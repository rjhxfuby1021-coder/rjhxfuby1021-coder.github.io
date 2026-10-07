/* Демо-бот на сайте — собрано из test-bot (node build-web.js), руками не править */
(function () {
'use strict';
if (window.BotChat) return;
var defs = {}, cache = {};
function require(name) {
  name = name.replace(/^\.\//, '');
  if (cache[name]) return cache[name].exports;
  var m = { exports: {} };
  cache[name] = m;
  defs[name](m, m.exports, require);
  return m.exports;
}
defs["scenarios"] = function (module, exports, require) {
// Схема бота — копия проекта Salebot «Реклама» (#868040): приветствие, меню и 8 сценариев.
//
// Блок — это одно сообщение бота:
//   text     — текст (HTML-разметка Telegram, #{переменная} подставляется), или функция (v, ctx) => текст
//   buttons  — кнопки под сообщением: строки → кнопки { text, go } | { text, url }
//              у кнопки может быть set: (v) => {...} — что запомнить при нажатии
//   reply    — обычная клавиатура вместо кнопок под сообщением ({ text, contact: true } — «отправить номер»)
//   set      — что сделать с переменными при входе в блок
//   route    — блок без текста: сразу ведёт дальше, (v, ctx) => id следующего блока
//   next     — отложенные сообщения: [{ after: секунды, go, unless: (v) => true — не отправлять,
//              real: когда оно пришло бы в рабочем боте, hint: своя подпись вместо стандартной }]
//              (подпись «⏳ Следующее сообщение придёт само…» движок добавляет в конец сообщения)
//   cancel   — при входе в блок остановить все отложенные сообщения (как «удалять при смене состояния»)
//   wait     — бот ждёт от человека текст: 'phone'

module.exports = function scenarios(cfg) {
  const MENU = { text: '🏠 Главное меню', go: 'menu' };
  const WANT = { text: '💬 Хочу такого бота', url: cfg.CONTACT_LINK };

  const MENU_BUTTONS = [
    [{ text: '🎥 Автовебинар', go: 'web_start' }, { text: '🔐 Закрытый канал', go: 'ch_start' }],
    [{ text: '🎁 Лид-магнит', go: 'lm_start' }, { text: '🧮 Тест с баллами', go: 'quiz_start' }],
    [{ text: '🎡 Колесо фортуны', go: 'wh_start' }, { text: '📅 Онлайн-запись', go: 'bk_start' }],
    [{ text: '📝 Сбор заявок', go: 'ld_start' }, { text: '🤝 Реферальная программа', go: 'rf_start' }],
  ];

  const pick = (go, key, values) =>
    values.map((value) => ({ text: value, go, set: (v) => { v[key] = value; } }));
  const points = (go, answers) =>
    answers.map((text, i) => ({ text, go, set: (v) => { v.score = (v.score || 0) + i; } }));
  const later = (when, sec) =>
    `⏱ <i>В рабочем боте это сообщение придёт ${when}. В демо — через ${sec} сек.</i>\n\n`;

  const blocks = {
    // ───────────── Приветствие и меню ─────────────
    start: {
      cancel: true,
      text:
        '👋 Привет! Я — ассистент Павла Корчагина, технического специалиста по чат-ботам, сайтам и онлайн-школам.\n\n' +
        'Здесь можно вживую пройти 8 сценариев ботов, которые Павел собирает для клиентов. Выберите любой — я разыграю его так, будто вы настоящий клиент.\n\n' +
        '⏱ Долгие паузы (часы и дни) в демо сокращены до секунд — я подпишу, когда сообщение пришло бы в рабочем боте.\n\n' +
        '🏠 Из любого сценария можно выйти кнопкой «Главное меню» — цепочка остановится.',
      buttons: MENU_BUTTONS,
    },
    menu: {
      cancel: true,
      text:
        '<b>Главное меню</b> — выберите сценарий 👇\n\n' +
        '🎥 <b>Автовебинар</b> — регистрация, напоминания, эфир, продажа и дожим\n' +
        '🔐 <b>Закрытый канал</b> — оплата подписки, доступ и продление\n' +
        '🎁 <b>Лид-магнит</b> — гайд за подписку и прогрев\n' +
        '🧮 <b>Тест с баллами</b> — опрос, подсчёт и результат по баллам\n' +
        '🎡 <b>Колесо фортуны</b> — игра со случайным призом\n' +
        '📅 <b>Онлайн-запись</b> — выбор услуги и времени, напоминания\n' +
        '📝 <b>Сбор заявок</b> — квалификация и контакт для менеджера\n' +
        '🤝 <b>Реферальная программа</b> — ссылка, друзья и бонусы',
      buttons: MENU_BUTTONS,
    },

    // ───────────── 1. Автовебинар ─────────────
    web_start: {
      cancel: true,
      set: (v) => { v.web_live = 0; v.web_sale = 0; },
      text:
        '🎥 <b>Сценарий «Автовебинар»</b>\n\n' +
        'Бот регистрирует человека на эфир, напоминает перед стартом, присылает ссылку, возвращает тех, кто не пришёл, продаёт в эфире и дожимает после.\n\n' +
        'Сейчас вы — участник вебинара «Как запустить продажи через чат-бота». Нажмите «Зарегистрироваться» 👇',
      buttons: [[{ text: '✅ Зарегистрироваться', go: 'web_reg' }], [MENU]],
    },
    web_reg: {
      cancel: true,
      text:
        '🎉 <b>Вы зарегистрированы!</b>\n\n' +
        'Вебинар «Как запустить продажи через чат-бота» — завтра в 19:00 МСК.\n\n' +
        'Не удаляйте этот чат: сюда придут напоминания и ссылка на эфир.',
      buttons: [[MENU]],
      next: [{ after: 10, go: 'web_morning', real: 'утром в день эфира' }],
    },
    web_morning: {
      text:
        later('утром в день эфира', 10) +
        '☀️ Доброе утро! Сегодня в 19:00 — вебинар.\n\n' +
        'Разберём:\n' +
        '• какие задачи бот закрывает вместо менеджера\n' +
        '• как бот доводит клиента до оплаты\n' +
        '• сколько стоит запуск и когда он окупается\n\n' +
        'До встречи вечером!',
      buttons: [[MENU]],
      next: [{ after: 10, go: 'web_hour', real: 'за час до начала' }],
    },
    web_hour: {
      text: later('за 1 час до старта', 10) + '⏰ Через час начинаем! Ссылка на эфир — по кнопке ниже.',
      buttons: [[{ text: '🔴 Войти в эфир', go: 'web_live' }], [MENU]],
      next: [{ after: 15, go: 'web_missed', unless: (v) => v.web_live, hint: 'Если не нажмёте «Войти в эфир», через 15 сек бот позовёт ещё раз (в рабочем боте — через 15 минут после старта).' }],
    },
    web_missed: {
      text:
        later('через 15 минут после старта, если человек не зашёл', 15) +
        '🔥 Мы уже начали! Первые 15 минут — самое важное. Заходите, пока не пропустили главное 👇',
      buttons: [[{ text: '🔴 Войти в эфир', go: 'web_live' }], [MENU]],
    },
    web_live: {
      set: (v) => { v.web_live = 1; },
      text:
        '🔴 <b>Вы в эфире</b>\n\n' +
        '<i>В рабочем боте кнопка открывает комнату вебинара — Bizon365, GetCourse или YouTube.</i>\n\n' +
        'Смотрите — ближе к концу эфира будет специальное предложение для участников.',
      buttons: [[MENU]],
      next: [{ after: 10, go: 'web_sale', unless: (v) => v.web_sale, real: 'через 40 минут эфира' }],
    },
    web_sale: {
      set: (v) => { v.web_sale = 1; },
      text:
        later('через 40 минут после начала эфира', 10) +
        '💥 <b>Предложение только для участников эфира</b>\n\n' +
        'Запуск чат-бота под ключ со скидкой 20% — до конца трансляции.',
      buttons: [[{ text: '💳 Оплатить (демо)', go: 'web_paid' }], [MENU]],
      next: [{ after: 15, go: 'web_followup', real: 'на следующий день после эфира' }],
    },
    web_followup: {
      text:
        later('на следующий день после эфира', 15) +
        '📼 Вчерашний эфир уже в записи — она доступна 24 часа.\n\n' +
        'Скидка 20% тоже действует до конца суток.',
      buttons: [
        [{ text: '▶️ Смотреть запись', go: 'web_record' }],
        [{ text: '💳 Оплатить (демо)', go: 'web_paid' }],
        [MENU],
      ],
      next: [{ after: 15, go: 'web_last', real: 'за 3 часа до конца скидки' }],
    },
    web_last: {
      text:
        later('за 3 часа до конца скидки', 15) +
        '⌛️ Через 3 часа запись удалится, а скидка сгорит. Успеете?',
      buttons: [[{ text: '💳 Оплатить (демо)', go: 'web_paid' }], [MENU]],
    },
    web_record: {
      text: '▶️ <i>Здесь бот присылает ссылку на запись эфира.</i>\n\nПосмотрели? Скидка ещё действует 👇',
      buttons: [[{ text: '💳 Оплатить (демо)', go: 'web_paid' }], [MENU]],
    },
    web_paid: {
      cancel: true,
      text:
        '✅ <b>Оплата прошла</b> <i>(демо — деньги не списаны)</i>\n\n' +
        'Доступ к продукту открыт, цепочка дожима остановлена.\n\n' +
        '<i>В рабочем боте здесь подключается ваша платёжная система: ЮKassa, Продамус, CloudPayments и другие.</i>\n\n' +
        'Это конец сценария. Хотите такой же автовебинар?',
      buttons: [[WANT], [MENU]],
    },

    // ───────────── 2. Закрытый канал ─────────────
    ch_start: {
      cancel: true,
      text:
        '🔐 <b>Сценарий «Закрытый канал по подписке»</b>\n\n' +
        'Бот продаёт доступ в закрытый канал или чат: принимает оплату, выдаёт ссылку, напоминает о продлении и сам удаляет из канала, когда подписка закончилась. Администратору не нужно следить за сроками.\n\n' +
        'Представьте, что вы хотите попасть в закрытый клуб 👇',
      buttons: [[{ text: '💳 Оформить подписку', go: 'ch_tariffs' }], [MENU]],
    },
    ch_tariffs: {
      text:
        'Выберите тариф <i>(цены для примера)</i>:\n\n' +
        '📅 1 месяц — 990 ₽\n' +
        '📅 3 месяца — 2 490 ₽ (выгода 16%)',
      buttons: [
        [{ text: '1 месяц — 990 ₽', go: 'ch_t1' }, { text: '3 месяца — 2 490 ₽', go: 'ch_t3' }],
        [MENU],
      ],
    },
    ch_t1: {
      set: (v) => { v.tariff = '1 месяц'; },
      text: 'Тариф: <b>1 месяц — 990 ₽</b>\n\n<i>В рабочем боте здесь открывается страница оплаты. В демо деньги не списываются.</i>',
      buttons: [[{ text: '✅ Оплатить (демо)', go: 'ch_paid' }], [MENU]],
    },
    ch_t3: {
      set: (v) => { v.tariff = '3 месяца'; },
      text: 'Тариф: <b>3 месяца — 2 490 ₽</b>\n\n<i>В рабочем боте здесь открывается страница оплаты. В демо деньги не списываются.</i>',
      buttons: [[{ text: '✅ Оплатить (демо)', go: 'ch_paid' }], [MENU]],
    },
    ch_paid: {
      cancel: true,
      text:
        '✅ <b>Оплата прошла</b> <i>(демо)</i>\n\n' +
        'Тариф: #{tariff}\n\n' +
        'Вот ваша ссылка в канал 👇\n' +
        '<i>В рабочем боте ссылка одноразовая и создаётся автоматически. В демо она ведёт в Telegram-канал Павла с кейсами.</i>',
      buttons: [[{ text: '🚪 Вступить в канал', url: cfg.CHANNEL_LINK }], [MENU]],
      next: [{ after: 15, go: 'ch_3days', real: 'за 3 дня до конца подписки' }],
    },
    ch_3days: {
      text:
        later('за 3 дня до окончания подписки', 15) +
        '🔔 Подписка заканчивается через 3 дня. Продлите заранее, чтобы не потерять доступ.',
      buttons: [[{ text: '🔄 Продлить', go: 'ch_tariffs' }], [MENU]],
      next: [{ after: 15, go: 'ch_lastday', real: 'в последний день подписки' }],
    },
    ch_lastday: {
      text:
        later('в последний день подписки', 15) +
        '⚠️ Сегодня последний день подписки. В 23:59 доступ к каналу закроется.',
      buttons: [[{ text: '🔄 Продлить', go: 'ch_tariffs' }], [MENU]],
      next: [{ after: 15, go: 'ch_ended', real: 'когда подписка закончится' }],
    },
    ch_ended: {
      text:
        later('после окончания подписки', 15) +
        '⛔️ Подписка закончилась — бот исключил вас из канала.\n' +
        '<i>В рабочем боте это происходит автоматически.</i>\n\n' +
        'Вернуться можно в любой момент 👇\n\n' +
        'Это конец сценария. Хотите такого бота для своего клуба?',
      buttons: [[{ text: '💳 Оформить подписку', go: 'ch_tariffs' }], [WANT], [MENU]],
    },

    // ───────────── 3. Лид-магнит ─────────────
    lm_start: {
      cancel: true,
      text:
        '🎁 <b>Сценарий «Лид-магнит»</b>\n\n' +
        'Бот выдаёт полезный материал в обмен на подписку, а потом аккуратно прогревает: присылает полезное и предлагает следующий шаг.\n\n' +
        'Заберите бесплатный гайд 👇',
      buttons: [[{ text: '📥 Получить гайд', go: 'lm_sub' }], [MENU]],
    },
    lm_sub: {
      text: () =>
        'Гайд — для подписчиков канала 🙌\n\n' +
        '1️⃣ Подпишитесь на канал\n' +
        '2️⃣ Нажмите «Я подписался»\n\n' +
        (cfg.CHANNEL_ID
          ? '<i>Бот сам проверит подписку и не выдаст гайд без неё.</i>'
          : '<i>В рабочем боте бот сам проверяет подписку и не выдаст гайд без неё. В демо проверка пропущена.</i>'),
      buttons: [
        [{ text: '📢 Перейти в канал', url: cfg.CHANNEL_LINK }],
        [{ text: '✅ Я подписался', go: 'lm_check' }],
        [MENU],
      ],
    },
    lm_check: {
      route: async (v, ctx) => ((await ctx.isSubscribed()) ? 'lm_guide' : 'lm_notsub'),
    },
    lm_notsub: {
      text: 'Пока не вижу вашей подписки 🤔\n\nПодпишитесь на канал и нажмите «Я подписался» ещё раз.',
      buttons: [
        [{ text: '📢 Перейти в канал', url: cfg.CHANNEL_LINK }],
        [{ text: '✅ Я подписался', go: 'lm_check' }],
        [MENU],
      ],
    },
    lm_guide: {
      cancel: true,
      text: '🎉 Держите гайд!\n\n📘 <b>«Лендинг на Tilda: 8 блоков, без которых он не приводит заявки»</b>',
      buttons: [[{ text: '📖 Открыть гайд', url: cfg.SITE + '/blog/lending-na-tilda-bloki' }], [MENU]],
      next: [{ after: 15, go: 'lm_warm1', real: 'через день' }],
    },
    lm_warm1: {
      text:
        later('через 1 день', 15) +
        '👋 Удалось посмотреть гайд?\n\n' +
        'Вот ещё полезный разбор: сколько стоит чат-бот и за что вы на самом деле платите.',
      buttons: [[{ text: '📖 Читать разбор', url: cfg.SITE + '/blog/skolko-stoit-chat-bot' }], [MENU]],
      next: [{ after: 15, go: 'lm_warm2', real: 'через 3 дня' }],
    },
    lm_warm2: {
      text:
        later('через 3 дня', 15) +
        '💡 Если хотите такую же систему — сайт, бот и прогрев — Павел соберёт её под ваш бизнес.\n\n' +
        'Первую консультацию по задаче он проводит бесплатно.\n\n' +
        'Это конец сценария.',
      buttons: [[WANT], [MENU]],
    },

    // ───────────── 4. Тест с баллами ─────────────
    quiz_start: {
      cancel: true,
      set: (v) => { v.score = 0; },
      text:
        '🧮 <b>Сценарий «Тест с подсчётом баллов»</b>\n\n' +
        'Бот задаёт вопросы, за каждый ответ начисляет баллы и в конце выдаёт результат под набранную сумму. Так делают диагностики, подбор продукта и квизы перед заявкой.\n\n' +
        'Тема: <b>«Готов ли ваш бизнес к автоматизации?»</b> — 4 вопроса.',
      buttons: [[{ text: '▶️ Начать тест', go: 'quiz_q1' }], [MENU]],
    },
    quiz_q1: {
      text: '<b>Вопрос 1 из 4</b>\n\nСколько заявок в день вы получаете?',
      buttons: [points('quiz_q2', ['До 5', '5–20', 'Больше 20']), [MENU]],
    },
    quiz_q2: {
      text: '<b>Вопрос 2 из 4</b>\n\nКак вы сейчас отвечаете клиентам?',
      buttons: [points('quiz_q3', ['Сам, вручную', 'Есть менеджер', 'Уже есть бот']), [MENU]],
    },
    quiz_q3: {
      text: '<b>Вопрос 3 из 4</b>\n\nГде теряются клиенты?',
      buttons: [points('quiz_q4', ['Не знаю', 'Долго отвечаем', 'Не доходят до оплаты']), [MENU]],
    },
    quiz_q4: {
      text: '<b>Вопрос 4 из 4</b>\n\nКак быстро нужен результат?',
      buttons: [points('quiz_calc', ['Пока изучаю', 'В этом месяце', 'Нужно вчера 🙂']), [MENU]],
    },
    quiz_calc: {
      cancel: true,
      text: '⏳ Считаю баллы…',
      next: [{ after: 2, go: 'quiz_result' }],
    },
    quiz_result: {
      route: (v) => (v.score <= 2 ? 'quiz_r1' : v.score <= 5 ? 'quiz_r2' : 'quiz_r3'),
    },
    quiz_r1: {
      text:
        '📊 <b>Ваш результат: #{score} из 8</b>\n\n' +
        '🌱 <b>Старт.</b> Пока заявок немного, и автоматизация всего сразу не окупится. Начните с одного простого бота: ответы на частые вопросы и сбор заявок. Он снимет рутину и покажет, где теряются клиенты.',
      buttons: [[{ text: '🔁 Пройти тест ещё раз', go: 'quiz_start' }], [WANT], [MENU]],
    },
    quiz_r2: {
      text:
        '📊 <b>Ваш результат: #{score} из 8</b>\n\n' +
        '🚀 <b>Пора автоматизировать.</b> Заявки уже идут, но часть теряется на ответах и дожиме. Бот-воронка с напоминаниями и передачей заявок менеджеру даст заметный прирост без найма людей.',
      buttons: [[{ text: '🔁 Пройти тест ещё раз', go: 'quiz_start' }], [WANT], [MENU]],
    },
    quiz_r3: {
      text:
        '📊 <b>Ваш результат: #{score} из 8</b>\n\n' +
        '🔥 <b>Вы теряете деньги каждый день.</b> Поток большой, а процесс держится на ручной работе. Нужна система: бот, CRM и оплаты в одной связке — чтобы каждая заявка доходила до сделки.',
      buttons: [[{ text: '🔁 Пройти тест ещё раз', go: 'quiz_start' }], [WANT], [MENU]],
    },

    // ───────────── 5. Колесо фортуны ─────────────
    wh_start: {
      cancel: true,
      set: (v) => { v.spins = 1; },
      text:
        '🎡 <b>Сценарий «Колесо фортуны»</b>\n\n' +
        'Игровая механика в боте: человек крутит колесо и получает случайный приз. Попытки выдаются за покупку, приглашённого друга или активность — это держит интерес и возвращает людей в бот.\n\n' +
        'У вас <b>1 попытка</b>. Крутим? 👇',
      buttons: [[{ text: '🎡 Крутить колесо', go: 'wh_spin' }], [MENU]],
    },
    wh_spin: {
      route: (v) => (v.spins > 0 ? 'wh_rolling' : 'wh_none'),
    },
    wh_rolling: {
      cancel: true,
      set: (v) => { v.spins -= 1; v.prize = 1 + Math.floor(Math.random() * 4); },
      text: '🎡 Колесо крутится… 🎰',
      next: [{ after: 2, go: 'wh_prize' }],
    },
    wh_prize: {
      route: (v) => 'wh_p' + v.prize,
    },
    wh_p1: {
      text:
        '🎉 <b>Вы выиграли:</b>\n🎁 Скидка 10% на первый заказ!\n\n' +
        '<i>В рабочем боте приз сохраняется в карточке клиента, а промокод приходит сообщением.</i>\n\n' +
        'Это конец сценария. Хотите такую игру в своём боте?',
      buttons: [[{ text: '🎡 Крутить ещё', go: 'wh_spin' }], [WANT], [MENU]],
    },
    wh_p2: {
      text:
        '🎉 <b>Вы выиграли:</b>\n🎁 Бесплатная консультация по вашей задаче!\n\n' +
        '<i>В рабочем боте приз сохраняется в карточке клиента, а промокод приходит сообщением.</i>\n\n' +
        'Это конец сценария. Хотите такую игру в своём боте?',
      buttons: [[{ text: '🎡 Крутить ещё', go: 'wh_spin' }], [WANT], [MENU]],
    },
    wh_p3: {
      text:
        '🎉 <b>Вы выиграли:</b>\n🎁 Чек-лист «Как бот увеличивает продажи»!\n\n' +
        '<i>В рабочем боте приз сохраняется в карточке клиента, а промокод приходит сообщением.</i>\n\n' +
        'Это конец сценария. Хотите такую игру в своём боте?',
      buttons: [[{ text: '🎡 Крутить ещё', go: 'wh_spin' }], [WANT], [MENU]],
    },
    wh_p4: {
      set: (v) => { v.spins += 1; },
      text: '🍀 <b>Выпало: ещё одна попытка!</b>\n\nКрутите снова 👇',
      buttons: [[{ text: '🎡 Крутить ещё', go: 'wh_spin' }], [MENU]],
    },
    wh_none: {
      text:
        '😔 Попытки закончились.\n\n' +
        '<i>В рабочем боте новую попытку дают, например, за покупку или приглашённого друга.</i>\n\n' +
        'Это конец сценария.',
      buttons: [[WANT], [MENU]],
    },

    // ───────────── 6. Онлайн-запись ─────────────
    bk_start: {
      cancel: true,
      text:
        '📅 <b>Сценарий «Онлайн-запись»</b>\n\n' +
        'Бот записывает клиента на услугу без администратора: показывает свободное время, подтверждает запись и напоминает о визите. Подходит салонам, клиникам, мастерам и репетиторам.\n\n' +
        '<i>В рабочем боте свободные окна берутся из расписания CRM. В демо — пример.</i>',
      buttons: [[{ text: '✍️ Записаться', go: 'bk_service' }], [MENU]],
    },
    bk_service: {
      text: 'Выберите услугу 👇',
      buttons: [pick('bk_day', 'service', ['💅 Маникюр', '✂️ Стрижка', '💬 Консультация']), [MENU]],
    },
    bk_day: {
      cancel: true,
      text: 'На какой день записать?',
      buttons: [pick('bk_time', 'day', ['Завтра', 'Послезавтра']), [MENU]],
    },
    bk_time: {
      text: 'Выберите время',
      buttons: [pick('bk_ok', 'time', ['10:00', '14:00', '18:00']), [MENU]],
    },
    bk_ok: {
      cancel: true,
      text:
        '✅ <b>Вы записаны!</b>\n\n' +
        '📌 Услуга: #{service}\n' +
        '📅 День: #{day}\n' +
        '🕐 Время: #{time}\n' +
        '📍 Адрес: ул. Примерная, 1 <i>(демо)</i>\n\n' +
        'Я напомню о визите заранее.',
      buttons: [[{ text: '❌ Отменить запись', go: 'bk_cancel' }], [MENU]],
      next: [{ after: 15, go: 'bk_rem1', real: 'за день до визита' }],
    },
    bk_rem1: {
      text: later('за 1 день до визита', 15) + '🔔 Напоминаю: #{day} в #{time} — #{service}.\n\nВсё в силе?',
      buttons: [
        [{ text: '✅ Приду', go: 'bk_confirm' }, { text: '🔁 Перенести', go: 'bk_day' }],
        [{ text: '❌ Отменить запись', go: 'bk_cancel' }],
        [MENU],
      ],
      next: [{ after: 15, go: 'bk_rem2', real: 'за 2 часа до визита' }],
    },
    bk_confirm: {
      text: '👍 Отлично, ждём вас!',
      buttons: [[MENU]],
    },
    bk_rem2: {
      text:
        later('за 2 часа до визита', 15) +
        '⏰ Через 2 часа ждём вас: #{service}, #{time}.\n\n' +
        'Это конец сценария. Хотите такого бота для записи клиентов?',
      buttons: [[WANT], [MENU]],
    },
    bk_cancel: {
      cancel: true,
      text:
        'Запись отменена. Слот освободился для других клиентов.\n\n' +
        '<i>В рабочем боте отмена сразу отражается в расписании CRM.</i>',
      buttons: [[{ text: '✍️ Записаться', go: 'bk_service' }], [MENU]],
    },

    // ───────────── 7. Сбор заявок ─────────────
    ld_start: {
      cancel: true,
      text:
        '📝 <b>Сценарий «Сбор заявок»</b>\n\n' +
        'Бот за минуту квалифицирует клиента: что нужно, какой бюджет, как связаться — и сразу передаёт готовую заявку менеджеру. Никто не теряется в переписке.\n\n' +
        'Представьте, что вы пришли заказать проект 👇',
      buttons: [[{ text: '🚀 Оставить заявку', go: 'ld_need' }], [MENU]],
    },
    ld_need: {
      text: 'Что вас интересует?',
      buttons: [pick('ld_budget', 'need', ['Сайт', 'Чат-бот', 'Онлайн-школа']), [MENU]],
    },
    ld_budget: {
      text: 'Какой бюджет планируете?',
      buttons: [pick('ld_phone', 'budget', ['до 20 000 ₽', '20–50 000 ₽', 'от 50 000 ₽']), [MENU]],
    },
    ld_phone: {
      wait: 'phone',
      text: '📱 Оставьте номер телефона — нажмите кнопку ниже или напишите номер в формате 79001234567.',
      reply: [[{ text: '📱 Отправить номер', contact: true }], [{ text: '🏠 Главное меню' }]],
    },
    ld_bad: {
      wait: 'phone',
      text: 'Кажется, это не номер телефона 🤔 Напишите 11 цифр, например 79001234567, или нажмите кнопку «Отправить номер».',
      reply: [[{ text: '📱 Отправить номер', contact: true }], [{ text: '🏠 Главное меню' }]],
    },
    ld_done: {
      text: () =>
        '✅ <b>Заявка принята!</b>\n\n' +
        '📌 Интересует: #{need}\n' +
        '💰 Бюджет: #{budget}\n\n' +
        'Менеджер свяжется с вами в течение 15 минут.\n\n' +
        (cfg.ADMIN_CHAT_ID
          ? '<i>Заявка в ту же секунду ушла менеджеру в Telegram.</i>'
          : '<i>В рабочем боте заявка в ту же секунду уходит менеджеру в Telegram, CRM или Google Таблицу.</i>') +
        '\n\nЭто конец сценария.',
      buttons: [[WANT], [MENU]],
    },

    // ───────────── 8. Реферальная программа ─────────────
    rf_start: {
      cancel: true,
      set: (v) => { v.refs = v.refs || 0; v.bonus = v.refs * 500; },
      text:
        '🤝 <b>Сценарий «Реферальная программа»</b>\n\n' +
        'Бот выдаёт каждому участнику персональную ссылку, сам считает, кто кого привёл, и начисляет бонусы. Никакого ручного учёта в таблицах.\n\n' +
        'Вы — участник программы. Что посмотрим? 👇',
      buttons: [
        [{ text: '🔗 Моя ссылка', go: 'rf_link' }, { text: '📊 Моя статистика', go: 'rf_stats' }],
        [MENU],
      ],
    },
    rf_link: {
      text: (v, ctx) => (cfg.WEB
        ? '🔗 <b>Ваша персональная ссылка</b>\n\n' +
          '<i>В Telegram-версии этого бота здесь появляется личная ссылка: друг запускает бота по ней — и вам сразу приходит уведомление и бонус. На сайте приход друга можно симулировать кнопкой ниже.</i>\n\n' +
          'За каждого друга — 500 ₽ бонусами.'
        : '🔗 <b>Ваша персональная ссылка:</b>\n' +
          ctx.refLink + '\n\n' +
          '<i>Ссылка настоящая: перешлите её другу — когда он запустит бота, вам придёт уведомление и начислится бонус.</i>\n\n' +
          'За каждого друга — 500 ₽ бонусами.'),
      buttons: [
        [{ text: '➕ Симулировать приход друга', go: 'rf_friend' }],
        [{ text: '📊 Моя статистика', go: 'rf_stats' }],
        [MENU],
      ],
    },
    rf_friend: {
      set: (v) => { v.refs = (v.refs || 0) + 1; v.bonus = v.refs * 500; },
      text:
        '🎉 По вашей ссылке пришёл новый друг!\n\n' +
        '👥 Всего друзей: #{refs}\n' +
        '💰 Ваш бонус: #{bonus} ₽\n\n' +
        '<i>Это симуляция. Настоящее уведомление приходит само, когда друг запускает бот по вашей ссылке.</i>',
      buttons: [
        [{ text: '➕ Симулировать приход друга', go: 'rf_friend' }],
        [{ text: '📊 Моя статистика', go: 'rf_stats' }],
        [WANT],
        [MENU],
      ],
    },
    // Сюда бот ведёт пригласившего, когда друг реально запустил бота по его ссылке
    rf_friend_real: {
      set: (v) => { v.refs = (v.refs || 0) + 1; v.bonus = v.refs * 500; },
      text:
        '🎉 По вашей ссылке пришёл новый друг!\n\n' +
        '👥 Всего друзей: #{refs}\n' +
        '💰 Ваш бонус: #{bonus} ₽',
      buttons: [[{ text: '📊 Моя статистика', go: 'rf_stats' }], [MENU]],
    },
    rf_stats: {
      set: (v) => { v.refs = v.refs || 0; v.bonus = v.refs * 500; },
      text: '📊 <b>Ваша статистика</b>\n\n👥 Приглашено друзей: #{refs}\n💰 Бонусов начислено: #{bonus} ₽',
      buttons: [
        [{ text: '➕ Симулировать приход друга', go: 'rf_friend' }],
        [{ text: '🔗 Моя ссылка', go: 'rf_link' }],
        [MENU],
      ],
    },
  };

  // «Хочу такого бота» ведёт на страницу заявки сайта: направление «чат-боты» и сценарий уже вписаны в форму
  const NAMES = { web: 'Автовебинар', ch: 'Закрытый канал', lm: 'Лид-магнит', quiz: 'Тест с баллами', wh: 'Колесо фортуны', bk: 'Онлайн-запись', ld: 'Сбор заявок', rf: 'Реферальная программа' };
  const FORM = cfg.FORM_URL || 'https://texspeckps.ru/ai/form';
  for (const [id, b] of Object.entries(blocks)) {
    const name = NAMES[id.split('_')[0]];
    for (const row of b.buttons || []) {
      for (let i = 0; i < row.length; i++) {
        if (row[i] !== WANT) continue;
        const task = 'Бот как в демо' + (name ? ': ' + name : '');
        row[i] = { text: WANT.text, url: FORM + (FORM.includes('?') ? '&' : '?') + 'service=salebot&task=' + encodeURIComponent(task) };
      }
    }
  }

  // Что можно написать боту текстом (без учёта регистра) → блок
  const triggers = {
    'начать': 'start', 'привет': 'start', 'старт': 'start', 'здравствуйте': 'start',
    '🏠 главное меню': 'menu', 'главное меню': 'menu', 'меню': 'menu', '/menu': 'menu',
    '🔁 пройти тест ещё раз': 'quiz_start',
  };
  for (const row of MENU_BUTTONS) for (const b of row) triggers[b.text.toLowerCase()] = b.go;

  return { blocks, triggers };
};

};
defs["engine"] = function (module, exports, require) {
// Движок: ведёт человека по блокам из scenarios.js, хранит переменные, ставит и снимает отложенные сообщения.
// С Telegram напрямую не работает — получает готовый api. Где хранить людей и паузы, решает тот, кто запускает:
//   bot.js (компьютер)  — файл data.json и таймеры в памяти;
//   worker.js (Cloudflare) — хранилище Durable Object и будильники (alarm);
//   test.js — всё в памяти.

const scenarios = require('./scenarios');

// Коды для ссылок t.me/бот?start=<код> — по ним сайт открывает бота сразу в нужном сценарии
const SCENARIO_LINKS = {
  webinar: 'web_start', channel: 'ch_start', leadmagnet: 'lm_start', quiz: 'quiz_start',
  wheel: 'wh_start', booking: 'bk_start', leads: 'ld_start', referral: 'rf_start', menu: 'menu',
};

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Паузы в памяти — для запуска на компьютере и для проверки
function memoryTimers(delayScale, log) {
  const all = new Map(); // chatId → Set(таймеров)
  return {
    fire: null, // движок подставит сам
    add(chatId, ms, job) {
      if (!all.has(chatId)) all.set(chatId, new Set());
      const set = all.get(chatId);
      const t = setTimeout(() => {
        set.delete(t);
        this.fire(chatId, job).catch((e) => log.error('Отложенное сообщение не ушло:', e.message));
      }, ms * delayScale);
      set.add(t);
    },
    cancel(chatId) {
      const set = all.get(chatId);
      if (set) { set.forEach(clearTimeout); set.clear(); }
    },
    stopAll() { for (const id of all.keys()) this.cancel(id); },
  };
}

function createEngine({ api, cfg, botUsername, store, users, timers, referral, delayScale = 1, log = console }) {
  const { blocks, triggers } = scenarios(cfg);

  // users: { has(id), load(id), save(id, user) } — можно асинхронно
  users = users || {
    has: (id) => store.has(id),
    load: (id) => store.user(id),
    save: () => store.save(),
  };
  // timers: { add(chatId, ms, job), cancel(chatId) }
  timers = timers || memoryTimers(delayScale, log);
  if ('fire' in timers) timers.fire = fire;
  // referral(id пригласившего) → true, если такой человек есть и ему отправлено уведомление
  referral = referral || (async (refId) => {
    if (!(await users.has(refId))) return false;
    await go(refId, 'rf_friend_real');
    return true;
  });

  function context(chatId) {
    return {
      chatId,
      refLink: `https://t.me/${botUsername}?start=ref_${chatId}`,
      isSubscribed: async () => {
        if (!cfg.CHANNEL_ID) return true; // канал для проверки не задан — пропускаем, как в демо Salebot
        try {
          const m = await api.getChatMember(cfg.CHANNEL_ID, chatId);
          return ['creator', 'administrator', 'member', 'restricted'].includes(m.status);
        } catch (e) {
          log.error('Не получилось проверить подписку (бот должен быть админом канала):', e.message);
          return true;
        }
      },
    };
  }

  const fill = (text, v) => text.replace(/#\{(\w+)\}/g, (_, k) => esc(v[k]));

  function markup(id, b) {
    if (b.reply) {
      return {
        keyboard: b.reply.map((row) => row.map((x) => (x.contact ? { text: x.text, request_contact: true } : { text: x.text }))),
        resize_keyboard: true,
      };
    }
    if (!b.buttons) return undefined;
    return {
      inline_keyboard: b.buttons.map((row, r) =>
        row.map((x, c) => (x.url ? { text: x.text, url: x.url } : { text: x.text, callback_data: `${id}:${r}:${c}` }))),
    };
  }

  async function go(chatId, id, hops = 0) {
    const b = blocks[id];
    if (!b) throw new Error(`Нет блока «${id}»`);
    if (hops > 10) throw new Error(`Блоки зациклились на «${id}»`);
    const user = await users.load(chatId);
    const v = user.vars;
    const ctx = context(chatId);

    if (b.cancel) await timers.cancel(chatId);
    if (b.set) b.set(v, ctx);
    user.state = id;
    user.wait = b.wait || null;
    // Обычную клавиатуру («Отправить номер») убираем, когда она больше не нужна
    const removeKb = !b.route && user.replyKb && !b.reply;
    if (removeKb) user.replyKb = false;
    if (b.reply) user.replyKb = true;
    await users.save(chatId, user);

    if (b.route) return go(chatId, await b.route(v, ctx), hops + 1);

    if (removeKb) {
      const tmp = await api.sendMessage(chatId, '…', { reply_markup: { remove_keyboard: true } });
      await api.deleteMessage(chatId, tmp.message_id).catch(() => {});
    }

    let text = typeof b.text === 'function' ? b.text(v, ctx) : b.text;
    // предупреждаем, что следующее сообщение придёт само — чтобы человек не жал всё подряд
    for (const n of b.next || []) {
      if (n.hint) text += `\n\n⏳ <i>${n.hint}</i>`;
      else if (n.real) text += `\n\n⏳ <i>Следующее сообщение придёт само через ${n.after} сек (в рабочем боте — ${n.real}). Можно ничего не нажимать.</i>`;
    }
    await api.sendMessage(chatId, fill(text, v), { reply_markup: markup(id, b) });

    const next = b.next || [];
    for (let i = 0; i < next.length; i++) await timers.add(chatId, next[i].after * 1000, { block: id, idx: i });
  }

  // Сработала пауза: job = { block, idx } — какое отложенное сообщение какого блока
  async function fire(chatId, job) {
    const n = blocks[job.block]?.next?.[job.idx];
    if (!n) return;
    const user = await users.load(chatId);
    if (n.unless && n.unless(user.vars)) return;
    await go(chatId, n.go);
  }

  async function onStart(chatId, payload, from) {
    const isNew = !(await users.has(chatId));
    const user = await users.load(chatId);
    user.name = [from.first_name, from.last_name].filter(Boolean).join(' ');
    user.username = from.username || '';
    await users.save(chatId, user);

    // Реферальная ссылка: t.me/бот?start=ref_<id пригласившего>
    const m = /^ref_(-?\d+)$/.exec(payload || '');
    if (isNew && m && m[1] !== String(chatId)) {
      const ok = await referral(m[1]).catch((e) => { log.error('Не удалось уведомить пригласившего:', e.message); return false; });
      if (ok) { user.invitedBy = m[1]; await users.save(chatId, user); }
    }
    // Ссылка с сайта сразу на сценарий: t.me/бот?start=webinar
    if (SCENARIO_LINKS[payload]) return go(chatId, SCENARIO_LINKS[payload]);
    return go(chatId, 'start');
  }

  async function onText(chatId, text, from = {}) {
    const t = text.trim();
    if (/^\/start(\s|$)/.test(t)) return onStart(chatId, t.split(/\s+/)[1], from);
    if (t === '/myid') return api.sendMessage(chatId, `Ваш chat id: <code>${chatId}</code>`);

    const target = triggers[t.toLowerCase()];
    if (target) return go(chatId, target);

    if ((await users.load(chatId)).wait === 'phone') return onPhone(chatId, t, from);

    return api.sendMessage(chatId, 'Я отвечаю на кнопки 🙂 Нажмите любую кнопку выше или напишите «меню».');
  }

  async function onPhone(chatId, raw, from = {}) {
    let digits = String(raw).replace(/\D/g, '');
    if (digits.length === 10 && digits[0] === '9') digits = '7' + digits;
    if (digits.length === 11 && digits[0] === '8') digits = '7' + digits.slice(1);
    if (!(digits.length === 11 && digits[0] === '7')) return go(chatId, 'ld_bad');

    const user = await users.load(chatId);
    user.vars.phone = '+' + digits;
    await users.save(chatId, user);

    if (cfg.ADMIN_CHAT_ID) {
      const v = user.vars;
      const who = [esc(user.name || from.first_name || ''), from.username ? '@' + esc(from.username) : ''].filter(Boolean).join(' ');
      await api.sendMessage(cfg.ADMIN_CHAT_ID,
        '📝 <b>Новая заявка из демо-бота</b>\n\n' +
        `👤 ${who || 'без имени'}\n` +
        `📌 Интересует: ${esc(v.need)}\n` +
        `💰 Бюджет: ${esc(v.budget)}\n` +
        `📱 Телефон: ${esc(v.phone)}`,
      ).catch((e) => log.error('Заявка не дошла до менеджера (проверьте ADMIN_CHAT_ID):', e.message));
    }
    return go(chatId, 'ld_done');
  }

  async function onContact(chatId, contact, from = {}) {
    if ((await users.load(chatId)).wait !== 'phone') return;
    return onPhone(chatId, contact.phone_number, from);
  }

  async function onButton(chatId, data) {
    const [id, r, c] = String(data).split(':');
    const btn = blocks[id]?.buttons?.[r]?.[c];
    if (!btn || !btn.go) return;
    if (btn.set) {
      const user = await users.load(chatId);
      btn.set(user.vars);
      await users.save(chatId, user);
    }
    return go(chatId, btn.go);
  }

  // Одно обновление от Telegram (getUpdates или вебхук)
  async function onUpdate(u) {
    if (u.callback_query) {
      const q = u.callback_query;
      if (api.answerCallbackQuery) await api.answerCallbackQuery(q.id).catch(() => {});
      if (q.message) await onButton(q.message.chat.id, q.data);
    } else if (u.message && u.message.chat.type === 'private') {
      const m = u.message;
      if (m.contact) await onContact(m.chat.id, m.contact, m.from);
      else if (m.text) await onText(m.chat.id, m.text, m.from);
    }
  }

  return {
    go, fire, onText, onContact, onButton, onUpdate, blocks,
    stop: () => timers.stopAll && timers.stopAll(),
  };
}

// id чата, к которому относится обновление (или null — не наше)
function chatOf(u) {
  if (u.callback_query) return u.callback_query.message?.chat.id ?? null;
  if (u.message && u.message.chat.type === 'private') return u.message.chat.id;
  return null;
}

module.exports = { createEngine, chatOf, SCENARIO_LINKS };

};
defs["widget"] = function (module, exports, require) {
// Чат с демо-ботом прямо на сайте — без перехода в Telegram.
// Те же сценарии и движок (scenarios.js, engine.js), только «Telegram» здесь — окно чата на странице.
// Собирается в один файл командой: node build-web.js  →  new/assets/botchat.js
//
// Открыть чат: BotChat.open() или BotChat.open('quiz'); любой элемент с data-botchat="<код>" открывает чат по клику.

const { createEngine } = require('engine');

const CHAT = 'web';
const ADMIN = 'admin';
const LEAD_URL = 'https://texspeckps-form.texspeckps.workers.dev';
const TG = 'https://t.me/Bot_PortfolioRabot';
const KEY_USER = 'pk-botchat-user';
const KEY_LOG = 'pk-botchat-log';

const cfg = {
  WEB: true,
  ADMIN_CHAT_ID: ADMIN,
  CHANNEL_ID: '',
  CHANNEL_LINK: 'https://t.me/+aq7mXP_tCQ8yNzVi',
  CONTACT_LINK: 'https://t.me/PavelTexSpec',
  SITE: 'https://texspeckps.ru',
};

const store = (k, val) => {
  try {
    if (val === undefined) return JSON.parse(localStorage.getItem(k) || 'null');
    localStorage.setItem(k, JSON.stringify(val));
  } catch (e) { /* приватный режим — живём без сохранения */ }
  return null;
};
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const CSS = `
:host{all:initial}
*{box-sizing:border-box;margin:0;padding:0}
.panel{position:fixed;left:16px;bottom:16px;z-index:2147483000;width:380px;height:min(620px,calc(100vh - 32px));display:flex;flex-direction:column;
  background:#fff;color:#16161a;border-radius:20px;overflow:hidden;box-shadow:0 30px 80px -20px rgba(0,0,0,.45),0 0 0 1px rgba(0,0,0,.08);
  font:400 15px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;transform-origin:left bottom;animation:pop .28s cubic-bezier(.2,.9,.3,1.2)}
@keyframes pop{from{opacity:0;transform:scale(.92) translateY(10px)}}
@media(max-width:560px){.panel{left:0;bottom:0;width:100vw;height:100dvh;border-radius:0}}
:host(.inline) .panel{position:relative;left:auto;bottom:auto;width:100%;height:100%;animation:none;border-radius:inherit;box-shadow:none}
:host(.inline) [data-close]{display:none}
.hd{display:flex;align-items:center;gap:10px;padding:12px 12px 12px 16px;background:var(--acc);color:var(--acc-ink)}
.ava{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.22);font-size:20px;flex:none}
.who{flex:1;min-width:0}.who b{display:block;font-weight:700;font-size:15px}.who span{font-size:12px;opacity:.85}
.ic{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:none;border:0;color:inherit;cursor:pointer;font-size:18px}
.ic:hover{background:rgba(255,255,255,.18)}
.log{flex:1;overflow-y:auto;padding:16px 12px 8px;background:#eef0f4;display:flex;flex-direction:column;gap:10px;overscroll-behavior:contain}
.msg{max-width:88%;padding:9px 12px 10px;border-radius:16px;white-space:normal;word-wrap:break-word;overflow-wrap:anywhere}
.bot{align-self:flex-start;background:#fff;border-bottom-left-radius:5px;box-shadow:0 1px 1px rgba(0,0,0,.06)}
.me{align-self:flex-end;background:var(--acc);color:var(--acc-ink);border-bottom-right-radius:5px}
.msg i{color:#5d6270}.me i{color:inherit}.msg code{font-family:ui-monospace,Consolas,monospace;background:#f1f2f5;padding:0 4px;border-radius:4px}
.kb{align-self:flex-start;max-width:88%;display:flex;flex-direction:column;gap:6px;margin-top:-4px}
.row{display:flex;gap:6px}
.btn{flex:1;min-height:38px;padding:7px 10px;border-radius:10px;border:0;background:#fff;color:var(--acc-text);font:600 13.5px/1.25 inherit;font-family:inherit;cursor:pointer;
  box-shadow:inset 0 0 0 1.5px var(--acc-soft);text-align:center;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:4px;transition:background .15s}
.btn:hover{background:var(--acc-soft)}
.btn[disabled]{opacity:.45;cursor:default}
.ext::after{content:"↗";font-size:12px;opacity:.7}
.typing{align-self:flex-start;background:#fff;border-radius:16px;padding:12px 14px;display:flex;gap:4px}
.typing i{width:7px;height:7px;border-radius:50%;background:#a3a8b5;animation:dot 1s infinite}
.typing i:nth-child(2){animation-delay:.15s}.typing i:nth-child(3){animation-delay:.3s}
@keyframes dot{0%,60%,100%{opacity:.3;transform:none}30%{opacity:1;transform:translateY(-3px)}}
.quick{display:flex;flex-wrap:wrap;gap:6px;padding:8px 12px 0;background:#fff}
.quick:empty{display:none}
.quick .btn{flex:0 1 auto}
.ft{display:flex;gap:8px;padding:10px 12px 12px;background:#fff;border-top:1px solid #e7e8ec}
.ft input{flex:1;min-width:0;height:42px;border-radius:21px;border:1.5px solid #dcdee4;padding:0 16px;font:inherit;color:inherit;background:#fff;outline:none}
.ft input:focus{border-color:var(--acc)}
.send{width:42px;height:42px;border-radius:50%;border:0;background:var(--acc);color:var(--acc-ink);cursor:pointer;display:grid;place-items:center;flex:none}
.note{padding:0 12px 10px;background:#fff;font-size:11.5px;color:#7a7f8c;text-align:center}
.note a{color:var(--acc-text)}
`;

function colors() {
  // берём акцентный цвет текущего стиля сайта, чтобы чат выглядел «своим»
  const cs = getComputedStyle(document.documentElement);
  let acc = (cs.getPropertyValue('--acc') || '').trim() || (cs.getPropertyValue('--acc-text') || '').trim() || '#2d5bff';
  const probe = document.createElement('span');
  probe.style.color = acc; document.body.appendChild(probe);
  const rgb = getComputedStyle(probe).color.match(/\d+(\.\d+)?/g) || [45, 91, 255];
  probe.remove();
  const [r, g, b] = rgb.map(Number);
  const light = (0.299 * r + 0.587 * g + 0.114 * b) > 170;
  return {
    acc: `rgb(${r},${g},${b})`,
    ink: light ? '#16161a' : '#fff',
    text: light ? '#16161a' : `rgb(${r},${g},${b})`, // на белом фоне светлый акцент нечитаем
    soft: `rgba(${r},${g},${b},.16)`,
  };
}

let root, logEl, quickEl, input, engine, opened = false;
let history = [];
let queue = Promise.resolve(); // вывод сообщений по одному, с «печатает…»
let act = Promise.resolve();   // действия человека по очереди
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function save() { try { sessionStorage.setItem(KEY_LOG, JSON.stringify(history.slice(-80))); } catch (e) { /* ничего */ } }
function scroll() { logEl.scrollTop = logEl.scrollHeight; }

function renderBot(m) {
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.innerHTML = m.text.replace(/\n/g, '<br>');
  logEl.appendChild(div);
  if (m.kb) {
    const kb = document.createElement('div');
    kb.className = 'kb';
    kb.innerHTML = m.kb.map((row) => '<div class="row">' + row.map((b) => b.url
      ? (/^https?:/.test(b.url) && !b.url.includes(location.host)
        ? `<a class="btn ext" href="${esc(b.url)}" target="_blank" rel="noopener">${esc(b.text)}</a>`
        : `<a class="btn" href="${esc(b.url)}">${esc(b.text)}</a>`)
      : `<button class="btn" type="button" data-cb="${esc(b.callback_data)}">${esc(b.text)}</button>`).join('') + '</div>').join('');
    logEl.appendChild(kb);
  }
}
function renderMe(text) {
  const div = document.createElement('div');
  div.className = 'msg me';
  div.textContent = text;
  logEl.appendChild(div);
}
function renderQuick(rows) {
  quickEl.innerHTML = (rows || []).flat().map((b) => b.request_contact
    ? '<button class="btn" type="button" data-phone>📱 Ввести номер</button>'
    : `<button class="btn" type="button" data-say="${esc(b.text)}">${esc(b.text)}</button>`).join('');
}

// «Telegram API» для движка: сообщения рисуются в окне чата
const api = {
  sendMessage(chatId, text, extra = {}) {
    if (String(chatId) === ADMIN) return sendLead(text);
    const mk = extra.reply_markup || {};
    queue = queue.then(async () => {
      const t = document.createElement('div');
      t.className = 'typing'; t.innerHTML = '<i></i><i></i><i></i>';
      logEl.appendChild(t); scroll();
      await sleep(Math.min(900, 250 + text.length * 2));
      t.remove();
      const m = { from: 'bot', text, kb: mk.inline_keyboard || null };
      history.push(m); renderBot(m);
      if (mk.keyboard) { renderQuick(mk.keyboard); history.push({ from: 'quick', rows: mk.keyboard }); }
      if (mk.remove_keyboard) { renderQuick(null); history.push({ from: 'quick', rows: null }); }
      save(); scroll();
    });
    return queue.then(() => ({ message_id: history.length }));
  },
  async deleteMessage() {},
  async getChatMember() { return { status: 'member' }; },
};

// Заявка из «Сбора заявок» уходит Павлу тем же путём, что и форма сайта
async function sendLead(html) {
  const text = '🤖 Демо-бот на сайте (' + location.pathname + ')\n\n' +
    html.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  try {
    await fetch(LEAD_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
  } catch (e) { /* заявка в демо — не страшно, если не дошла */ }
  return { message_id: 0 };
}

// страница заявки того стиля сайта, где открыт чат
function formUrl() {
  const p = location.pathname;
  if (p.startsWith('/ai/')) return '/ai/form';
  if (p.includes('/creative/')) return 'brief.html';
  const f = window.DATA && window.DATA.pages && window.DATA.pages.form;
  return f && !/^https?:/.test(f) ? f : 'https://texspeckps.ru/ai/form';
}

function makeEngine() {
  cfg.FORM_URL = formUrl();
  const users = {
    has: () => Boolean(store(KEY_USER)),
    load: () => { users._u = users._u || store(KEY_USER) || { vars: {}, state: null }; return users._u; },
    save: (id, u) => { users._u = u; store(KEY_USER, u); },
  };
  return createEngine({ api, cfg, botUsername: 'Bot_PortfolioRabot', users, log: { error: () => {} } });
}

function build(into) {
  const host = document.createElement('div');
  host.id = 'pk-botchat';
  if (into) { host.className = 'inline'; host.style.cssText = 'display:block;height:100%;border-radius:inherit'; into.appendChild(host); }
  else document.body.appendChild(host);
  root = host.attachShadow({ mode: 'open' });
  const c = colors();
  root.innerHTML = `<style>:host{--acc:${c.acc};--acc-ink:${c.ink};--acc-text:${c.text};--acc-soft:${c.soft}}${CSS}</style>
    <section class="panel" role="dialog" aria-label="Демо-бот" hidden>
      <header class="hd"><span class="ava" aria-hidden="true">🤖</span>
        <span class="who"><b>Демо-бот Павла</b><span>отвечает сразу · паузы ускорены</span></span>
        <button class="ic" type="button" data-restart title="Начать сначала" aria-label="Начать сначала">↺</button>
        <button class="ic" type="button" data-close title="Закрыть" aria-label="Закрыть">✕</button></header>
      <div class="log" aria-live="polite"></div>
      <div class="quick"></div>
      <form class="ft"><input type="text" placeholder="Напишите сообщение…" aria-label="Сообщение" autocomplete="off" enterkeyhint="send">
        <button class="send" type="submit" aria-label="Отправить"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12.6 2-12.6 2z"/></svg></button></form>
      <p class="note">Это демо. Тот же бот в Telegram: <a href="${TG}" target="_blank" rel="noopener">@Bot_PortfolioRabot</a></p>
    </section>`;
  logEl = root.querySelector('.log');
  quickEl = root.querySelector('.quick');
  input = root.querySelector('input');
  engine = makeEngine();

  // история переписки — чтобы при переходе по страницам сайта чат не начинался заново
  try { history = JSON.parse(sessionStorage.getItem(KEY_LOG) || '[]'); } catch (e) { history = []; }
  for (const m of history) {
    if (m.from === 'bot') renderBot(m);
    else if (m.from === 'me') renderMe(m.text);
    else if (m.from === 'quick') renderQuick(m.rows);
  }

  root.addEventListener('click', (e) => {
    const t = e.target.closest('button, a');
    if (!t) return;
    if (t.hasAttribute('data-close')) return close();
    if (t.hasAttribute('data-restart')) return restart();
    if (t.hasAttribute('data-phone')) { input.placeholder = 'Номер, например 79001234567'; input.inputMode = 'tel'; input.focus(); return; }
    if (t.dataset.say) return say(t.dataset.say);
    if (t.dataset.cb) {
      me(t.textContent);
      act = act.then(() => engine.onButton(CHAT, t.dataset.cb)).catch(() => {});
    }
  });
  root.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    say(text);
  });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && opened) close(); });
}

function me(text) { history.push({ from: 'me', text }); renderMe(text); save(); scroll(); }
function run(cmd) { act = act.then(() => engine.onText(CHAT, cmd, { first_name: 'Гость сайта' })).catch(() => {}); }
function say(text) {
  me(text);
  input.placeholder = 'Напишите сообщение…'; input.inputMode = 'text';
  act = act.then(() => engine.onText(CHAT, text, { first_name: 'Гость сайта' })).catch(() => {});
}

// Встроить чат в блок страницы (страница «Демо-бот»): сразу запускается, ?start=<код> — сразу сценарий
function mount(el) {
  build(el);
  root.querySelector('.panel').hidden = false; opened = true;
  const code = new URLSearchParams(location.search).get('start');
  if (code) run('/start ' + code.replace(/[^a-z]/g, ''));
  else if (!history.length) act = act.then(() => engine.onText(CHAT, '/start', {})).catch(() => {});
  scroll();
}

function open(code) {
  if (!root) build();
  const panel = root.querySelector('.panel');
  panel.hidden = false; opened = true;
  if (code) run('/start ' + code);
  else if (!history.length) act = act.then(() => engine.onText(CHAT, '/start', {})).catch(() => {});
  scroll();
  if (matchMedia('(min-width: 561px)').matches) setTimeout(() => input.focus(), 50);
}
function close() { if (root && !root.host.classList.contains('inline')) { root.querySelector('.panel').hidden = true; opened = false; } }
function restart() {
  engine.stop();
  history = []; save(); store(KEY_USER, { vars: {}, state: null });
  logEl.innerHTML = ''; renderQuick(null);
  engine = makeEngine();
  queue = Promise.resolve();
  act = Promise.resolve().then(() => engine.onText(CHAT, '/start', {})).catch(() => {});
}

window.BotChat = { open, close };

// Любая ссылка/кнопка с data-botchat открывает чат на сайте вместо Telegram
document.addEventListener('click', (e) => {
  const a = e.target.closest && e.target.closest('[data-botchat]');
  if (!a || e.ctrlKey || e.metaKey || e.shiftKey) return;
  e.preventDefault();
  open(a.dataset.botchat || '');
  if (root && root.host.classList.contains('inline') && matchMedia('(max-width: 900px)').matches) root.host.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
// на странице «Демо-бот» чат встроен в блок #botchat-mount
function boot() {
  if (root) return;
  const spot = document.getElementById('botchat-mount');
  if (spot) mount(spot);
  else if (location.hash === '#botchat') open();
}
boot();
if (!root) document.addEventListener('DOMContentLoaded', boot);

};
require('widget');
})();
