const express = require('express');
const router = express.Router();
const generador = require('../controllers/generador');

router.post('/generar', generador.generarPagina);
router.get('/preview', generador.mostrarPreview);

module.exports = router;