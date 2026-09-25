/*
  Увеличение картинок кейсов чат-ботов: исходники схем и скриншотов на Tilda мелкие (300–1000 px),
  поэтому текст на них не читается. Берём оригинал, увеличиваем в 2 раза (Lanczos, до 2400 px) с лёгкой резкостью.
  Запуск: node tools/upscale-salebot.js
*/
const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const MAP = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'data', 'images.json'), 'utf8'));
const CASES = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'data', 'cases.json'), 'utf8'));

function fetchBuf(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) { res.resume(); return reject(new Error(res.statusCode + ' ' + url)); }
      const chunks = []; res.on('data', (c) => chunks.push(c)); res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

(async () => {
  const urls = new Set();
  CASES.filter((c) => c.dir === 'salebot').forEach((c) => {
    urls.add(c.cover);
    (c.gallery || []).forEach((g) => urls.add(g.src));
  });
  for (const url of urls) {
    const local = MAP[url];
    if (!local || !local.endsWith('.webp')) continue;
    const src = await fetchBuf(url);
    const { width } = await sharp(src).metadata();
    const target = Math.min(width * 2, 2400);
    const out = await sharp(src)
      .resize({ width: target, kernel: 'lanczos3' })
      .sharpen({ sigma: 0.6 })
      .webp({ quality: 94, smartSubsample: true, effort: 6 })
      .toBuffer();
    fs.writeFileSync(path.join(ROOT, 'static', local), out);
    console.log(local, width + ' → ' + target, (out.length / 1024).toFixed(0) + ' КБ');
  }
})();
