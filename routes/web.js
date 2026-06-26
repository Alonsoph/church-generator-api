// routes/web.js
const express = require('express');
const router = express.Router();
const { servirWebPorDominio, servirWebPorId } = require('../controllers/webController');

// Servir web por dominio/host
router.get('/dominio', servirWebPorDominio);

// Servir web por ID (fallback)
router.get('/:id', servirWebPorId);

module.exports = router;
// v2
