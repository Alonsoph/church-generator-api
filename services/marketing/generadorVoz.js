const Replicate = require("replicate");
const fs = require("fs");
const https = require("https");

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

// Sample público de narrador masculino cálido en español (Mozilla Common Voice)
const VOZ_REFERENCIA_URL = "https://replicate.delivery/pbxt/JqzVJ7nW2c8U0YzKkDvRfMvHJ8Xb1nL9pQ7yFmBzN3wRkLcA/male-spanish-sample.wav"\;

async function generarVoz(texto, outputPath) {
  console.log("[Voz] Generando audio XTTS...");

  const output = await replicate.run(
    "lucataco/xtts-v2:684bc3855b37866c0c65add2ff39c78f3dea3f4ff103a436465326e0f438d55e",
    {
      input: {
        text: texto,
        speaker: VOZ_REFERENCIA_URL,
        language: "es",
        cleanup_voice: false
      }
    }
  );

  const audioUrl = typeof output === "string" ? output : output.url ? output.url() : output[0];

  await new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https.get(audioUrl, (response) => {
      response.pipe(file);
      file.on("finish", () => file.close(resolve));
    }).on("error", (err) => {
      fs.unlink(outputPath, () => reject(err));
    });
  });

  console.log("[Voz] Audio guardado en", outputPath);
  return outputPath;
}

module.exports = { generarVoz };
