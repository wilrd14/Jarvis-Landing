// Genera los recursos raster de public/ (og-image.png, apple-touch-icon.png,
// favicon.ico) a partir de los SVG del proyecto, usando el Chromium de Playwright
// (ya es devDependency). Uso: node scripts/generate-assets.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { SITE } from '../src/data/site.ts';

const root = new URL('../', import.meta.url);
const fromRoot = (path) => fileURLToPath(new URL(path, root));
const fontUrl = (pkg, file) =>
  `data:font/woff2;base64,${readFileSync(fromRoot(`node_modules/@fontsource-variable/${pkg}/files/${file}`)).toString('base64')}`;

const logoSvg = readFileSync(fromRoot('public/logo.svg'), 'utf8');
const faviconSvg = readFileSync(fromRoot('public/favicon.svg'), 'utf8');
const toDataUri = (svg) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

const ogHtml = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Space Grotesk';src:url('${fontUrl('space-grotesk', 'space-grotesk-latin-wght-normal.woff2')}');font-weight:300 700}
@font-face{font-family:'Geist';src:url('${fontUrl('geist', 'geist-latin-wght-normal.woff2')}');font-weight:100 900}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:radial-gradient(ellipse at 28% 50%,#0b2a23 0%,#06100d 45%,#030504 80%);
display:flex;align-items:center;gap:72px;padding:0 96px;color:#f2fff9;font-family:'Geist',sans-serif}
img{width:300px;height:300px;flex:none}
h1{font-family:'Space Grotesk',sans-serif;font-size:132px;line-height:1;font-weight:700;letter-spacing:-2px;color:#1fe0a0}
p{margin-top:28px;font-size:34px;line-height:1.35;color:#c5d6cf;max-width:700px;text-wrap:balance}
</style></head><body>
<img src="${toDataUri(logoSvg)}" alt="">
<div><h1>${SITE.name}</h1><p>${SITE.tagline}</p></div>
</body></html>`;

const iconHtml = (size) =>
  `<!doctype html><html><body style="margin:0;background:transparent"><img src="${toDataUri(faviconSvg)}" width="${size}" height="${size}" style="display:block"></body></html>`;

/** Empaqueta PNG en un .ico (formato con PNG embebido, válido desde Vista). */
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, png }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size, 0);
    entry.writeUInt8(size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map((image) => image.png)]);
}

const browser = await chromium.launch();
try {
  const shot = async (html, width, height, omitBackground = false) => {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.setContent(html, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    const png = await page.screenshot({ type: 'png', omitBackground });
    await page.close();
    return png;
  };

  writeFileSync(fromRoot('public/og-image.png'), await shot(ogHtml, 1200, 630));
  writeFileSync(fromRoot('public/apple-touch-icon.png'), await shot(iconHtml(180), 180, 180));
  const sizes = [16, 32, 48];
  const images = [];
  for (const size of sizes) {
    images.push({ size, png: await shot(iconHtml(size), size, size, true) });
  }
  writeFileSync(fromRoot('public/favicon.ico'), buildIco(images));
} finally {
  await browser.close();
}
process.stdout.write('Recursos generados en public/\n');
