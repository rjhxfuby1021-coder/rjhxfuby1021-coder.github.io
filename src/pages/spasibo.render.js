// /spasibo — после отправки заявки. В поиск не попадает (noindex).
const { Dict } = require('./_dict.js');
const SITE = 'https://texspeckps.ru/';
const L = (ru, en) => ({ ru, en });
const ARROW = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const CHECK = '<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>';

const NEXT = [
  [L('Как пройдёт работа', 'What happens next'), [
    L('Прочитаю заявку и отвечу в течение рабочего дня — в Telegram или по контакту, который вы указали.', 'I’ll read your request and reply within one business day — on Telegram or via the contact you left.'),
    L('Если написали вечером или в выходные — отвечу утром следующего рабочего дня.', 'If you wrote in the evening or at the weekend, I’ll reply the next business morning.'),
    L('Задам пару уточняющих вопросов и предложу решение, сроки и цену.', 'I’ll ask a couple of questions and suggest a solution, timeline and price.')
  ]]
];

const LINKS = [
  ['keys', L('Кейсы', 'Case studies'), L('Посмотрите похожие проекты, пока ждёте', 'Browse similar projects while you wait')],
  ['blog', L('Разборы', 'Breakdowns'), L('Как устроены сайты, боты и школы изнутри', 'How sites, bots and schools work inside')],
  ['otzivi', L('Отзывы', 'Reviews'), L('Что говорят клиенты', 'What clients say')],
  ['price', L('Услуги и цены', 'Services & pricing'), L('Все направления и сроки', 'All areas and timelines')]
];

module.exports = function render() {
  const d = new Dict();
  const steps = NEXT[0][1].map((s, i) => d.tag('li', 'ty.s' + i, s)).join('');
  const links = LINKS.map(([slug, t, s], i) =>
    '<li class="pk-reveal" style="--d:' + i + '"><a class="pk-nf__link" href="' + SITE + slug + '">' +
      '<span>' + d.tag('b', 'ty.l' + i, t) + d.tag('small', 'ty.ls' + i, s) + '</span>' + ARROW + '</a></li>').join('');

  const html = '' +
    '<section class="pk-hero pk-nf pk-ty" aria-labelledby="pk-h1"><div class="pk-wrap">' +
      '<span class="pk-ty__ok pk-reveal">' + CHECK + '</span>' +
      d.tag('h1', 'ty.h1', L('Спасибо! Заявка отправлена', 'Thank you! Your request is sent'), 'class="pk-h2 pk-reveal" id="pk-h1" style="--d:1"') +
      d.tag('p', 'ty.lead', L('Она уже у меня в Telegram. Отвечу в течение рабочего дня.', 'It’s already in my Telegram. I’ll reply within one business day.'), 'class="pk-lead pk-reveal" style="--d:2"') +
      '<div class="pk-ty__box pk-reveal" style="--d:3">' + d.tag('h2', 'ty.next', NEXT[0][0], 'class="pk-h3"') + '<ol>' + steps + '</ol></div>' +
      '<div class="pk-hero__btns pk-reveal" style="--d:4">' +
        '<a class="pk-btn pk-magnet" href="' + SITE + 'keys">' + d.tag('span', 'ty.cases', L('Смотреть кейсы', 'See case studies')) + ARROW + '</a>' +
        '<a class="pk-btn pk-btn--ghost" href="https://t.me/PavelTexSpec" target="_blank" rel="noopener">' + d.tag('span', 'ty.tg', L('Написать в Telegram', 'Message on Telegram')) + '</a>' +
      '</div>' +
      '<ul class="pk-nf__links">' + links + '</ul>' +
    '</div></section>';

  return { html, en: d.en, jsonld: '' };
};
