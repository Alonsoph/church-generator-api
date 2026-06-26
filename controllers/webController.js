// controllers/webController.js
const pool = require('../config/db');
const { generarHTML } = require('../templates/selector');

// Caché simple en memoria (1 hora)
const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000;

function getCache(key) {
  const item = cache.get(key);
  if (item && Date.now() - item.timestamp < CACHE_TTL) return item.html;
  cache.delete(key);
  return null;
}

function setCache(key, html) {
  cache.set(key, { html, timestamp: Date.now() });
}

function clearCache(iglesiaId) {
  for (const key of cache.keys()) {
    if (key.includes(String(iglesiaId))) cache.delete(key);
  }
}

async function getContenido(iglesiaId) {
  const result = await pool.query(
    'SELECT seccion_slug, clave, valor FROM contenido_iglesia WHERE iglesia_id = $1',
    [iglesiaId]
  );
  const contenido = {};
  result.rows.forEach(row => {
    if (!contenido[row.seccion_slug]) contenido[row.seccion_slug] = {};
    contenido[row.seccion_slug][row.clave] = row.valor;
  });
  return contenido;
}

function transformarContenido(contenidoBD) {
  const c = { horarios: [], predicaciones: [], eventos: [], ministerios: [] };
  c.hero_cta = 'Conócenos';
  c.horarios_intro = 'Te esperamos cada semana';
  for (let i = 1; i <= 3; i++) {
    const nombre = contenidoBD.horarios?.['horario_' + i + '_nombre'];
    const dia = contenidoBD.horarios?.['horario_' + i + '_dia'];
    const hora = contenidoBD.horarios?.['horario_' + i + '_hora'];
    if (nombre) c.horarios.push({ titulo: nombre, horario: (dia || '') + ' ' + (hora || '') });
  }
  if (c.horarios.length === 0) c.horarios = [{ titulo: 'Servicio Dominical', horario: 'Domingo 10:00' }];
  c.predicaciones_intro = 'Escucha y crece en tu fe';
  for (let i = 1; i <= 3; i++) {
    const titulo = contenidoBD.predicaciones?.['pred_' + i + '_titulo'];
    const predicador = contenidoBD.predicaciones?.['pred_' + i + '_predicador'];
    if (titulo) c.predicaciones.push({ titulo, predicador: predicador || 'Pastor' });
  }
  if (c.predicaciones.length === 0) c.predicaciones = [{ titulo: 'El poder de la fe', predicador: 'Pastor' }];
  c.eventos_intro = 'No te pierdas nuestras actividades';
  for (let i = 1; i <= 2; i++) {
    const titulo = contenidoBD.eventos?.['evento_' + i + '_titulo'];
    const fecha = contenidoBD.eventos?.['evento_' + i + '_fecha'];
    const hora = contenidoBD.eventos?.['evento_' + i + '_hora'];
    if (titulo) {
      const parts = (fecha || '').split(' ');
      c.eventos.push({ titulo, fecha_dia: parts[0] || '', fecha_mes: (parts[1] || '').toUpperCase().slice(0,3), hora: hora || '' });
    }
  }
  c.ministerios_intro = 'Hay un lugar para ti';
  for (let i = 1; i <= 8; i++) {
    const nombre = contenidoBD.ministerios?.['min_' + i + '_nombre'];
    const desc = contenidoBD.ministerios?.['min_' + i + '_desc'];
    if (nombre) c.ministerios.push({ nombre, descripcion: desc || '', lider: '' });
  }
  c.transmision_intro = 'Acompáñanos desde donde estés';
  c.transmision_nota = 'Transmitimos cada domingo';
  c.nuevos_intro = 'Queremos que te sientas como en casa';
  c.pasos_nuevos = ['Llega unos minutos antes', 'Vístete cómodo', 'Tenemos espacio para niños', 'Quédate para un café'];
  c.donaciones_intro = 'Tu generosidad sostiene la obra';
  c.banco = contenidoBD.donaciones?.banco || '';
  c.numero_cuenta = contenidoBD.donaciones?.numero_cuenta || '';
  c.tipo_cuenta = contenidoBD.donaciones?.tipo_cuenta || '';
  c.titular = contenidoBD.donaciones?.titular || '';
  c.rut = contenidoBD.donaciones?.rut || '';
  c.email_donaciones = contenidoBD.donaciones?.email_donaciones || '';
  return c;
}

function construirDatos(contenidoBD, iglesia) {
  return {
    iglesia: { nombre: contenidoBD.hero?.nombre_iglesia || iglesia.nombre_iglesia, lema: contenidoBD.hero?.lema || '' },
    ubicacion: { direccion: contenidoBD.ubicacion?.direccion || contenidoBD.contacto?.direccion || '', ciudad: '' },
    redes_sociales: { whatsapp: contenidoBD.contacto?.telefono || '', email: contenidoBD.contacto?.email || '', youtube: contenidoBD.contacto?.youtube || '', instagram: contenidoBD.contacto?.instagram || '', facebook: contenidoBD.contacto?.facebook || '' },
    multimedia: { logo: '', fotoPrincipal: '' },
    funcionalidades_activas: { horarios_ubicacion: true, biblioteca_sermones: true, calendario_eventos: true, transmision_vivo: true, ministerios: true, formulario_contacto: true, pagina_nuevos_visitantes: true, donaciones: true, galeria_fotos: true, redes_sociales: true }
  };
}

async function servirWebPorDominio(req, res) {
  try {
    const host = req.query.host || req.get('host') || '';
    if (!host) return res.status(400).send('Dominio requerido');
    const cached = getCache(host);
    if (cached) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('X-Cache', 'HIT');
      return res.send(cached);
    }
    const slug = host.replace('.tuwebiglesia.cl', '').replace(/-/g, ' ').toLowerCase();
    const result = await pool.query(
      'SELECT id, nombre_iglesia FROM iglesias_aprobadas WHERE LOWER(nombre_iglesia) LIKE $1 LIMIT 1',
      [slug + '%']
    );
    if (result.rows.length === 0) return res.status(404).send('<h1>Iglesia no encontrada</h1>');
    const iglesia = result.rows[0];
    const contenidoBD = await getContenido(iglesia.id);
    const contenido = transformarContenido(contenidoBD);
    const datos = construirDatos(contenidoBD, iglesia);
    const plantilla = 'reverente';
    const html = generarHTML(plantilla, datos, contenido);
    setCache(host, html);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    console.error('Error web:', err);
    res.status(500).send('Error interno');
  }
}

async function servirWebPorId(req, res) {
  try {
    const { id } = req.params;
    const cached = getCache('id-' + id);
    if (cached) return res.setHeader('Content-Type', 'text/html; charset=utf-8').send(cached);
    const result = await pool.query('SELECT id, nombre_iglesia FROM iglesias_aprobadas WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).send('No encontrada');
    const iglesia = result.rows[0];
    const contenidoBD = await getContenido(iglesia.id);
    const contenido = transformarContenido(contenidoBD);
    const datos = construirDatos(contenidoBD, iglesia);
    const html = generarHTML('reverente', datos, contenido);
    setCache('id-' + id, html);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error');
  }
}

module.exports = { servirWebPorDominio, servirWebPorId, clearCache };
