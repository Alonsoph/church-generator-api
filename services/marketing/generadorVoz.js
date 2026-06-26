const Replicate = require("replicate");
const fs = require("fs");
const https = require("https");

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

async function generarVoz(texto, outputPath) {
  console.log("[Voz] Generando audio con MiniMax Speech HD (Friendly_Person)...");

  const output = await replicate.run("minimax/speech-02-hd", {
    input: {
      text: texto,
      voice_id: "Friendly_Person",
      language_boost: "Spanish",
      speed: 0.95,
      emotion: "neutral",
    },
  });

  const audioUrl = typeof output === "string" ? output : output.url ? output.url() : output;

  await new Promise((resolve, reject) => {
    const descargar = (url) => {
      https.get(url, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          descargar(response.headers.location);
          return;
        }
        const file = fs.createWriteStream(outputPath);
        response.pipe(file);
        file.on("finish", () => file.close(resolve));
      }).on("error", (err) => {
        fs.unlink(outputPath, () => reject(err));
      });
    };
    descargar(audioUrl);
  });

  console.log("[Voz] Audio guardado en", outputPath);
  return outputPath;
}

module.exports = { generarVoz };
