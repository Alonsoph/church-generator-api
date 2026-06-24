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

module.exports = router;
