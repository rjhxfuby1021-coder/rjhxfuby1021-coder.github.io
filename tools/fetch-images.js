/*
  Скачивает все картинки с серверов Tilda (static.tildacdn.com) в static/img/
  и записывает соответствие «старый адрес → новый» в src/data/images.json.
  Запуск: node tools/fetch-images.js   (повторный запуск докачивает только новое)
*/
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'static', 'img');
const MAP_FILE = path.join(ROOT, 'src', 'data', 'images.json');
const EXTRA = [
  // иконки сайта из старой версии на Tilda
  'https://static.tildacdn.com/tild3831-3233-4735-b563-336162333165/ChatGPT_Image_15__20.png',
  'https://static.tildacdn.com/tild3132-6362-4339-a431-316365396264/ChatGPT_Image_22__20.png',
  'https://static.tildacdn.com/tild6665-3332-4062-b064-316137646231/favicon.svg'
];

function walk(dir, out) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, out);
    else if (/\.(js|json|html|css)$/.test(f) && f !== 'images.json') out.push(p);
  }
  return out;
}

function get(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) { res.resume(); return get(res.headers.location, dest).then(resolve, reject); }
      if (res.statusCode !== 200) { res.resume(); return reject(new Error(url + ' → ' + res.statusCode)); }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
      file.on('error', reject);
    }).on('error', reject);
  });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const map = fs.existsSync(MAP_FILE) ? JSON.parse(fs.readFileSync(MAP_FILE, 'utf8')) : {};
  const urls = new Set(EXTRA);
  for (const f of walk(path.join(ROOT, 'src'), [])) {
    (fs.readFileSync(f, 'utf8').match(/https:\/\/static\.tildacdn\.com\/[^"'\s)<>]+/g) || []).forEach((u) => urls.add(u));
  }
  let done = 0, skipped = 0, failed = [];
  for (const url of urls) {
    // tild1234-…/имя.png → 1234-…-имя.png (уникально и читаемо)
    const m = url.match(/tildacdn\.com\/tild([^/]+)\/(.+)$/);
    const name = (m ? m[1] + '-' + decodeURIComponent(m[2]) : path.basename(url)).replace(/[^\w.-]+/g, '_');
    const dest = path.join(OUT, name);
    if (map[url] && fs.existsSync(dest)) { skipped++; continue; }
    try { await get(url, dest); map[url] = '/img/' + name; done++; }
    catch (e) { failed.push(e.message); }
  }
  fs.writeFileSync(MAP_FILE, JSON.stringify(map, null, 2) + '\n');
  const size = fs.readdirSync(OUT).reduce((a, f) => a + fs.statSync(path.join(OUT, f)).size, 0);
  console.log('Скачано: ' + done + ', уже было: ' + skipped + ', ошибок: ' + failed.length + ' · всего ' + (size / 1048576).toFixed(1) + ' МБ');
  failed.forEach((f) => console.log('  ✗ ' + f));
})();
