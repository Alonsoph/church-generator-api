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
router_pub.post('/crear-acceso', adminAuth, crearAcceso);

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
// crear-acceso movido a router_pub

module.exports = router;

// Subida de archivos a Cloudinary
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router_pastor.post('/upload', upload.single('imagen'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se envio imagen' });
    const { iglesiaId } = req.pastor;
    const b64 = req.file.buffer.toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${b64}`;
    const resultado = await cloudinary.uploader.upload(dataUri, {
      folder: 'tuwebiglesia/panel',
      public_id: `img-${iglesiaId}-${Date.now()}`,
    });
    res.json({ url: resultado.secure_url, public_id: resultado.public_id });
  } catch (err) {
    console.error('Error subiendo imagen:', err);
    res.status(500).json({ error: 'Error al subir imagen' });
  }
});

// Generar imagen por IA para seccion portada
router_pastor.post('/generar-imagen', async (req, res) => {
  try {
    const { iglesiaId } = req.pastor;
    const { descripcion } = req.body;
    const nombre = req.pastor.nombre || 'iglesia';
    // Buscar nombre iglesia
    const { Pool } = require('pg');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
    const iglesiaRes = await pool.query('SELECT nombre_iglesia FROM iglesias_aprobadas WHERE id = $1', [iglesiaId]);
    const nombreIglesia = iglesiaRes.rows[0]?.nombre_iglesia || nombre;
    await pool.end();

    const prompt = descripcion || `Iglesia cristiana evangélica moderna, ${nombreIglesia}, ambiente acogedor, estilo profesional, colores cálidos, luz natural, 4k`;
    const Groq = require('groq-sdk');
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: 'mixtral-8x7b-32768',
      messages: [{ role: 'user', content: `Genera una descripción detallada para crear una imagen de iglesia: ${prompt}. Responde solo con la descripción en español, máximo 100 palabras.` }],
    });
    const descripcionIA = completion.choices[0]?.message?.content || prompt;

    // Usar Replicate para generar imagen
    const Replicate = require('replicate');
    const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
    const output = await replicate.run('stability-ai/stable-diffusion-3.5-large-turbo', {
      input: { prompt: descripcionIA, negative_prompt: 'texto, letras, palabras, personas feas, deformes', width: 1024, height: 576, num_outputs: 1 },
    });
    const urlImagen = output[0];

    res.json({ url: urlImagen, descripcion: descripcionIA });
  } catch (err) {
    console.error('Error generando imagen:', err);
    res.status(500).json({ error: 'Error al generar imagen' });
  }
});
