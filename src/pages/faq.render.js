// /faq — ИИ-ассистент Salebot + статичные вопросы (для людей без чата и для поисковиков).
const { Dict } = require('./_dict.js');
const SITE = 'https://texspeckps.ru/';

const QA = [
  [{ ru: 'Сколько стоит проект под ключ?', en: 'How much does a turnkey project cost?' },
   { ru: 'Зависит от объёма: сайт-визитка, сложный Zero Block с анимацией и школа на GetCourse стоят по-разному. Актуальные цены по каждому направлению — на странице <a class="pk-link" href="' + SITE + 'price">услуг и цен</a>, там же можно выбрать услугу и сразу отправить заявку.', en: 'It depends on scope: a business-card site, a complex animated Zero Block and a GetCourse school are priced differently. Current prices for every area are on the <a class="pk-link" href="' + SITE + 'price">services & pricing</a> page, where you can pick a service and send a request right away.' }],
  [{ ru: 'В какие сроки делаете сайт, бота или школу?', en: 'How long does a website, bot or school take?' },
   { ru: 'Сайт-визитка — от 5–7 рабочих дней, сложный Zero Block с анимацией — от 2–3 недель. Простого бота запускаю за 1–2 дня. Комплекс «сайт + бот + школа» обсуждаем индивидуально после брифа.', en: 'A business-card site takes from 5–7 business days, a complex animated Zero Block from 2–3 weeks. A simple bot launches in 1–2 days. A “website + bot + school” package is scoped individually after the brief.' }],
  [{ ru: 'Можно заказать не всё под ключ, а один этап?', en: 'Can I order a single stage instead of a turnkey project?' },
   { ru: 'Да. Можно взять только дизайн, только вёрстку, только бота или только настройку GetCourse — работаю и с отдельными задачами, и с полным циклом.', en: 'Yes. You can order only design, only development, only a bot or only GetCourse setup — I take on single tasks as well as the full cycle.' }],
  [{ ru: 'Как ставить ТЗ, если его нет?', en: 'What if I don’t have a brief?' },
   { ru: 'Готовое ТЗ не нужно. На созвоне я сам задам вопросы о бизнесе, аудитории и целях и на их основе соберу структуру и план работ.', en: 'You don’t need one. On a call I’ll ask about your business, audience and goals and turn the answers into a structure and work plan.' }],
  [{ ru: 'Что с поддержкой после запуска?', en: 'What about support after launch?' },
   { ru: 'Остаюсь на связи: правки, доработки анимаций, донастройка бота или школы — разово или на абонентской основе.', en: 'I stay in touch: edits, animation tweaks, bot or school fine-tuning — one-off or on a monthly plan.' }],
  [{ ru: 'Работаете с готовым сайтом или только с нуля?', en: 'Do you work with existing sites or only from scratch?' },
   { ru: 'И так, и так: дорабатываю существующий сайт на Tilda, добавляю анимации и ботов — или собираю всё с нуля, как удобнее вам.', en: 'Both: I improve existing Tilda sites, add animations and bots — or build everything from scratch, whichever suits you.' }],
  [{ ru: 'Как проходит работа?', en: 'How does the work go?' },
   { ru: 'Пять шагов: заявка и бриф → прототип и дизайн → разработка → тестирование на всех устройствах → запуск и поддержка. На каждом этапе вы видите результат и согласовываете его.', en: 'Five steps: request and brief → prototype and design → development → testing on every device → launch and support. You see and approve the result at every stage.' }],
  [{ ru: 'Можно посмотреть примеры работ?', en: 'Can I see examples of your work?' },
   { ru: 'Конечно — в разделе <a class="pk-link" href="' + SITE + 'keys">кейсов</a> каждый проект разобран отдельно: задача, сценарий, экраны и итог. Свежие работы также публикую в Telegram-канале.', en: 'Of course — in the <a class="pk-link" href="' + SITE + 'keys">case studies</a> every project is broken down: task, flow, screens and result. I also post new work on my Telegram channel.' }]
];

const strip = (s) => s.replace(/<[^>]+>/g, '');

module.exports = function render() {
  const d = new Dict();
  const items = QA.map(([q, a], i) =>
    '<details class="pk-reveal" style="--d:' + (i % 3) + '"' + (i === 0 ? ' open' : '') + '><summary>' + d.tag('span', 'fq.q' + i, q) + '<i aria-hidden="true"></i></summary>' + d.tag('p', 'fq.a' + i, a, '', true) + '</details>').join('');

  const html = '' +
    '<section class="pk-hero pk-dirhero" aria-labelledby="pk-h1"><div class="pk-wrap">' +
      d.tag('p', 'fq.eye', { ru: 'Вопросы и ответы', en: 'Questions & answers' }, 'class="pk-eyebrow pk-reveal"') +
      d.tag('h1', 'fq.h1', { ru: 'Спросите — отвечу сразу', en: 'Ask — get an answer right away' }, 'class="pk-h1 pk-reveal" id="pk-h1" style="--d:1"') +
      d.tag('p', 'fq.lead', { ru: 'Мой ИИ-ассистент знает всё об услугах, сроках, ценах и проектах и отвечает в любое время суток. Если вопрос нестандартный — он передаст его мне.', en: 'My AI assistant knows everything about services, timelines, prices and projects and replies around the clock. If your question is unusual, it passes it on to me.' }, 'class="pk-lead pk-reveal" style="--d:2"') +
    '</div></section>' +
    '<section class="pk-section" style="padding-top:0"><div class="pk-wrap">' +
      '<div class="pk-aibox pk-reveal">' +
        '<div class="pk-aibox__chat" aria-hidden="true">' +
          d.tag('p', 'fq.demo1', { ru: 'Сколько стоит бот для сбора заявок?', en: 'How much is a lead capture bot?' }, 'class="pk-bubble pk-bubble--me"') +
          d.tag('p', 'fq.demo2', { ru: 'От 3 000 до 6 000 ₽, запуск за 1–2 дня. Бот квалифицирует лида, собирает контакты и сразу уведомляет менеджера. Рассказать, как это будет работать у вас?', en: 'From 3 000 to 6 000 ₽, live in 1–2 days. The bot qualifies the lead, collects contacts and alerts the manager instantly. Want me to explain how it would work for you?' }, 'class="pk-bubble"') +
          '<p class="pk-bubble pk-bubble--typing"><i></i><i></i><i></i></p>' +
        '</div>' +
        '<div class="pk-aibox__cta">' +
          '<span class="pk-ai__badge"><span class="pk-dot" aria-hidden="true"></span>' + d.tag('span', 'fq.online', { ru: 'Ассистент онлайн 24/7', en: 'Assistant online 24/7' }) + '</span>' +
          d.tag('h2', 'fq.cta.h', { ru: 'Задайте вопрос ассистенту', en: 'Ask the assistant' }, 'class="pk-h2"') +
          d.tag('p', 'fq.cta.p', { ru: 'Чат откроется в правом нижнем углу. Можно писать как человеку — коротко и своими словами.', en: 'The chat opens in the bottom-right corner. Write as you would to a person — briefly and in your own words.' }, 'class="pk-muted"') +
          '<button type="button" class="pk-btn pk-magnet" data-open-chat>' + d.tag('span', 'fq.open', { ru: 'Открыть чат', en: 'Open the chat' }) +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></button>' +
          '<a class="pk-link" href="https://t.me/PavelTexSpec" target="_blank" rel="noopener">' + d.tag('span', 'fq.human', { ru: 'Хочу поговорить с Павлом', en: 'I’d rather talk to Pavel' }) + '</a>' +
        '</div>' +
      '</div>' +
    '</div></section>' +
    '<section class="pk-section" style="padding-top:0" aria-labelledby="pk-qa-h"><div class="pk-wrap pk-faq">' +
      '<div class="pk-head" style="margin-bottom:0">' +
        d.tag('p', 'fq.often', { ru: 'Частые вопросы', en: 'Frequent questions' }, 'class="pk-eyebrow pk-reveal"') +
        d.tag('h2', 'fq.qa.h', { ru: 'То, о чём спрашивают чаще всего', en: 'What people ask most often' }, 'class="pk-h2 pk-reveal" id="pk-qa-h"') +
      '</div>' +
      '<div class="pk-qa">' + items + '</div>' +
    '</div></section>';

  return {
    html,
    en: d.en,
    jsonld: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'FAQPage', url: SITE + 'faq',
      mainEntity: QA.map(([q, a]) => ({ '@type': 'Question', name: q.ru, acceptedAnswer: { '@type': 'Answer', text: strip(a.ru) } }))
    }, null, 2)
  };
};
