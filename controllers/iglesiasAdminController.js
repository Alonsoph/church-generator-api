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

module.exports = { listarIglesias, agregarObservacion };