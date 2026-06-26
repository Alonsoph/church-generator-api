// controllers/panelController.js
const pool = require('../config/db');
const { clearCache } = require('./webController');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/panelAuth');

// Límites por plan
const LIMITES = {
  fe:      { secciones: 5,  fotos: 20, ediciones: 5 },
  mision:  { secciones: 8,  fotos: 40, ediciones: 20 },
  impacto: { secciones: 11, fotos: 60, ediciones: Infinity }
};

// ── LOGIN ──
async function login(req, res) {
  const { usuario, password } = req.body;
  if (!usuario || !password) {
    return res.status(400).json({ error: 'Ingrese usuario y contraseña' });
  }

  try {
    const result = await pool.query(
      `SELECT pa.id, pa.iglesia_id, pa.usuario, pa.password_hash,
              ia.nombre_iglesia, ia.plan_seleccionado
       FROM pastores_acceso pa
       JOIN iglesias_aprobadas ia ON ia.id = pa.iglesia_id
       WHERE pa.usuario = $1`,
      [usuario.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const pastor = result.rows[0];
    const match = await bcrypt.compare(password, pastor.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Actualizar último login
    await pool.query(
      'UPDATE pastores_acceso SET ultimo_login = NOW() WHERE id = $1',
      [pastor.id]
    );

    const token = jwt.sign(
      {
        iglesiaId: pastor.iglesia_id,
        usuario: pastor.usuario,
        plan: pastor.plan_seleccionado || 'fe'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      iglesia: {
        id: pastor.iglesia_id,
        nombre: pastor.nombre_iglesia,
        plan: pastor.plan_seleccionado || 'fe'
      }
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// ── OBTENER CONTENIDO ──
async function getContenido(req, res) {
  const { iglesiaId, plan } = req.pastor;

  try {
    // Contenido agrupado por sección
    const contenido = await pool.query(
      `SELECT seccion_slug, clave, valor, orden
       FROM contenido_iglesia
       WHERE iglesia_id = $1
       ORDER BY seccion_slug, orden`,
      [iglesiaId]
    );

    // Secciones activas
    const secciones = await pool.query(
      `SELECT si.seccion_slug, si.activa, sc.nombre, sc.descripcion
       FROM secciones_iglesia si
       JOIN secciones_catalogo sc ON sc.slug = si.seccion_slug
       WHERE si.iglesia_id = $1
       ORDER BY sc.orden`,
      [iglesiaId]
    );

    // Ediciones del mes actual
    const mesActual = new Date().toISOString().slice(0, 7);
    const limites = LIMITES[plan] || LIMITES.fe;
    const ediciones = await pool.query(
      `SELECT conteo FROM ediciones_mensuales WHERE iglesia_id = $1 AND mes = $2`,
      [iglesiaId, mesActual]
    );
    const edicionesUsadas = ediciones.rows.length > 0 ? ediciones.rows[0].conteo : 0;

    // Contar fotos actuales
    const fotos = await pool.query(
      `SELECT COUNT(*) as total FROM contenido_iglesia
       WHERE iglesia_id = $1 AND seccion_slug = 'galeria'`,
      [iglesiaId]
    );

    // Agrupar contenido por sección
    const contenidoPorSeccion = {};
    contenido.rows.forEach(row => {
      if (!contenidoPorSeccion[row.seccion_slug]) {
        contenidoPorSeccion[row.seccion_slug] = {};
      }
      contenidoPorSeccion[row.seccion_slug][row.clave] = row.valor;
    });

    res.json({
      contenido: contenidoPorSeccion,
      secciones: secciones.rows,
      limites: {
        ediciones_usadas: edicionesUsadas,
        ediciones_limite: limites.ediciones === Infinity ? 'ilimitadas' : limites.ediciones,
        ediciones_restantes: limites.ediciones === Infinity ? 'ilimitadas' : Math.max(0, limites.ediciones - edicionesUsadas),
        fotos_usadas: parseInt(fotos.rows[0].total),
        fotos_limite: limites.fotos
      },
      plan
    });
  } catch (err) {
    console.error('Error obteniendo contenido:', err);
    res.status(500).json({ error: 'Error al cargar el contenido' });
  }
}

// ── ACTUALIZAR CONTENIDO ──
async function updateContenido(req, res) {
  const { iglesiaId, plan } = req.pastor;
  const { seccion, clave, valor } = req.body;

  if (!seccion || !clave) {
    return res.status(400).json({ error: 'Sección y clave son obligatorios' });
  }

  try {
    // Verificar que la sección esté activa para esta iglesia
    const seccionActiva = await pool.query(
      `SELECT activa FROM secciones_iglesia WHERE iglesia_id = $1 AND seccion_slug = $2`,
      [iglesiaId, seccion]
    );
    if (seccionActiva.rows.length > 0 && !seccionActiva.rows[0].activa) {
      return res.status(403).json({ error: 'Esta sección no está activa en tu plan' });
    }

    // Verificar límite de ediciones
    const limites = LIMITES[plan] || LIMITES.fe;
    if (limites.ediciones !== Infinity) {
      const mesActual = new Date().toISOString().slice(0, 7);
      const ediciones = await pool.query(
        `SELECT conteo FROM ediciones_mensuales WHERE iglesia_id = $1 AND mes = $2`,
        [iglesiaId, mesActual]
      );
      const usadas = ediciones.rows.length > 0 ? ediciones.rows[0].conteo : 0;
      if (usadas >= limites.ediciones) {
        return res.status(429).json({
          error: `Has alcanzado tus ${limites.ediciones} ediciones de este mes. Se renuevan el 1 del próximo mes.`,
          upgrade: true
        });
      }
    }

    // Upsert contenido
    await pool.query(
      `INSERT INTO contenido_iglesia (iglesia_id, seccion_slug, clave, valor, actualizado_en)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (iglesia_id, seccion_slug, clave)
       DO UPDATE SET valor = $4, actualizado_en = NOW()`,
      [iglesiaId, seccion, clave, valor]
    );

    // Incrementar contador de ediciones
    const mesActual = new Date().toISOString().slice(0, 7);
    await pool.query(
      `INSERT INTO ediciones_mensuales (iglesia_id, mes, conteo)
       VALUES ($1, $2, 1)
       ON CONFLICT (iglesia_id, mes)
       DO UPDATE SET conteo = ediciones_mensuales.conteo + 1`,
      [iglesiaId, mesActual]
    );

    clearCache(iglesiaId);
    res.json({ ok: true, mensaje: 'Contenido actualizado' });
  } catch (err) {
    console.error('Error actualizando contenido:', err);
    res.status(500).json({ error: 'Error al guardar los cambios' });
  }
}

// ── SUBIR FOTO (recibe URL de Cloudinary) ──
async function subirFoto(req, res) {
  const { iglesiaId, plan } = req.pastor;
  const { url, descripcion } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL de la foto es obligatoria' });
  }

  try {
    const limites = LIMITES[plan] || LIMITES.fe;
    const fotos = await pool.query(
      `SELECT COUNT(*) as total FROM contenido_iglesia
       WHERE iglesia_id = $1 AND seccion_slug = 'galeria'`,
      [iglesiaId]
    );
    const totalFotos = parseInt(fotos.rows[0].total);

    if (totalFotos >= limites.fotos) {
      return res.status(429).json({
        error: `Has alcanzado el máximo de ${limites.fotos} fotos de tu plan.`,
        upgrade: true
      });
    }

    const clave = `foto_${Date.now()}`;
    await pool.query(
      `INSERT INTO contenido_iglesia (iglesia_id, seccion_slug, clave, valor, orden)
       VALUES ($1, 'galeria', $2, $3, $4)`,
      [iglesiaId, clave, JSON.stringify({ url, descripcion: descripcion || '' }), totalFotos + 1]
    );

    clearCache(iglesiaId);
    res.json({
      ok: true,
      mensaje: 'Foto guardada',
      fotos_usadas: totalFotos + 1,
      fotos_limite: limites.fotos
    });
  } catch (err) {
    console.error('Error subiendo foto:', err);
    res.status(500).json({ error: 'Error al guardar la foto' });
  }
}

// ── ELIMINAR FOTO ──
async function eliminarFoto(req, res) {
  const { iglesiaId } = req.pastor;
  const { clave } = req.body;

  if (!clave) {
    return res.status(400).json({ error: 'Clave de la foto es obligatoria' });
  }

  try {
    await pool.query(
      `DELETE FROM contenido_iglesia
       WHERE iglesia_id = $1 AND seccion_slug = 'galeria' AND clave = $2`,
      [iglesiaId, clave]
    );
    clearCache(iglesiaId);
    res.json({ ok: true, mensaje: 'Foto eliminada' });
  } catch (err) {
    console.error('Error eliminando foto:', err);
    res.status(500).json({ error: 'Error al eliminar la foto' });
  }
}

// ── CREAR ACCESO DE PASTOR (admin only) ──
async function crearAcceso(req, res) {
  const { iglesia_id, usuario, password } = req.body;

  if (!iglesia_id || !usuario || !password) {
    return res.status(400).json({ error: 'iglesia_id, usuario y password son obligatorios' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO pastores_acceso (iglesia_id, usuario, password_hash)
       VALUES ($1, $2, $3)
       ON CONFLICT (usuario) DO UPDATE SET password_hash = $3`,
      [iglesia_id, usuario.toLowerCase().trim(), hash]
    );

    res.json({
      ok: true,
      mensaje: `Acceso creado para ${usuario}`,
      link_panel: `https://tuwebiglesia.cl/panel`
    });
  } catch (err) {
    console.error('Error creando acceso:', err);
    res.status(500).json({ error: 'Error al crear el acceso' });
  }
}

module.exports = {
  login,
  getContenido,
  updateContenido,
  subirFoto,
  eliminarFoto,
  crearAcceso
};
