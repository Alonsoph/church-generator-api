// controllers/webController.js
const pool = require('../config/db');
const { generarHTML } = require('../templates/selector');

// Caché simple en memoria (1 hora)
const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hora en ms

function getCache(key) {
  const item = cache.get(key);
  if (item && Date.now() - item.timestamp < CACHE_TTL) {
    return item.html;
  }
  cache.delete(key);
  return null;
}

function setCache(key, html) {
  cache.set(key, { html, timestamp: Date.now() });
}

// Limpiar caché cuando el pastor publica cambios
function clearCache(iglesiaId) {
  for (const key of cache.keys()) {
    if (key.includes('iglesia-' + iglesiaId) || key.includes('id-' + iglesiaId)) {
      cache.delete(key);
    }
  }
}

// ── SERVICIO: Obtener iglesia por dominio ──
async function getIglesiaByDominio(host) {
  const hostLower = host.toLowerCase().trim();
  
  // Intentar buscar por dominio_valor exacto
  const result = await pool.query(
    'SELECT id, nombre_iglesia, plan_seleccionado, dominio_tipo, dominio_valor, html_final, html_generado, plantilla_usada, estado FROM iglesias_aprobadas WHERE LOWER(dominio_valor) = $1',
    [hostLower.replace('.tuwebiglesia.cl', '')]
  );
  
  if (result.rows.length > 0) {
    return result.rows[0];
  }
  
  // Intentar buscar por nombre normalizado
  const nombreSlug = hostLower.replace('.tuwebiglesia.cl', '').replace(/-/g, ' ');
  const nombreResult = await pool.query(
    'SELECT id, nombre_iglesia, plan_seleccionado, dominio_tipo, dominio_valor, html_final, html_generado, plantilla_usada, estado FROM iglesias_aprobadas WHERE LOWER(nombre_iglesia) LIKE $1',
    [nombreSlug + '%']
  );
  
  return nombreResult.rows[0] || null;
}

// ── SERVICIO: Obtener contenido estructurado ──
async function getContenidoEstructurado(iglesiaId) {
  const result = await pool.query(
    'SELECT seccion_slug, clave, valor FROM contenido_iglesia WHERE iglesia_id = $1',
    [iglesiaId]
  );
  
  const contenido = {};
  result.rows.forEach(row => {
    if (!contenido[row.seccion_slug]) {
      contenido[row.seccion_slug] = {};
    }
    contenido[row.seccion_slug][row.clave] = row.valor;
  });
  
  return contenido;
}

// ── HELPER: Transformar contenido al formato de plantillas ──
function transformarContenido(contenidoBD) {
  const c = {};
  
  c.hero_cta = 'Conócenos';
  c.horarios_intro = 'Te esperamos cada semana';
  c.horarios = [
    { titulo: 'Servicio Dominical', horario: 'Domingo · 10:00' },
    { titulo: 'Estudio Bíblico', horario: 'Miércoles · 19:00' },
  ];
  
  // Horarios dinámicos
  if (contenidoBD.horarios) {
    for (let i = 1; i <= 3; i++) {
      if (contenidoBD.horarios['horario_' + i + '_nombre']) {
        c.horarios[i-1] = {
          titulo: contenidoBD.horarios['horario_' + i + '_nombre'],
          horario: (contenidoBD.horarios['horario_' + i + '_dia'] || '') + ' · ' + (contenidoBD.horarios['horario_' + i + '_hora'] || '')
        };
      }
    }
  }
  
  c.predicaciones_intro = 'Escucha y crece en tu fe';
  c.predicaciones = [];
  if (contenidoBD.predicaciones) {
    for (let i = 1; i <= 3; i++) {
      if (contenidoBD.predicaciones['pred_' + i + '_titulo']) {
        c.predicaciones.push({
          titulo: contenidoBD.predicaciones['pred_' + i + '_titulo'],
          predicador: contenidoBD.predicaciones['pred_' + i + '_predicador'] || 'Pastor'
        });
      }
    }
  }
  if (c.predicaciones.length === 0) {
    c.predicaciones = [{ titulo: 'El poder de la fe', predicador: 'Pastor' }];
  }
  
  c.eventos_intro = 'No te pierdas nuestras actividades';
  c.eventos = [];
  if (contenidoBD.eventos) {
    for (let i = 1; i <= 2; i++) {
      if (contenidoBD.eventos['evento_' + i + '_titulo']) {
        c.eventos.push({
          titulo: contenidoBD.eventos['evento_' + i + '_titulo'],
          fecha_dia: contenidoBD.eventos['evento_' + i + '_fecha']?.split(' ')[0] || '',
          fecha_mes: contenidoBD.eventos['evento_' + i + '_fecha']?.split(' ')[1]?.toUpperCase().slice(0,3) || '',
          hora: contenidoBD.eventos['evento_' + i + '_hora'] || ''
        });
      }
    }
  }
  
  c.ministerios_intro = 'Hay un lugar para ti';
  c.ministerios = [];
  if (contenidoBD.ministerios) {
    for (let i = 1; i <= 8; i++) {
      if (contenidoBD.ministerios['min_' + i + '_nombre']) {
        c.ministerios.push({
          nombre: contenidoBD.ministerios['min_' + i + '_nombre'],
          descripcion: contenidoBD.ministerios['min_' + i + '_desc'] || '',
          lider: ''
        });
      }
    }
  }
  
  c.transmision_intro = 'Acompáñanos desde donde estés';
  c.transmision_nota = 'Transmitimos cada domingo';
  
  c.nuevos_intro = 'Queremos que te sientas como en casa';
  c.pasos_nuevos = ['Llega unos minutos antes', 'Vístete cómodo', 'Tenemos espacio para tus niños', 'Quédate para un café'];
  
  c.donaciones_intro = 'Tu generosidad sostiene la obra';
  c.banco = contenidoBD.donaciones?.banco || '';
  c.numero_cuenta = contenidoBD.donaciones?.numero_cuenta || '';
  c.tipo_cuenta = contenidoBD.donaciones?.tipo_cuenta || '';
  c.titular = contenidoBD.donaciones?.titular || '';
  c.rut = contenidoBD.donaciones?.rut || '';
  c.email_donaciones = contenidoBD.donaciones?.email_donaciones || '';
  
  return c;
}

// ── HELPER: Construir datos para plantilla ──
function construirDatos(contenidoBD, iglesia) {
  return {
    iglesia: {
      nombre: contenidoBD.hero?.nombre_iglesia || iglesia.nombre_iglesia,
      lema: contenidoBD.hero?.lema || '',
    },
    ubicacion: {
      direccion: contenidoBD.ubicacion?.direccion || contenidoBD.contacto?.direccion || '',
      ciudad: '',
    },
    redes_sociales: {
      whatsapp: contenidoBD.contacto?.telefono || '',
      email: contenidoBD.contacto?.email || '',
      youtube: contenidoBD.contacto?.youtube || '',
      instagram: contenidoBD.contacto?.instagram || '',
      facebook: contenidoBD.contacto?.facebook || '',
    },
    multimedia: { logo: '', fotoPrincipal: '' },
    funcionalidades_activas: {
      horarios_ubicacion: true,
      biblioteca_sermones: true,
      calendario_eventos: true,
      transmision_vivo: true,
      ministerios: true,
      formulario_contacto: true,
      pagina_nuevos_visitantes: true,
      donaciones: true,
      galeria_fotos: true,
      redes_sociales: true,
    },
  };
}

// ── CONTROLADOR: Servir web por dominio ──
async function servirWebPorDominio(req, res) {
  try {
    const host = req.query.host || req.headers.host || '';
    
    if (!host) {
      return res.status(400).send('Dominio no especificado');
    }
    
    const cached = getCache(host);
    if (cached) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('X-Cache', 'HIT');
      return res.send(cached);
    }
    
    const iglesia = await getIglesiaByDominio(host);
    if (!iglesia) {
      return res.status(404).send('<h1>Iglesia no encontrada</h1><a href="https://tuwebiglesia.cl">Volver</a>');
    }
    
    const contenidoBD = await getContenidoEstructurado(iglesia.id);
    const contenido = transformarContenido(contenidoBD);
    const datos = construirDatos(contenidoBD, iglesia);
    const plantilla = iglesia.plantilla_usada || 'reverente';
    const html = generarHTML(plantilla, datos, contenido);
    
    setCache(host, html);
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Cache', 'MISS');
    res.send(html);
    
  } catch (err) {
    console.error('Error sirviendo web:', err);
    res.status(500).send('Error interno');
  }
}

// ── CONTROLADOR: Servir web por ID ──
async function servirWebPorId(req, res) {
  try {
    const { id } = req.params;
    
    const cached = getCache('id-' + id);
    if (cached) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.send(cached);
    }
    
    const result = await pool.query(
      'SELECT id, nombre_iglesia, html_final, html_generado, plantilla_usada, estado FROM iglesias_aprobadas WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).send('Iglesia no encontrada');
    }
    
    const iglesia = result.rows[0];
    
    const contenidoBD = await getContenidoEstructurado(iglesia.id);
    const contenido = transformarContenido(contenidoBD);
    const datos = construirDatos(contenidoBD, iglesia);
    const plantilla = iglesia.plantilla_usada || 'reverente';
    const html = generarHTML(plantilla, datos, contenido);
    
    setCache('id-' + id, html);
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
    
  } catch (err) {
    console.error('Error sirviendo web por ID:', err);
    res.status(500).send('Error interno');
  }
}

module.exports = {
  servirWebPorDominio,
  servirWebPorId,
  clearCache,
};
