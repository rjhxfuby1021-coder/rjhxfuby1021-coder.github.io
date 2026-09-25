/*
  Сборка сайта: node build.js
  src/ → dist/<slug>.html (каждый файл целиком вставляется в T123 своей страницы)
  и admin/admin-kit.js (всё, что нужно локальной админке кейсов).
*/
const fs = require('fs');
const path = require('path');
const { assemble, assembleParts, MAX_BLOCK } = require('./src/assemble.js');
const PARTS = {}; // slug → массив блоков для Tilda
const PAGE_DATA = {}; // slug → данные страницы (для сборки обычного сайта)
const cases = require('./src/cases/render.js');

const SRC = path.join(__dirname, 'src');
const DIST = path.join(__dirname, 'dist');
const read = (p) => fs.readFileSync(path.join(SRC, p), 'utf8').replace(/\s+$/, '');
const readIf = (p) => (fs.existsSync(path.join(SRC, p)) ? read(p) : '');
const json = (p) => (fs.existsSync(path.join(SRC, p)) ? JSON.parse(read(p)) : {});

const kit = {
  baseCss: read('base.css'),
  baseJs: read('base.js'),
  header: read('partials/header.html'),
  menu: read('partials/menu.html'),
  footer: read('partials/footer.html'),
  commonEn: json('i18n/common.en.json')
};

// статические страницы: src/pages/<slug>.{html,en.json,ru.json,css,js,jsonld}
const PAGES = [
  { slug: 'index', title: 'Главная' },
  { slug: 'price', title: 'Услуги и цены' },
  { slug: 'form', title: 'Контакты и заявка' },
  { slug: 'faq', title: 'Вопросы и ИИ-ассистент' },
  { slug: 'otzivi', title: 'Отзывы' },
  { slug: 'iambonus', title: 'Обо мне' },
  { slug: 'rezume', title: 'Резюме' },
  { slug: 'politica', title: 'Политика конфиденциальности' },
  { slug: '404', title: 'Страница не найдена' }
];

fs.mkdirSync(DIST, { recursive: true });
const built = [];

for (const p of PAGES) {
  // страница — либо разметка <slug>.html, либо генератор <slug>.render.js (данные + шаблон)
  const renderFile = path.join(SRC, 'pages', p.slug + '.render.js');
  const gen = fs.existsSync(renderFile) ? require(renderFile)() : null;
  if (!gen && !fs.existsSync(path.join(SRC, 'pages', p.slug + '.html'))) continue;
  const css = [p.css ? readIf(p.css) : '', readIf('pages/' + p.slug + '.css')].filter(Boolean).join('\n\n');
  const pageData = {
    slug: p.slug,
    title: p.title,
    html: gen ? gen.html : read('pages/' + p.slug + '.html'),
    en: Object.assign(json('pages/' + p.slug + '.en.json'), gen ? gen.en : {}),
    ru: json('pages/' + p.slug + '.ru.json'),
    css,
    js: readIf('pages/' + p.slug + '.js'),
    jsonld: gen && gen.jsonld ? gen.jsonld : readIf('pages/' + p.slug + '.jsonld')
  };
  PAGE_DATA[p.slug] = pageData;
  PARTS[p.slug] = assembleParts(kit, pageData);
  fs.writeFileSync(path.join(DIST, p.slug + '.html'), PARTS[p.slug].join('\n'));
  built.push(p.slug);
}

// страницы направлений кейсов из данных
const data = JSON.parse(read('data/cases.json'));
const casesCss = read('cases/cases.css');
const casesJs = read('cases/cases.js');
const casePages = [cases.renderKeysPage(data)].concat(cases.DIRS.map((d) => cases.renderDirPage(d.id, data)));
for (const page of casePages) {
  PAGE_DATA[page.slug] = Object.assign(page, { css: casesCss, js: casesJs, nav: 'keys' });
  PARTS[page.slug] = assembleParts(kit, PAGE_DATA[page.slug]);
  fs.writeFileSync(path.join(DIST, page.slug + '.html'), PARTS[page.slug].join('\n'));
  built.push(page.slug);
}

// набор для админки: те же исходники, что использует сборка
const adminKit =
  '/* Сгенерировано build.js — не редактировать вручную. */\n' +
  'window.PK_KIT = ' + JSON.stringify(Object.assign({}, kit, { casesCss, casesJs })) + ';\n' +
  'window.PK_CASES_DEFAULT = ' + JSON.stringify(data) + ';\n' +
  'window.PK_IMAGES = ' + JSON.stringify(json('data/images.json')) + ';\n' +
  read('assemble.js') + '\n' + read('cases/render.js') + '\n';
fs.mkdirSync(path.join(__dirname, 'admin'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'admin', 'admin-kit.js'), adminKit);

// блоки по отдельности: dist/blocks/<slug>-<n>.html
fs.rmSync(path.join(DIST, 'blocks'), { recursive: true, force: true });
fs.mkdirSync(path.join(DIST, 'blocks'), { recursive: true });
let tooBig = [];
for (const [slug, parts] of Object.entries(PARTS)) {
  parts.forEach((part, i) => {
    fs.writeFileSync(path.join(DIST, 'blocks', slug + '-' + (i + 1) + '.html'), part);
    if (part.length > MAX_BLOCK) tooBig.push(slug + '-' + (i + 1) + ' (' + part.length + ')');
  });
}
console.log('Собрано ' + built.length + ' страниц: ' + built.map((s) => s + '×' + PARTS[s].length).join(', '));
if (tooBig.length) console.log('ВНИМАНИЕ: блоки больше ' + MAX_BLOCK + ' символов: ' + tooBig.join(', '));

// помощник установки: УСТАНОВКА.html — все страницы с кнопками «Скопировать код» и SEO-текстами
const INSTALL = [
  ['index', 'Главная', '/ (главная страница сайта)', 'Павел Корчагин — сайты на Tilda, чат-боты Salebot, GetCourse', 'Технический специалист: дизайн в Figma, сайты на Tilda и Zero Block, чат-боты Salebot с ИИ, онлайн-школы GetCourse, вебинары и рассылки — в одной системе.'],
  ['keys', 'Кейсы — витрина', '/keys', 'Кейсы — сайты, чат-боты, дизайн и онлайн-школы', 'Проекты: сайты на Tilda, чат-боты Salebot, UX/UI в Figma и онлайн-школы на GetCourse. Задача, сценарий, экраны и итог каждого проекта.'],
  ['salebot', 'Кейсы Salebot', '/salebot', 'Кейсы чат-ботов на Salebot — воронки, ИИ, игры', 'Боты, которые продают, записывают, напоминают и вовлекают: воронки продаж, ИИ-ассистенты, автовебинары и игровые механики на Salebot.'],
  ['tilda', 'Кейсы Tilda', '/tilda', 'Кейсы сайтов на Tilda и Zero Block', 'Лендинги, многостраничные сайты и интернет-магазины на Tilda: структура, дизайн, адаптив и путь пользователя до заявки.'],
  ['figma', 'Кейсы Figma', '/figma', 'Кейсы UX/UI-дизайна в Figma', 'Сценарий, каркас, UI и прототип: как строится лендинг, который ведёт к регистрации, — от пустого холста до готовых экранов.'],
  ['getcourse', 'Кейсы GetCourse', '/getcourse', 'Кейсы онлайн-школ на GetCourse', 'Настройка и сопровождение онлайн-школ на GetCourse: каталог, личный кабинет, рассылки, интеграции и чат-боты.'],
  ['price', 'Услуги и цены', '/price', 'Услуги и цены — чат-боты, сайты, дизайн, GetCourse', 'Цены и сроки: чат-боты Salebot от 2 000 ₽, лендинги на Tilda от 2 000 ₽, дизайн в Figma, настройка GetCourse. Выгодные пакеты.'],
  ['form', 'Заявка и контакты', '/form', 'Обсудить проект — Павел Корчагин', 'Расскажите о задаче — заявка придёт прямо в Telegram. Отвечаю в течение рабочего дня. Telegram, WhatsApp, MAX, телефон, почта.'],
  ['faq', 'Вопросы и ИИ-ассистент', '/faq', 'Вопросы и ИИ-ассистент — Павел Корчагин', 'Цены, сроки, этапы работы и поддержка. ИИ-ассистент отвечает на вопросы круглосуточно.'],
  ['otzivi', 'Отзывы', '/otzivi', 'Отзывы клиентов — Павел Корчагин', 'Реальные отзывы клиентов о сайтах и чат-ботах — со ссылками на проекты.'],
  ['iambonus', 'Обо мне', '/iambonus', 'Обо мне и реферальная программа — Павел Корчагин', 'Технический специалист из Брянска: Figma, Tilda, Salebot, GetCourse, HTML/CSS/JS. Рекомендуйте — получайте 10% от заказа.'],
  ['rezume', 'Резюме', '/rezume', 'Резюме — Корчагин Павел, технический специалист', 'Технический специалист и веб-разработчик: сайты на Tilda, чат-боты Salebot, GetCourse. Удалённо, проектная и частичная занятость.'],
  ['politica', 'Политика конфиденциальности', '/politica', 'Политика конфиденциальности — texspeckps.ru', 'Как texspeckps.ru обрабатывает и защищает персональные данные пользователей.'],
  ['404', 'Страница 404', '/404 (затем выбрать её в «Настройки сайта» → «Ещё» → «Страница 404»)', 'Страница не найдена — Павел Корчагин', 'Такой страницы нет. Перейдите на главную, к кейсам или напишите мне.']
].map(([slug, name, url, title, desc]) => ({ slug, name, url, title, desc, parts: PARTS[slug] }));
fs.writeFileSync(
  path.join(__dirname, 'УСТАНОВКА.html'),
  read('install.template.html').replace('/*@PAGES@*/[]', JSON.stringify(INSTALL).replace(/<\//g, '<\\/'))
);
console.log('Помощник установки: УСТАНОВКА.html');

// админка одним файлом: АДМИНКА.html (всё внутри, можно переносить куда угодно)
const adminHtml = fs.readFileSync(path.join(__dirname, 'admin', 'admin.html'), 'utf8');
fs.writeFileSync(
  path.join(__dirname, 'АДМИНКА.html'),
  adminHtml.replace('<script src="admin-kit.js"></script>', () => '<script>\n' + adminKit.replace(/<\/script/gi, '<\\/script') + '\n</script>')
);
console.log('Админка одним файлом: АДМИНКА.html');

// обычный сайт для хостинга (GitHub Pages): site/
require('./src/static.js')({ root: __dirname, kit, pages: PAGE_DATA, meta: INSTALL, images: json('data/images.json') });
