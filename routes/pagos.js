const express = require('express');
const router = express.Router();
const crypto = require('node:crypto');
const axios = require('axios');
const querystring = require('node:querystring');
const { firmarParams } = require('../utils/flowSign');

const FLOW_API_URL = process.env.FLOW_ENV === 'production'
  ? 'https://www.flow.cl/api'
  : 'https://sandbox.flow.cl/api'\;

const FLOW_API_KEY = process.env.FLOW_API_KEY;
const FLOW_SECRET_KEY = process.env.FLOW_SECRET_KEY;

const BACKEND_URL = process.env.BACKEND_URL || 'https://church-generator-api-production.up.railway.app'\;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://church-generator-frontend.verce
cat > ~/church-generator-api/routes/pagos.js << 'ENDOFFILE'
const express = require('express');
const router = express.Router();
const crypto = require('node:crypto');
const axios = require('axios');
const querystring = require('node:querystring');
const { firmarParams } = require('../utils/flowSign');

const FLOW_API_URL = process.env.FLOW_ENV === 'production'
  ? 'https://www.flow.cl/api'
  : 'https://sandbox.flow.cl/api'\;

const FLOW_API_KEY = process.env.FLOW_API_KEY;
const FLOW_SECRET_KEY = process.env.FLOW_SECRET_KEY;

const BACKEND_URL = process.env.BACKEND_URL || 'https://church-generator-api-production.up.railway.app'\;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://church-generator-frontend.vercel.app'\;

const pool = require('../config/db');

const PLANES = {
  fe:      { nombre: 'Plan Fe',      pagoUnico: 50000,  mensual: 12000 },
  mision:  { nombre: 'Plan Misión',  pagoUnico: 80000,  mensual: 19000 },
  impacto: { nombre: 'Plan Impacto', pagoUnico: 100000, mensual: 29000 }
};

const COMISION_PAGO_UNICO = 50;
const COMISION_MENSUAL = 10;

router.post('/crear', async (req, res) => {
  try {
    const { iglesia_id, plan, email } = req.body;

    if (!iglesia_id || !plan || !email) {
      return res.status(400).json({ error: 'Faltan campos: iglesia_id, plan, email' });
    }

    const planData = PLANES[plan];
    if (!planData) {
      return res.status(400).json({ error: 'Plan inválido. Usa: fe, mision, impacto' });
    }

    const iglesiaResult = await pool.query(
      'SELECT id, nombre_iglesia FROM iglesias_aprobadas WHERE id = $1',
      [iglesia_id]
    );
    if (iglesiaResult.rows.length === 0) {
      return res.status(404).json({ error: 'Iglesia no encontrada' });
    }

    const iglesia = iglesiaResult.rows[0];
    const commerceOrder = `TWI-${iglesia_id}-${Date.now()}`;

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
cat > ~/church-generator-api/routes/pagos.js << 'ENDOFFILE'
const express = require('express');
const router = express.Router();
const crypto = require('node:crypto');
const axios = require('axios');
const querystring = require('node:querystring');
const { firmarParams } = require('../utils/flowSign');

const FLOW_API_URL = process.env.FLOW_ENV === 'production'
  ? 'https://www.flow.cl/api'
  : 'https://sandbox.flow.cl/api'\;

const FLOW_API_KEY = process.env.FLOW_API_KEY;
const FLOW_SECRET_KEY = process.env.FLOW_SECRET_KEY;

const BACKEND_URL = process.env.BACKEND_URL || 'https://church-generator-api-production.up.railway.app'\;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://church-generator-frontend.vercel.app'\;

const pool = require('../config/db');

const PLANES = {
  fe:      { nombre: 'Plan Fe',      pagoUnico: 50000,  mensual: 12000 },
  mision:  { nombre: 'Plan Misión',  pagoUnico: 80000,  mensual: 19000 },
  impacto: { nombre: 'Plan Impacto', pagoUnico: 100000, mensual: 29000 }
};

const COMISION_PAGO_UNICO = 50;
const COMISION_MENSUAL = 10;

router.post('/crear', async (req, res) => {
  try {
    const { iglesia_id, plan, email } = req.body;

    if (!iglesia_id || !plan || !email) {
      return res.status(400).json({ error: 'Faltan campos: iglesia_id, plan, email' });
    }

    const planData = PLANES[plan];
    if (!planData) {
      return res.status(400).json({ error: 'Plan inválido. Usa: fe, mision, impacto' });
    }

    const iglesiaResult = await pool.query(
      'SELECT id, nombre_iglesia FROM iglesias_aprobadas WHERE id = $1',
      [iglesia_id]
    );
    if (iglesiaResult.rows.length === 0) {
      return res.status(404).json({ error: 'Iglesia no encontrada' });
    }

    const iglesia = iglesiaResult.rows[0];
    const commerceOrder = `TWI-${iglesia_id}-${Date.now()}`;

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

router.post('/confirmar', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(200).send('Sin token');
    }

    const params = { apiKey: FLOW_API_KEY, token: token };
    const firma = firmarParams(params, FLOW_SECRET_KEY);

    const response = await axios.get(`${FLOW_API_URL}/payment/getStatus`, {
      params: { ...params, s: firma }
    });

    const paymentData = response.data;

    let estadoPago;
    switch (paymentData.status) {
      case 2: estadoPago = 'pagado'; break;
      case 3: estadoPago = 'rechazado'; break;
      case 4: estadoPago = 'anulado'; break;
      default: estadoPago = 'pendiente';
    }

    await pool.query(
      `UPDATE iglesias_aprobadas 
       SET estado_pago = $1,
           fecha_pago = CASE WHEN $1 = 'pagado' THEN NOW() ELSE fecha_pago END,
           medio_pago = $2
       WHERE commerce_order = $3`,
      [estadoPago, paymentData.paymentData?.media || null, paymentData.commerceOrder]
    );

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

async function generarComision(commerceOrder) {
  try {
    const result = await pool.query(
      `SELECT id, codigo_referencia, plan_seleccionado, monto_pagado
       FROM iglesias_aprobadas WHERE commerce_order = $1`,
      [commerceOrder]
    );

    if (result.rows.length === 0) return;

    const iglesia = result.rows[0];

    if (!iglesia.codigo_referencia) {
      console.log(`[COMISION] Sin misionero para orden ${commerceOrder}`);
      return;
    }

    const misioneroResult = await pool.query(
      'SELECT codigo FROM misioneros WHERE codigo = $1 AND activo = true',
      [iglesia.codigo_referencia]
    );

    if (misioneroResult.rows.length === 0) {
      console.log(`[COMISION] Código ${iglesia.codigo_referencia} no encontrado o inactivo`);
      return;
    }

    const montoComision = Math.round(iglesia.monto_pagado * COMISION_PAGO_UNICO / 100);

    const existe = await pool.query(
      'SELECT id FROM comisiones WHERE commerce_order = $1 AND tipo = $2',
      [commerceOrder, 'pago_unico']
    );

    if (existe.rows.length > 0) return;

    await pool.query(
      `INSERT INTO comisiones 
       (iglesia_id, codigo_misionero, tipo, monto_venta, porcentaje, monto_comision, commerce_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [iglesia.id, iglesia.codigo_referencia, 'pago_unico',
       iglesia.monto_pagado, COMISION_PAGO_UNICO, montoComision, commerceOrder]
    );

    console.log(`[COMISION] Generada: ${iglesia.codigo_referencia} gana $${montoComision} por orden ${commerceOrder}`);

  } catch (error) {
    console.error('[COMISION] Error generando comisión:', error.message);
  }
}

router.post('/retorno', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.redirect(`${FRONTEND_URL}?pago=error`);
    }

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
