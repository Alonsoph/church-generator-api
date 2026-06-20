// Rutas de misioneros (afiliados)
// La ruta pública /validar/:codigo no requiere autenticación.
// Las rutas /admin/... están protegidas con el middleware adminAuth.

const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const ctrl = require('../controllers/misionerosController');

// PÚBLICO
router.get('/validar/:codigo', ctrl.validarCodigo);

// ADMIN — el orden importa: /admin/ventas va ANTES que /admin/:id
router.get('/admin/ventas', adminAuth, ctrl.verVentas);
router.get('/admin', adminAuth, ctrl.listarMisioneros);
router.post('/admin', adminAuth, ctrl.crearMisionero);
router.patch('/admin/:id', adminAuth, ctrl.editarMisionero);
router.delete('/admin/:id', adminAuth, ctrl.desactivarMisionero);

module.exports = router;