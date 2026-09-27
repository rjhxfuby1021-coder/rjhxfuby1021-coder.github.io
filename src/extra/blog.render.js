/*
  Блог «Разборы»: /blog и /blog/<slug>. Статьи лежат в src/data/blog.json.
  Формат статьи: { slug, date, tag{ru,en}, title{ru,en}, desc{ru,en}, read, cover?, service?, body: [блок] }
  Блоки: { h: {ru,en} } — подзаголовок, { p: {ru,en} } — абзац, { ul: [{ru,en}] } — список,
         { note: {ru,en} } — выделенная мысль, { case: 'id-кейса' } — ссылка на кейс.
*/
const { Dict, esc } = require('../pages/_dict.js');

const SITE = 'https://texspeckps.ru/';
const L = (ru, en) => ({ ru, en });
const ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const TG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.9 4.3l-3.2 15.1c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6.2 13.1l-4.8-1.5c-1-.3-1.1-1 .2-1.5l18.9-7.3c.9-.3 1.6.2 1.4 1.5z"/></svg>';
const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dateL = (iso) => { const [y, m, dd] = iso.split('-').map(Number); return L(dd + ' ' + MONTHS[m - 1] + ' ' + y, MONTHS_EN[m - 1] + ' ' + dd + ', ' + y); };
const minL = (n) => L(n + ' мин чтения', n + ' min read');

// ссылки на страницы услуг по направлению
const SERVICE_URL = {
  salebot: 'uslugi/chat-boty-salebot', tilda: 'uslugi/sajty-na-tilda', figma: 'uslugi/dizajn-v-figma',
  getcourse: 'uslugi/nastrojka-getcourse', webinar: 'uslugi/vebinary-i-rassylki'
};

function renderIndex(posts) {
  const d = new Dict();
  const cards = posts.map((p, i) =>
    '<li class="pk-reveal" style="--d:' + (i % 4) + '"><a class="pk-post" href="' + SITE + 'blog/' + esc(p.slug) + '">' +
      (p.cover ? '<span class="pk-post__img"><img src="' + esc(p.cover) + '" alt="" loading="lazy" decoding="async"></span>' : '') +
      '<span class="pk-post__body">' +
        '<span class="pk-post__meta">' + d.tag('span', 'bl.' + p.slug + '.tag', p.tag) + '<span aria-hidden="true">·</span>' + d.tag('time', 'bl.' + p.slug + '.date', dateL(p.date), 'datetime="' + esc(p.date) + '"') + '</span>' +
        d.tag('b', 'bl.' + p.slug + '.t', p.title, 'class="pk-post__title"') +
        d.tag('span', 'bl.' + p.slug + '.d', p.desc, 'class="pk-post__desc"') +
        '<span class="pk-post__more">' + d.tag('span', 'bl.read', L('Читать', 'Read')) + ARROW + '</span>' +
      '</span></a></li>').join('');

  const html = '' +
    '<section class="pk-hero pk-dirhero" aria-labelledby="pk-h1"><div class="pk-wrap">' +
      d.tag('p', 'bl.eye', L('Блог', 'Blog'), 'class="pk-eyebrow pk-reveal"') +
      d.tag('h1', 'bl.h1', L('Разборы', 'Breakdowns'), 'class="pk-h1 pk-reveal" id="pk-h1" style="--d:1"') +
      d.tag('p', 'bl.lead', L('Как устроены сайты, боты и онлайн-школы изнутри: цены, сценарии, ошибки и решения из моей работы. Новая статья — каждую неделю.', 'How websites, bots and online schools work inside: prices, flows, mistakes and fixes from my work. A new article every week.'), 'class="pk-lead pk-reveal" style="--d:2"') +
    '</div></section>' +
    '<section class="pk-section" style="padding-top:0"><div class="pk-wrap">' +
      '<ul class="pk-posts">' + cards + '</ul>' +
    '</div></section>';

  const jsonld = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Blog', name: 'Разборы — блог Павла Корчагина', url: SITE + 'blog',
    blogPost: posts.map((p) => ({ '@type': 'BlogPosting', headline: p.title.ru, url: SITE + 'blog/' + p.slug, datePublished: p.date })) }, null, 2);

  return { slug: 'blog', title: 'Блог', html, en: d.en, jsonld, nav: 'blog',
    meta: { name: 'Блог «Разборы»', url: '/blog', title: 'Разборы — блог о сайтах на Tilda, чат-ботах и GetCourse',
      desc: 'Статьи о том, как устроены сайты на Tilda, чат-боты Salebot и онлайн-школы на GetCourse: цены, сценарии, ошибки и решения из практики.' } };
}

function renderPost(p, posts, cases) {
  const d = new Dict();
  const k = 'bp.';
  let n = 0;
  const body = p.body.map((b) => {
    const key = k + (n++);
    if (b.h) return d.tag('h2', key, b.h, 'class="pk-h2"');
    if (b.p) return d.tag('p', key, b.p);
    if (b.note) return d.tag('p', key, b.note, 'class="pk-article__note"');
    if (b.ul) return '<ul>' + b.ul.map((li, i) => d.tag('li', key + '.' + i, li)).join('') + '</ul>';
    if (b.case) {
      const c = cases.find((x) => x.id === b.case);
      if (!c) return '';
      return '<a class="pk-article__case" href="' + SITE + c.dir + '#' + esc(c.id) + '">' +
        (c.cover ? '<img src="' + esc(c.cover) + '" alt="" loading="lazy" decoding="async">' : '') +
        '<span>' + d.tag('small', key + '.l', L('Кейс', 'Case study')) + d.tag('b', key + '.t', c.title) + '</span>' + ARROW + '</a>';
    }
    return '';
  }).join('');

  const svc = p.service && SERVICE_URL[p.service];
  const more = posts.filter((x) => x.slug !== p.slug).slice(0, 3).map((x) =>
    '<li><a class="pk-link" href="' + SITE + 'blog/' + esc(x.slug) + '">' + d.tag('span', 'bm.' + x.slug, x.title) + ARROW + '</a></li>').join('');

  const html = '' +
    '<section class="pk-hero pk-dirhero pk-article__hero" aria-labelledby="pk-h1"><div class="pk-wrap pk-article__wrap">' +
      '<a class="pk-back pk-reveal" href="' + SITE + 'blog">' + d.tag('span', 'bp.back', L('Все разборы', 'All breakdowns')) + '</a>' +
      '<p class="pk-post__meta pk-reveal">' + d.tag('span', k + 'tag', p.tag) + '<span aria-hidden="true">·</span>' +
        d.tag('time', k + 'date', dateL(p.date), 'datetime="' + esc(p.date) + '"') + '<span aria-hidden="true">·</span>' + d.tag('span', k + 'read', minL(p.read || 5)) + '</p>' +
      d.tag('h1', k + 'title', p.title, 'class="pk-h1 pk-article__h1 pk-reveal" id="pk-h1" style="--d:1"') +
      d.tag('p', k + 'desc', p.desc, 'class="pk-lead pk-reveal" style="--d:2"') +
    '</div></section>' +
    '<section class="pk-section" style="padding-top:0"><div class="pk-wrap pk-article__wrap">' +
      (p.cover ? '<img class="pk-article__cover" src="' + esc(p.cover) + '" alt="" decoding="async">' : '') +
      '<article class="pk-article">' + body + '</article>' +
      '<div class="pk-article__cta pk-reveal">' +
        d.tag('p', 'bp.cta.h', L('Хотите так же для своего проекта?', 'Want the same for your project?'), 'class="pk-h3"') +
        d.tag('p', 'bp.cta.p', L('Расскажите о задаче — предложу решение и сроки. Отвечаю в течение рабочего дня.', 'Tell me about your task and I’ll suggest a solution and timeline. I reply within one business day.'), 'class="pk-muted"') +
        '<div class="pk-hero__btns">' +
          '<a class="pk-btn pk-magnet" href="' + SITE + (svc || 'form') + '">' + d.tag('span', 'bp.cta.b', svc ? L('Подробнее об услуге', 'About this service') : L('Обсудить проект', 'Discuss a project')) + ARROW + '</a>' +
          '<a class="pk-btn pk-btn--ghost pk-btn--tg" href="https://t.me/PavelTexSpec?text=' + esc(encodeURIComponent('Здравствуйте! Прочитал разбор «' + p.title.ru + '»')) + '" target="_blank" rel="noopener">' + TG + d.tag('span', 'bp.tg', L('Написать в Telegram', 'Message on Telegram')) + '</a>' +
        '</div>' +
      '</div>' +
      (more ? '<nav class="pk-article__more" aria-labelledby="bp-more">' + d.tag('h2', 'bp.more', L('Ещё разборы', 'More breakdowns'), 'class="pk-h3" id="bp-more"') + '<ul>' + more + '</ul></nav>' : '') +
    '</div></section>';

  const text = p.body.map((b) => (b.p || b.h || b.note || {}).ru || '').join(' ');
  const jsonld = JSON.stringify({ '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title.ru, description: p.desc.ru,
    datePublished: p.date, dateModified: p.updated || p.date, inLanguage: 'ru', url: SITE + 'blog/' + p.slug,
    image: p.cover ? (/^https?:/.test(p.cover) ? p.cover : SITE.replace(/\/$/, '') + p.cover) : undefined, wordCount: text.split(/\s+/).length,
    author: { '@type': 'Person', name: 'Павел Корчагин', url: SITE + 'iambonus' },
    publisher: { '@type': 'Person', name: 'Павел Корчагин', url: SITE },
    mainEntityOfPage: SITE + 'blog/' + p.slug }, null, 2);

  return { slug: 'blog/' + p.slug, title: p.title.ru, html, en: d.en, jsonld, nav: 'blog',
    meta: { name: p.title.ru, url: '/blog/' + p.slug, title: p.title.ru + ' — блог Павла Корчагина', desc: p.desc.ru } };
}

const BLOG_CSS = `
.pk-posts { display: grid; gap: 16px; }
@media (min-width: 720px) { .pk-posts { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1080px) { .pk-posts { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.pk-post { display: grid; grid-template-rows: auto 1fr; height: 100%; border-radius: 20px; overflow: hidden; background: var(--card); box-shadow: inset 0 0 0 1px var(--line); transition: transform .4s var(--ease), box-shadow .3s; }
.pk-post:hover { transform: translateY(-3px); box-shadow: inset 0 0 0 1px var(--line2), var(--shadow); }
.pk-post__img { aspect-ratio: 16 / 9; overflow: hidden; background: var(--card2); }
.pk-post__img img { width: 100%; height: 100%; object-fit: cover; object-position: top; transition: transform .8s var(--ease); }
.pk-post:hover .pk-post__img img { transform: scale(1.03); }
.pk-post__body { display: grid; gap: 10px; align-content: start; padding: 20px 22px 24px; }
.pk-post__meta { display: flex; flex-wrap: wrap; gap: 8px; font-size: .82rem; font-weight: 600; color: var(--muted); }
.pk-post__meta > span:first-child { color: var(--acc-text); }
.pk-post__title { font: 600 1.15rem/1.3 var(--display); letter-spacing: -.01em; }
.pk-post__desc { color: var(--muted); font-size: .94rem; line-height: 1.55; }
.pk-post__more { display: inline-flex; align-items: center; gap: 6px; margin-top: 4px; font-weight: 700; font-size: .9rem; color: var(--acc-text); }
.pk-article__wrap { max-width: 820px; }
.pk-article__h1 { font-size: clamp(1.9rem, 5vw, 3.2rem); }
.pk-article__cover { width: 100%; border-radius: 20px; margin-bottom: 36px; box-shadow: inset 0 0 0 1px var(--line); }
.pk-article { display: grid; gap: 18px; font-size: 1.06rem; line-height: 1.75; }
.pk-article .pk-h2 { font-size: clamp(1.3rem, 3vw, 1.7rem); margin-top: 22px; }
.pk-article ul { display: grid; gap: 8px; padding-left: 1.2em; list-style: disc; }
.pk-article li::marker { color: var(--acc-text); }
.pk-article__note { padding: 18px 22px; border-radius: 14px; background: var(--acc-soft); box-shadow: inset 3px 0 0 var(--acc-text); font-weight: 600; }
.pk-article__case { display: flex; align-items: center; gap: 16px; padding: 12px; border-radius: 16px; background: var(--card); box-shadow: inset 0 0 0 1px var(--line); transition: box-shadow .3s; }
.pk-article__case:hover { box-shadow: inset 0 0 0 1px var(--line2), var(--shadow); }
.pk-article__case img { width: 110px; aspect-ratio: 16 / 10; object-fit: cover; object-position: top; border-radius: 10px; flex: none; }
.pk-article__case span { display: grid; gap: 2px; flex: 1; min-width: 0; font-size: .95rem; line-height: 1.35; }
.pk-article__case small { font-size: .78rem; font-weight: 700; color: var(--acc-text); }
.pk-article__case svg { color: var(--acc-text); flex: none; }
.pk-article__cta { display: grid; gap: 12px; margin-top: 48px; padding: clamp(22px, 4vw, 36px); border-radius: 24px; background: radial-gradient(60% 80% at 100% 0%, var(--glow1), transparent 70%), var(--card); box-shadow: inset 0 0 0 1px var(--line); }
.pk-article__more { display: grid; gap: 12px; margin-top: 40px; }
.pk-article__more ul { display: grid; gap: 10px; }
`;

module.exports = function renderBlog(posts, cases) {
  // cover: 'case:<id>' — обложка кейса
  posts = posts.map((p) => { const m = /^case:(.+)$/.exec(p.cover || ''); const c = m && cases.find((x) => x.id === m[1]); return c ? Object.assign({}, p, { cover: c.cover }) : p; });
  const sorted = posts.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
  return [renderIndex(sorted)].concat(sorted.map((p) => renderPost(p, sorted, cases)));
};
module.exports.BLOG_CSS = BLOG_CSS;
