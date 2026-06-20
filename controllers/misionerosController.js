// Controller de misioneros (afiliados)
// Comisiones fijas: 50% del setup + 10% de la mensualidad

const pool = require('../config/db');

// Precios fijos por plan (en CLP)
const PRECIOS = {
  fe: { setup: 50000, mensual: 12000 },
  mision: { setup: 80000, mensual: 19000 },
  impacto: { setup: 100000, mensual: 29000 },
};

const COMISION_SETUP = 0.50;   // 50% del pago único
const COMISION_MENSUAL = 0.10; // 10% de la mensualidad

// ============================================================
// PÚBLICO: validar un código de referencia
// GET /api/misioneros/validar/:codigo
// ============================================================
async function validarCodigo(req, res) {
  try {
    const codigo = (req.params.codigo || '').trim().toUpperCase();

    if (!codigo) {
      return res.json({ exito: false, valido: false, error: 'Código vacío' });
    }

    const resultado = await pool.query(
      'SELECT codigo, nombre FROM misioneros WHERE UPPER(codigo) = $1 AND activo = true LIMIT 1',
      [codigo]
    );

    if (resultado.rows.length === 0) {
      return res.json({ exito: true, valido: false });
    }

    const misionero = resultado.rows[0];
    return res.json({
      exito: true,
      valido: true,
      nombre: misionero.nombre,
      codigo: misionero.codigo,
    });
  } catch (err) {
    console.error('Error validando código:', err);
    return res.status(500).json({ exito: false, error: 'Error del servidor' });
  }
}

// ============================================================
// ADMIN: listar todos los misioneros
// ============================================================
async function listarMisioneros(req, res) {
  try {
    const resultado = await pool.query(
      'SELECT id, codigo, nombre, whatsapp, email, activo, creado_en FROM misioneros ORDER BY creado_en DESC'
    );
    return res.json({ exito: true, misioneros: resultado.rows });
  } catch (err) {
    console.error('Error listando misioneros:', err);
    return res.status(500).json({ exito: false, error: 'Error del servidor' });
  }
}

// ============================================================
// ADMIN: crear un misionero
// ============================================================
async function crearMisionero(req, res) {
  try {
    const { codigo, nombre, whatsapp, email } = req.body;

    if (!codigo || !nombre) {
      return res.status(400).json({
        exito: false,
        error: 'codigo y nombre son obligatorios',
      });
    }

    const codigoLimpio = codigo.trim().toUpperCase();

    const resultado = await pool.query(
      `INSERT INTO misioneros (codigo, nombre, whatsapp, email)
       VALUES ($1, $2, $3, $4)
       RETURNING id, codigo, nombre, whatsapp, email, activo, creado_en`,
      [codigoLimpio, nombre.trim(), whatsapp || null, email || null]
    );

    return res.json({ exito: true, misionero: resultado.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({
        exito: false,
        error: 'Ya existe un misionero con ese código',
      });
    }
    console.error('Error creando misionero:', err);
    return res.status(500).json({ exito: false, error: 'Error del servidor' });
  }
}

// ============================================================
// ADMIN: editar un misionero
// ============================================================
async function editarMisionero(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ exito: false, error: 'ID inválido' });
    }

    const { codigo, nombre, whatsapp, email, activo } = req.body;

    const campos = [];
    const valores = [];
    let idx = 1;

    if (codigo !== undefined) {
      campos.push(`codigo = $${idx++}`);
      valores.push(codigo.trim().toUpperCase());
    }
    if (nombre !== undefined) {
      campos.push(`nombre = $${idx++}`);
      valores.push(nombre.trim());
    }
    if (whatsapp !== undefined) {
      campos.push(`whatsapp = $${idx++}`);
      valores.push(whatsapp || null);
    }
    if (email !== undefined) {
      campos.push(`email = $${idx++}`);
      valores.push(email || null);
    }
    if (activo !== undefined) {
      campos.push(`activo = $${idx++}`);
      valores.push(Boolean(activo));
    }

    if (campos.length === 0) {
      return res.status(400).json({ exito: false, error: 'Nada que actualizar' });
    }

    valores.push(id);
    const query = `UPDATE misioneros SET ${campos.join(', ')} WHERE id = $${idx} RETURNING *`;

    const resultado = await pool.query(query, valores);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ exito: false, error: 'Misionero no encontrado' });
    }

    return res.json({ exito: true, misionero: resultado.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({
        exito: false,
        error: 'Ya existe un misionero con ese código',
      });
    }
    console.error('Error editando misionero:', err);
    return res.status(500).json({ exito: false, error: 'Error del servidor' });
  }
}

// ============================================================
// ADMIN: desactivar un misionero (soft delete)
// ============================================================
async function desactivarMisionero(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ exito: false, error: 'ID inválido' });
    }

    const resultado = await pool.query(
      'UPDATE misioneros SET activo = false WHERE id = $1 RETURNING id, codigo, nombre, activo',
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ exito: false, error: 'Misionero no encontrado' });
    }

    return res.json({ exito: true, misionero: resultado.rows[0] });
  } catch (err) {
    console.error('Error desactivando misionero:', err);
    return res.status(500).json({ exito: false, error: 'Error del servidor' });
  }
}

// ============================================================
// ADMIN: ver ventas y comisiones por misionero
// ============================================================
async function verVentas(req, res) {
  try {
    const ventas = await pool.query(`
      SELECT
        i.id              AS iglesia_id,
        i.nombre          AS iglesia_nombre,
        i.plan_seleccionado,
        i.codigo_referencia,
        i.fecha_creacion  AS iglesia_creada_en,
        m.id              AS misionero_id,
        m.codigo          AS misionero_codigo,
        m.nombre          AS misionero_nombre,
        m.activo          AS misionero_activo
      FROM iglesias_aprobadas i
      LEFT JOIN misioneros m
        ON UPPER(m.codigo) = UPPER(i.codigo_referencia)
      WHERE i.codigo_referencia IS NOT NULL
        AND i.codigo_referencia <> ''
      ORDER BY m.codigo NULLS LAST, i.fecha_creacion DESC
    `);

    const porMisionero = {};

    for (const fila of ventas.rows) {
      const claveMisionero = fila.misionero_codigo || `__sin_registro__${fila.codigo_referencia}`;

      if (!porMisionero[claveMisionero]) {
        porMisionero[claveMisionero] = {
          codigo: fila.misionero_codigo || fila.codigo_referencia,
          nombre: fila.misionero_nombre || '(Código sin misionero registrado)',
          registrado: Boolean(fila.misionero_id),
          activo: fila.misionero_activo,
          iglesias: [],
          totales: {
            cantidad_iglesias: 0,
            comision_setup_total: 0,
            comision_mensual_total: 0,
          },
        };
      }

      const plan = (fila.plan_seleccionado || '').toLowerCase();
      const precios = PRECIOS[plan] || { setup: 0, mensual: 0 };
      const comisionSetup = Math.round(precios.setup * COMISION_SETUP);
      const comisionMensual = Math.round(precios.mensual * COMISION_MENSUAL);

      porMisionero[claveMisionero].iglesias.push({
        id: fila.iglesia_id,
        nombre: fila.iglesia_nombre,
        plan: fila.plan_seleccionado,
        codigo_usado: fila.codigo_referencia,
        creada_en: fila.iglesia_creada_en,
        comision_setup: comisionSetup,
        comision_mensual: comisionMensual,
      });

      porMisionero[claveMisionero].totales.cantidad_iglesias += 1;
      porMisionero[claveMisionero].totales.comision_setup_total += comisionSetup;
      porMisionero[claveMisionero].totales.comision_mensual_total += comisionMensual;
    }

    return res.json({
      exito: true,
      comisiones: { setup_pct: COMISION_SETUP * 100, mensual_pct: COMISION_MENSUAL * 100 },
      precios: PRECIOS,
      ventas: Object.values(porMisionero),
    });
  } catch (err) {
    console.error('Error obteniendo ventas:', err);
    return res.status(500).json({ exito: false, error: 'Error del servidor' });
  }
}

module.exports = {
  validarCodigo,
  listarMisioneros,
  crearMisionero,
  editarMisionero,
  desactivarMisionero,
  verVentas,
};