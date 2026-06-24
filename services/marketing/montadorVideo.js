const ffmpeg = require("fluent-ffmpeg");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MUSICA_PATH = path.join(__dirname, "../../assets/marketing/musica-worship.mp3");

function generarSrt(frases, outputPath) {
  // Tiempos calculados para 18s total: 3s + 4s + 6s + 5s
  const tiempos = [
    { inicio: "00:00:03,000", fin: "00:00:06,000", texto: frases.frase1 },
    { inicio: "00:00:06,000", fin: "00:00:10,000", texto: frases.frase2 },
    { inicio: "00:00:10,000", fin: "00:00:16,000", texto: frases.frase3 },
    { inicio: "00:00:16,000", fin: "00:00:21,000", texto: frases.frase4 },
  ];
  const srt = tiempos.map((t, i) =>
    `${i + 1}\n${t.inicio} --> ${t.fin}\n${t.texto}\n`
  ).join("\n");
  fs.writeFileSync(outputPath, srt);
  return outputPath;
}

async function montarVideoCompleto({ imagenAntes, videoDespues, audioVoz, frases, outputPath, tmpDir }) {
  const srtPath = path.join(tmpDir, "subs.srt");
  generarSrt(frases, srtPath);

  const tieneMusica = fs.existsSync(MUSICA_PATH);
  console.log("[Montador] Música de fondo:", tieneMusica ? "sí" : "no (placeholder ausente)");

  return new Promise((resolve, reject) => {
    const cmd = ffmpeg();

    // Input 0: imagen "antes" (3 segundos como video)
    cmd.input(imagenAntes).inputOptions(["-loop 1", "-t 3"]);
    // Input 1: video del scroll (12 segundos)
    cmd.input(videoDespues);
    // Input 2: audio voz
    cmd.input(audioVoz);
    // Input 3: música (si existe)
    if (tieneMusica) cmd.input(MUSICA_PATH).inputOptions(["-stream_loop -1"]);

    // Filtro: concatenar imagen + video, mezclar audios, agregar subs
    const filtros = [
      "[0:v]scale=1080:1920,setsar=1,fade=t=out:st=2.5:d=0.5[antes]",
      "[1:v]scale=1080:1920,setsar=1,fade=t=in:st=0:d=0.5[despues]",
      "[antes][despues]concat=n=2:v=1:a=0[video_concat]",
      `[video_concat]subtitles=${srtPath}:force_style='FontName=Arial,FontSize=22,PrimaryColour=&HFFFFFF&,OutlineColour=&H000000&,BorderStyle=1,Outline=2,Shadow=1,MarginV=80'[video_final]`,
    ];

    if (tieneMusica) {
      filtros.push("[3:a]volume=0.15[musica]");
      filtros.push("[2:a][musica]amix=inputs=2:duration=first:dropout_transition=2[audio_final]");
    }

    cmd.complexFilter(filtros);
    cmd.outputOptions([
      "-map", "[video_final]",
      "-map", tieneMusica ? "[audio_final]" : "2:a",
      "-c:v libx264",
      "-preset fast",
      "-crf 23",
      "-c:a aac",
      "-b:a 128k",
      "-t 21",
      "-pix_fmt yuv420p",
      "-movflags +faststart",
    ]);

    cmd.output(outputPath)
      .on("start", (cmdLine) => console.log("[FFmpeg] iniciando..."))
      .on("end", () => { console.log("[FFmpeg] listo"); resolve(outputPath); })
      .on("error", (err) => { console.error("[FFmpeg] error:", err.message); reject(err); })
      .run();
  });
}

async function subirACloudinary(videoPath, nombreIglesia) {
  console.log("[Cloudinary] subiendo...");
  const resultado = await cloudinary.uploader.upload(videoPath, {
    resource_type: "video",
    folder: "tuwebiglesia/marketing",
    public_id: `antes-despues-${nombreIglesia.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now()}`,
  });
  console.log("[Cloudinary] subido:", resultado.secure_url);
  return resultado.secure_url;
}

module.exports = { montarVideoCompleto, subirACloudinary };
