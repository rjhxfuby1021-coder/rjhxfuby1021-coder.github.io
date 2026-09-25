/*
  Сборка обычного сайта для хостинга (GitHub Pages) в папку site/.
  Те же страницы, что и для Tilda, но целиком: <head> с SEO и Метрикой, локальные картинки,
  robots.txt, sitemap.xml, llms.txt, 404.html, CNAME.
*/
const fs = require('fs');
const path = require('path');
const { segments } = require('./assemble.js');

const DOMAIN = 'texspeckps.ru';
const SITE = 'https://' + DOMAIN;
const METRIKA = [112984847, 111630027]; // оба счётчика, что стояли на Tilda
const OG_IMAGE = 'https://static.tildacdn.com/tild3366-6336-4861-a230-666439386134/noroot.png';
const FAVICONS = {
  svg: 'https://static.tildacdn.com/tild6665-3332-4062-b064-316137646231/favicon.svg',
  light: 'https://static.tildacdn.com/tild3831-3233-4735-b563-336162333165/ChatGPT_Image_15__20.png',
  dark: 'https://static.tildacdn.com/tild3132-6362-4339-a431-316365396264/ChatGPT_Image_22__20.png'
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const urlOf = (slug) => SITE + (slug === 'index' ? '/' : '/' + slug);

function copyDir(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  for (const f of fs.readdirSync(from)) {
    const a = path.join(from, f), b = path.join(to, f);
    if (fs.statSync(a).isDirectory()) copyDir(a, b); else fs.copyFileSync(a, b);
  }
}

module.exports = function buildSite({ root, kit, pages, meta, images }) {
  const OUT = path.join(root, 'site');
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  copyDir(path.join(root, 'static'), OUT);

  // адреса картинок Tilda → наши файлы (в разметке — относительные, в JSON-LD и OG — полные)
  const local = (s, absolute) => {
    for (const [u, l] of Object.entries(images)) s = s.split(u).join(absolute ? SITE + l : l);
    return s;
  };
  // внутренние ссылки делаем относительными: сайт работает и на временном адресе, и на домене
  const relLinks = (s) => s.replace(/https:\/\/texspeckps\.ru\//g, '/');

  const metrika =
    '<script>(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();' +
    'for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}' +
    'k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})' +
    '(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");' +
    'ym(' + METRIKA[0] + ',"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});' +
    'ym(' + METRIKA[1] + ',"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true});</script>' +
    '<noscript><div><img src="https://mc.yandex.ru/watch/' + METRIKA[0] + '" style="position:absolute;left:-9999px" alt=""></div></noscript>';

  const written = [];
  for (const m of meta) {
    const page = pages[m.slug];
    if (!page) continue;
    const segs = segments(kit, page, 1e9);
    const isLd = (s) => s.indexOf('application/ld+json') >= 0;
    const headSeg = local(segs[0], false); // viewport + шрифты + стили
    // в микроразметке адреса картинок должны быть полными, в том числе загруженные через админку (/img/…)
    const ldAbs = (s) => local(s, true).split('"/img/').join('"' + SITE + '/img/');
    const body = segs.slice(1).map((s) => (isLd(s) ? ldAbs(s) : relLinks(local(s, false)))).join('\n');
    const is404 = m.slug === '404';
    const url = urlOf(m.slug);

    const head = [
      '<meta charset="utf-8">',
      '<title>' + esc(m.title) + '</title>',
      '<meta name="description" content="' + esc(m.desc) + '">',
      is404 ? '<meta name="robots" content="noindex">' : '<link rel="canonical" href="' + url + '">',
      '<meta property="og:type" content="website">',
      '<meta property="og:site_name" content="Павел Корчагин — технический специалист">',
      '<meta property="og:title" content="' + esc(m.title) + '">',
      '<meta property="og:description" content="' + esc(m.desc) + '">',
      is404 ? '' : '<meta property="og:url" content="' + url + '">',
      '<meta property="og:image" content="' + local(OG_IMAGE, true) + '">',
      '<meta property="og:locale" content="ru_RU">',
      '<meta name="twitter:card" content="summary_large_image">',
      '<meta name="theme-color" content="#0a0a0d">',
      '<link rel="icon" type="image/svg+xml" href="' + local(FAVICONS.svg) + '">',
      '<link rel="icon" type="image/png" sizes="32x32" href="' + local(FAVICONS.light) + '" media="(prefers-color-scheme: light)">',
      '<link rel="icon" type="image/png" sizes="32x32" href="' + local(FAVICONS.dark) + '" media="(prefers-color-scheme: dark)">',
      '<link rel="apple-touch-icon" href="' + local(FAVICONS.dark) + '">',
      headSeg,
      metrika
    ].filter(Boolean).join('\n');

    const html = '<!doctype html>\n<html lang="ru">\n<head>\n' + head + '\n</head>\n' +
      '<body style="margin:0;background:#0a0a0d">\n' + body + '\n</body>\n</html>\n';
    fs.writeFileSync(path.join(OUT, (m.slug === 'index' ? 'index' : m.slug) + '.html'), html);
    written.push(m.slug);
  }

  const today = new Date().toISOString().slice(0, 10);
  const indexable = meta.filter((m) => m.slug !== '404' && pages[m.slug]);

  fs.writeFileSync(path.join(OUT, 'sitemap.xml'),
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    indexable.map((m) => '  <url><loc>' + urlOf(m.slug) + '</loc><lastmod>' + today + '</lastmod></url>').join('\n') +
    '\n</urlset>\n');

  fs.writeFileSync(path.join(OUT, 'robots.txt'),
    'User-agent: *\nDisallow: /admin\n\n' +
    '# Яндекс: не индексировать адреса с рекламными метками и параметрами формы как отдельные страницы\n' +
    'Clean-param: utm_source&utm_medium&utm_campaign&utm_content&utm_term&yclid&gclid&fbclid\n' +
    'Clean-param: service&task /form\n\n' +
    'Sitemap: ' + SITE + '/sitemap.xml\n');

  fs.writeFileSync(path.join(OUT, 'llms.txt'),
    '# Павел Корчагин — технический специалист\n\n' +
    '> Дизайн в Figma, сайты на Tilda и Zero Block, чат-боты Salebot с ИИ, онлайн-школы на GetCourse, вебинары и рассылки — в одной системе. Работает удалённо, отвечает на заявки в течение рабочего дня.\n\n' +
    '## Страницы\n\n' +
    indexable.map((m) => '- [' + m.name + '](' + urlOf(m.slug) + '): ' + m.desc).join('\n') +
    '\n\n## Контакты\n\n- Telegram: https://t.me/PavelTexSpec\n- Email: TexSpecKor@yandex.ru\n- Телефон: +7 950 704-13-98\n');

  fs.writeFileSync(path.join(OUT, 'CNAME'), DOMAIN + '\n');
  fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

  // проверка: не осталось ли ссылок на картинки Tilda
  const left = written.filter((s) => fs.readFileSync(path.join(OUT, s + '.html'), 'utf8').includes('static.tildacdn.com'));
  console.log('Сайт для хостинга: site/ (' + written.length + ' страниц)' + (left.length ? ' · ВНИМАНИЕ: картинки Tilda остались на: ' + left.join(', ') : ''));
};
