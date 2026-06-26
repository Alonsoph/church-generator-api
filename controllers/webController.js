// controllers/webController.js
const pool = require('../config/db');

// Caché simple en memoria
const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000;

function clearCache(iglesiaId) {
  for (const key of cache.keys()) {
    if (key.includes(String(iglesiaId))) {
      cache.delete(key);
    }
  }
}

async function servirWebPorDominio(req, res) {
  try {
    const host = req.query.host || req.get('host') || '';
    
    if (!host) {
      return res.status(400).send('Dominio requerido');
    }
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send('<h1>Web de: ' + host + '</h1><p>Endpoint funcionando correctamente</p>');
    
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error interno');
  }
}

async function servirWebPorId(req, res) {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT html_final, html_generado FROM iglesias_aprobadas WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).send('Iglesia no encontrada');
    }
    
    const html = result.rows[0].html_final || result.rows[0].html_generado;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
    
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error interno');
  }
}

module.exports = { servirWebPorDominio, servirWebPorId, clearCache };
