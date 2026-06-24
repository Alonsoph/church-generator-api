const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const os = require("os");
const pool = require("../config/db");

const { generarGuionAntesDespues } = require("../services/marketing/generadorGuion");
const { grabarScrollWeb } = require("../services/marketing/grabadorWeb");
const { generarVoz } = require("../services/marketing/generadorVoz");
const { generarImagenMockAntes } = require("../services/marketing/generadorMockAntes");
const { montarVideoCompleto, subirACloudinary } = require("../services/marketing/montadorVideo");

const BASE_URL = process.env.BASE_URL || "https://church-generator-api-production.up.railway.app"\;

router.post("/video", async (req, res) => {
  const { iglesiaId } = req.body;
  if (!iglesiaId) return res.status(400).json({ error: "Falta iglesiaId" });

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "tuwebvideo-"));
  console.log("[Video] tmp:", tmpDir);

  try {
    const { rows } = await pool.query(
      "SELECT id, nombre_iglesia, html_generado FROM iglesias_aprobadas WHERE id = $1",
      [iglesiaId]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Iglesia no encontrada" });
    const iglesia = { id: rows[0].id, nombre: rows[0].nombre_iglesia, comuna: "Chile" };

    console.log("[1/5] Generando guion...");
    const { frases, textoCompleto } = await generarGuionAntesDespues(iglesia);

    console.log("[2/5] Generando imagen antes...");
    const imagenAntes = path.join(tmpDir, "antes.png");
    await generarImagenMockAntes(iglesia.nombre, iglesia.comuna, imagenAntes);

    console.log("[3/5] Grabando scroll + generando voz en paralelo...");
    const videoScroll = path.join(tmpDir, "scroll.webm");
    const audioVoz = path.join(tmpDir, "voz.wav");
    const urlWeb = `${BASE_URL}/api/iglesias/web/${iglesia.id}`;
    await Promise.all([
      grabarScrollWeb(urlWeb, videoScroll, 12),
      generarVoz(textoCompleto, audioVoz),
    ]);

    console.log("[4/5] Montando video con FFmpeg...");
    const videoFinal = path.join(tmpDir, "final.mp4");
    await montarVideoCompleto({
      imagenAntes, videoDespues: videoScroll, audioVoz, frases,
      outputPath: videoFinal, tmpDir,
    });

    console.log("[5/5] Subiendo a Cloudinary...");
    const urlPublica = await subirACloudinary(videoFinal, iglesia.nombre);

    fs.rmSync(tmpDir, { recursive: true, force: true });
    res.json({ exito: true, url: urlPublica, guion: frases });
  } catch (error) {
    console.error("[Video] error:", error);
    fs.rmSync(tmpDir, { recursive: true, force: true });
    res.status(500).json({ exito: false, error: error.message });
  }
});


const { generarLoteIglesias } = require("../services/marketing/generadorLoteIglesias");
const generarWeb = require("../controllers/generador");

router.post("/generar-lote", async (req, res) => {
  const cantidad = Math.min(req.body.cantidad || 5, 50);
  console.log(`[Lote] Iniciando generacion de ${cantidad} iglesias + videos...`);

  try {
    // Paso 1: GLM-5.2 genera los perfiles
    console.log("[Lote 1/3] Llamando a GLM-5.2...");
    const iglesias = await generarLoteIglesias(cantidad);

    // Paso 2: Groq genera las webs HTML para cada perfil
    console.log("[Lote 2/3] Generando webs con Groq...");
    const resultados = [];

    for (let i = 0; i < iglesias.length; i++) {
      const ig = iglesias[i];
      console.log(`  [${i + 1}/${iglesias.length}] ${ig.nombre} (${ig.comuna})`);

      try {
        // Insertar en BD como demo (no como cliente real)
        const insertResult = await pool.query(
          `INSERT INTO iglesias_aprobadas 
           (nombre_iglesia, plan_seleccionado, estado, observaciones)
           VALUES ($1, 'demo', 'demo', $2)
           RETURNING id`,
          [ig.nombre, `Demo generada por lote - ${ig.comuna}`]
        );
        const iglesiaId = insertResult.rows[0].id;

        // Generar HTML con Groq (reutiliza tu generador existente)
        const datosFormulario = {
          nombreIglesia: ig.nombre,
          direccion: `${ig.direccion}, ${ig.comuna}`,
          horarios: ig.horarios,
          pastor: ig.pastor,
          whatsapp: ig.whatsapp,
          lema: ig.lema,
          descripcion: ig.descripcion,
          estilo: "Tradicional",
          audiencia: "Toda edad",
          tono: "Cercano",
        };

        // Guardar datos para que el endpoint de video los encuentre
        await pool.query(
          `UPDATE iglesias_aprobadas SET observaciones = $1 WHERE id = $2`,
          [JSON.stringify({ ...ig, datosFormulario }), iglesiaId]
        );

        resultados.push({
          id: iglesiaId,
          nombre: ig.nombre,
          comuna: ig.comuna,
          estado: "perfil_guardado",
        });
      } catch (err) {
        console.error(`  Error con ${ig.nombre}:`, err.message);
        resultados.push({
          nombre: ig.nombre,
          comuna: ig.comuna,
          estado: "error",
          error: err.message,
        });
      }
    }

    console.log("[Lote 3/3] Perfiles guardados. Videos se generan por separado.");
    res.json({
      exito: true,
      total: iglesias.length,
      guardados: resultados.filter((r) => r.estado === "perfil_guardado").length,
      errores: resultados.filter((r) => r.estado === "error").length,
      resultados,
      siguiente: "Usa POST /api/marketing/video con cada iglesiaId para generar los videos",
    });
  } catch (error) {
    console.error("[Lote] Error general:", error);
    res.status(500).json({ exito: false, error: error.message });
  }
});

module.exports = router;
