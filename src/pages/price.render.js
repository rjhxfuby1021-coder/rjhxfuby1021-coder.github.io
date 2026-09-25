// /price — прайс по направлениям. Данные ниже, разметка — в render().
const { Dict, esc } = require('./_dict.js');
const SITE = 'https://texspeckps.ru/';

const GROUPS = [
  {
    id: 'salebot', num: '01', tab: { ru: 'Чат-боты', en: 'Chatbots' },
    title: { ru: 'Чат-боты на Salebot', en: 'Chatbots on Salebot' },
    lead: { ru: 'Соберу бота под конкретную задачу: продажи, заявки, автоматизацию, контент или вовлечение.', en: 'A bot built for a specific job: sales, leads, automation, content or engagement.' },
    items: [
      [{ ru: 'Бот-воронка для прогрева и продаж', en: 'Nurture & sales funnel bot' }, { ru: 'Сценарий воронки, сообщения, кнопки, сегментация, оплата, тестирование.', en: 'Funnel script, messages, buttons, segmentation, payment, testing.' }, '5 000 — 15 000 ₽', { ru: '2–5 дней', en: '2–5 days' }],
      [{ ru: 'Бот для выдачи лид-магнита', en: 'Lead magnet bot' }, { ru: 'PDF, видео или ссылка, подписка на канал, сбор контактов.', en: 'PDF, video or link, channel subscription, contact capture.' }, '2 000 — 5 000 ₽', { ru: '1–2 дня', en: '1–2 days' }],
      [{ ru: 'Бот для сбора заявок', en: 'Lead capture bot' }, { ru: 'Квалификация лида, контакты, уведомление менеджеру, сохранение в таблицу.', en: 'Lead qualification, contacts, manager alert, saving to a sheet.' }, '3 000 — 6 000 ₽', { ru: '1–2 дня', en: '1–2 days' }],
      [{ ru: 'Бот-автоответчик', en: 'Auto-reply bot' }, { ru: 'FAQ, меню, выдача информации и разгрузка эксперта от рутины.', en: 'FAQ, menus, info delivery — takes routine off the expert.' }, '3 000 — 7 000 ₽', { ru: '1–3 дня', en: '1–3 days' }],
      [{ ru: 'Бот-напоминалка о вебинаре', en: 'Webinar reminder bot' }, { ru: 'Напоминания за день, час и 15 минут плюс ссылка на эфир.', en: 'Reminders a day, an hour and 15 minutes before, plus the stream link.' }, '2 000 — 4 000 ₽', { ru: '1 день', en: '1 day' }],
      [{ ru: 'Бот для рассылки контента', en: 'Content delivery bot' }, { ru: 'Регулярная отправка постов, уроков и материалов.', en: 'Regular delivery of posts, lessons and materials.' }, '3 000 — 6 000 ₽', { ru: '1–2 дня', en: '1–2 days' }],
      [{ ru: 'Квиз-бот', en: 'Quiz bot' }, { ru: 'Вопросы, подсчёт результатов и персональные рекомендации.', en: 'Questions, scoring and personal recommendations.' }, '4 000 — 8 000 ₽', { ru: '2–3 дня', en: '2–3 days' }],
      [{ ru: 'Геймификация в боте', en: 'Gamification in a bot' }, { ru: 'Баллы, уровни, достижения, рейтинги и игровые механики.', en: 'Points, levels, achievements, leaderboards and game mechanics.' }, '5 000 — 10 000 ₽', { ru: '2–4 дня', en: '2–4 days' }],
      [{ ru: 'Марафон или челлендж в боте', en: 'Marathon or challenge bot' }, { ru: 'Задания, прогресс, напоминания и итоговый результат.', en: 'Tasks, progress, reminders and a final result.' }, '6 000 — 12 000 ₽', { ru: '3–5 дней', en: '3–5 days' }],
      [{ ru: 'ИИ-ассистент на базе знаний', en: 'Knowledge-base AI assistant' }, { ru: 'Отвечает клиентам 24/7 по вашим материалам, помогает выбрать услугу и передаёт заявку вам.', en: 'Answers clients 24/7 from your materials, helps pick a service and hands the lead to you.' }, '8 000 — 20 000 ₽', { ru: '3–7 дней', en: '3–7 days' }],
      [{ ru: 'Бот с онлайн-записью', en: 'Online booking bot' }, { ru: 'Запись на свободное время из расписания CRM и напоминания клиенту о визите.', en: 'Booking into free CRM slots plus visit reminders for the client.' }, '6 000 — 15 000 ₽', { ru: '3–5 дней', en: '3–5 days' }],
      [{ ru: 'Бот для платного канала', en: 'Paid channel bot' }, { ru: 'Оплата подписки, выдача доступа, напоминания о продлении и автоматическое удаление после срока.', en: 'Subscription payment, access, renewal reminders and automatic removal after expiry.' }, '7 000 — 15 000 ₽', { ru: '3–5 дней', en: '3–5 days' }],
      [{ ru: 'Реферальная программа в боте', en: 'Referral program in a bot' }, { ru: 'Персональные ссылки, учёт приглашённых, выдача бонусов и статистика в Google Таблице.', en: 'Personal links, referral tracking, bonus delivery and stats in Google Sheets.' }, '5 000 — 10 000 ₽', { ru: '2–4 дня', en: '2–4 days' }],
      [{ ru: 'Правки в существующем боте', en: 'Fixes to an existing bot' }, { ru: 'Ошибки, тексты, кнопки и небольшие изменения.', en: 'Bugs, copy, buttons and small changes.' }, '500 — 3 000 ₽', { ru: '1 час – 1 день', en: '1 hr – 1 day' }],
      [{ ru: 'Добавление новой функции', en: 'Adding a new feature' }, { ru: 'Новая ветка, интеграция или дополнительная механика.', en: 'A new branch, integration or extra mechanic.' }, '2 000 — 5 000 ₽', { ru: '1–2 дня', en: '1–2 days' }],
      [{ ru: 'Ежемесячная поддержка', en: 'Monthly support' }, { ru: 'Мониторинг, правки, консультации и обновления.', en: 'Monitoring, fixes, advice and updates.' }, { ru: '3 000 — 7 000 ₽/мес', en: '3 000 — 7 000 ₽/mo' }, null]
    ],
    packs: [
      [{ ru: 'Запуск продукта', en: 'Product launch' }, { ru: 'Лид-магнит + воронка прогрева + напоминания о вебинаре.', en: 'Lead magnet + nurture funnel + webinar reminders.' }, '10 000 ₽', '8 000 ₽'],
      [{ ru: 'Автоматизация эксперта', en: 'Expert automation' }, { ru: 'Автоответчик + сбор заявок + рассылка контента.', en: 'Auto-reply + lead capture + content delivery.' }, '12 000 ₽', '9 000 ₽'],
      [{ ru: 'Вовлечение аудитории', en: 'Audience engagement' }, { ru: 'Квиз + геймификация + лид-магнит.', en: 'Quiz + gamification + lead magnet.' }, '15 000 ₽', '12 000 ₽']
    ]
  },
  {
    id: 'tilda', num: '02', tab: { ru: 'Сайты', en: 'Websites' },
    title: { ru: 'Сайты на Tilda', en: 'Websites on Tilda' },
    lead: { ru: 'Дизайн и сборка сайтов, которые выглядят профессионально и приводят пользователя к действию.', en: 'Design and build of websites that look professional and drive action.' },
    items: [
      [{ ru: 'Лендинг на Tilda', en: 'Tilda landing page' }, { ru: 'Структура, дизайн, сборка блоков, адаптив и формы.', en: 'Structure, design, block build, responsive layout and forms.' }, '2 000 — 30 000 ₽', { ru: '1–7 дней', en: '1–7 days' }],
      [{ ru: 'Многостраничный сайт', en: 'Multi-page website' }, { ru: 'Несколько страниц, единый стиль, навигация и адаптив.', en: 'Several pages, one style, navigation and responsive layout.' }, '10 000 — 50 000 ₽', { ru: '3–16 дней', en: '3–16 days' }],
      [{ ru: 'Интернет-магазин на Tilda', en: 'Online store on Tilda' }, { ru: 'Каталог с фильтрами, карточки товаров, корзина, оформление заказа и оплата.', en: 'Filtered catalog, product cards, cart, checkout and payment.' }, '15 000 — 50 000 ₽', { ru: '5–14 дней', en: '5–14 days' }],
      [{ ru: 'Перенос макета из Figma в Zero Block', en: 'Figma mockup to Zero Block' }, { ru: 'Вёрстка готового дизайна с сохранением сетки, шрифтов и анимаций, адаптив под все экраны.', en: 'Building a finished design while keeping grid, fonts and animation, responsive on every screen.' }, '5 000 — 25 000 ₽', { ru: '2–7 дней', en: '2–7 days' }],
      [{ ru: 'Оплата и интеграции', en: 'Payments and integrations' }, { ru: 'Приём оплат, передача заявок в CRM, уведомления в Telegram и на почту.', en: 'Payment acceptance, leads to CRM, notifications to Telegram and email.' }, '1 500 — 6 000 ₽', { ru: '1–2 дня', en: '1–2 days' }],
      [{ ru: 'Базовое SEO и Яндекс Метрика', en: 'Basic SEO and Yandex Metrica' }, { ru: 'Заголовки и описания страниц, карта сайта, подключение Метрики и целей на заявки.', en: 'Page titles and descriptions, sitemap, Metrica setup with goals on requests.' }, '2 000 — 5 000 ₽', { ru: '1–2 дня', en: '1–2 days' }],
      [{ ru: 'Доработка сайта на Tilda', en: 'Tilda site improvements' }, { ru: 'Правки существующего сайта, блоки, CSS, анимации, формы и адаптив.', en: 'Edits to an existing site: blocks, CSS, animation, forms, responsive.' }, '500 — 5 000 ₽', { ru: '1 час – 1 день', en: '1 hr – 1 day' }]
    ]
  },
  {
    id: 'figma', num: '03', tab: { ru: 'Дизайн', en: 'Design' },
    title: { ru: 'UX/UI-дизайн в Figma', en: 'UX/UI design in Figma' },
    lead: { ru: 'От идеи и прототипа до готового интерфейса в Figma.', en: 'From idea and prototype to a finished interface in Figma.' },
    items: [
      [{ ru: 'Прототип страницы', en: 'Page prototype' }, { ru: 'Структура, пользовательский путь и расположение основных блоков.', en: 'Structure, user journey and layout of key blocks.' }, '5 000 — 30 000 ₽', { ru: '3–10 дней', en: '3–10 days' }],
      [{ ru: 'UI-дизайн', en: 'UI design' }, { ru: 'Визуальная концепция, типографика, цвета и компоненты.', en: 'Visual concept, typography, colors and components.' }, '5 000 — 30 000 ₽', { ru: '3–10 дней', en: '3–10 days' }],
      [{ ru: 'Дизайн сайта в Figma', en: 'Website design in Figma' }, { ru: 'Полный дизайн страниц с адаптивными версиями.', en: 'Full page design with responsive versions.' }, '10 000 — 50 000 ₽', { ru: '5–15 дней', en: '5–15 days' }],
      [{ ru: 'Редизайн существующего сайта', en: 'Redesign of an existing site' }, { ru: 'Новая визуальная концепция и структура на основе того, что уже работает.', en: 'A new visual concept and structure built on what already works.' }, '8 000 — 30 000 ₽', { ru: '4–10 дней', en: '4–10 days' }],
      [{ ru: 'UX-аудит сайта', en: 'Website UX audit' }, { ru: 'Разбор, где посетители теряются и уходят, со списком конкретных правок.', en: 'Where visitors get lost and leave, with a list of concrete fixes.' }, '3 000 — 8 000 ₽', { ru: '1–3 дня', en: '1–3 days' }]
    ]
  },
  {
    id: 'getcourse', num: '04', tab: { ru: 'Онлайн-школы', en: 'Online schools' },
    title: { ru: 'Онлайн-школы на GetCourse', en: 'Online schools on GetCourse' },
    lead: { ru: 'Техническая часть онлайн-школы и автоматизация учебных процессов.', en: 'The technical side of an online school and automated learning flows.' },
    items: [
      [{ ru: 'Настройка курса', en: 'Course setup' }, { ru: 'Структура, уроки, доступы, личный кабинет и базовые настройки.', en: 'Structure, lessons, access, member area and base settings.' }, '10 000 — 30 000 ₽', { ru: '3–7 дней', en: '3–7 days' }],
      [{ ru: 'Автоматизация GetCourse', en: 'GetCourse automation' }, { ru: 'Триггеры, письма, доступы, действия пользователей и автоматические сценарии.', en: 'Triggers, emails, access, user actions and automated flows.' }, '1 000 — 15 000 ₽', { ru: '1–3 дня', en: '1–3 days' }],
      [{ ru: 'Техническая настройка школы', en: 'School tech setup' }, { ru: 'Помощь с технической частью, интеграциями и настройкой процессов.', en: 'Help with the tech side, integrations and processes.' }, '1 000 — 15 000 ₽', { ru: '1–3 дня', en: '1–3 days' }],
      [{ ru: 'Лендинг программы на GetCourse', en: 'Program landing page on GetCourse' }, { ru: 'Страница курса или потока с формой записи и оплатой.', en: 'A course or cohort page with sign-up form and payment.' }, '5 000 — 15 000 ₽', { ru: '2–5 дней', en: '2–5 days' }],
      [{ ru: 'Оформление кабинета и каталога курсов', en: 'Member area and catalog styling' }, { ru: 'Карточки курсов в стиле школы, статусы и прогресс вместо стандартных плиток.', en: 'Branded course cards, statuses and progress instead of default tiles.' }, '5 000 — 15 000 ₽', { ru: '2–5 дней', en: '2–5 days' }],
      [{ ru: 'Ежемесячное сопровождение школы', en: 'Monthly school support' }, { ru: 'Заливка уроков, запуск потоков, правки рассылок и процессов.', en: 'Uploading lessons, launching cohorts, fixing emails and processes.' }, { ru: '5 000 — 15 000 ₽/мес', en: '5 000 — 15 000 ₽/mo' }, null]
    ]
  },
  {
    id: 'webinar', num: '05', tab: { ru: 'Вебинары и рассылки', en: 'Webinars & email' },
    title: { ru: 'Вебинары и рассылки', en: 'Webinars & email' },
    lead: { ru: 'Эфиры и письма, которые прогревают аудиторию и возвращают тех, кто не купил сразу.', en: 'Live streams and emails that warm up your audience and bring back those who did not buy right away.' },
    items: [
      [{ ru: 'Вебинарная комната в Bizon365', en: 'Bizon365 webinar room' }, { ru: 'Настройка комнаты, регистрации, кнопок и баннеров для эфира.', en: 'Room, registration, buttons and banners for the stream.' }, '3 000 — 8 000 ₽', { ru: '1–2 дня', en: '1–2 days' }],
      [{ ru: 'Автовебинар под ключ', en: 'Turnkey automated webinar' }, { ru: 'Комната, регистрация, напоминания и повторные показы по расписанию.', en: 'Room, registration, reminders and scheduled replays.' }, '8 000 — 20 000 ₽', { ru: '3–5 дней', en: '3–5 days' }],
      [{ ru: 'Цепочка писем', en: 'Email sequence' }, { ru: 'Прогревающая или приветственная серия из 5–7 писем: тексты, вёрстка, запуск.', en: 'A 5–7 email nurture or welcome series: copy, layout, launch.' }, '4 000 — 10 000 ₽', { ru: '2–4 дня', en: '2–4 days' }],
      [{ ru: 'Настройка email-сервиса', en: 'Email service setup' }, { ru: 'Unisender или GetCourse: база, сегменты, шаблон письма, подключение формы с сайта.', en: 'Unisender or GetCourse: list, segments, email template, site form connection.' }, '2 000 — 6 000 ₽', { ru: '1–2 дня', en: '1–2 days' }]
    ]
  }
];

const ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const CLOCK = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
const val = (v) => (typeof v === 'string' ? { ru: v, en: v } : v);

module.exports = function render() {
  const d = new Dict();
  const order = (g, name) => SITE + 'form?service=' + g.id + '&task=' + encodeURIComponent(name.ru);

  const tabs = GROUPS.map((g, i) =>
    '<button type="button" role="tab" id="pt-' + g.id + '" aria-controls="pp-' + g.id + '" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '">' +
      '<i>' + g.num + '</i>' + d.tag('span', 'pr.tab.' + g.id, g.tab) + '</button>').join('');

  const panels = GROUPS.map((g, i) => {
    const items = g.items.map((it, j) => {
      const [name, desc, price, time] = it;
      const k = 'pr.' + g.id + '.' + j;
      const p = val(price);
      return '<li class="pk-pitem">' +
        '<div class="pk-pitem__main">' + d.tag('h3', k + '.n', name, 'class="pk-h3"') + d.tag('p', k + '.d', desc) + '</div>' +
        '<div class="pk-pitem__side">' +
          (p.ru === p.en ? '<p class="pk-pitem__price">' + esc(p.ru) + '</p>' : d.tag('p', k + '.p', p, 'class="pk-pitem__price"')) +
          (time ? '<p class="pk-pitem__time">' + CLOCK + d.tag('span', k + '.t', time) + '</p>' : '') +
          '<a class="pk-pitem__cta" href="' + esc(order(g, name)) + '">' + d.tag('span', 'pr.order', { ru: 'Заказать', en: 'Order' }) + ARROW + '</a>' +
        '</div></li>';
    }).join('');
    const packs = (g.packs || []).map((pk, j) => {
      const [name, desc, oldP, newP] = pk;
      const k = 'pr.' + g.id + '.pk' + j;
      return '<li class="pk-pack pk-reveal" style="--d:' + j + '">' +
        d.tag('p', 'pr.pack', { ru: 'Выгодный пакет', en: 'Bundle deal' }, 'class="pk-eyebrow"') +
        d.tag('h3', k + '.n', name, 'class="pk-h3"') + d.tag('p', k + '.d', desc, 'class="pk-muted"') +
        '<p class="pk-pack__price"><s>' + esc(oldP) + '</s><b>' + esc(newP) + '</b></p>' +
        '<a class="pk-btn pk-btn--sm" href="' + esc(order(g, { ru: 'Пакет «' + name.ru + '»' })) + '">' + d.tag('span', 'pr.take', { ru: 'Взять пакет', en: 'Get the bundle' }) + ARROW + '</a></li>';
    }).join('');
    return '<div class="pk-ppanel" role="tabpanel" id="pp-' + g.id + '" aria-labelledby="pt-' + g.id + '"' + (i === 0 ? '' : ' hidden') + '>' +
      '<div class="pk-ppanel__head"><p class="pk-ppanel__num">' + g.num + ' / ' + g.id.toUpperCase() + '</p>' +
        d.tag('h2', 'pr.' + g.id + '.title', g.title, 'class="pk-h2"') + d.tag('p', 'pr.' + g.id + '.lead', g.lead, 'class="pk-lead"') +
        '<a class="pk-link" href="' + SITE + g.id + '">' + d.tag('span', 'pr.cases', { ru: 'Смотреть кейсы направления', en: 'See cases in this area' }) + ARROW + '</a>' +
      '</div>' +
      '<ul class="pk-plist">' + items + '</ul>' +
      (packs ? '<ul class="pk-packs">' + packs + '</ul>' : '') +
    '</div>';
  }).join('');

  const html = '' +
    '<section class="pk-hero pk-dirhero" aria-labelledby="pk-h1"><div class="pk-wrap">' +
      d.tag('p', 'pr.eye', { ru: 'Услуги и цены', en: 'Services & pricing' }, 'class="pk-eyebrow pk-reveal"') +
      d.tag('h1', 'pr.h1', { ru: 'Прозрачные цены на весь техстек', en: 'Transparent pricing across the whole tech stack' }, 'class="pk-h1 pk-reveal" id="pk-h1" style="--d:1"') +
      d.tag('p', 'pr.lead', { ru: 'От отдельного бота или лендинга до системы, где сайт, бот, школа и рассылки работают вместе. Точную стоимость назову после короткого брифа.', en: 'From a single bot or landing page to a system where site, bot, school and email work together. I’ll quote the exact price after a short brief.' }, 'class="pk-lead pk-reveal" style="--d:2"') +
    '</div></section>' +
    '<section class="pk-section" style="padding-top:0"><div class="pk-wrap">' +
      '<div class="pk-ptabs pk-reveal" role="tablist" aria-label="Направления" data-i18n-attr="aria-label:pr.tabs">' + tabs + '</div>' +
      panels +
    '</div></section>' +
    '<section class="pk-section" style="padding-top:0" aria-labelledby="pk-combo-h"><div class="pk-wrap">' +
      '<div class="pk-combo pk-reveal">' +
        d.tag('p', 'pr.combo.eye', { ru: 'Комплексные проекты', en: 'End-to-end projects' }, 'class="pk-eyebrow"') +
        d.tag('h2', 'pr.combo.h', { ru: 'Можно собрать всю систему в одном проекте', en: 'Build the whole system in one project' }, 'class="pk-h2" id="pk-combo-h"') +
        d.tag('p', 'pr.combo.p', { ru: 'Если нужен не отдельный сайт или бот, а полноценная система, — объединю дизайн, сайт, онлайн-школу и автоматизацию в одну связку. Стоимость считается под задачу: вы платите за результат, а не за лишние часы.', en: 'If you need a complete system rather than a single site or bot, I’ll combine design, website, online school and automation into one chain. Pricing is per task: you pay for the result, not extra hours.' }, 'class="pk-lead"') +
        '<ol class="pk-chain" aria-label="Figma → Tilda → GetCourse → Salebot"><li>Figma</li><li>Tilda</li><li>GetCourse</li><li>Salebot</li></ol>' +
        '<div class="pk-final__btns"><a class="pk-btn pk-magnet" href="' + SITE + 'form?service=complex">' + d.tag('span', 'pr.combo.cta', { ru: 'Обсудить систему под ключ', en: 'Discuss a turnkey system' }) + ARROW + '</a></div>' +
      '</div>' +
    '</div></section>';

  d.en['pr.tabs'] = 'Areas';
  const offers = [];
  GROUPS.forEach((g) => g.items.forEach((it) => offers.push({ '@type': 'Offer', name: it[0].ru, description: it[1].ru, priceCurrency: 'RUB', price: String(val(it[2]).ru).replace(/[^\d—–-]/g, '').split(/[—–-]/)[0] })));
  return {
    html,
    en: d.en,
    jsonld: JSON.stringify({ '@context': 'https://schema.org', '@type': 'OfferCatalog', name: 'Услуги и цены — Павел Корчагин', url: SITE + 'price', itemListElement: offers }, null, 2)
  };
};
