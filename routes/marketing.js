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
const { generarLoteIglesias } = require("../services/marketing/generadorLoteIglesias");
const { generarHTMLdesdePerfilGLM } = require("../services/marketing/generadorHTMLlote");

const BASE_URL = process.env.BASE_URL || "https://church-generator-api-production.up.railway.app";

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

router.post("/generar-lote", async (req, res) => {
  const cantidad = Math.min(req.body.cantidad || 5, 50);
  console.log(`[Lote] Iniciando generacion de ${cantidad} iglesias...`);

  try {
    console.log("[Lote 1/2] Llamando a GLM-5.2 para perfiles...");
    const iglesias = await generarLoteIglesias(cantidad);

    console.log("[Lote 2/2] Generando HTML con GLM-5.2 y guardando...");
    const resultados = [];

    for (let i = 0; i < iglesias.length; i++) {
      const ig = iglesias[i];
      console.log(`  [${i + 1}/${iglesias.length}] ${ig.nombre} (${ig.comuna})`);

      try {
        const { html, plantilla } = await generarHTMLdesdePerfilGLM(ig);

        const insertResult = await pool.query(
          `INSERT INTO iglesias_aprobadas 
           (nombre_iglesia, plan_seleccionado, estado, observaciones, html_generado)
           VALUES ($1, 'demo', 'demo', $2, $3)
           RETURNING id`,
          [ig.nombre, `Demo lote GLM-5.2 - ${ig.comuna} - plantilla: ${plantilla}`, html]
        );

        resultados.push({
          id: insertResult.rows[0].id,
          nombre: ig.nombre,
          comuna: ig.comuna,
          plantilla,
          estado: "listo",
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

    const listos = resultados.filter((r) => r.estado === "listo");
    res.json({
      exito: true,
      total: iglesias.length,
      listos: listos.length,
      errores: resultados.length - listos.length,
      resultados,
      videos: listos.map((r) => `POST /api/marketing/video con {"iglesiaId": ${r.id}}`),
    });
  } catch (error) {
    console.error("[Lote] Error general:", error);
    res.status(500).json({ exito: false, error: error.message });
  }
});

module.exports = router;
