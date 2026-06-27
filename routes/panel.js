// routes/panel.js
const express = require('express');
const router = express.Router();
const { panelAuth } = require('../middleware/panelAuth');
const adminAuth = require('../middleware/adminAuth');
const {
  login,
  getContenido,
  updateContenido,
  subirFoto,
  eliminarFoto,
  crearAcceso,
  getSecciones,
  toggleSeccion,
  getDominio,
  getStats,
  cambiarPlantilla,
  getPreview
} = require('../controllers/panelController');

// ──────────────────────────────────────────────────
const router_pub = express.Router();
const router_pastor = express.Router();

// Público: login del pastor
router_pub.post('/login', login);

// ── Protegido por JWT del pastor ──

// Contenido
router_pastor.get('/contenido',  getContenido);   // GET  /api/panel/contenido
router_pastor.put('/contenido',  updateContenido); // PUT  /api/panel/contenido

// Fotos
router_pastor.post('/foto',   subirFoto);    // POST   /api/panel/foto
router_pastor.delete('/foto', eliminarFoto); // DELETE /api/panel/foto

// Secciones
router_pastor.get('/secciones',         getSecciones);  // GET  /api/panel/secciones
router_pastor.patch('/secciones/toggle', toggleSeccion); // PATCH /api/panel/secciones/toggle

// Dominio
router_pastor.get('/dominio', getDominio); // GET /api/panel/dominio

// Stats
router_pastor.get('/stats', getStats); // GET /api/panel/stats

// Plantilla visual
router_pastor.post('/plantilla', cambiarPlantilla); // POST /api/panel/plantilla

// Preview HTML en tiempo real
router_pastor.get('/preview', getPreview); // GET /api/panel/preview

// Aplicar middleware de autenticación al grupo de rutas protegidas
router.use('/', router_pub);
router.use('/', panelAuth, router_pastor);

// ── Protegido por admin token ──
router.post('/crear-acceso', adminAuth, crearAcceso);

module.exports = router;
