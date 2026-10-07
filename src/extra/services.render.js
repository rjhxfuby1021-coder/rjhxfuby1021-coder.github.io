/*
  Страницы услуг под поисковые запросы: /uslugi/<slug>.
  Каждая — H1 под запрос, для кого, цены из прайса, этапы, свои кейсы, квиз и частые вопросы.
*/
const { Dict, esc } = require('../pages/_dict.js');
const { GROUPS } = require('../pages/price.render.js');
const { renderQuiz } = require('./quiz.js');

const SITE = 'https://texspeckps.ru/';
const L = (ru, en) => ({ ru, en });
const val = (v) => (typeof v === 'string' ? { ru: v, en: v } : v);
const ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const CLOCK = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
const TG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.9 4.3l-3.2 15.1c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-5 9.1-8.2c.4-.4-.1-.6-.6-.2L6.2 13.1l-4.8-1.5c-1-.3-1.1-1 .2-1.5l18.9-7.3c.9-.3 1.6.2 1.4 1.5z"/></svg>';

const SERVICES = [
  {
    slug: 'uslugi/chat-boty-salebot', dir: 'salebot', cases: ['sb-jador', 'sb-cafe', 'sb-channel'],
    name: 'Чат-боты на Salebot',
    title: 'Создание чат-бота в Telegram на Salebot — цены и сроки',
    desc: 'Разработка чат-ботов на Salebot: воронки продаж, сбор заявок, ИИ-ассистенты, онлайн-запись и платные каналы. Цены от 2 000 ₽, запуск от 1 дня.',
    eye: L('Чат-боты · Salebot · Telegram', 'Chatbots · Salebot · Telegram'),
    h1: L('Создание чат-бота в Telegram на Salebot', 'Telegram chatbot development on Salebot'),
    lead: L('Бот, который отвечает клиентам, собирает заявки, записывает и продаёт — круглосуточно, пока вы заняты делом. Настраиваю сценарий, интеграции и ИИ под вашу задачу.',
      'A bot that answers clients, captures leads, books and sells around the clock while you run the business. I set up the flow, integrations and AI for your task.'),
    who: [
      [L('Салоны и сервисы', 'Salons and services'), L('Запись на свободное время и напоминания о визите без администратора.', 'Booking into free slots and visit reminders without a receptionist.')],
      [L('Эксперты и онлайн-школы', 'Experts and online schools'), L('Воронки прогрева, выдача лид-магнитов и доступ к курсу после оплаты.', 'Nurture funnels, lead magnets and course access after payment.')],
      [L('Кафе и магазины', 'Cafés and shops'), L('Меню, заказы, отзывы за промокод и связь с руководителем.', 'Menus, orders, reviews for a promo code and a line to the manager.')],
      [L('Авторы каналов', 'Channel owners'), L('Продажа доступа в платный канал, продление и удаление после срока.', 'Selling paid channel access, renewals and removal after expiry.')]
    ],
    faq: [
      [L('Сколько стоит чат-бот?', 'How much does a chatbot cost?'), L('Простой бот для заявок или лид-магнита — от 2 000 до 6 000 ₽. Воронка продаж — 5 000–15 000 ₽, ИИ-ассистент на базе знаний — 8 000–20 000 ₽. Точную цену называю после короткого брифа.', 'A simple lead or lead-magnet bot costs 2,000–6,000 ₽. A sales funnel is 5,000–15,000 ₽, a knowledge-base AI assistant 8,000–20,000 ₽. I quote the exact price after a short brief.')],
      [L('Сколько времени занимает запуск?', 'How long does launch take?'), L('Простой бот запускаю за 1–2 дня, воронку или бота с записью — за 3–5 дней, ИИ-ассистента — до недели вместе с тестами.', 'A simple bot launches in 1–2 days, a funnel or booking bot in 3–5 days, an AI assistant within a week including testing.')],
      [L('Бот будет работать только в Telegram?', 'Will the bot work only on Telegram?'), L('Salebot подключает один сценарий сразу к нескольким каналам: Telegram, VK, WhatsApp, виджет на сайте. Какие нужны именно вам, решаем на брифе.', 'Salebot connects one flow to several channels at once: Telegram, VK, WhatsApp and a website widget. We pick yours during the brief.')],
      [L('Можно доработать бота, который уже есть?', 'Can you improve an existing bot?'), L('Да. Правки в готовом боте стоят от 500 ₽, новая ветка или интеграция — от 2 000 ₽. Могу взять бота на ежемесячную поддержку.', 'Yes. Fixes to an existing bot start at 500 ₽, a new branch or integration at 2,000 ₽. I can also take the bot on monthly support.')]
    ]
  },
  {
    slug: 'uslugi/sajty-na-tilda', dir: 'tilda', cases: ['ekskurpiter', 'cafe-shop', 'maxfit'],
    name: 'Сайты на Tilda',
    title: 'Создание сайта на Tilda под ключ — лендинг, магазин, Zero Block',
    desc: 'Разработка сайтов на Tilda под ключ: лендинги, многостраничные сайты, интернет-магазины, вёрстка макетов из Figma в Zero Block. Адаптив, SEO и Метрика.',
    eye: L('Сайты · Tilda · Zero Block', 'Websites · Tilda · Zero Block'),
    h1: L('Создание сайта на Tilda под ключ', 'Turnkey website development on Tilda'),
    lead: L('Лендинг, многостраничный сайт или интернет-магазин, который ведёт посетителя к заявке. Структура, дизайн, сборка, адаптив, формы и базовое SEO — всё в одних руках.',
      'A landing page, multi-page site or online store that leads visitors to a request. Structure, design, build, responsive layout, forms and basic SEO — all in one pair of hands.'),
    who: [
      [L('Услуги и сервисы', 'Services'), L('Лендинг под одну услугу с понятным оффером, ценой и формой заявки.', 'A landing page for one offer with a clear pitch, price and request form.')],
      [L('Онлайн-школы', 'Online schools'), L('Сайт курса или школы: программа, преподаватели и путь до записи.', 'A course or school site: curriculum, teachers and a path to sign-up.')],
      [L('Кафе и магазины', 'Cafés and shops'), L('Каталог, корзина, доставка и приём оплаты прямо на сайте.', 'Catalog, cart, delivery and payment right on the site.')],
      [L('Дизайнеры с готовым макетом', 'Designers with a mockup'), L('Вёрстка макета из Figma в Zero Block с сохранением сетки и анимаций.', 'Building a Figma mockup in Zero Block while keeping the grid and animation.')]
    ],
    faq: [
      [L('Сколько стоит сайт на Tilda?', 'How much does a Tilda site cost?'), L('Лендинг — от 2 000 до 30 000 ₽ в зависимости от объёма и дизайна, многостраничный сайт — 10 000–50 000 ₽, интернет-магазин — 15 000–50 000 ₽.', 'A landing page costs 2,000–30,000 ₽ depending on scope and design, a multi-page site 10,000–50,000 ₽, an online store 15,000–50,000 ₽.')],
      [L('Сколько делается лендинг?', 'How long does a landing page take?'), L('От 1 до 7 дней. Сложный Zero Block с анимацией — от 2–3 недель. Сроки фиксируем до начала работы.', 'From 1 to 7 days. A complex animated Zero Block takes 2–3 weeks or more. We fix the timeline before starting.')],
      [L('Нужен ли свой дизайн?', 'Do I need my own design?'), L('Нет. Могу спроектировать сайт с нуля в Figma, сверстать ваш готовый макет или собрать сайт по примерам, которые вам нравятся.', 'No. I can design the site from scratch in Figma, build your ready mockup or assemble the site from references you like.')],
      [L('Подключите оплату и заявки в Telegram?', 'Will you connect payments and Telegram leads?'), L('Да: приём оплат, передача заявок в CRM, уведомления в Telegram и на почту, Яндекс Метрика с целями на заявки.', 'Yes: payments, leads to CRM, notifications to Telegram and email, and Yandex Metrica with request goals.')]
    ]
  },
  {
    slug: 'uslugi/dizajn-v-figma', dir: 'figma', cases: ['figma-webinar', 'fold8-ozon'],
    name: 'Дизайн в Figma',
    title: 'UX/UI-дизайн сайта в Figma — прототип, макет, редизайн',
    desc: 'Дизайн сайтов и интерфейсов в Figma: прототипы, UI-дизайн, адаптивные макеты, редизайн и UX-аудит. Макеты сразу готовы к вёрстке на Tilda.',
    eye: L('Дизайн · Figma · UX/UI', 'Design · Figma · UX/UI'),
    h1: L('Дизайн сайта в Figma: от прототипа до макета', 'Website design in Figma: from prototype to mockup'),
    lead: L('Сначала сценарий и каркас, потом визуал. Макеты, которые ведут человека к действию и сразу готовы к вёрстке — без сюрпризов на этапе сборки.',
      'Scenario and wireframe first, visuals second. Mockups that lead people to action and are ready to build — no surprises at the build stage.'),
    who: [
      [L('Новый проект', 'A new project'), L('Прототип и дизайн сайта с нуля под вашу аудиторию и оффер.', 'A prototype and site design from scratch for your audience and offer.')],
      [L('Сайт, который не продаёт', 'A site that does not sell'), L('UX-аудит и редизайн: где теряются посетители и что поменять.', 'A UX audit and redesign: where visitors drop off and what to change.')],
      [L('Продавцы на маркетплейсах', 'Marketplace sellers'), L('Инфографика для карточек товара, которая читается в ленте каталога.', 'Product card infographics that read in the catalog feed.')],
      [L('Команды с разработчиком', 'Teams with a developer'), L('Аккуратные макеты с компонентами и адаптивом для передачи в вёрстку.', 'Clean mockups with components and responsive states for handoff.')]
    ],
    faq: [
      [L('Сколько стоит дизайн сайта?', 'How much does a website design cost?'), L('Прототип страницы или UI-дизайн — 5 000–30 000 ₽, полный дизайн сайта с адаптивом — 10 000–50 000 ₽, UX-аудит — 3 000–8 000 ₽.', 'A page prototype or UI design costs 5,000–30,000 ₽, a full responsive site design 10,000–50,000 ₽, a UX audit 3,000–8,000 ₽.')],
      [L('Что я получу в конце?', 'What do I get at the end?'), L('Файл Figma с экранами, компонентами и адаптивными версиями. По желанию — сразу вёрстку на Tilda.', 'A Figma file with screens, components and responsive versions. Optionally, the build on Tilda right away.')],
      [L('Сколько правок входит?', 'How many revisions are included?'), L('Согласовываем структуру до визуала, поэтому крупных переделок обычно нет. Правки в рамках задачи вношу до результата.', 'We agree on structure before visuals, so major rework is rare. I make revisions within scope until it is right.')],
      [L('Делаете инфографику для маркетплейсов?', 'Do you make marketplace infographics?'), L('Да, для карточек Ozon и Wildberries: серия слайдов с главными аргументами, характеристиками и единым стилем.', 'Yes, for Ozon and Wildberries cards: a slide set with key arguments, specs and a consistent style.')]
    ]
  },
  {
    slug: 'uslugi/nastrojka-getcourse', dir: 'getcourse', cases: ['pro-technik'],
    name: 'Настройка GetCourse',
    title: 'Настройка GetCourse под ключ — курсы, процессы, рассылки',
    desc: 'Техническая настройка онлайн-школы на GetCourse: курсы и доступы, процессы и автоматизации, лендинги программ, оформление кабинета, сопровождение.',
    eye: L('Онлайн-школы · GetCourse', 'Online schools · GetCourse'),
    h1: L('Настройка GetCourse для онлайн-школы', 'GetCourse setup for an online school'),
    lead: L('Техническая часть школы: курсы, доступы, процессы, письма, лендинги программ и кабинет ученика. Школа работает сама — вы занимаетесь контентом.',
      'The technical side of your school: courses, access, processes, emails, program pages and the student area. The school runs itself while you focus on content.'),
    who: [
      [L('Запуск школы', 'Launching a school'), L('Структура курса, уроки, доступы и приём оплат с нуля.', 'Course structure, lessons, access and payments from scratch.')],
      [L('Работающая школа', 'A running school'), L('Автоматизации и процессы, чтобы убрать ручную работу кураторов.', 'Automations and processes to remove manual curator work.')],
      [L('Новый поток', 'A new cohort'), L('Лендинг программы, форма записи и цепочка писем по шаблону.', 'A program landing page, sign-up form and email sequence from a template.')],
      [L('Эксперты без техспециалиста', 'Experts without a tech specialist'), L('Ежемесячное сопровождение: уроки, потоки, правки рассылок.', 'Monthly support: lessons, cohorts and email fixes.')]
    ],
    faq: [
      [L('Сколько стоит настройка GetCourse?', 'How much does GetCourse setup cost?'), L('Настройка курса — 10 000–30 000 ₽, отдельные автоматизации — от 1 000 ₽, лендинг программы и оформление кабинета — 5 000–15 000 ₽.', 'Course setup costs 10,000–30,000 ₽, individual automations from 1,000 ₽, a program landing page or styled member area 5,000–15,000 ₽.')],
      [L('Можно переделать стандартный кабинет?', 'Can you restyle the default member area?'), L('Да. Делаю карточки курсов в стиле школы, статусы «доступно / пройдено» и прогресс-бары вместо стандартных плиток.', 'Yes. I build branded course cards, “available / completed” statuses and progress bars instead of the default tiles.')],
      [L('Подключите бота и рассылки?', 'Will you connect a bot and emails?'), L('Да: письма в GetCourse, бот на Salebot для связи с учениками и напоминаний, интеграции с другими сервисами.', 'Yes: GetCourse emails, a Salebot bot for student communication and reminders, and integrations with other services.')],
      [L('Работаете на постоянной основе?', 'Do you work on an ongoing basis?'), L('Да, сопровождение школы — 5 000–15 000 ₽ в месяц: заливка уроков, запуск потоков, правки процессов.', 'Yes, school support is 5,000–15,000 ₽ a month: uploading lessons, launching cohorts, fixing processes.')]
    ]
  },
  {
    slug: 'uslugi/vebinary-i-rassylki', dir: 'webinar', cases: ['sb-autowebinar', 'webinar-landing'],
    name: 'Вебинары и рассылки',
    title: 'Настройка автовебинара и email-рассылок — Bizon365, GetCourse',
    desc: 'Настройка вебинарных комнат и автовебинаров в Bizon365, цепочки писем и email-сервисы: прогрев аудитории и возврат тех, кто не купил сразу.',
    eye: L('Вебинары · Bizon365 · Email', 'Webinars · Bizon365 · Email'),
    h1: L('Настройка автовебинара и рассылок', 'Automated webinar and email setup'),
    lead: L('Эфиры и письма, которые прогревают аудиторию и возвращают тех, кто не купил сразу. Комната, регистрация, напоминания, повторы и цепочки писем — под ключ.',
      'Streams and emails that warm up your audience and bring back those who did not buy right away. Room, registration, reminders, replays and email sequences — turnkey.'),
    who: [
      [L('Эксперты с продуктом', 'Experts with a product'), L('Автовебинар, который продаёт по расписанию без вашего участия.', 'An automated webinar that sells on schedule without you.')],
      [L('Живые эфиры', 'Live streams'), L('Комната, регистрация, баннеры и кнопки продаж для трансляции.', 'Room, registration, banners and sales buttons for the stream.')],
      [L('Школы с базой', 'Schools with a list'), L('Цепочки писем для прогрева, возврата и допродаж.', 'Email sequences for nurturing, win-back and upsells.')],
      [L('Запуск с нуля', 'Starting from zero'), L('Сервис рассылок, сегменты и форма подписки с сайта.', 'An email service, segments and a site sign-up form.')]
    ],
    faq: [
      [L('Сколько стоит автовебинар?', 'How much does an automated webinar cost?'), L('Автовебинар под ключ — 8 000–20 000 ₽: комната, регистрация, напоминания и повторные показы по расписанию.', 'A turnkey automated webinar costs 8,000–20,000 ₽: room, registration, reminders and scheduled replays.')],
      [L('На какой платформе делаете?', 'Which platform do you use?'), L('Вебинары — в Bizon365, рассылки — в Unisender или GetCourse. Если у вас уже есть сервис, работаю в нём.', 'Webinars run on Bizon365, emails on Unisender or GetCourse. If you already have a service, I work in it.')],
      [L('Поможете вернуть тех, кто не пришёл?', 'Can you bring back no-shows?'), L('Да: бот и письма напоминают о повторном показе и отправляют запись тем, кто пропустил эфир.', 'Yes: the bot and emails remind people of the replay and send the recording to those who missed it.')],
      [L('Напишете тексты писем?', 'Will you write the email copy?'), L('Цепочка из 5–7 писем включает тексты, вёрстку и запуск — 4 000–10 000 ₽.', 'A 5–7 email sequence includes copy, layout and launch — 4,000–10,000 ₽.')]
    ]
  }
];

// Демо-бот в Telegram (папка test-bot): ссылка ?start=<код> открывает сценарий сразу
const BOT = 'https://t.me/Bot_PortfolioRabot';
const BOT_QR = require('fs').readFileSync(require('path').join(__dirname, '../../new/assets/bot-qr.svg'), 'utf8')
  .replace('<svg ', '<svg width="150" height="150" role="img" aria-label="QR-код бота" ');
const BOT_SCENARIOS = [
  ['webinar', '🎥', L('Автовебинар', 'Automated webinar'), L('Регистрация, напоминания, эфир, продажа и дожим', 'Sign-up, reminders, live stream, offer and follow-up')],
  ['channel', '🔐', L('Закрытый канал', 'Private channel'), L('Оплата подписки, доступ и продление', 'Subscription payment, access and renewal')],
  ['leadmagnet', '🎁', L('Лид-магнит', 'Lead magnet'), L('Гайд за подписку и прогрев', 'A guide for subscribing, then nurturing')],
  ['quiz', '🧮', L('Тест с баллами', 'Scored quiz'), L('Опрос, подсчёт и результат по баллам', 'Questions, scoring and a result by points')],
  ['wheel', '🎡', L('Колесо фортуны', 'Wheel of fortune'), L('Игра со случайным призом', 'A game with a random prize')],
  ['booking', '📅', L('Онлайн-запись', 'Online booking'), L('Услуга, день и время, напоминания о визите', 'Service, day and time, visit reminders')],
  ['leads', '📝', L('Сбор заявок', 'Lead capture'), L('Квалификация и контакт для менеджера', 'Qualification and a contact for the manager')],
  ['referral', '🤝', L('Реферальная программа', 'Referral program'), L('Личная ссылка, друзья и бонусы', 'Personal link, friends and bonuses')]
];
const DEMO = { salebot: null, webinar: ['webinar'] }; // где показывать: null — все сценарии

function renderDemo(d, dir) {
  const only = DEMO[dir];
  const list = only ? BOT_SCENARIOS.filter((x) => only.includes(x[0])) : BOT_SCENARIOS;
  const one = list.length === 1;
  const items = list.map(([code, ico, name, desc], i) =>
    '<li class="pk-reveal" style="--d:' + (i % 4) + '"><a class="pk-demo__item" href="' + BOT + '?start=' + code + '" target="_blank" rel="noopener">' +
      '<span class="pk-demo__ico" aria-hidden="true">' + ico + '</span>' +
      '<span class="pk-demo__txt">' + d.tag('b', 'dm.n.' + code, name) + d.tag('span', 'dm.d.' + code, desc) + '</span>' + ARROW + '</a></li>').join('');
  return '<section class="pk-section" id="demo" aria-labelledby="sv-demo"><div class="pk-wrap">' +
    '<div class="pk-demo__top">' +
      '<div class="pk-demo__hd">' +
        d.tag('p', 'dm.eye', L('Демо · Telegram', 'Demo · Telegram'), 'class="pk-eyebrow pk-reveal"') +
        (one
          ? d.tag('h2', 'dm.h1', L('Пройдите автовебинар в боте', 'Go through the webinar in the bot'), 'class="pk-h2 pk-reveal" id="sv-demo"') +
            d.tag('p', 'dm.p1', L('Регистрация, напоминания, эфир, продажа и дожим — та же цепочка, что получат ваши зрители, только паузы сокращены до секунд.', 'Sign-up, reminders, live stream, offer and follow-up — the same chain your viewers get, with pauses cut to seconds.'), 'class="pk-muted pk-reveal"')
          : d.tag('h2', 'dm.h', L('Протестируйте бота сами', 'Test the bot yourself'), 'class="pk-h2 pk-reveal" id="sv-demo"') +
            d.tag('p', 'dm.p', L('Восемь сценариев, которые я собираю для клиентов. Выберите любой — бот откроется в Telegram сразу на нём и разыграет его с вами, как с настоящим клиентом.', 'Eight flows I build for clients. Pick any — the bot opens in Telegram right on it and plays it out with you as a real customer.'), 'class="pk-muted pk-reveal"')) +
        '<div class="pk-hero__btns pk-reveal"><a class="pk-btn pk-magnet" href="' + BOT + '" target="_blank" rel="noopener">' + TG + d.tag('span', 'dm.btn', L('Открыть бота в Telegram', 'Open the bot in Telegram')) + '</a></div>' +
      '</div>' +
      '<figure class="pk-demo__qr pk-reveal">' + BOT_QR + d.tag('figcaption', 'dm.qr', L('Наведите камеру телефона', 'Point your phone camera')) + '</figure>' +
    '</div>' +
    '<ul class="pk-demo__list' + (one ? ' pk-demo__list--one' : '') + '">' + items + '</ul>' +
    d.tag('p', one ? 'dm.note1' : 'dm.note', one
      ? L('В меню бота — ещё семь сценариев: закрытый канал, лид-магнит, тест, колесо фортуны, запись, заявки и рефералка.', 'The bot menu has seven more flows: private channel, lead magnet, quiz, wheel of fortune, booking, leads and referrals.')
      : L('Бот настоящий: долгие паузы сокращены до секунд, оплата — демонстрационная. Выйти из сценария — кнопка «Главное меню».', 'The bot is real: long pauses are cut to seconds and payments are demo only. Leave a flow with the “Main menu” button.'), 'class="pk-muted pk-demo__note"') +
  '</div></section>';
}

const STEPS = [
  [L('Бриф', 'Brief'), L('Обсуждаем задачу, аудиторию и бюджет. Готовое ТЗ не нужно.', 'We discuss the task, audience and budget. No spec needed.')],
  [L('План и цена', 'Plan and price'), L('Фиксирую объём, сроки и стоимость до начала работы.', 'I fix scope, timeline and price before starting.')],
  [L('Работа', 'Build'), L('Собираю и показываю промежуточный результат.', 'I build and show progress along the way.')],
  [L('Запуск', 'Launch'), L('Тестирую на всех устройствах, запускаю и остаюсь на связи.', 'I test on every device, launch and stay in touch.')]
];

function renderService(s, cases) {
  const d = new Dict();
  const group = GROUPS.find((g) => g.id === s.dir);
  const k = 'sv.';
  const form = SITE + 'form?service=' + s.dir;
  const tg = 'https://t.me/PavelTexSpec?text=' + encodeURIComponent('Здравствуйте! Интересует: ' + s.name);

  const who = s.who.map((w, i) =>
    '<li class="pk-svc__who pk-reveal" style="--d:' + i + '">' + d.tag('h3', k + 'w' + i, w[0], 'class="pk-h3"') + d.tag('p', k + 'wd' + i, w[1], 'class="pk-muted"') + '</li>').join('');

  const items = group.items.map((it, j) => {
    const [name, desc, price, time] = it;
    const p = val(price);
    const pk = 'pr.' + group.id + '.' + j;
    return '<li class="pk-pitem">' +
      '<div class="pk-pitem__main">' + d.tag('h3', pk + '.n', name, 'class="pk-h3"') + d.tag('p', pk + '.d', desc) + '</div>' +
      '<div class="pk-pitem__side">' +
        (p.ru === p.en ? '<p class="pk-pitem__price">' + esc(p.ru) + '</p>' : d.tag('p', pk + '.p', p, 'class="pk-pitem__price"')) +
        (time ? '<p class="pk-pitem__time">' + CLOCK + d.tag('span', pk + '.t', time) + '</p>' : '') +
        '<a class="pk-pitem__cta" href="' + esc(form + '&task=' + encodeURIComponent(name.ru)) + '">' + d.tag('span', 'pr.order', L('Заказать', 'Order')) + ARROW + '</a>' +
      '</div></li>';
  }).join('');

  const steps = STEPS.map((st, i) =>
    '<li class="pk-svc__step pk-reveal" style="--d:' + i + '"><span class="pk-svc__n">0' + (i + 1) + '</span>' +
      d.tag('h3', 'sv.st' + i, st[0], 'class="pk-h3"') + d.tag('p', 'sv.std' + i, st[1], 'class="pk-muted"') + '</li>').join('');

  const caseCards = s.cases.map((id) => cases.find((c) => c.id === id)).filter(Boolean).map((c, i) =>
    '<li class="pk-reveal" style="--d:' + i + '"><a class="pk-svc__case" href="' + SITE + c.dir + '#' + esc(c.id) + '">' +
      (c.cover ? '<span class="pk-svc__cimg"><img src="' + esc(c.cover) + '" alt="" loading="lazy" decoding="async"></span>' : '') +
      '<span class="pk-svc__cbody">' + d.tag('small', 'sv.ct' + i, c.type) + d.tag('b', 'sv.cn' + i, c.title) + '</span>' +
    '</a></li>').join('');

  const faq = s.faq.map((f, i) =>
    '<details class="pk-reveal" style="--d:' + i + '"><summary>' + d.tag('span', k + 'q' + i, f[0]) + '<i aria-hidden="true"></i></summary>' + d.tag('p', k + 'a' + i, f[1]) + '</details>').join('');

  const others = SERVICES.filter((o) => o !== s).map((o) =>
    '<li><a class="pk-link" href="' + SITE + o.slug + '">' + d.tag('span', 'sv.o.' + o.dir, o.h1) + ARROW + '</a></li>').join('');

  const html = '' +
    '<section class="pk-hero pk-dirhero" aria-labelledby="pk-h1"><div class="pk-wrap">' +
      '<a class="pk-back pk-reveal" href="' + SITE + 'price">' + d.tag('span', 'sv.back', L('Все услуги и цены', 'All services & pricing')) + '</a>' +
      d.tag('p', k + 'eye', s.eye, 'class="pk-eyebrow pk-reveal"') +
      d.tag('h1', k + 'h1', s.h1, 'class="pk-h1 pk-reveal" id="pk-h1" style="--d:1"') +
      d.tag('p', k + 'lead', s.lead, 'class="pk-lead pk-reveal" style="--d:2"') +
      '<div class="pk-hero__btns pk-reveal" style="--d:3">' +
        '<a class="pk-btn pk-magnet" href="' + form + '">' + d.tag('span', 'sv.cta', L('Обсудить задачу', 'Discuss your task')) + ARROW + '</a>' +
        '<a class="pk-btn pk-btn--ghost pk-btn--tg" href="' + esc(tg) + '" target="_blank" rel="noopener">' + TG + d.tag('span', 'sv.tg', L('Написать в Telegram', 'Message on Telegram')) + '</a>' +
        (s.dir in DEMO ? '<a class="pk-btn pk-btn--ghost" href="#demo">' + d.tag('span', 'dm.try', L('Протестировать бота', 'Try the bot')) + '</a>' : '') +
      '</div>' +
    '</div></section>' +

    (s.dir in DEMO ? renderDemo(d, s.dir) : '') +

    '<section class="pk-section" aria-labelledby="sv-who"><div class="pk-wrap">' +
      d.tag('h2', 'sv.who.h', L('Кому подойдёт', 'Who it is for'), 'class="pk-h2 pk-reveal" id="sv-who"') +
      '<ul class="pk-svc__whos">' + who + '</ul>' +
    '</div></section>' +

    '<section class="pk-section" aria-labelledby="sv-price"><div class="pk-wrap pk-svc__cols">' +
      '<div class="pk-svc__side">' +
        d.tag('h2', 'sv.price.h', L('Цены и сроки', 'Prices and timelines'), 'class="pk-h2 pk-reveal" id="sv-price"') +
        d.tag('p', 'sv.price.p', L('Точную стоимость называю после брифа и фиксирую до начала работы.', 'I quote the exact price after the brief and fix it before starting.'), 'class="pk-muted pk-reveal"') +
      '</div>' +
      '<ul class="pk-plist">' + items + '</ul>' +
    '</div></section>' +

    '<section class="pk-section" aria-labelledby="sv-steps"><div class="pk-wrap">' +
      d.tag('h2', 'sv.steps.h', L('Как работаем', 'How we work'), 'class="pk-h2 pk-reveal" id="sv-steps"') +
      '<ol class="pk-svc__steps">' + steps + '</ol>' +
    '</div></section>' +

    (caseCards ? '<section class="pk-section" aria-labelledby="sv-cases"><div class="pk-wrap">' +
      '<div class="pk-svc__row">' + d.tag('h2', 'sv.cases.h', L('Примеры работ', 'Work examples'), 'class="pk-h2 pk-reveal" id="sv-cases"') +
        '<a class="pk-link" href="' + SITE + (s.dir === 'webinar' ? 'keys' : s.dir) + '">' + d.tag('span', 'sv.cases.all', L('Все кейсы направления', 'All cases in this area')) + ARROW + '</a></div>' +
      '<ul class="pk-svc__cases">' + caseCards + '</ul>' +
    '</div></section>' : '') +

    renderQuiz(d, s.dir) +

    '<section class="pk-section" aria-labelledby="sv-faq"><div class="pk-wrap pk-faq">' +
      '<div>' + d.tag('h2', 'sv.faq.h', L('Частые вопросы', 'Frequent questions'), 'class="pk-h2 pk-reveal" id="sv-faq"') + '</div>' +
      '<div class="pk-qa">' + faq + '</div>' +
    '</div></section>' +

    '<section class="pk-section" aria-labelledby="sv-more"><div class="pk-wrap">' +
      d.tag('h2', 'sv.more.h', L('Другие услуги', 'Other services'), 'class="pk-h3 pk-reveal" id="sv-more"') +
      '<ul class="pk-svc__others">' + others + '</ul>' +
    '</div></section>';

  const jsonld = JSON.stringify([
    { '@context': 'https://schema.org', '@type': 'Service', name: s.h1.ru, description: s.desc, url: SITE + s.slug, areaServed: 'RU',
      provider: { '@type': 'Person', name: 'Павел Корчагин', url: SITE },
      offers: group.items.map((it) => ({ '@type': 'Offer', name: it[0].ru, priceCurrency: 'RUB', price: String(val(it[2]).ru).replace(/[^\d—–-]/g, '').split(/[—–-]/)[0] })) },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: s.faq.map((f) => ({ '@type': 'Question', name: f[0].ru, acceptedAnswer: { '@type': 'Answer', text: f[1].ru } })) }
  ], null, 2);

  return { slug: s.slug, title: s.name, html, en: d.en, jsonld, nav: 'price',
    meta: { name: s.name, url: '/' + s.slug, title: s.title, desc: s.desc } };
}

const SERVICES_CSS = `
.pk-svc__whos { display: grid; gap: 12px; margin-top: 28px; }
@media (min-width: 720px) { .pk-svc__whos { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1080px) { .pk-svc__whos { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.pk-svc__who { display: grid; gap: 8px; align-content: start; padding: 22px; border-radius: 18px; background: var(--card); box-shadow: inset 0 0 0 1px var(--line); }
.pk-svc__cols { display: grid; gap: 28px; }
@media (min-width: 1080px) { .pk-svc__cols { grid-template-columns: 1fr 1.9fr; gap: 56px; align-items: start; } .pk-svc__side { position: sticky; top: 110px; } }
.pk-svc__side { display: grid; gap: 12px; }
.pk-svc__steps { display: grid; gap: 12px; margin-top: 28px; counter-reset: s; }
@media (min-width: 900px) { .pk-svc__steps { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.pk-svc__step { display: grid; gap: 8px; align-content: start; padding: 22px; border-radius: 18px; background: var(--card); box-shadow: inset 0 0 0 1px var(--line); }
.pk-svc__n { font: 600 .8rem/1 var(--display); color: var(--acc-text); letter-spacing: .08em; }
.pk-svc__row { display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: 14px; }
.pk-svc__cases { display: grid; gap: 14px; margin-top: 28px; }
@media (min-width: 720px) { .pk-svc__cases { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.pk-svc__case { display: grid; border-radius: 18px; overflow: hidden; background: var(--card); box-shadow: inset 0 0 0 1px var(--line); transition: transform .4s var(--ease), box-shadow .3s; height: 100%; }
.pk-svc__case:hover { transform: translateY(-3px); box-shadow: inset 0 0 0 1px var(--line2), var(--shadow); }
.pk-svc__cimg { aspect-ratio: 16 / 10; overflow: hidden; background: var(--card2); }
.pk-svc__cimg img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
.pk-svc__cbody { display: grid; gap: 6px; padding: 16px 18px 20px; }
.pk-svc__cbody small { font-size: .8rem; color: var(--acc-text); font-weight: 700; }
.pk-svc__cbody b { font: 600 1rem/1.3 var(--display); }
.pk-svc__others { display: flex; flex-wrap: wrap; gap: 10px 28px; margin-top: 16px; }
.pk-demo__top { display: grid; gap: 28px; align-items: end; }
@media (min-width: 760px) { .pk-demo__top { grid-template-columns: minmax(0, 1fr) auto; gap: 56px; } }
.pk-demo__hd { display: grid; gap: 14px; max-width: 720px; }
.pk-demo__qr { display: none; justify-items: center; gap: 8px; font-size: .85rem; color: var(--muted); text-align: center; }
@media (min-width: 760px) { .pk-demo__qr { display: grid; } }
.pk-demo__qr svg { padding: 10px; background: #fff; border-radius: 14px; }
.pk-demo__list { display: grid; gap: 12px; margin-top: 28px; }
@media (min-width: 560px) { .pk-demo__list { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1080px) { .pk-demo__list { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
@media (min-width: 560px) { .pk-demo__list--one { grid-template-columns: minmax(0, 520px); } }
.pk-demo__item { display: flex; align-items: flex-start; gap: 12px; height: 100%; padding: 18px; border-radius: 18px; background: var(--card); box-shadow: inset 0 0 0 1px var(--line); transition: transform .4s var(--ease), box-shadow .3s; }
.pk-demo__item:hover { transform: translateY(-3px); box-shadow: inset 0 0 0 1px var(--line2), var(--shadow); }
.pk-demo__item svg { flex: none; margin-top: 4px; color: var(--acc-text); }
.pk-demo__ico { font-size: 1.6rem; line-height: 1; flex: none; }
.pk-demo__txt { display: grid; gap: 4px; flex: 1; min-width: 0; }
.pk-demo__txt b { font: 600 1rem/1.3 var(--display); }
.pk-demo__txt span { font-size: .9rem; color: var(--muted); }
.pk-demo__note { margin-top: 18px; font-size: .9rem; }
`;

module.exports = function renderServices(cases) { return SERVICES.map((s) => renderService(s, cases)); };
module.exports.SERVICES = SERVICES;
module.exports.SERVICES_CSS = SERVICES_CSS;
