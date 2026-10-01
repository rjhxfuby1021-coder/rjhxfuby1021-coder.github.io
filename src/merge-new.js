// Объединение: новый сайт со стилями (папка new/) становится главным, нынешний сайт уезжает в /ai/ («ИИшный» стиль).
// Вызывается в конце build.js, когда site/ уже собран.
//  - страницы нынешнего сайта -> site/ai/ (внутренние ссылки /price, /faq… переписываются на /ai/…)
//  - на старых адресах (/price, /blog/…) остаются перенаправления на /ai/… — ссылки из поиска не ломаются
//  - new/* -> корень site/ (стартовый экран выбора стиля и все стили)
//  - Яндекс Метрика добавляется на новые страницы; sitemap.xml пересобирается
const fs = require('fs'), path = require('path');
const DOMAIN = 'https://texspeckps.ru';

module.exports = function mergeNew(root) {
  const SITE = path.join(root, 'site'), AI = path.join(SITE, 'ai'), NEW = path.join(root, 'new');
  if (!fs.existsSync(NEW)) { console.log('Новый сайт (new/) не найден — пропускаю объединение'); return; }

  // ---------- 1. нынешний сайт -> /ai/ ----------
  const ROUTES = 'keys|form|price|otzivi|iambonus|faq|rezume|blog|politica|spasibo|tilda|salebot|getcourse|figma|uslugi|404';
  const isOldPage = (rel) => rel.endsWith('.html') && !/^yandex_/.test(path.basename(rel));
  const oldPages = [];
  (function walk(dir, rel) {
    for (const f of fs.readdirSync(dir)) {
      const p = path.join(dir, f), r = rel ? rel + '/' + f : f;
      if (fs.statSync(p).isDirectory()) { if (['blog', 'uslugi'].includes(f) && !rel) walk(p, r); continue; }
      if (isOldPage(r)) oldPages.push(r);
    }
  })(SITE, '');

  const rewrite = (html) => html
    // ссылки и пути внутри разметки и скриптов: "/price" -> "/ai/price"
    .replace(new RegExp('(["\'`(=\\s])\\/(' + ROUTES + ')(?=["\'`?#/\\s)\\\\])', 'g'), '$1/ai/$2')
    // ссылка на главную
    .replace(/href="\/"/g, 'href="/ai/"')
    // абсолютные адреса (canonical, og:url, разметка для поиска)
    .replace(new RegExp(DOMAIN.replace(/\./g, '\\.') + '\\/(' + ROUTES + ')(?=["\'?#/<\\s])', 'g'), DOMAIN + '/ai/$1')
    .replace(new RegExp('(["\'>])' + DOMAIN.replace(/\./g, '\\.') + '\\/(?=["\'<])', 'g'), '$1' + DOMAIN + '/ai/');
  const SWITCH = '<a href="/" style="position:fixed;left:16px;bottom:16px;z-index:2147483000;background:#d5ff45;color:#0a0a0d;font:700 13px/1 Manrope,system-ui,sans-serif;padding:11px 16px;border-radius:999px;text-decoration:none;box-shadow:0 10px 30px -10px rgba(0,0,0,.6)">↺ Сменить стиль</a>';

  for (const rel of oldPages) {
    const src = path.join(SITE, rel), dst = path.join(AI, rel);
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    let html = rewrite(fs.readFileSync(src, 'utf8'));
    if (!/404|spasibo/.test(rel)) html = html.replace('</body>', SWITCH + '</body>');
    fs.writeFileSync(dst, html);
  }

  // ---------- 2. перенаправления со старых адресов ----------
  const stub = (to) => `<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>Страница переехала</title>
<link rel="canonical" href="${DOMAIN}${to}"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=${to}">
<script>location.replace(${JSON.stringify(to)} + location.search + location.hash)</script></head>
<body><p>Страница переехала: <a href="${to}">${DOMAIN}${to}</a></p></body></html>`;
  for (const rel of oldPages) {
    if (rel === 'index.html' || rel === '404.html') continue;
    const route = '/ai/' + rel.replace(/\.html$/, '');
    fs.writeFileSync(path.join(SITE, rel), stub(route));
  }
  // общая 404 GitHub Pages — версия нынешнего сайта с исправленными ссылками
  fs.copyFileSync(path.join(AI, '404.html'), path.join(SITE, '404.html'));

  // ---------- 3. новый сайт -> корень ----------
  const metrika = (fs.readFileSync(path.join(AI, 'index.html'), 'utf8').match(/<script>\(function\(m,e,t,r,i,k,a\)[\s\S]*?<\/noscript>/) || [''])[0];
  let copied = 0;
  (function copy(from, to) {
    for (const f of fs.readdirSync(from)) {
      if (f === 'tools' && from === NEW) continue;
      const a = path.join(from, f), b = path.join(to, f);
      if (fs.statSync(a).isDirectory()) { fs.mkdirSync(b, { recursive: true }); copy(a, b); continue; }
      if (f.endsWith('.html')) {
        let html = fs.readFileSync(a, 'utf8');
        if (metrika && !html.includes('mc.yandex.ru')) html = html.replace('</head>', metrika + '\n</head>');
        // SEO: в поиске — экран выбора и нынешний сайт (/ai/). Страницы стилей — витрина для людей:
        // не индексируются (иначе 17 похожих версий одних кейсов и цен конкурируют между собой), но ссылки по ним учитываются.
        const isChooser = from === NEW && f === 'index.html';
        if (isChooser) html = html.replace(/<title>[^<]*<\/title>/, '<title>Павел Корчагин — сайты на Tilda, чат-боты Salebot, онлайн-школы GetCourse</title>')
          .replace(/<meta name="description"[^>]*>/, '<meta name="description" content="Технический специалист: дизайн в Figma, сайты на Tilda и Zero Block, чат-боты Salebot с ИИ, онлайн-школы GetCourse, вебинары и рассылки — в одной системе. Выберите удобный стиль сайта: кейсы, цены и отзывы везде настоящие.">')
          .replace('</head>', `<link rel="canonical" href="${DOMAIN}/">\n<meta property="og:type" content="website"><meta property="og:url" content="${DOMAIN}/"><meta property="og:title" content="Павел Корчагин — сайты, чат-боты и онлайн-школы"><meta property="og:description" content="Один специалист вместо пяти подрядчиков: Figma, Tilda, Salebot, GetCourse. Выберите стиль сайта."><meta property="og:image" content="${DOMAIN}/icon-512.png">\n<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="icon" href="/favicon-32.png" sizes="32x32"><link rel="apple-touch-icon" href="/apple-touch-icon.png">\n</head>`);
        else if (!/name="robots"/.test(html)) html = html.replace('</head>', '<meta name="robots" content="noindex, follow">\n</head>');
        fs.writeFileSync(b, html);
      } else fs.copyFileSync(a, b);
      copied++;
    }
  })(NEW, SITE);

  // ---------- 4. карта сайта ----------
  // в карте сайта — только то, что индексируется: экран выбора и нынешний сайт в /ai/
  const STYLES = fs.readdirSync(NEW).filter((d) => fs.existsSync(path.join(NEW, d, 'index.html')) && d !== 'tools');
  const urls = ['/'];
  const oldMap = fs.existsSync(path.join(SITE, 'sitemap.xml')) ? fs.readFileSync(path.join(SITE, 'sitemap.xml'), 'utf8') : '';
  const oldLocs = [...oldMap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, ''))
    .filter((u) => u !== '/spasibo').map((u) => u === '/' ? '/ai/' : '/ai' + u);
  const all = [...new Set(urls.concat(oldLocs))];
  fs.writeFileSync(path.join(SITE, 'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + all.map((u) => `  <url><loc>${DOMAIN}${u}</loc></url>`).join('\n') + '\n</urlset>\n');

  console.log(`Объединение: нынешний сайт -> /ai/ (${oldPages.length} стр.), новый сайт в корне (${copied} файлов, стилей: ${STYLES.length}), sitemap: ${all.length} адресов`);
};
