// /rezume — резюме с печатью в PDF.
const { Dict } = require('./_dict.js');
const SITE = 'https://texspeckps.ru/';
const HH = 'https://kaluga.hh.ru/resume/c9910cadff107e4cf60039ed1f674933414759';

const FACTS = [
  [{ ru: 'Возраст', en: 'Age' }, { ru: '31 год', en: '31' }],
  [{ ru: 'Город', en: 'City' }, { ru: 'Троицк (Москва)', en: 'Troitsk (Moscow)' }],
  [{ ru: 'Формат', en: 'Format' }, { ru: 'Удалённо', en: 'Remote' }],
  [{ ru: 'Занятость', en: 'Employment' }, { ru: 'Полная, частичная, проектная', en: 'Full-time, part-time, project' }],
  [{ ru: 'Стоимость проекта', en: 'Project rate' }, { ru: 'от 5 000 ₽', en: 'from 5 000 ₽' }]
];
const SPEC = [
  [{ ru: 'Сайты на Tilda', en: 'Websites on Tilda' }, { ru: 'Лендинги, многостраничные сайты, магазины, портфолио, кастомная вёрстка в Zero Block.', en: 'Landing pages, multi-page sites, stores, portfolios, custom Zero Block layouts.' }],
  [{ ru: 'Чат-боты и автоматизация', en: 'Chatbots & automation' }, { ru: 'Salebot, боты с ИИ, автоворонки продаж, интеграции сервисов, рассылки.', en: 'Salebot, AI bots, sales funnels, service integrations, email flows.' }],
  [{ ru: 'Дизайн и прототипы', en: 'Design & prototypes' }, { ru: 'Figma, адаптивная вёрстка, HTML / CSS / JS.', en: 'Figma, responsive layout, HTML / CSS / JS.' }],
  [{ ru: 'Онлайн-школы', en: 'Online schools' }, { ru: 'Настройка GetCourse, автоматизация продаж курсов.', en: 'GetCourse setup, automated course sales.' }]
];
const SKILLS = ['Tilda', 'Zero Block', 'HTML / CSS / JS', 'Salebot', { ru: 'Чат-боты', en: 'Chatbots' }, 'GetCourse', 'Unisender', { ru: 'Автоворонки продаж', en: 'Sales funnels' }, { ru: 'Интеграция сервисов', en: 'Service integrations' }, { ru: 'Настройка CRM', en: 'CRM setup' }, { ru: 'Адаптивная вёрстка', en: 'Responsive layout' }, { ru: 'Веб-дизайн', en: 'Web design' }, 'Figma'];
const EDU = [
  ['2019', { ru: 'Высшее образование', en: 'Higher education' }, { ru: 'ВА ВПВО ВС РФ', en: 'Military Academy of Air Defense (Russia)' }],
  ['2014', { ru: 'Среднее специальное образование', en: 'Vocational education' }, { ru: 'БФ МЭСИ', en: 'Bryansk branch of MESI' }]
];

module.exports = function render() {
  const d = new Dict();
  const facts = FACTS.map(([l, v], i) => '<li>' + d.tag('small', 'cv.fl' + i, l) + d.tag('b', 'cv.fv' + i, v) + '</li>').join('');
  const spec = SPEC.map(([t, s], i) => '<li><span class="pk-steps2__n">' + String(i + 1).padStart(2, '0') + '</span>' + d.tag('b', 'cv.st' + i, t) + d.tag('span', 'cv.sd' + i, s) + '</li>').join('');
  const skills = SKILLS.map((s, i) => typeof s === 'string' ? '<li>' + s + '</li>' : d.tag('li', 'cv.sk' + i, s)).join('');
  const edu = EDU.map(([y, t, p], i) => '<li><span class="pk-cv__year">' + y + '</span><span>' + d.tag('b', 'cv.et' + i, t) + d.tag('span', 'cv.ep' + i, p, 'class="pk-muted"') + '</span></li>').join('');

  const html = '' +
    '<section class="pk-hero pk-dirhero" aria-labelledby="pk-h1"><div class="pk-wrap">' +
      d.tag('p', 'cv.eye', { ru: 'Резюме', en: 'Résumé' }, 'class="pk-eyebrow pk-reveal"') +
      d.tag('h1', 'cv.h1', { ru: 'Корчагин Павел Сергеевич', en: 'Pavel Korchagin' }, 'class="pk-h1 pk-reveal" id="pk-h1" style="--d:1"') +
      d.tag('p', 'cv.role', { ru: 'Технический специалист и веб-разработчик. Сайты на Tilda и чат-боты на Salebot.', en: 'Technical specialist and web developer. Tilda websites and Salebot chatbots.' }, 'class="pk-lead pk-reveal" style="--d:2"') +
      '<div class="pk-hero__btns pk-reveal pk-noprint" style="--d:3">' +
        '<button type="button" class="pk-btn" data-print>' + d.tag('span', 'cv.pdf', { ru: 'Сохранить в PDF', en: 'Save as PDF' }) +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg></button>' +
        '<a class="pk-btn pk-btn--ghost" href="' + HH + '" target="_blank" rel="noopener">' + d.tag('span', 'cv.hh', { ru: 'Резюме на hh.ru', en: 'Résumé on hh.ru' }) + '</a>' +
      '</div>' +
    '</div></section>' +
    '<section class="pk-section" style="padding-top:0"><div class="pk-wrap pk-cv">' +
      '<ul class="pk-cv__facts pk-reveal">' + facts + '</ul>' +
      '<div class="pk-cv__row pk-reveal">' + d.tag('h2', 'cv.about.h', { ru: 'Обо мне', en: 'About' }, 'class="pk-case__label"') +
        '<div class="pk-cv__text">' +
          d.tag('p', 'cv.about1', { ru: 'Помогаю бизнесу закрывать конкретную задачу — привлекать заявки и доводить их до продажи. Беру на себя полный цикл: дизайн и прототип в Figma, сборку сайта на Tilda, настройку чат-бота на Salebot и связку всего этого с CRM и рассылками, чтобы клиент не терял заявки на каждом шаге воронки.', en: 'I help businesses solve a specific problem — attract leads and turn them into sales. I handle the full cycle: design and prototype in Figma, building the site on Tilda, setting up the Salebot chatbot and connecting it all to CRM and email so no lead is lost at any funnel step.' }) +
          d.tag('p', 'cv.about2', { ru: 'Работаю на результат, а не на процесс: предлагаю решение исходя из бюджета и цели проекта, а не «продаю» лишние часы. Сроки и договорённости соблюдаю, на связи на всех этапах — от брифа до запуска и техподдержки после сдачи.', en: 'I work for results, not process: I propose solutions based on the budget and goal, not by “selling” extra hours. I keep deadlines and agreements and stay in touch at every stage — from brief to launch and support after handoff.' }) +
        '</div></div>' +
      '<div class="pk-cv__row pk-reveal">' + d.tag('h2', 'cv.spec.h', { ru: 'Специализация', en: 'Specialization' }, 'class="pk-case__label"') + '<ol class="pk-steps2 pk-steps2--2">' + spec + '</ol></div>' +
      '<div class="pk-cv__row pk-reveal">' + d.tag('h2', 'cv.skills.h', { ru: 'Навыки', en: 'Skills' }, 'class="pk-case__label"') + '<ul class="pk-tags pk-tags--lg">' + skills + '</ul></div>' +
      '<div class="pk-cv__row pk-reveal">' + d.tag('h2', 'cv.edu.h', { ru: 'Образование', en: 'Education' }, 'class="pk-case__label"') + '<ol class="pk-cv__edu">' + edu + '</ol></div>' +
      '<div class="pk-cv__row pk-reveal">' + d.tag('h2', 'cv.contact.h', { ru: 'Контакты', en: 'Contacts' }, 'class="pk-case__label"') +
        '<p class="pk-cv__contacts"><a href="https://t.me/PavelTexSpec">Telegram: @PavelTexSpec</a><a href="tel:+79507041398">+7 950 704-13-98</a><a href="mailto:TexSpecKor@yandex.ru">TexSpecKor@yandex.ru</a><a href="' + SITE + '">texspeckps.ru</a></p></div>' +
    '</div></section>' +
    '<section class="pk-section pk-noprint" style="padding-top:0"><div class="pk-wrap"><div class="pk-final pk-reveal">' +
      d.tag('h2', 'cv.cta.h', { ru: 'Подхожу под вашу задачу?', en: 'Am I a fit for your task?' }, 'class="pk-h2"') +
      '<div class="pk-final__btns"><a class="pk-btn pk-magnet" href="' + SITE + 'form">' + d.tag('span', 'cv.cta.b', { ru: 'Заказать проект', en: 'Order a project' }) + '</a>' +
      '<a class="pk-btn pk-btn--ghost" href="' + SITE + 'keys">' + d.tag('span', 'cv.cta.c', { ru: 'Смотреть кейсы', en: 'See case studies' }) + '</a></div>' +
    '</div></div></section>';

  return {
    html,
    en: d.en,
    jsonld: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'ProfilePage', url: SITE + 'rezume',
      mainEntity: {
        '@type': 'Person', name: 'Корчагин Павел Сергеевич', jobTitle: 'Технический специалист и веб-разработчик', url: SITE, sameAs: [HH, 'https://t.me/PavelTexSpec'],
        address: { '@type': 'PostalAddress', addressLocality: 'Троицк', addressRegion: 'Москва', addressCountry: 'RU' },
        alumniOf: EDU.map((e) => ({ '@type': 'EducationalOrganization', name: e[2].ru })),
        knowsAbout: SKILLS.map((s) => (typeof s === 'string' ? s : s.ru))
      }
    }, null, 2)
  };
};
