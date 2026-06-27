// Controller admin para iglesias aprobadas
const pool = require('../config/db');

// ============================================================
// ADMIN: listar todas las iglesias aprobadas
// GET /api/iglesias/admin/listar
// ============================================================
async function listarIglesias(req, res) {
  try {
    const resultado = await pool.query(`
      SELECT id, nombre_iglesia, email_contacto, whatsapp_contacto,
             sugerencias_cliente, plan_seleccionado, codigo_referencia,
             observaciones, fecha_creacion
      FROM iglesias_aprobadas
      ORDER BY fecha_creacion DESC
    `);
    return res.json({ exito: true, iglesias: resultado.rows });
  } catch (err) {
    console.error('Error listando iglesias:', err);
    return res.status(500).json({ exito: false, error: 'Error del servidor' });
  }
}

// ============================================================
// ADMIN: agregar observación a una iglesia (concatena, no reemplaza)
// POST /api/iglesias/admin/:id/observacion
// ============================================================
async function agregarObservacion(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ exito: false, error: 'ID inválido' });
    }

    const { texto } = req.body;
    if (!texto || !texto.trim()) {
      return res.status(400).json({ exito: false, error: 'Texto vacío' });
    }

    const fecha = new Date().toISOString().split('T')[0];
    const nuevaNota = `\n---\n[${fecha} admin] ${texto.trim()}`;

    const resultado = await pool.query(
      `UPDATE iglesias_aprobadas
       SET observaciones = COALESCE(observaciones, '') || $1
       WHERE id = $2
       RETURNING id, observaciones`,
      [nuevaNota, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ exito: false, error: 'Iglesia no encontrada' });
    }

    return res.json({ exito: true, iglesia: resultado.rows[0] });
  } catch (err) {
    console.error('Error agregando observación:', err);
    return res.status(500).json({ exito: false, error: 'Error del servidor' });
  }
}

// ============================================================
// ADMIN: asignar dominio a una iglesia
// PUT /api/iglesias/admin/:id/dominio
// Body: { dominio_tipo: 'subdominio'|'propio', dominio_valor: 'casa-de-dios' }
// ============================================================
async function asignarDominio(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ exito: false, error: 'ID inválido' });
    }

    const { dominio_tipo, dominio_valor } = req.body;
    if (!dominio_tipo || !dominio_valor) {
      return res.status(400).json({ exito: false, error: 'dominio_tipo y dominio_valor son obligatorios' });
    }

    const tiposValidos = ['subdominio', 'propio'];
    if (!tiposValidos.includes(dominio_tipo)) {
      return res.status(400).json({ exito: false, error: `dominio_tipo debe ser: ${tiposValidos.join(' | ')}` });
    }

    // Normalizar dominio_valor (slug limpio para subdominios)
    const valorNormalizado = dominio_tipo === 'subdominio'
      ? dominio_valor.toLowerCase()
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9-]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
      : dominio_valor.toLowerCase().trim();

    if (!valorNormalizado) {
      return res.status(400).json({ exito: false, error: 'dominio_valor no puede estar vacío' });
    }

    // Verificar que no esté usado por otra iglesia
    const existente = await pool.query(
      `SELECT id, nombre_iglesia FROM iglesias_aprobadas
       WHERE dominio_valor = $1 AND id != $2`,
      [valorNormalizado, id]
    );
    if (existente.rows.length > 0) {
      return res.status(409).json({
        exito: false,
        error: `El dominio '${valorNormalizado}' ya está asignado a: ${existente.rows[0].nombre_iglesia}`
      });
    }

    const resultado = await pool.query(
      `UPDATE iglesias_aprobadas
       SET dominio_tipo = $1, dominio_valor = $2
       WHERE id = $3
       RETURNING id, nombre_iglesia, dominio_tipo, dominio_valor`,
      [dominio_tipo, valorNormalizado, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ exito: false, error: 'Iglesia no encontrada' });
    }

    const iglesia = resultado.rows[0];
    const urlPublica = dominio_tipo === 'propio'
      ? `https://${valorNormalizado}`
      : `https://${valorNormalizado}.tuwebiglesia.cl`;

    return res.json({
      exito: true,
      iglesia,
      url_publica: urlPublica
    });
  } catch (err) {
    console.error('Error asignando dominio:', err);
    return res.status(500).json({ exito: false, error: 'Error del servidor' });
  }
}

// ============================================================
// ADMIN: ver acceso del pastor de una iglesia
// GET /api/iglesias/admin/:id/acceso
// ============================================================
async function getAccesoPastor(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ exito: false, error: 'ID inválido' });
    }

    const resultado = await pool.query(
      `SELECT pa.id, pa.usuario, pa.creado_en, pa.ultimo_login,
              ia.nombre_iglesia, ia.plan_seleccionado, ia.dominio_valor
       FROM pastores_acceso pa
       JOIN iglesias_aprobadas ia ON ia.id = pa.iglesia_id
       WHERE pa.iglesia_id = $1`,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.json({
        exito: true,
        tiene_acceso: false,
        mensaje: 'Esta iglesia no tiene pastor registrado aún'
      });
    }

    return res.json({
      exito: true,
      tiene_acceso: true,
      acceso: {
        usuario:       resultado.rows[0].usuario,
        creado_en:     resultado.rows[0].creado_en,
        ultimo_login:  resultado.rows[0].ultimo_login,
        nombre_iglesia: resultado.rows[0].nombre_iglesia,
        plan:          resultado.rows[0].plan_seleccionado,
        dominio:       resultado.rows[0].dominio_valor
      }
    });
  } catch (err) {
    console.error('Error obteniendo acceso pastor:', err);
    return res.status(500).json({ exito: false, error: 'Error del servidor' });
  }
}

// ============================================================
// ADMIN: cambiar plan de una iglesia
// PUT /api/iglesias/admin/:id/plan
// Body: { plan: 'fe' | 'mision' | 'impacto' }
// ============================================================
async function cambiarPlan(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ exito: false, error: 'ID inválido' });
    }

    const { plan } = req.body;
    const planesValidos = ['fe', 'mision', 'impacto'];
    if (!planesValidos.includes(plan)) {
      return res.status(400).json({ exito: false, error: `Plan debe ser: ${planesValidos.join(' | ')}` });
    }

    const resultado = await pool.query(
      `UPDATE iglesias_aprobadas
       SET plan_seleccionado = $1
       WHERE id = $2
       RETURNING id, nombre_iglesia, plan_seleccionado`,
      [plan, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ exito: false, error: 'Iglesia no encontrada' });
    }

    return res.json({ exito: true, iglesia: resultado.rows[0] });
  } catch (err) {
    console.error('Error cambiando plan:', err);
    return res.status(500).json({ exito: false, error: 'Error del servidor' });
  }
}

module.exports = { listarIglesias, agregarObservacion, asignarDominio, getAccesoPastor, cambiarPlan };