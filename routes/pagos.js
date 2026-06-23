const express = require('express');
const router = express.Router();
const crypto = require('node:crypto');
const axios = require('axios');
const querystring = require('node:querystring');
const { firmarParams } = require('../utils/flowSign');

// ============================================================
// CONFIGURACIÓN
// ============================================================
const FLOW_API_URL = process.env.FLOW_ENV === 'production'
  ? 'https://www.flow.cl/api'
  : 'https://sandbox.flow.cl/api';

const FLOW_API_KEY = process.env.FLOW_API_KEY;
const FLOW_SECRET_KEY = process.env.FLOW_SECRET_KEY;

const BACKEND_URL = process.env.BACKEND_URL || 'https://church-generator-api-production.up.railway.app';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://church-generator-frontend.vercel.app';

// Importar pool de PostgreSQL (ajusta la ruta si tu archivo se llama distinto)
const pool = require('../config/db');

// ============================================================
// PLANES Y COMISIONES
// ============================================================
const PLANES = {
  fe:      { nombre: 'Plan Fe',      pagoUnico: 50000,  mensual: 12000 },
  mision:  { nombre: 'Plan Misión',  pagoUnico: 80000,  mensual: 19000 },
  impacto: { nombre: 'Plan Impacto', pagoUnico: 100000, mensual: 29000 }
};

const COMISION_PAGO_UNICO = 50; // 50%
const COMISION_MENSUAL = 10;    // 10%

// ============================================================
// POST /api/pagos/flow/crear
// Frontend llama esto cuando el pastor elige plan y hace clic en Pagar.
// Crea orden en Flow y devuelve URL del checkout.
// ============================================================
router.post('/crear', async (req, res) => {
  try {
    const { iglesia_id, plan, email } = req.body;

    // Validar
    if (!iglesia_id || !plan || !email) {
      return res.status(400).json({ error: 'Faltan campos: iglesia_id, plan, email' });
    }

    const planData = PLANES[plan];
    if (!planData) {
      return res.status(400).json({ error: 'Plan inválido. Usa: fe, mision, impacto' });
    }

    // Verificar que la iglesia existe
    const iglesiaResult = await pool.query(
      'SELECT id, nombre_iglesia FROM iglesias_aprobadas WHERE id = $1',
      [iglesia_id]
    );
    if (iglesiaResult.rows.length === 0) {
      return res.status(404).json({ error: 'Iglesia no encontrada' });
    }

    const iglesia = iglesiaResult.rows[0];
    const commerceOrder = `TWI-${iglesia_id}-${Date.now()}`;

    // Crear orden en Flow
    const params = {
      apiKey: FLOW_API_KEY,
      commerceOrder: commerceOrder,
      subject: `${planData.nombre} - ${iglesia.nombre_iglesia} - TuWebIglesia`,
      amount: planData.pagoUnico,
      email: email,
      urlConfirmation: `${BACKEND_URL}/api/pagos/flow/confirmar`,
      urlReturn: `${BACKEND_URL}/api/pagos/flow/retorno`,
      currency: 'CLP',
      paymentMethod: 9
    };

    const firma = firmarParams(params, FLOW_SECRET_KEY);
    const body = { ...params, s: firma };

    const response = await axios.post(
      `${FLOW_API_URL}/payment/create`,
      querystring.stringify(body),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { url, token, flowOrder } = response.data;

    // Guardar en BD
    await pool.query(
      `UPDATE iglesias_aprobadas 
       SET estado_pago = 'pendiente',
           plan_seleccionado = $1,
           commerce_order = $2,
           flow_order = $3,
           flow_token = $4,
           email_pagador = $5,
           monto_pagado = $6,
           fecha_orden = NOW()
       WHERE id = $7`,
      [plan, commerceOrder, flowOrder, token, email, planData.pagoUnico, iglesia_id]
    );

    const checkoutUrl = `${url}?token=${token}`;
    console.log(`[FLOW] Orden creada: ${commerceOrder} | Plan: ${plan} | $${planData.pagoUnico}`);

    res.json({ success: true, checkoutUrl });

  } catch (error) {
    console.error('[FLOW] Error creando orden:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error al crear la orden de pago' });
  }
});

// ============================================================
// POST /api/pagos/flow/confirmar
// Webhook que Flow llama cuando el pago se procesa.
// Aquí se actualiza la BD y se genera la comisión del misionero.
// Debe responder HTTP 200 en menos de 15 segundos.
// ============================================================
router.post('/confirmar', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      console.error('[FLOW] Webhook sin token');
      return res.status(200).send('Sin token');
    }

    // Consultar estado en Flow
    const params = { apiKey: FLOW_API_KEY, token: token };
    const firma = firmarParams(params, FLOW_SECRET_KEY);

    const response = await axios.get(`${FLOW_API_URL}/payment/getStatus`, {
      params: { ...params, s: firma }
    });

    const paymentData = response.data;

    // Status: 1=pendiente, 2=pagada, 3=rechazada, 4=anulada
    let estadoPago;
    switch (paymentData.status) {
      case 2: estadoPago = 'pagado'; break;
      case 3: estadoPago = 'rechazado'; break;
      case 4: estadoPago = 'anulado'; break;
      default: estadoPago = 'pendiente';
    }

    // Actualizar estado del pago
    const fechaPagoSQL = estadoPago === 'pagado' ? 'NOW()' : 'fecha_pago';
    const medio = paymentData.paymentData?.media || null;
    await pool.query(
      `UPDATE iglesias_aprobadas 
       SET estado_pago = $1::text,
           fecha_pago = ${fechaPagoSQL},
           medio_pago = COALESCE($2::text, medio_pago)
       WHERE commerce_order = $3::text`,
      [estadoPago, medio, paymentData.commerceOrder]
    );

    // Si el pago fue exitoso, generar comisión del misionero
    if (estadoPago === 'pagado') {
      await generarComision(paymentData.commerceOrder);
    }

    console.log(`[FLOW] Pago ${estadoPago}: ${paymentData.commerceOrder}`);
    res.status(200).send('OK');

  } catch (error) {
    console.error('[FLOW] Error en webhook:', error.response?.data || error.message);
    res.status(200).send('Error procesado');
  }
});

// ============================================================
// Función interna: genera comisión si hay código de misionero
// ============================================================
async function generarComision(commerceOrder) {
  try {
    // Buscar la iglesia y su código de referencia
    const result = await pool.query(
      `SELECT id, codigo_referencia, plan_seleccionado, monto_pagado
       FROM iglesias_aprobadas WHERE commerce_order = $1`,
      [commerceOrder]
    );

    if (result.rows.length === 0) return;

    const iglesia = result.rows[0];

    // Si no tiene código de misionero, no hay comisión
    if (!iglesia.codigo_referencia) {
      console.log(`[COMISION] Sin misionero para orden ${commerceOrder}`);
      return;
    }

    // Verificar que el misionero exista en la tabla misioneros
    const misioneroResult = await pool.query(
      'SELECT codigo FROM misioneros WHERE codigo = $1 AND activo = true',
      [iglesia.codigo_referencia]
    );

    if (misioneroResult.rows.length === 0) {
      console.log(`[COMISION] Código ${iglesia.codigo_referencia} no encontrado o inactivo`);
      return;
    }

    // Calcular comisión: 50% del pago único
    const montoComision = Math.round(iglesia.monto_pagado * COMISION_PAGO_UNICO / 100);

    // Verificar que no exista ya una comisión para esta orden
    const existe = await pool.query(
      'SELECT id FROM comisiones WHERE commerce_order = $1 AND tipo = $2',
      [commerceOrder, 'pago_unico']
    );

    if (existe.rows.length > 0) {
      console.log(`[COMISION] Ya existe comisión para ${commerceOrder}`);
      return;
    }

    // Insertar comisión
    await pool.query(
      `INSERT INTO comisiones 
       (iglesia_id, codigo_misionero, tipo, monto_venta, porcentaje, monto_comision, commerce_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [iglesia.id, iglesia.codigo_referencia, 'pago_unico', 
       iglesia.monto_pagado, COMISION_PAGO_UNICO, montoComision, commerceOrder]
    );

    console.log(`[COMISION] Generada: ${iglesia.codigo_referencia} gana $${montoComision.toLocaleString('es-CL')} por orden ${commerceOrder}`);

  } catch (error) {
    console.error('[COMISION] Error generando comisión:', error.message);
    // No lanzar error — el pago ya se procesó, la comisión se puede calcular después
  }
}

// ============================================================
// POST /api/pagos/flow/retorno
// Flow redirige al pastor aquí después de pagar.
// Consultamos estado y redirigimos al frontend con query params.
// ============================================================
router.post('/retorno', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.redirect(`${FRONTEND_URL}?pago=error`);
    }

    // Consultar estado en Flow
    const params = { apiKey: FLOW_API_KEY, token: token };
    const firma = firmarParams(params, FLOW_SECRET_KEY);

    const response = await axios.get(`${FLOW_API_URL}/payment/getStatus`, {
      params: { ...params, s: firma }
    });

    const paymentData = response.data;

    if (paymentData.status === 2) {
      res.redirect(`${FRONTEND_URL}?pago=exitoso&orden=${paymentData.commerceOrder}`);
    } else if (paymentData.status === 1) {
      res.redirect(`${FRONTEND_URL}?pago=pendiente&orden=${paymentData.commerceOrder}`);
    } else {
      res.redirect(`${FRONTEND_URL}?pago=fallido&orden=${paymentData.commerceOrder}`);
    }

  } catch (error) {
    console.error('[FLOW] Error en retorno:', error.message);
    res.redirect(`${FRONTEND_URL}?pago=error`);
  }
});

// ============================================================
// GET /api/pagos/flow/estado/:iglesiaId
// Consultar estado de pago (para el admin panel).
// ============================================================
router.get('/estado/:iglesiaId', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ia.id, ia.nombre_iglesia, ia.plan_seleccionado, ia.estado_pago, 
              ia.monto_pagado, ia.fecha_pago, ia.medio_pago, ia.codigo_referencia,
              c.monto_comision, c.estado as estado_comision, c.codigo_misionero
       FROM iglesias_aprobadas ia
       LEFT JOIN comisiones c ON c.iglesia_id = ia.id AND c.tipo = 'pago_unico'
       WHERE ia.id = $1`,
      [req.params.iglesiaId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Iglesia no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('[FLOW] Error consultando estado:', error.message);
    res.status(500).json({ error: 'Error al consultar estado' });
  }
});

module.exports = router;
