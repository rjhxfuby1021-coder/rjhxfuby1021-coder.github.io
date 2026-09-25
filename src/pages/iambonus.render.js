// /iambonus — кто я + реферальная программа.
const { Dict } = require('./_dict.js');
const SITE = 'https://texspeckps.ru/';
const PHOTO = 'https://static.tildacdn.com/tild3366-6336-4861-a230-666439386134/noroot.png';
const ARROW = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

const TRAITS = [
  [{ ru: 'Спокойный', en: 'Calm' }, { ru: 'Без паники даже в горящих задачах', en: 'No panic, even with urgent tasks' }],
  [{ ru: 'Ответственный', en: 'Responsible' }, { ru: 'Отвечаю за весь результат, а не за свой кусок', en: 'I own the whole result, not just my piece' }],
  [{ ru: 'Пунктуальный', en: 'Punctual' }, { ru: 'Сроки согласуем заранее и держим их', en: 'We agree on deadlines up front, and I keep them' }],
  [{ ru: 'Добросовестный', en: 'Conscientious' }, { ru: 'Проверяю всё на всех устройствах до сдачи', en: 'I test everything on every device before handoff' }]
];

const REF = [
  [{ ru: 'Рекомендуете', en: 'You recommend' }, { ru: 'Расскажите обо мне тому, кому нужен сайт, бот или онлайн-школа.', en: 'Tell someone who needs a website, bot or online school about me.' }],
  [{ ru: 'Клиент заказывает', en: 'They order' }, { ru: 'Человек приходит по вашей рекомендации и оплачивает заказ.', en: 'They come on your recommendation and pay for the order.' }],
  [{ ru: 'Вы получаете 10%', en: 'You get 10%' }, { ru: 'Выплачиваю 10% от фактически оплаченной суммы — после полной оплаты заказа.', en: 'I pay 10% of the amount actually paid — once the order is fully paid.' }],
  [{ ru: 'И дальше', en: 'And beyond' }, { ru: 'Если проект берётся на сопровождение — 10% с каждой ежемесячной оплаты.', en: 'If the project goes on ongoing support — 10% of every monthly payment.' }]
];

module.exports = function render() {
  const d = new Dict();
  const traits = TRAITS.map(([t, s], i) => '<li class="pk-trait pk-reveal" style="--d:' + i + '">' + d.tag('b', 'ab.tr' + i, t) + d.tag('span', 'ab.trd' + i, s, 'class="pk-muted"') + '</li>').join('');
  const steps = REF.map(([t, s], i) => '<li class="pk-reveal" style="--d:' + i + '"><span class="pk-steps2__n">' + String(i + 1).padStart(2, '0') + '</span>' + d.tag('b', 'ab.rf' + i, t) + d.tag('span', 'ab.rfd' + i, s) + '</li>').join('');

  const html = '' +
    '<section class="pk-hero" aria-labelledby="pk-h1"><div class="pk-wrap pk-hero__grid">' +
      '<div class="pk-hero__text">' +
        d.tag('p', 'ab.eye', { ru: 'Кто я', en: 'Who I am' }, 'class="pk-eyebrow pk-reveal"') +
        d.tag('h1', 'ab.h1', { ru: 'Павел Корчагин', en: 'Pavel Korchagin' }, 'class="pk-h1 pk-reveal" id="pk-h1" style="--d:1"') +
        d.tag('p', 'ab.p1', { ru: 'Мне <strong>31 год</strong>, я родом из <strong>Брянска</strong>. Занимаюсь фрилансом и цифровыми проектами: работаю с Figma, Tilda, Salebot и GetCourse, имею сертификаты по <strong>HTML, CSS и JavaScript</strong>.', en: 'I’m <strong>31</strong>, originally from <strong>Bryansk</strong>, Russia. I freelance on digital projects: I work with Figma, Tilda, Salebot and GetCourse and hold certificates in <strong>HTML, CSS and JavaScript</strong>.' }, 'class="pk-lead pk-reveal" style="--d:2"', true) +
        d.tag('p', 'ab.p2', { ru: 'Люблю сложные и нестандартные задачи — те, где нужно разобраться в проблеме, найти оптимальное решение и довести всё до результата. Постоянно развиваюсь и осваиваю новые инструменты. Открыт к сотрудничеству и новым знакомствам.', en: 'I love complex, unconventional tasks — the kind where you dig into the problem, find the best solution and see it through. I keep growing and learning new tools. Open to collaboration and new connections.' }, 'class="pk-lead pk-reveal" style="--d:3"') +
        '<div class="pk-hero__btns pk-reveal" style="--d:4">' +
          '<a class="pk-btn pk-magnet" href="' + SITE + 'form">' + d.tag('span', 'ab.cta', { ru: 'Обсудить проект', en: 'Discuss a project' }) + ARROW + '</a>' +
          '<a class="pk-btn pk-btn--ghost" href="' + SITE + 'rezume">' + d.tag('span', 'ab.cv', { ru: 'Резюме', en: 'Résumé' }) + '</a>' +
        '</div>' +
      '</div>' +
      '<div class="pk-visual pk-reveal" style="--d:2"><div class="pk-visual__ring">' +
        '<img class="pk-visual__photo" src="' + PHOTO + '" width="736" height="887" alt="Павел Корчагин" data-i18n-attr="alt:ab.alt">' +
      '</div></div>' +
    '</div></section>' +
    '<section class="pk-section" style="padding-top:0" aria-labelledby="pk-tr-h"><div class="pk-wrap">' +
      '<div class="pk-head">' + d.tag('h2', 'ab.tr.h', { ru: 'Какой я в работе', en: 'What I’m like to work with' }, 'class="pk-h2 pk-reveal" id="pk-tr-h"') + '</div>' +
      '<ul class="pk-traits pk-traits--4">' + traits + '</ul>' +
    '</div></section>' +
    '<section class="pk-section" style="padding-top:0" aria-labelledby="pk-ref-h" id="referral"><div class="pk-wrap">' +
      '<div class="pk-refbox pk-reveal">' +
        '<div class="pk-refbox__head">' +
          '<p class="pk-refbox__big">10%</p>' +
          '<div>' + d.tag('p', 'ab.ref.eye', { ru: 'Реферальная программа', en: 'Referral program' }, 'class="pk-eyebrow"') +
            d.tag('h2', 'ab.ref.h', { ru: 'Рекомендуйте — и зарабатывайте вместе со мной', en: 'Recommend me — and earn with me' }, 'class="pk-h2" id="pk-ref-h"') + '</div>' +
        '</div>' +
        '<ol class="pk-steps2" style="--n:4">' + steps + '</ol>' +
        '<div class="pk-final__btns" style="justify-content:flex-start">' +
          '<a class="pk-btn" href="https://t.me/PavelTexSpec" target="_blank" rel="noopener">' + d.tag('span', 'ab.ref.cta', { ru: 'Порекомендовать клиента', en: 'Refer a client' }) + ARROW + '</a>' +
        '</div>' +
      '</div>' +
    '</div></section>';

  d.en['ab.alt'] = 'Pavel Korchagin';
  return {
    html,
    en: d.en,
    jsonld: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'ProfilePage', url: SITE + 'iambonus',
      mainEntity: { '@type': 'Person', name: 'Павел Корчагин', jobTitle: 'Технический специалист', image: PHOTO, url: SITE, knowsAbout: ['Figma', 'Tilda', 'Salebot', 'GetCourse', 'HTML', 'CSS', 'JavaScript'] }
    }, null, 2)
  };
};
