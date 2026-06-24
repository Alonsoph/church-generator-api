const { chromium } = require("playwright");

function htmlMockFacebook(nombreIglesia, comuna) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
  body { margin:0; font-family: Arial, sans-serif; background:#e9ebee; width:1080px; height:1920px; }
  .header { background:#3b5998; color:white; padding:30px; font-size:42px; font-weight:bold; }
  .perfil { background:white; margin:40px; border-radius:8px; padding:50px; box-shadow:0 2px 4px rgba(0,0,0,0.1); }
  .avatar { width:200px; height:200px; background:#ccc; border-radius:50%; margin:0 auto 30px; display:flex; align-items:center; justify-content:center; font-size:120px; color:#888; }
  .nombre { font-size:54px; font-weight:bold; text-align:center; color:#1d2129; margin-bottom:15px; }
  .info { font-size:32px; color:#606770; text-align:center; margin:10px 0; }
  .post { background:white; margin:40px; border-radius:8px; padding:40px; }
  .post-meta { color:#606770; font-size:26px; margin-bottom:20px; }
  .post-texto { font-size:36px; color:#1d2129; line-height:1.5; }
  .badge { display:inline-block; background:#f0f2f5; color:#65676b; padding:8px 16px; border-radius:4px; font-size:24px; margin-top:20px; }
  .marca-agua { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%) rotate(-15deg); font-size:120px; color:rgba(200,80,80,0.25); font-weight:bold; }
</style></head><body>
  <div class="header">facebook</div>
  <div class="perfil">
    <div class="avatar">⛪</div>
    <div class="nombre">${nombreIglesia}</div>
    <div class="info">📍 ${comuna || "Chile"}</div>
    <div class="info">Última actualización: hace 8 meses</div>
    <div class="info" style="color:#c0392b;">⚠ Sin sitio web</div>
  </div>
  <div class="post">
    <div class="post-meta">Publicación de 2023</div>
    <div class="post-texto">Hermanos, recuerden el culto del domingo...</div>
    <span class="badge">12 reacciones</span>
  </div>
  <div class="marca-agua">ANTES</div>
</body></html>`;
}

async function generarImagenMockAntes(nombreIglesia, comuna, outputPath) {
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const context = await browser.newContext({ viewport: { width: 1080, height: 1920 } });
  const page = await context.newPage();
  await page.setContent(htmlMockFacebook(nombreIglesia, comuna), { waitUntil: "networkidle" });
  await page.screenshot({ path: outputPath, fullPage: false });
  await browser.close();
  return outputPath;
}

module.exports = { generarImagenMockAntes };
