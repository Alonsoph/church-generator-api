const express = require('express');
const router = express.Router();
const generador = require('../controllers/generador');
const adminAuth = require('../middleware/adminAuth');
const iglesiasAdmin = require('../controllers/iglesiasAdminController');

// Públicos
router.post('/generar', generador.generarPagina);
router.post('/cambiar-plantilla', generador.cambiarPlantilla);
router.get('/preview', generador.mostrarPreview);
router.post('/aprobar', generador.aprobarIglesia);

// Admin (protegidos con token)
router.get('/admin/pendientes', adminAuth, generador.listarPendientes);
router.get('/admin/listar', adminAuth, iglesiasAdmin.listarIglesias);
router.post('/admin/:id/observacion', adminAuth, iglesiasAdmin.agregarObservacion);

module.exports = router;