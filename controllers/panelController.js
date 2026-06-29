// controllers/panelController.js
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/panelAuth');
const { generarHTML } = require('../templates/selector');

// Lazy require para evitar circular dependency con webController
function getWebController() {
  return require('./webController');
}

// Límites por plan
const LIMITES = {
  fe:      { secciones: 5,  fotos: 20, ediciones: 5 },
  mision:  { secciones: 8,  fotos: 40, ediciones: 20 },
  impacto: { secciones: 11, fotos: 60, ediciones: Infinity }
};

// Configuración completa de cada sección con sus campos editables
const SECCIONES_CONFIG = {
  hero: {
    nombre: 'Portada principal',
    icono: '🏠',
    orden: 1,
    campos: [
      { clave: 'nombre_iglesia', tipo: 'text',     label: 'Nombre de la iglesia', requerido: true },
      { clave: 'lema',          tipo: 'text',     label: 'Lema o versículo',      requerido: false },
      { clave: 'foto_portada',  tipo: 'image_url', label: 'Foto de portada (URL)', requerido: false },
      { clave: 'cta_texto',     tipo: 'text',     label: 'Texto del botón',        requerido: false }
    ]
  },
  horarios: {
    nombre: 'Horarios de culto',
    icono: '🕐',
    orden: 2,
    campos: [
      { clave: 'horario_1_nombre', tipo: 'text', label: 'Servicio 1 - Nombre' },
      { clave: 'horario_1_dia',   tipo: 'text', label: 'Servicio 1 - Día' },
      { clave: 'horario_1_hora',  tipo: 'text', label: 'Servicio 1 - Hora' },
      { clave: 'horario_2_nombre', tipo: 'text', label: 'Servicio 2 - Nombre' },
      { clave: 'horario_2_dia',   tipo: 'text', label: 'Servicio 2 - Día' },
      { clave: 'horario_2_hora',  tipo: 'text', label: 'Servicio 2 - Hora' },
      { clave: 'horario_3_nombre', tipo: 'text', label: 'Servicio 3 - Nombre' },
      { clave: 'horario_3_dia',   tipo: 'text', label: 'Servicio 3 - Día' },
      { clave: 'horario_3_hora',  tipo: 'text', label: 'Servicio 3 - Hora' }
    ]
  },
  nosotros: {
    nombre: 'Quiénes somos',
    icono: '✝️',
    orden: 3,
    campos: [
      { clave: 'historia',  tipo: 'textarea', label: 'Historia de la iglesia' },
      { clave: 'vision',    tipo: 'textarea', label: 'Visión' },
      { clave: 'mision',    tipo: 'textarea', label: 'Misión' },
      { clave: 'pastor',    tipo: 'text',     label: 'Nombre del pastor principal' },
      { clave: 'foto_pastor', tipo: 'image_url', label: 'Foto del pastor (URL)' }
    ]
  },
  predicaciones: {
    nombre: 'Predicaciones',
    icono: '🎙️',
    orden: 4,
    campos: [
      { clave: 'pred_1_titulo',     tipo: 'text', label: 'Predicación 1 - Título' },
      { clave: 'pred_1_predicador', tipo: 'text', label: 'Predicación 1 - Predicador' },
      { clave: 'pred_1_url',        tipo: 'text', label: 'Predicación 1 - Link YouTube' },
      { clave: 'pred_2_titulo',     tipo: 'text', label: 'Predicación 2 - Título' },
      { clave: 'pred_2_predicador', tipo: 'text', label: 'Predicación 2 - Predicador' },
      { clave: 'pred_2_url',        tipo: 'text', label: 'Predicación 2 - Link YouTube' },
      { clave: 'pred_3_titulo',     tipo: 'text', label: 'Predicación 3 - Título' },
      { clave: 'pred_3_predicador', tipo: 'text', label: 'Predicación 3 - Predicador' },
      { clave: 'pred_3_url',        tipo: 'text', label: 'Predicación 3 - Link YouTube' }
    ]
  },
  eventos: {
    nombre: 'Eventos',
    icono: '📅',
    orden: 5,
    campos: [
      { clave: 'evento_1_titulo', tipo: 'text', label: 'Evento 1 - Título' },
      { clave: 'evento_1_fecha',  tipo: 'text', label: 'Evento 1 - Fecha (ej: 15 JUN)' },
      { clave: 'evento_1_hora',   tipo: 'text', label: 'Evento 1 - Hora' },
      { clave: 'evento_2_titulo', tipo: 'text', label: 'Evento 2 - Título' },
      { clave: 'evento_2_fecha',  tipo: 'text', label: 'Evento 2 - Fecha' },
      { clave: 'evento_2_hora',   tipo: 'text', label: 'Evento 2 - Hora' }
    ]
  },
  ministerios: {
    nombre: 'Ministerios',
    icono: '🙌',
    orden: 6,
    campos: [
      { clave: 'min_1_nombre', tipo: 'text',     label: 'Ministerio 1 - Nombre' },
      { clave: 'min_1_desc',   tipo: 'textarea', label: 'Ministerio 1 - Descripción' },
      { clave: 'min_2_nombre', tipo: 'text',     label: 'Ministerio 2 - Nombre' },
      { clave: 'min_2_desc',   tipo: 'textarea', label: 'Ministerio 2 - Descripción' },
      { clave: 'min_3_nombre', tipo: 'text',     label: 'Ministerio 3 - Nombre' },
      { clave: 'min_3_desc',   tipo: 'textarea', label: 'Ministerio 3 - Descripción' },
      { clave: 'min_4_nombre', tipo: 'text',     label: 'Ministerio 4 - Nombre' },
      { clave: 'min_4_desc',   tipo: 'textarea', label: 'Ministerio 4 - Descripción' }
    ]
  },
  galeria: {
    nombre: 'Galería de fotos',
    icono: '🖼️',
    orden: 7,
    campos: [] // Gestión especial vía endpoint /foto
  },
  transmision: {
    nombre: 'Transmisión en vivo',
    icono: '📺',
    orden: 8,
    campos: [
      { clave: 'youtube_canal',    tipo: 'text', label: 'URL del canal de YouTube' },
      { clave: 'youtube_video_id', tipo: 'text', label: 'ID del último video (ej: dQw4w9WgXcQ)' },
      { clave: 'transmision_nota', tipo: 'text', label: 'Nota de horario (ej: Domingos 10:00 AM)' }
    ]
  },
  ubicacion: {
    nombre: 'Ubicación',
    icono: '📍',
    orden: 9,
    campos: [
      { clave: 'direccion', tipo: 'text', label: 'Dirección completa', requerido: true }
    ]
  },
  contacto: {
    nombre: 'Contacto',
    icono: '📞',
    orden: 10,
    campos: [
      { clave: 'telefono',   tipo: 'text',  label: 'WhatsApp (con código país, ej: 56912345678)' },
      { clave: 'email',      tipo: 'email', label: 'Email de contacto' },
      { clave: 'facebook',   tipo: 'text',  label: 'URL Facebook' },
      { clave: 'instagram',  tipo: 'text',  label: 'URL Instagram' },
      { clave: 'youtube',    tipo: 'text',  label: 'URL YouTube' }
    ]
  },
  donaciones: {
    nombre: 'Donaciones',
    icono: '💝',
    orden: 11,
    campos: [
      { clave: 'banco',            tipo: 'text',  label: 'Banco' },
      { clave: 'numero_cuenta',    tipo: 'text',  label: 'Número de cuenta' },
      { clave: 'tipo_cuenta',      tipo: 'text',  label: 'Tipo de cuenta (Ej: Cuenta Corriente)' },
      { clave: 'titular',          tipo: 'text',  label: 'Titular de la cuenta' },
      { clave: 'rut',              tipo: 'text',  label: 'RUT del titular' },
      { clave: 'email_donaciones', tipo: 'email', label: 'Email para transferencias' }
    ]
  }
};

// Secciones disponibles por plan (en orden)
const TODAS_LAS_SECCIONES = ['hero', 'horarios', 'nosotros', 'predicaciones', 'eventos', 'ministerios', 'galeria', 'transmision', 'ubicacion', 'contacto', 'donaciones'];

// Secciones activas por defecto al crear iglesia
const SECCIONES_DEFAULT = {
  fe:      ['hero', 'horarios', 'nosotros', 'predicaciones', 'contacto'],
  mision:  ['hero', 'horarios', 'nosotros', 'predicaciones', 'eventos', 'ministerios', 'transmision', 'contacto'],
  impacto: ['hero', 'horarios', 'nosotros', 'predicaciones', 'eventos', 'ministerios', 'galeria', 'transmision', 'ubicacion', 'contacto', 'donaciones']
};

// Todos los planes ven las 11 secciones, el limite controla cuantas pueden activar
const SECCIONES_POR_PLAN = {
  fe:      TODAS_LAS_SECCIONES,
  mision:  TODAS_LAS_SECCIONES,
  impacto: TODAS_LAS_SECCIONES
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

    // Plantilla usada
    const plantillaRes = await pool.query(
      'SELECT plantilla_usada FROM iglesias_aprobadas WHERE id = $1',
      [iglesiaId]
    );
    const plantillaUsada = plantillaRes.rows[0]?.plantilla_usada || 'reverente';

    res.json({
      contenido: contenidoPorSeccion,
      secciones: secciones.rows,
      limites: {
        ediciones_usadas: edicionesUsadas,
        ediciones_limite: limites.ediciones === Infinity ? 'ilimitadas' : limites.ediciones,
        ediciones_restantes: limites.ediciones === Infinity ? 'ilimitadas' : Math.max(0, limites.ediciones - edicionesUsadas),
        fotos_usadas: parseInt(fotos.rows[0].total),
        fotos_limite: limites.fotos,
        secciones_limite: limites.secciones
      },
      plan,
      plantilla: plantillaUsada
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

    getWebController().clearCache(iglesiaId);
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

    getWebController().clearCache(iglesiaId);
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
    getWebController().clearCache(iglesiaId);
    res.json({ ok: true, mensaje: 'Foto eliminada' });
  } catch (err) {
    console.error('Error eliminando foto:', err);
    res.status(500).json({ error: 'Error al eliminar la foto' });
  }
}

// ── LISTAR ACCESOS DE PASTOR (admin only) ──
async function listarAccesos(req, res) {
  try {
    const result = await pool.query(
      `SELECT pa.id, pa.iglesia_id, pa.usuario, pa.password_plano, pa.creado_en, pa.ultimo_login,
              ia.nombre_iglesia
       FROM pastores_acceso pa
       LEFT JOIN iglesias_aprobadas ia ON ia.id = pa.iglesia_id
       ORDER BY pa.creado_en DESC`
    );
    res.json({ accesos: result.rows });
  } catch (err) {
    console.error('Error listando accesos:', err);
    res.status(500).json({ error: 'Error al listar accesos' });
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
      `INSERT INTO pastores_acceso (iglesia_id, usuario, password_hash, password_plano)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (usuario) DO UPDATE SET password_hash = $3, password_plano = $4`,
      [iglesia_id, usuario.toLowerCase().trim(), hash, password]
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

// ── OBTENER SECCIONES CONFIG (qué campos tiene cada sección) ──
async function getSecciones(req, res) {
  const { iglesiaId, plan } = req.pastor;

  try {
    const seccionesDelPlan = SECCIONES_POR_PLAN[plan] || SECCIONES_POR_PLAN.fe;

    // Verificar cuáles están activas en BD para esta iglesia
    const activasDB = await pool.query(
      `SELECT seccion_slug, activa FROM secciones_iglesia WHERE iglesia_id = $1`,
      [iglesiaId]
    );
    const mapaActivas = {};
    activasDB.rows.forEach(r => { mapaActivas[r.seccion_slug] = r.activa; });

    const secciones = seccionesDelPlan.map(slug => ({
      slug,
      ...SECCIONES_CONFIG[slug],
      // Si no hay registro en BD, activa solo si esta en las secciones default del plan
      activa: mapaActivas[slug] !== undefined ? mapaActivas[slug] : (SECCIONES_DEFAULT[plan] || SECCIONES_DEFAULT.fe).includes(slug),
      incluida_en_plan: true
    }));

    res.json({
      secciones,
      plan,
      total_secciones: secciones.length,
      limite_secciones: LIMITES[plan]?.secciones || 5
    });
  } catch (err) {
    console.error('Error obteniendo secciones:', err);
    res.status(500).json({ error: 'Error al cargar las secciones' });
  }
}

// ── TOGGLE SECCIÓN ACTIVA/INACTIVA ──
async function toggleSeccion(req, res) {
  const { iglesiaId, plan } = req.pastor;
  const { seccion_slug, activa } = req.body;

  if (!seccion_slug) {
    return res.status(400).json({ error: 'seccion_slug es obligatorio' });
  }

  const seccionesDelPlan = SECCIONES_POR_PLAN[plan] || SECCIONES_POR_PLAN.fe;
  if (!seccionesDelPlan.includes(seccion_slug)) {
    return res.status(403).json({ error: 'Esta sección no está disponible en tu plan' });
  }

  // No permitir desactivar hero ni contacto
  if (['hero', 'contacto'].includes(seccion_slug)) {
    return res.status(400).json({ error: `La sección '${seccion_slug}' no se puede desactivar` });
  }

  // Validar limite de secciones activas al activar
  if (activa !== false) {
    const limite = LIMITES[plan]?.secciones || 5;
    const activasActuales = await pool.query(
      `SELECT COUNT(*) as total FROM secciones_iglesia WHERE iglesia_id = $1 AND activa = true`,
      [iglesiaId]
    );
    // Contar tambien las que no estan en BD (por defecto activas)
    const seccionesEnBD = await pool.query(
      `SELECT seccion_slug, activa FROM secciones_iglesia WHERE iglesia_id = $1`,
      [iglesiaId]
    );
    const mapa = {};
    seccionesEnBD.rows.forEach(r => { mapa[r.seccion_slug] = r.activa; });
    let totalActivas = 0;
    TODAS_LAS_SECCIONES.forEach(s => {
      if (mapa[s] !== undefined) { if (mapa[s]) totalActivas++; }
    });
    // Si ya esta en el limite y quiere activar una nueva
    if (totalActivas >= limite && mapa[seccion_slug] !== true) {
      return res.status(400).json({ error: 'Has alcanzado el limite de ' + limite + ' secciones activas en tu plan. Desactiva una antes de activar otra.' });
    }
  }

  try {
    await pool.query(
      `INSERT INTO secciones_iglesia (iglesia_id, seccion_slug, activa)
       VALUES ($1, $2, $3)
       ON CONFLICT (iglesia_id, seccion_slug)
       DO UPDATE SET activa = $3`,
      [iglesiaId, seccion_slug, activa !== false]
    );

    getWebController().clearCache(iglesiaId);
    res.json({ ok: true, seccion_slug, activa: activa !== false });
  } catch (err) {
    console.error('Error toggling sección:', err);
    res.status(500).json({ error: 'Error al actualizar la sección' });
  }
}

// ── OBTENER INFO DE DOMINIO ──
async function getDominio(req, res) {
  const { iglesiaId, plan } = req.pastor;

  try {
    const result = await pool.query(
      `SELECT nombre_iglesia, dominio_tipo, dominio_valor, plan_seleccionado
       FROM iglesias_aprobadas WHERE id = $1`,
      [iglesiaId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Iglesia no encontrada' });
    }

    const iglesia = result.rows[0];
    const subdominio = iglesia.nombre_iglesia
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    const urlPublica = iglesia.dominio_valor
      ? (iglesia.dominio_tipo === 'propio'
          ? `https://${iglesia.dominio_valor}`
          : `https://${iglesia.dominio_valor}.tuwebiglesia.cl`)
      : `https://church-generator-api-production.up.railway.app/api/web/${iglesiaId}`;

    res.json({
      nombre_iglesia: iglesia.nombre_iglesia,
      plan,
      dominio_tipo:  iglesia.dominio_tipo  || 'subdominio',
      dominio_valor: iglesia.dominio_valor || subdominio,
      dominio_asignado: !!iglesia.dominio_valor,
      url_publica: urlPublica,
      url_fallback: `https://church-generator-api-production.up.railway.app/api/web/${iglesiaId}`,
      subdominio_sugerido: subdominio
    });
  } catch (err) {
    console.error('Error obteniendo dominio:', err);
    res.status(500).json({ error: 'Error al cargar el dominio' });
  }
}

// ── STATS DEL PASTOR ──
async function getStats(req, res) {
  const { iglesiaId, plan } = req.pastor;
  const mesActual = new Date().toISOString().slice(0, 7);
  const limites = LIMITES[plan] || LIMITES.fe;

  try {
    // Ediciones este mes
    const edicionesRes = await pool.query(
      `SELECT conteo FROM ediciones_mensuales WHERE iglesia_id = $1 AND mes = $2`,
      [iglesiaId, mesActual]
    );
    const edicionesUsadas = edicionesRes.rows.length > 0 ? edicionesRes.rows[0].conteo : 0;

    // Total fotos
    const fotosRes = await pool.query(
      `SELECT COUNT(*) as total FROM contenido_iglesia
       WHERE iglesia_id = $1 AND seccion_slug = 'galeria'`,
      [iglesiaId]
    );
    const fotosUsadas = parseInt(fotosRes.rows[0].total);

    // Total campos completados
    const camposRes = await pool.query(
      `SELECT COUNT(*) as total FROM contenido_iglesia
       WHERE iglesia_id = $1 AND seccion_slug != 'galeria' AND valor IS NOT NULL AND valor != ''`,
      [iglesiaId]
    );
    const camposCompletados = parseInt(camposRes.rows[0].total);

    // Secciones activas
    const seccionesRes = await pool.query(
      `SELECT COUNT(*) as total FROM secciones_iglesia
       WHERE iglesia_id = $1 AND activa = true`,
      [iglesiaId]
    );
    const seccionesActivas = parseInt(seccionesRes.rows[0].total);

    // Último login del pastor
    const loginRes = await pool.query(
      `SELECT ultimo_login FROM pastores_acceso WHERE iglesia_id = $1 ORDER BY ultimo_login DESC LIMIT 1`,
      [iglesiaId]
    );

    // Historial de ediciones (últimos 6 meses)
    const historialRes = await pool.query(
      `SELECT mes, conteo FROM ediciones_mensuales
       WHERE iglesia_id = $1
       ORDER BY mes DESC LIMIT 6`,
      [iglesiaId]
    );

    res.json({
      plan,
      mes_actual: mesActual,
      ediciones: {
        usadas:     edicionesUsadas,
        limite:     limites.ediciones === Infinity ? null : limites.ediciones,
        restantes:  limites.ediciones === Infinity ? null : Math.max(0, limites.ediciones - edicionesUsadas),
        porcentaje: limites.ediciones === Infinity ? 0 : Math.round((edicionesUsadas / limites.ediciones) * 100)
      },
      fotos: {
        usadas:     fotosUsadas,
        limite:     limites.fotos,
        restantes:  Math.max(0, limites.fotos - fotosUsadas),
        porcentaje: Math.round((fotosUsadas / limites.fotos) * 100)
      },
      contenido: {
        campos_completados: camposCompletados,
        secciones_activas:  seccionesActivas
      },
      ultimo_login: loginRes.rows.length > 0 ? loginRes.rows[0].ultimo_login : null,
      historial_ediciones: historialRes.rows
    });
  } catch (err) {
    console.error('Error obteniendo stats:', err);
    res.status(500).json({ error: 'Error al cargar las estadísticas' });
  }
}

// ── CAMBIAR PLANTILLA VISUAL ──
async function cambiarPlantilla(req, res) {
  const { iglesiaId, plan } = req.pastor;
  const { plantilla } = req.body;

  const plantillasDisponibles = {
    fe:      ['reverente'],
    mision:  ['reverente', 'contemporanea', 'acogedora'],
    impacto: ['reverente', 'contemporanea', 'acogedora', 'catedral', 'transmision', 'mision', 'plaza']
  };

  const disponibles = plantillasDisponibles[plan] || plantillasDisponibles.fe;

  if (!disponibles.includes(plantilla)) {
    return res.status(403).json({
      error: `La plantilla '${plantilla}' no está disponible en tu plan ${plan}`,
      disponibles
    });
  }

  try {
    await pool.query(
      `UPDATE iglesias_aprobadas SET plantilla_usada = $1 WHERE id = $2`,
      [plantilla, iglesiaId]
    );

    getWebController().clearCache(iglesiaId);
    res.json({
      ok: true,
      plantilla,
      mensaje: 'Plantilla actualizada. Tu web se verá reflejada en minutos.'
    });
  } catch (err) {
    console.error('Error cambiando plantilla:', err);
    res.status(500).json({ error: 'Error al cambiar la plantilla' });
  }
}

// ── PREVIEW HTML EN TIEMPO REAL ──
async function getPreview(req, res) {
  const { iglesiaId } = req.pastor;

  try {
    const iglesiaRes = await pool.query(
      `SELECT nombre_iglesia, plantilla_usada FROM iglesias_aprobadas WHERE id = $1`,
      [iglesiaId]
    );
    if (iglesiaRes.rows.length === 0) return res.status(404).json({ error: 'Iglesia no encontrada' });
    const iglesia = iglesiaRes.rows[0];

    const contenidoBD = {};
    const contenidoRes = await pool.query(
      `SELECT seccion_slug, clave, valor FROM contenido_iglesia WHERE iglesia_id = $1`,
      [iglesiaId]
    );
    contenidoRes.rows.forEach(row => {
      if (!contenidoBD[row.seccion_slug]) contenidoBD[row.seccion_slug] = {};
      contenidoBD[row.seccion_slug][row.clave] = row.valor;
    });

    // Usar el mismo transformer del webController
    const { transformarContenido, construirDatos } = getWebController();
    const contenido = transformarContenido(contenidoBD);
    const datos = construirDatos(contenidoBD, iglesia, '');

    const plantilla = iglesia.plantilla_usada || 'reverente';
    const html = generarHTML(plantilla, datos, contenido);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    console.error('Error generando preview:', err);
    res.status(500).json({ error: 'Error al generar el preview' });
  }
}

module.exports = {
  login,
  getContenido,
  updateContenido,
  subirFoto,
  eliminarFoto,
  crearAcceso,
  listarAccesos,
  getSecciones,
  toggleSeccion,
  getDominio,
  getStats,
  cambiarPlantilla,
  getPreview
};
