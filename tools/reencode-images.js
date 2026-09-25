/*
  Пересжатие картинок кейсов с высоким качеством (скриншоты с текстом плохо переносят сильное сжатие).
  Берёт оригиналы по адресам из src/data/images.json (сервера Tilda), кодирует в WebP:
  маленькие (до 800 px) — без потерь, остальные — качество 92, ширина до 2000 px.
  Запуск: node tools/reencode-images.js
*/
const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const MAP = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'data', 'images.json'), 'utf8'));

function fetchBuf(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) { res.resume(); return reject(new Error(res.statusCode + ' ' + url)); }
      const chunks = []; res.on('data', (c) => chunks.push(c)); res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

(async () => {
  let n = 0, total = 0, failed = [];
  for (const [url, local] of Object.entries(MAP)) {
    if (!local.endsWith('.webp')) continue; // иконки не трогаем
    try {
      const src = await fetchBuf(url);
      const meta = await sharp(src).metadata();
      const img = sharp(src).resize({ width: 2000, withoutEnlargement: true });
      const out = meta.width <= 800
        ? await img.webp({ lossless: true, effort: 6 }).toBuffer()
        : await img.webp({ quality: 92, smartSubsample: true, effort: 6 }).toBuffer();
      fs.writeFileSync(path.join(ROOT, 'static', local), out);
      total += out.length; n++;
    } catch (e) { failed.push(e.message); }
  }
  console.log('Пересжато: ' + n + ' · всего ' + (total / 1048576).toFixed(1) + ' МБ · ошибок: ' + failed.length);
  failed.forEach((f) => console.log('  ✗ ' + f));
})();
