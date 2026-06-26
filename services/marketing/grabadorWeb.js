const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

async function grabarScrollWeb(urlWeb, outputPath, duracionSegundos = 12) {
  const browser = await chromium.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const context = await browser.newContext({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: path.dirname(outputPath),
      size: { width: 1080, height: 1920 }
    }
  });

  const page = await context.newPage();
  await page.goto(urlWeb, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(1000);

  const alturaTotal = await page.evaluate(() => document.body.scrollHeight);
  const alturaVisible = 1920;
  const distanciaScroll = Math.max(alturaTotal - alturaVisible, 0);

  const pasos = duracionSegundos * 30;
  const pixelesPorPaso = distanciaScroll / pasos;
  const msPorPaso = (duracionSegundos * 1000) / pasos;

  for (let i = 0; i < pasos; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), pixelesPorPaso * i);
    await page.waitForTimeout(msPorPaso);
  }

  await page.close();
  await context.close();
  await browser.close();

  const archivos = fs.readdirSync(path.dirname(outputPath))
    .filter(f => f.endsWith(".webm"));
  const ultimoVideo = archivos.sort().pop();
  const rutaTemp = path.join(path.dirname(outputPath), ultimoVideo);
  fs.renameSync(rutaTemp, outputPath);

  return outputPath;
}

module.exports = { grabarScrollWeb };
