/*
  Сжимает скачанные картинки: static/img/*.png|jpg → .webp (ширина до 1800 px).
  Иконки сайта не трогает. Обновляет src/data/images.json на новые адреса.
  Запуск: node tools/optimize-images.js
*/
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'static', 'img');
const MAP_FILE = path.join(ROOT, 'src', 'data', 'images.json');
const KEEP = /favicon|ChatGPT_Image_(15|22)__20\.png$/; // иконки и логотип — как есть

(async () => {
  const map = JSON.parse(fs.readFileSync(MAP_FILE, 'utf8'));
  let before = 0, after = 0, n = 0;
  for (const [url, local] of Object.entries(map)) {
    const src = path.join(ROOT, 'static', local);
    if (!/\.(png|jpe?g)$/i.test(local) || KEEP.test(local) || !fs.existsSync(src)) continue;
    const outLocal = local.replace(/\.(png|jpe?g)$/i, '.webp');
    const out = path.join(ROOT, 'static', outLocal);
    before += fs.statSync(src).size;
    await sharp(src).resize({ width: 1800, withoutEnlargement: true }).webp({ quality: 80, effort: 5 }).toFile(out);
    after += fs.statSync(out).size;
    fs.unlinkSync(src);
    map[url] = outLocal;
    n++;
  }
  fs.writeFileSync(MAP_FILE, JSON.stringify(map, null, 2) + '\n');
  console.log('Сжато картинок: ' + n + ' · было ' + (before / 1048576).toFixed(1) + ' МБ → стало ' + (after / 1048576).toFixed(1) + ' МБ');
})();
