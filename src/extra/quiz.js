/*
  Квиз «Что вас интересует в этом направлении?» — на страницах кейсов и услуг.
  Разметка целиком рендерится при сборке (все шаги и все результаты — с data-i18n),
  браузерный скрипт только листает шаги и собирает ссылку на заявку.
  Цены и сроки берутся из прайса (src/pages/price.render.js), чтобы нигде не расходились.
*/
const { esc } = require('../pages/_dict.js');
const { GROUPS } = require('../pages/price.render.js');

const SITE = 'https://texspeckps.ru/';
const L = (ru, en) => ({ ru, en });
const val = (v) => (typeof v === 'string' ? { ru: v, en: v } : v);

// общий последний вопрос — сроки
const WHEN = {
  q: L('Когда нужно запустить?', 'When do you need to launch?'),
  opts: [L('В течение недели', 'Within a week'), L('В этом месяце', 'This month'), L('Пока присматриваюсь', 'Just exploring')]
};

// первый вопрос выбирает услугу из прайса (индекс в items), второй уточняет ситуацию
const QUIZ = {
  salebot: {
    q1: L('Что должен делать бот?', 'What should the bot do?'),
    opts: [
      [L('Прогревать и продавать', 'Nurture and sell'), 0],
      [L('Собирать заявки', 'Capture leads'), 2],
      [L('Отвечать клиентам 24/7 с ИИ', 'Answer clients 24/7 with AI'), 9],
      [L('Записывать на услуги', 'Book appointments'), 10],
      [L('Вовлекать: квиз, игра, марафон', 'Engage: quiz, game, challenge'), 7],
      [L('Продавать доступ в платный канал', 'Sell paid channel access'), 11]
    ],
    q2: L('Бот у вас уже есть?', 'Do you already have a bot?'),
    opts2: [L('Нет, нужен с нуля', 'No, build from scratch'), L('Есть, нужно доработать', 'Yes, it needs work'), L('Есть на другой платформе', 'Yes, on another platform')]
  },
  tilda: {
    q1: L('Какой сайт нужен?', 'What kind of website?'),
    opts: [
      [L('Лендинг под одну услугу', 'A landing page for one offer'), 0],
      [L('Сайт из нескольких страниц', 'A multi-page website'), 1],
      [L('Интернет-магазин', 'An online store'), 2],
      [L('Сверстать готовый макет из Figma', 'Build a ready Figma mockup'), 3],
      [L('Доработать существующий сайт', 'Improve an existing site'), 6]
    ],
    q2: L('Дизайн уже есть?', 'Do you have a design?'),
    opts2: [L('Нет, нужен с нуля', 'No, design from scratch'), L('Есть макет в Figma', 'Yes, a Figma mockup'), L('Есть сайты-примеры', 'I have reference sites')]
  },
  figma: {
    q1: L('Что нужно спроектировать?', 'What needs designing?'),
    opts: [
      [L('Прототип и структуру страницы', 'A page prototype and structure'), 0],
      [L('Визуальный стиль и компоненты', 'Visual style and components'), 1],
      [L('Полный дизайн сайта', 'A full website design'), 2],
      [L('Редизайн текущего сайта', 'A redesign of the current site'), 3],
      [L('Найти, где теряются клиенты (UX-аудит)', 'Find where clients drop off (UX audit)'), 4]
    ],
    q2: L('Что будет с макетом потом?', 'What happens to the mockup next?'),
    opts2: [L('Сверстать на Tilda', 'Build it on Tilda'), L('Передам своему разработчику', 'Hand it to my developer'), L('Пока не знаю', 'Not sure yet')]
  },
  getcourse: {
    q1: L('Что нужно сделать в школе?', 'What does your school need?'),
    opts: [
      [L('Собрать курс: уроки и доступы', 'Build a course: lessons and access'), 0],
      [L('Настроить автоматизации и письма', 'Set up automations and emails'), 1],
      [L('Сделать лендинг программы', 'Make a program landing page'), 3],
      [L('Оформить кабинет и каталог', 'Style the member area and catalog'), 4],
      [L('Взять школу на сопровождение', 'Ongoing school support'), 5]
    ],
    q2: L('Школа уже работает?', 'Is the school already running?'),
    opts2: [L('Запускаюсь с нуля', 'Launching from scratch'), L('Работает, нужно улучшить', 'Running, needs improvement'), L('Переезжаю с другой платформы', 'Moving from another platform')]
  },
  webinar: {
    q1: L('Что нужно настроить?', 'What needs setting up?'),
    opts: [
      [L('Комнату для живого эфира', 'A room for a live stream'), 0],
      [L('Автовебинар по расписанию', 'A scheduled automated webinar'), 1],
      [L('Цепочку писем', 'An email sequence'), 2],
      [L('Сервис рассылок и базу', 'An email service and list'), 3]
    ],
    q2: L('Аудитория уже есть?', 'Do you already have an audience?'),
    opts2: [L('Нет, только собираю', 'No, just building it'), L('Есть база подписчиков', 'Yes, a subscriber list'), L('Есть, но она «остыла»', 'Yes, but it has gone cold')]
  }
};

const ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const TG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.9 4.3l-3.2 15.1c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6.2 13.1l-4.8-1.5c-1-.3-1.1-1 .2-1.5l18.9-7.3c.9-.3 1.6.2 1.4 1.5z"/></svg>';

// d — Dict страницы; dir — направление (salebot | tilda | figma | getcourse | webinar)
function renderQuiz(d, dir) {
  const qz = QUIZ[dir];
  const group = GROUPS.find((g) => g.id === dir);
  if (!qz || !group) return '';
  const k = 'qz.' + dir + '.';
  const step = (n, title, opts, name) =>
    '<fieldset class="pk-quiz__step" data-step="' + n + '"' + (n ? ' hidden' : '') + '>' +
      '<legend class="pk-quiz__q"><span class="pk-quiz__n">' + (n + 1) + ' / 3</span>' + d.tag('span', k + 'q' + n, title) + '</legend>' +
      '<div class="pk-quiz__opts">' + opts.map((o, i) =>
        '<button type="button" class="pk-quiz__opt" data-name="' + name + '" data-value="' + i + '" data-ru="' + esc(o.ru) + '">' +
          d.tag('span', k + 'q' + n + '.' + i, o) + '</button>').join('') + '</div>' +
      (n ? '<button type="button" class="pk-quiz__back" data-back>' + d.tag('span', 'qz.back', L('← Назад', '← Back')) + '</button>' : '') +
    '</fieldset>';

  const results = qz.opts.map(([label, idx], i) => {
    const it = group.items[idx];
    const price = val(it[2]);
    return '<div class="pk-quiz__res" data-result="' + i + '" data-service="' + esc(it[0].ru) + '" hidden>' +
      d.tag('p', 'qz.fit', L('Вам подойдёт', 'Your best fit'), 'class="pk-eyebrow"') +
      d.tag('h3', 'pr.' + dir + '.' + idx + '.n', it[0], 'class="pk-h2 pk-quiz__title"') +
      d.tag('p', 'pr.' + dir + '.' + idx + '.d', it[1], 'class="pk-muted"') +
      '<p class="pk-quiz__meta"><b>' + (price.ru === price.en ? esc(price.ru) : d.tag('span', 'pr.' + dir + '.' + idx + '.p', price)) + '</b>' +
        (it[3] ? d.tag('span', 'pr.' + dir + '.' + idx + '.t', it[3]) : '') + '</p>' +
    '</div>';
  }).join('');

  return '<section class="pk-section pk-quizwrap" aria-labelledby="qz-h-' + dir + '"><div class="pk-wrap">' +
    '<div class="pk-quiz pk-reveal" data-quiz="' + dir + '">' +
      '<div class="pk-quiz__head">' +
        d.tag('p', 'qz.eye', L('Подбор за 3 вопроса', 'Find a fit in 3 questions'), 'class="pk-eyebrow"') +
        d.tag('h2', 'qz.h', L('Что вас интересует в этом направлении?', 'What are you looking for in this area?'), 'class="pk-h2" id="qz-h-' + dir + '"') +
        d.tag('p', 'qz.lead', L('Ответьте на три вопроса — покажу подходящую услугу, цену и сроки. Заявку отправите в один клик.', 'Answer three questions and I’ll show the right service, price and timeline. Send the request in one click.'), 'class="pk-muted"') +
      '</div>' +
      '<div class="pk-quiz__body">' +
        step(0, qz.q1, qz.opts.map((o) => o[0]), 'need') +
        step(1, qz.q2, qz.opts2, 'state') +
        step(2, WHEN.q, WHEN.opts, 'when') +
        '<div class="pk-quiz__done" hidden>' + results +
          '<div class="pk-quiz__btns">' +
            '<a class="pk-btn pk-magnet" data-quiz-form href="' + SITE + 'form?service=' + dir + '">' + d.tag('span', 'qz.send', L('Оставить заявку', 'Send a request')) + ARROW + '</a>' +
            '<a class="pk-btn pk-btn--ghost" data-quiz-tg href="https://t.me/PavelTexSpec" target="_blank" rel="noopener">' + TG + d.tag('span', 'qz.tg', L('Обсудить в Telegram', 'Discuss on Telegram')) + '</a>' +
            '<button type="button" class="pk-quiz__back" data-restart>' + d.tag('span', 'qz.again', L('Пройти заново', 'Start over')) + '</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div></section>';
}

// скрипт для браузера (подключается к странице как обычный JS)
const QUIZ_JS = `
(function () {
  var PK = window.PK;
  var root = PK ? PK.root : document;
  root.querySelectorAll('[data-quiz]').forEach(function (qz) {
    var steps = qz.querySelectorAll('.pk-quiz__step');
    var done = qz.querySelector('.pk-quiz__done');
    var answers = {};
    function show(n) {
      steps.forEach(function (s, i) { s.hidden = i !== n; });
      done.hidden = n !== steps.length;
    }
    function finish() {
      var res = qz.querySelector('[data-result="' + answers.need.value + '"]');
      qz.querySelectorAll('.pk-quiz__res').forEach(function (r) { r.hidden = r !== res; });
      var task = res.getAttribute('data-service') + ' · ' + answers.state.ru + ' · ' + answers.when.ru;
      qz.querySelector('[data-quiz-form]').href = '/form?service=' + qz.getAttribute('data-quiz') + '&task=' + encodeURIComponent(task);
      qz.querySelector('[data-quiz-tg]').href = 'https://t.me/PavelTexSpec?text=' + encodeURIComponent('Здравствуйте! Прошёл подбор на сайте: ' + task);
      show(steps.length);
      if (window.ym) { try { window.ym(112984847, 'reachGoal', 'quiz_done'); } catch (e) {} }
    }
    qz.addEventListener('click', function (e) {
      var opt = e.target.closest('.pk-quiz__opt');
      if (opt) {
        answers[opt.getAttribute('data-name')] = { value: opt.getAttribute('data-value'), ru: opt.getAttribute('data-ru') };
        var n = +opt.closest('.pk-quiz__step').getAttribute('data-step');
        if (n + 1 < steps.length) show(n + 1); else finish();
        return;
      }
      if (e.target.closest('[data-back]')) {
        var cur = +e.target.closest('.pk-quiz__step').getAttribute('data-step');
        show(Math.max(0, cur - 1));
      }
      if (e.target.closest('[data-restart]')) { answers = {}; show(0); }
    });
  });
})();
`;

const QUIZ_CSS = `
.pk-quiz {
  display: grid; gap: 28px; padding: clamp(24px, 5vw, 56px); border-radius: 28px; position: relative; overflow: hidden; isolation: isolate;
  background: radial-gradient(60% 80% at 100% 0%, var(--glow1), transparent 70%), var(--card);
  box-shadow: inset 0 0 0 1px var(--line);
}
@media (min-width: 960px) { .pk-quiz { grid-template-columns: 1fr 1.4fr; gap: 56px; align-items: start; } }
.pk-quiz__head { display: grid; gap: 14px; align-content: start; }
.pk-quiz__step { border: 0; margin: 0; padding: 0; min-width: 0; display: grid; gap: 16px; }
.pk-quiz__q { display: grid; gap: 8px; padding: 0; font: 600 1.25rem/1.25 var(--display); }
.pk-quiz__n { font: 600 .78rem/1 var(--display); letter-spacing: .08em; color: var(--acc-text); }
.pk-quiz__opts { display: grid; gap: 10px; }
@media (min-width: 640px) { .pk-quiz__opts { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.pk-quiz__opt {
  text-align: left; padding: 16px 18px; border-radius: 12px; font-weight: 600; line-height: 1.35; color: var(--ink);
  background: var(--bg2); box-shadow: inset 0 0 0 1px var(--line2); transition: box-shadow .25s, transform .3s var(--ease), background-color .25s;
}
.pk-quiz__opt:hover, .pk-quiz__opt:focus-visible { box-shadow: inset 0 0 0 1.5px var(--acc-text); transform: translateY(-2px); }
.pk-quiz__back { justify-self: start; font-size: .9rem; font-weight: 600; color: var(--muted); padding: 6px 0; }
.pk-quiz__back:hover { color: var(--ink); }
.pk-quiz__done { display: grid; gap: 18px; }
.pk-quiz__res { display: grid; gap: 10px; }
.pk-quiz__title { font-size: clamp(1.4rem, 3vw, 1.9rem); }
.pk-quiz__meta { display: flex; flex-wrap: wrap; align-items: baseline; gap: 14px; }
.pk-quiz__meta b { font: 700 1.5rem/1 var(--display); letter-spacing: -.03em; color: var(--acc-text); }
.pk-quiz__meta span { color: var(--muted); font-size: .92rem; }
.pk-quiz__btns { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
.pk-motion .pk-quiz__step:not([hidden]), .pk-motion .pk-quiz__done:not([hidden]) { animation: pk-qz-in .45s var(--ease); }
@keyframes pk-qz-in { from { opacity: 0; transform: translateY(10px); } }
.pk-btn--tg svg { color: #2aabee; }
`;

module.exports = { renderQuiz, QUIZ_JS, QUIZ_CSS, QUIZ };
