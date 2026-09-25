// /404 — страница «не найдено». В Tilda назначается в «Настройки сайта → Ещё → Страница 404».
const { Dict } = require('./_dict.js');
const SITE = 'https://texspeckps.ru/';
const L = (ru, en) => ({ ru, en });
const ARROW = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

const LINKS = [
  ['keys', L('Кейсы', 'Case studies'), L('Проекты с подробным разбором', 'Projects broken down in detail')],
  ['price', L('Услуги и цены', 'Services & pricing'), L('Сколько стоит и сколько делать', 'What it costs and how long it takes')],
  ['faq', L('Вопросы', 'FAQ'), L('ИИ-ассистент ответит сразу', 'The AI assistant answers right away')],
  ['form', L('Связаться', 'Get in touch'), L('Отвечаю в течение рабочего дня', 'I reply within one business day')]
];

module.exports = function render() {
  const d = new Dict();
  const links = LINKS.map(([slug, t, s], i) =>
    '<li class="pk-reveal" style="--d:' + i + '"><a class="pk-nf__link" href="' + SITE + slug + '">' +
      '<span>' + d.tag('b', 'nf.l' + i, t) + d.tag('small', 'nf.s' + i, s) + '</span>' + ARROW + '</a></li>').join('');

  const html = '' +
    '<section class="pk-hero pk-nf" aria-labelledby="pk-h1"><div class="pk-wrap">' +
      '<p class="pk-nf__code pk-reveal" aria-hidden="true"><span>4</span><span class="pk-nf__zero">0</span><span>4</span></p>' +
      d.tag('h1', 'nf.h1', L('Такой страницы нет', 'This page doesn’t exist'), 'class="pk-h2 pk-reveal" id="pk-h1" style="--d:1"') +
      d.tag('p', 'nf.lead', L('Возможно, ссылка устарела или в адресе опечатка. Зато всё остальное на месте — выбирайте, куда дальше.', 'The link may be outdated or the address mistyped. Everything else is right where it should be — pick where to go next.'), 'class="pk-lead pk-reveal" style="--d:2"') +
      '<div class="pk-hero__btns pk-reveal" style="--d:3">' +
        '<a class="pk-btn pk-magnet" href="' + SITE + '">' + d.tag('span', 'nf.home', L('На главную', 'Back to home')) + ARROW + '</a>' +
        '<a class="pk-btn pk-btn--ghost" href="https://t.me/PavelTexSpec" target="_blank" rel="noopener">' + d.tag('span', 'nf.tg', L('Написать в Telegram', 'Message on Telegram')) + '</a>' +
      '</div>' +
      '<ul class="pk-nf__links">' + links + '</ul>' +
    '</div></section>';

  return { html, en: d.en, jsonld: '' };
};
