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
  crearAcceso
} = require('../controllers/panelController');

// Público: login del pastor
router.post('/login', login);

// Protegido por JWT del pastor
router.get('/contenido', panelAuth, getContenido);
router.put('/contenido', panelAuth, updateContenido);
router.post('/foto', panelAuth, subirFoto);
router.delete('/foto', panelAuth, eliminarFoto);

// Protegido por admin token: crear acceso para un pastor
router.post('/crear-acceso', adminAuth, crearAcceso);

module.exports = router;
