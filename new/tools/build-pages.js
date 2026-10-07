// Раскладывает стили по папкам: главная -> <style>/index.html, плюс файлы-оболочки внутренних страниц.
// Запуск: node tools/build-pages.js            (все стили)
//         node tools/build-pages.js bold auto  (только перечисленные)
// Тексты и оформление каждого стиля — в <style>/site.js и <style>/style.css (пишутся вручную).
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..');
const STYLES = ['business', 'bold', 'premium', 'bento', 'retro', 'glass', 'terminal', 'friendly', 'kinetic',
  'cafe', 'auto', 'medical', 'expert', 'lawyer', 'accountant', 'it'];
const PAGES = { cases: 'cases', case: 'case', services: 'services', service: 'service', bot: 'bot', reviews: 'reviews', faq: 'faq', about: 'about',
  blog: 'blog', post: 'post', bonus: 'bonus', contact: 'contact', thanks: 'thanks', privacy: 'privacy', '404': 'nf' };
const only = process.argv.slice(2);

for (const st of STYLES.filter((s) => !only.length || only.includes(s))) {
  const dir = path.join(R, st), src = path.join(R, st + '.html'), dst = path.join(dir, 'index.html');
  fs.mkdirSync(dir, { recursive: true });
  // 1. главная: переносим один раз (если уже перенесена — берём из папки)
  let home = fs.existsSync(src) ? fs.readFileSync(src, 'utf8') : fs.readFileSync(dst, 'utf8');
  if (fs.existsSync(src)) {
    home = home.replace(/src="assets\//g, 'src="../assets/').replace(/href="index\.html"/g, 'href="../index.html"');
    if (home.includes('<script src="../assets/data.js"></script>') && !home.includes('engine.js'))
      home = home.replace('<script src="../assets/data.js"></script>', '<script src="../assets/data.js"></script>\n<script src="../assets/engine.js"></script>\n<script src="site.js"></script>');
    fs.writeFileSync(dst, home);
    fs.unlinkSync(src);
  }
  // шрифты стиля — из главной
  const fonts = (home.match(/<link href="https:\/\/fonts\.googleapis\.com\/css2[^"]*" rel="stylesheet">/) || [''])[0];
  // 2. оболочки внутренних страниц
  for (const [file, id] of Object.entries(PAGES)) {
    const html = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Павел Корчагин</title>${id === 'thanks' || id === 'nf' ? '\n<meta name="robots" content="noindex">' : ''}
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${fonts}
<link rel="stylesheet" href="style.css">
<link rel="stylesheet" href="../assets/logo.css">
</head>
<body data-page="${id}">
<div id="hd"></div>
<main id="main"></main>
<div id="ft"></div>
<script src="../assets/data.js"></script>
<script src="../assets/content.js"></script>
<script src="../assets/engine.js"></script>
<script src="site.js"></script>${id === 'bot' ? '\n<script src="../assets/botchat.js"></script>' : ''}
</body>
</html>
`;
    fs.writeFileSync(path.join(dir, file + '.html'), html);
  }
  console.log('ok', st, fonts ? 'fonts' : 'NO FONTS');
}
// 3. стартовый экран: ссылки на папки
let idx = fs.readFileSync(path.join(R, 'index.html'), 'utf8');
for (const st of STYLES) idx = idx.split(`href="${st}.html"`).join(`href="${st}/"`);
fs.writeFileSync(path.join(R, 'index.html'), idx);
