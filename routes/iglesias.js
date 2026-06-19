const express = require('express');
const router = express.Router();
const generador = require('../controllers/generador');

router.post('/generar', generador.generarPagina);
router.post('/cambiar-plantilla', generador.cambiarPlantilla);
router.get('/preview', generador.mostrarPreview);
router.post('/aprobar', generador.aprobarIglesia);
router.get('/admin/pendientes', generador.listarPendientes);
module.exports = router;