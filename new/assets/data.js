/* Общие данные для всех стилей — только реальные факты с texspeckps.ru */
window.DATA = {
  name: 'Павел Корчагин',
  tg: 'https://t.me/PavelTexSpec',
  form: 'https://texspeckps.ru/form',
  priceUrl: 'https://texspeckps.ru/price',
  faqUrl: 'https://texspeckps.ru/faq',
  offer: 'Проектирую в Figma, собираю сайты на Tilda, настраиваю чат-ботов в Salebot, школы на GetCourse и вебинары — и связываю всё в одну систему, которая сама доводит клиента до оплаты.',
  stats: [
    ['10+', 'завершённых проектов: школы, магазины, личные бренды'],
    ['5 в 1', 'дизайн, сайт, бот, школа и рассылки — один исполнитель'],
    ['№1', 'в поиске по области — сайт кафе после запуска'],
    ['0', 'отрицательных отзывов от заказчиков']
  ],
  chain: [
    ['Figma', 'Дизайн', 'Прототип и визуал, которые ведут к действию'],
    ['Tilda · Zero Block', 'Сайт', 'Быстрый, адаптивный, с SEO и аналитикой'],
    ['Salebot + ИИ', 'Чат-бот', 'Ловит заявку и отвечает клиенту 24/7'],
    ['Bizon365', 'Вебинар', 'Прогревает и продаёт в эфире или автоматически'],
    ['Email · мессенджеры', 'Рассылки', 'Возвращают тех, кто не купил сразу'],
    ['GetCourse', 'Оплата и школа', 'Доступ к курсу открывается автоматически']
  ],
  pains: [
    { q: 'Заплатил за сайт, а заявок как не было, так и нет', a: 'Закладываю SEO, аналитику и логику воронки ещё на этапе сборки — сайт с первого дня работает на заявки.', c: 0 },
    { q: 'Заявки сыпятся в директ, а обрабатывать некому', a: 'Настраиваю чат-бота с ИИ: он отвечает, квалифицирует и доводит до записи даже ночью.', c: 1 },
    { q: 'Хочу онлайн-школу, но GetCourse — это лес', a: 'Собираю курсы, кабинеты, процессы и приём оплат. Школа работает сама — вы занимаетесь контентом.', c: 2 },
    { q: 'Макет в Figma есть, а живого сайта — нет', a: 'Сам проектирую и сам верстаю — без посредника, который теряет анимации и детали при переносе.', c: 6 },
    { q: 'Оплата прошла, а данные никуда не попали', a: 'Связываю оплату, CRM, школу и рассылки в одну цепочку — ни одна заявка и ни один платёж не теряются.', c: 5 }
  ],
  cases: [
    { t: 'Кафе «Приятного аппетита»', type: 'Интернет-магазин', cat: 'Tilda', client: true, img: 'https://static.tildacdn.com/tild6132-3733-4237-a265-653539353236/2026-09-12_19-08-11.png', f: ['86', 'заявок за неделю — до сайта онлайн-заказов не было'], tools: ['Tilda', 'Онлайн-заказ', 'CRM'], url: 'https://priyatnogoappetita.tilda.ws/', p: 'Онлайн-меню, корзина, доставка и карта точек — презентация сразу ведёт к заказу.' },
    { t: 'ИИ-администратор салона «Жадор»', type: 'ИИ-ассистент', cat: 'Salebot', client: true, img: 'https://static.tildacdn.com/tild3235-6638-4861-b662-393936303634/2026-08-15_22-09-38.png', f: ['24/7', 'консультации и запись по живому расписанию CRM'], tools: ['Salebot', 'ИИ', 'CRM'], p: 'Консультирует, помогает выбрать услугу и записывает на свободное время.' },
    { t: 'PRO.Техник — онлайн-школа', type: 'Онлайн-школа', cat: 'GetCourse', client: true, img: 'https://static.tildacdn.com/tild3832-3337-4161-b033-633533653061/2026-08-15_22-43-44.png', f: ['5', 'направлений работы в одной школе'], tools: ['GetCourse', 'Salebot', 'HTML/CSS/JS'], p: 'Довёл платформу от «голого» конструктора до рабочего учебного процесса.' },
    { t: 'Экскурпитер', type: 'Лендинг', cat: 'Tilda', client: true, img: 'https://texspeckps.ru/img/ekskurpiter-cover.webp', f: ['3', 'шага от выбора прогулки до билета'], tools: ['Tilda', 'Zero Block', 'WhatsApp'], url: 'https://экскурпитер.рф/', p: 'Речные прогулки по Петербургу: форматы, маршрут, расписание и бронь онлайн.' },
    { t: 'MAXFIT — школа фитнес-тренеров', type: 'Многостраничный сайт', cat: 'Tilda', client: true, img: 'https://static.tildacdn.com/tild6332-6432-4634-b632-663764653161/2026-08-01_17-19-48.png', f: ['5', 'ключевых этапов пути пользователя'], tools: ['Tilda', 'Zero Block', 'Telegram'], url: 'https://fitbasepro.ru/', p: 'Объёмная программа превращена в понятный путь до заявки.' },
    { t: 'Цифровой администратор кафе', type: 'Бот для бизнеса', cat: 'Salebot', client: true, img: 'https://static.tildacdn.com/tild3031-6335-4466-a666-373339383865/Gemini_Generated_Ima.jpg', f: ['5', 'клиентских сценариев в одном боте'], tools: ['Salebot', 'Telegram', 'VK'], p: 'Рассказывает о кафе, ведёт к заказу, собирает отзывы за промокод.' },
    { t: 'QLedger — ядро для банков', type: 'Лендинг', cat: 'Tilda', client: false, img: 'https://texspeckps.ru/img/qledger-cover.webp', f: ['4', 'вкладки с примером кода: JSON, Python, Go, CLI'], tools: ['Tilda', 'Zero Block', 'HTML/CSS/JS'], url: 'https://texspeckps.tilda.ws/qledger', p: 'Сложный B2B-продукт, который читается с первого экрана.' },
    { t: 'Кромка — заточка ножей', type: 'Лендинг', cat: 'Tilda', client: false, img: 'https://texspeckps.ru/img/kromka-cover.webp', f: ['5', 'позиций в калькуляторе заказа'], tools: ['Tilda', 'Zero Block', 'Калькулятор'], url: 'https://texspeckps.tilda.ws/kromka', p: 'Цена на первом экране, калькулятор и подписка для ресторанов.' }
  ],
  feature: {
    task: 'До сайта у кафе не было онлайн-заказов совсем — оформить заказ с доставкой через интернет было негде.',
    solution: 'Сайт-магазин, где презентация сразу ведёт к заказу: онлайн-меню, корзина, оформление доставки и карта с точками кафе. Мобильная версия — главная.',
    nums: [['86', 'заявок за неделю'], ['15,44%', 'конверсия — было 0'], ['№1', 'в поиске по области'], ['557', 'визитов за неделю'], ['72,5%', 'гостей с телефона']],
    review: { text: 'Всё сделали именно так, как я хотел. Сайт получился красивый, удобный, теперь клиенты легко оформляют заказы и доставку. Работать было приятно, всегда на связи.', who: 'Рубен Ш.', role: 'владелец кафе' }
  },
  reviews: [
    { text: 'Супер, мне очень нравится! Получилось именно так, как я себе представляла — стильно, чисто и со вкусом. Особенно понравилось, что сайт не выглядит шаблонным, всё смотрится цельно и дорого.', who: 'Вера Н.', role: 'веб-дизайнер', ini: 'ВН' },
    { text: 'Всё сделали именно так, как я хотел. Сайт получился красивый, удобный, теперь клиенты легко оформляют заказы и доставку. Работать было приятно, всегда на связи.', who: 'Рубен Ш.', role: 'владелец кафе', ini: 'РШ' },
    { text: 'Все задачи выполнялись оперативно, чётко и без лишних вопросов. Сайт получился современным, удобным и полностью соответствует нашим требованиям. Любые правки вносились быстро.', who: 'Светлана А.', role: 'школа фитнес-тренеров FitbasePro', ini: 'СА' }
  ],
  services: [
    ['UX/UI-дизайн в Figma', 'Прототипы, интерфейсы и визуальная концепция. Макеты сразу готовы к вёрстке.', 'от 10 000 ₽'],
    ['Сайты на Tilda и Zero Block', 'Лендинги, многостраничники и магазины, кастомная анимация на HTML, CSS и JS.', 'от 2 000 ₽'],
    ['Чат-боты и ИИ-ассистенты', 'Воронки продаж, приём заявок, игровые механики и ИИ, который отвечает 24/7.', 'от 5 000 ₽'],
    ['Онлайн-школы на GetCourse', 'Курсы, кабинеты, процессы, автоматизации и приём оплат.', 'от 10 000 ₽'],
    ['Вебинары и рассылки', 'Bizon365, цепочки писем и сообщений, которые возвращают тех, кто не купил.', 'по задаче']
  ],
  prices: [
    ['Лендинг на Tilda', 'от 2 000 ₽'], ['Многостраничный сайт', 'от 10 000 ₽'], ['Интернет-магазин', 'от 15 000 ₽'],
    ['Дизайн сайта в Figma', 'от 10 000 ₽'], ['Чат-бот: воронка продаж', 'от 5 000 ₽'], ['ИИ-ассистент для бизнеса', 'от 8 000 ₽'],
    ['Онлайн-школа на GetCourse', 'от 10 000 ₽'], ['Поддержка после запуска', '3–7 тыс ₽/мес']
  ],
  steps: [
    ['Заявка и знакомство', 'Обсуждаем цели, аудиторию и бюджет.'],
    ['Прототип и дизайн', 'Согласовываем структуру и визуал до сборки.'],
    ['Разработка', 'Верстаю, настраиваю анимации, ботов и интеграции.'],
    ['Тестирование', 'Проверяю на всех устройствах и вношу правки.'],
    ['Запуск и поддержка', 'Сопровождаю после старта, докручиваю метрики.']
  ],
  integrations: ['Figma', 'Tilda', 'Zero Block', 'HTML · CSS · JS', 'Salebot', 'ИИ-ассистенты', 'Telegram', 'VK', 'WhatsApp', 'GetCourse', 'Bizon365', 'CRM', 'Google Таблицы', 'Рассылки', 'Яндекс Метрика'],
  faq: [
    ['Сколько стоит проект под ключ?', 'Зависит от объёма: сайт-визитка, сложный Zero Block с анимацией и школа на GetCourse стоят по-разному. Точную сумму назову после разговора о задаче.'],
    ['В какие сроки делаете сайт, бота или школу?', 'Сайт-визитка — от 5–7 рабочих дней, сложный Zero Block с анимацией — от 2–3 недель. Комплекс «сайт + бот + школа» обсуждаем после разговора о задаче.'],
    ['Можно заказать только один этап?', 'Да: только дизайн, только вёрстку, только бота или только настройку GetCourse — или полный цикл.'],
    ['Работаете с готовым сайтом?', 'Да: дорабатываю существующий сайт на Tilda, добавляю анимации и ботов — или собираю всё с нуля.']
  ],
  about: 'Мне 31 год, родился в Брянске, живу в Троицке (Москва). Работаю с Figma, Tilda, Salebot и GetCourse, имею сертификаты по HTML, CSS и JavaScript — поэтому там, где конструктор упирается в потолок, дописываю код сам.',
  traits: [['Ответственный', 'Отвечаю за весь результат, а не за свой кусок'], ['Пунктуальный', 'Сроки согласуем заранее и держим их'], ['Спокойный', 'Без паники даже в горящих задачах'], ['Добросовестный', 'Проверяю всё на всех устройствах до сдачи']]
};

/* Демо-бот (сценарий по мотивам кейса «Жадор»). opts: {chat, replies, status, onEnd} */
window.mountBot = function (o) {
  const FLOW = {
    start: { bot: ['Здравствуйте! Я ИИ-администратор салона.', 'Помогу выбрать услугу и запишу на свободное время. Что вас интересует?'], opts: [['Маникюр', 'mani'], ['Сколько стоит?', 'price'], ['Вы работаете ночью?', 'night']] },
    night: { bot: ['Салон работает днём, а я — круглосуточно.', 'Могу прямо сейчас записать вас на ближайшее свободное окно.'], opts: [['Хочу на маникюр', 'mani']] },
    price: { bot: ['Цена зависит от услуги и мастера.', 'Выберите услугу — покажу стоимость и свободное время.'], opts: [['Маникюр с покрытием', 'mani']] },
    mani: { bot: ['Отличный выбор! Смотрю расписание мастеров…', 'Есть свободные окна на завтра:'], opts: [['11:00', 'book'], ['15:30', 'book'], ['18:00', 'book']] },
    book: { bot: ['Записала вас ✓', 'Запись уже в расписании CRM. Напомню о визите за день и за час до него.'], sys: 'запись создана в CRM · администратор уведомлён', opts: [['Как это настроить у себя?', 'end']] },
    end: { bot: ['Такого ассистента Павел соберёт под ваш бизнес — на ваших услугах, ценах и расписании.'], opts: [] }
  };
  let busy = false;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const add = (cls, html) => { const d = document.createElement('div'); d.className = 'msg ' + cls; d.innerHTML = html; o.chat.appendChild(d); o.chat.scrollTop = o.chat.scrollHeight; return d; };
  async function step(key, userText) {
    if (busy) return; busy = true; o.replies.innerHTML = '';
    if (userText) add('out', userText);
    const s = FLOW[key];
    for (const m of s.bot) {
      await wait(350); if (o.status) o.status.textContent = 'печатает…';
      const t = add('in typing', '<i></i><i></i><i></i>');
      await wait(Math.min(1300, 450 + m.length * 13)); t.remove(); add('in', m);
      if (o.status) o.status.textContent = 'онлайн';
    }
    if (s.sys) { await wait(250); add('sys', s.sys); }
    if (key === 'end') { if (o.onEnd) o.onEnd(o.replies); }
    else o.replies.innerHTML = s.opts.map(([l, k]) => `<button data-k="${k}">${l}</button>`).join('');
    busy = false;
  }
  o.replies.addEventListener('click', e => { const b = e.target.closest('button[data-k]'); if (b) step(b.dataset.k, b.textContent); });
  const restart = () => { if (busy) return; o.chat.innerHTML = ''; step('start'); };
  let started = false;
  new IntersectionObserver((en, ob) => { if (en[0].isIntersecting && !started) { started = true; step('start'); ob.disconnect(); } }, { threshold: .3 }).observe(o.chat);
  return { restart };
};

/* Появление блоков при прокрутке: элементы с [data-rv] */
window.reveal = function (cls) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add(cls || 'in'); io.unobserve(e.target); } }), { threshold: .12 });
  document.querySelectorAll('[data-rv]').forEach(el => {
    if (el.getBoundingClientRect().top < innerHeight) el.classList.add(cls || 'in'); // первый экран — сразу
    else io.observe(el);
  });
};

/* Единый логотип: монограмма «ПК» + «Павел Корчагин». Вид под стиль задаёт assets/logo.css (класс pk-logo--<стиль>).
   sub — необязательная подпись под именем (например, «сайты для кафе»). */
window.LOGO = function (st, sub) {
  return '<span class="pk-logo pk-logo--' + st + '"><span class="pk-mark" aria-hidden="true">ПК</span><span class="pk-word">Павел Корчагин' + (sub ? '<small>' + sub + '</small>' : '') + '</span></span>';
};

/* Плавающая кнопка «сменить стиль» */
window.styleSwitch = function (label) {
  const a = document.createElement('a');
  a.href = (window.ROOT || '') + 'index.html'; a.className = 'style-switch'; a.textContent = label || '↺ Сменить стиль';
  document.body.appendChild(a);
  if (window.linkPages) window.linkPages();
};

/* Все 25 кейсов с texspeckps.ru (первые — самые сильные) */
window.DATA.all = [{"id":"cafe-shop","t":"Кафе «Приятного аппетита»","type":"Интернет-магазин","cat":"Tilda","client":true,"img":"https://static.tildacdn.com/tild6132-3733-4237-a265-653539353236/2026-09-12_19-08-11.png","f":["№1","в поиске по своей области"],"tools":["Tilda","Онлайн-заказ","CRM"],"url":"https://priyatnogoappetita.tilda.ws/","p":"Сайт-магазин кафе, где презентация сразу ведёт к заказу: онлайн-меню, корзина, оформление доставки и карта с точками кафе."},
  {"id":"sb-jador","t":"ИИ-администратор салона «Жадор»","type":"ИИ-ассистент","cat":"Salebot","client":true,"img":"https://static.tildacdn.com/tild3235-6638-4861-b662-393936303634/2026-08-15_22-09-38.png","f":["24/7","консультации и запись"],"tools":["Salebot","ИИ","CRM"],"url":"","p":"Ассистент круглосуточно консультирует клиентов маникюрного салона, помогает выбрать услугу и записывает на свободное время прямо из расписания CRM."},
  {"id":"pro-technik","t":"PRO.Техник — онлайн-школа технических специалистов","type":"Онлайн-школа","cat":"GetCourse","client":true,"img":"https://static.tildacdn.com/tild3832-3337-4161-b033-633533653061/2026-08-15_22-43-44.png","f":["5","направлений работы в одной школе"],"tools":["GetCourse","Salebot","HTML / CSS / JS"],"url":"","p":"Школа учит зарабатывать на чат-ботах и автоматизации."},
  {"id":"qledger","t":"QLedger — лендинг финансового ядра для банков","type":"Лендинг","cat":"Tilda","client":false,"img":"https://texspeckps.ru/img/qledger-cover.webp","f":["7","разделов: от идеи продукта до блога"],"tools":["Tilda","Zero Block","HTML / CSS / JS"],"url":"https://texspeckps.tilda.ws/qledger","p":"Технологичный лендинг для сложного B2B-продукта: ядра финансового учёта, в котором ошибка невозможна по построению."},
  {"id":"ekskurpiter","t":"Экскурпитер — прогулки по рекам и каналам Петербурга","type":"Лендинг","cat":"Tilda","client":true,"img":"https://texspeckps.ru/img/ekskurpiter-cover.webp","f":["5","форматов прогулок с ценой и длительностью"],"tools":["Tilda","Zero Block","Формы заявок"],"url":"https://экскурпитер.рф/","p":"Лендинг речных прогулок: пять форматов, маршрут с воды, расписание по причалам и бронирование онлайн — путь от первого экрана до билета в WhatsApp."},
  {"id":"maxfit","t":"MAXFIT — школа фитнес-тренеров","type":"Многостраничный сайт","cat":"Tilda","client":true,"img":"https://static.tildacdn.com/tild6332-6432-4634-b632-663764653161/2026-08-01_17-19-48.png","f":["5","ключевых этапов пути пользователя"],"tools":["Tilda","Zero Block","Формы заявок"],"url":"https://fitbasepro.ru/","p":"Сайт школы, который превращает объёмную образовательную программу в понятный путь: узнать о школе, разобраться в программе и оставить заявку."},
  {"id":"sb-cafe","t":"Цифровой администратор кафе «Приятного аппетита»","type":"Бот для бизнеса","cat":"Salebot","client":true,"img":"https://static.tildacdn.com/tild3031-6335-4466-a666-373339383865/Gemini_Generated_Ima.jpg","f":["5","клиентских сценариев в одном боте"],"tools":["Salebot","Telegram","VK"],"url":"","p":"Первая цифровая точка контакта кафе: бот рассказывает о заведении, ведёт на сайт для заказа с доставкой, собирает отзывы за промокод и передаёт обращения руководителю."},
  {"id":"kromka","t":"Кромка — заточка ножей с курьером","type":"Лендинг","cat":"Tilda","client":false,"img":"https://texspeckps.ru/img/kromka-cover.webp","f":["5","позиций в калькуляторе заказа"],"tools":["Tilda","Zero Block","Калькулятор"],"url":"https://texspeckps.tilda.ws/kromka","p":"Лендинг мастерской заточки: курьер забирает тупые ножи и через 48 часов привозит острыми."},
  {"id":"sb-autowebinar","t":"Автовебинар, который работает по сценарию","type":"Воронка продаж","cat":"Salebot","client":false,"img":"https://static.tildacdn.com/tild6662-6362-4037-b463-363734383937/Gemini_Generated_Ima.png","f":["3","показа вебинара в одном сценарии"],"tools":["Salebot","Telegram","Автовебинар"],"url":"","p":"Бот регистрирует участников, прогревает их до эфира, сопровождает во время трансляции и возвращает тех, кто опоздал или не пришёл, — на два повторных показа."},
  {"id":"wave-sup","t":"Wave SUP — прогулки по рекам Петербурга","type":"Лендинг","cat":"Tilda","client":false,"img":"https://static.tildacdn.com/tild3666-3965-4961-a238-333461663531/2026-09-12_19-18-31.png","f":["6","маршрутов с ценами"],"tools":["Tilda","Zero Block","Формы заявок"],"url":"https://wave-sup.ru/","p":"Лендинг школы SUP-прогулок, который влюбляет в отдых на воде ещё до брони и ведёт от эмоции к записи в три простых шага."},
  {"id":"vera-portfolio","t":"Сайт-портфолио веб-дизайнера Веры","type":"Многостраничный сайт","cat":"Tilda","client":true,"img":"https://static.tildacdn.com/tild3537-3731-4936-b436-363330633439/2026-08-01_17-18-46.png","f":["1","площадка вместо нескольких ссылок"],"tools":["Tilda","Портфолио","VK"],"url":"https://link-laureate-sturgeon.tilda.ws/","p":"Одна площадка вместо россыпи ссылок: работы, услуги, стоимость и понятный следующий шаг для клиента."},
  {"id":"sb-channel","t":"Платный канал на автопилоте","type":"Воронка продаж","cat":"Salebot","client":false,"img":"https://static.tildacdn.com/tild3362-6537-4137-b335-666330363332/Gemini_Generated_Ima.png","f":["5","этапов: от знакомства до продления"],"tools":["Salebot","Telegram","Google Таблицы"],"url":"","p":"Бот продаёт доступ в закрытый канал, сам открывает его после оплаты и сам закрывает, когда подписка заканчивается."},
  {"id":"yurdirect","t":"Юрдирект — юридическое агентство","type":"Многостраничный сайт","cat":"Tilda","client":false,"img":"https://static.tildacdn.com/tild6533-6431-4439-b332-386232363561/2026-09-12_19-23-05.png","f":["5","практик права"],"tools":["Tilda","Zero Block","Формы заявок"],"url":"","p":"Сайт, который показывает агентство надёжным партнёром в пяти практиках права и делает процесс работы предсказуемым — от вопроса до консультации."},
  {"id":"mechanic","t":"Механик 102 — ремонт полуприцепов-цистерн","type":"Лендинг","cat":"Tilda","client":false,"img":"https://static.tildacdn.com/tild3536-3539-4439-b462-643634633930/2026-09-12_19-14-20.png","f":["8","шагов прозрачного процесса работы"],"tools":["Tilda","Zero Block","Формы заявок"],"url":"","p":"Сложная B2B-услуга объяснена через личную историю мастера, конкретные цифры и разбор реальных поломок — доверие вместо громких обещаний."},
  {"id":"sb-wheel","t":"Колесо фортуны за каждого друга","type":"Игровая механика","cat":"Salebot","client":false,"img":"https://static.tildacdn.com/tild3334-3962-4163-b338-356131663739/Gemini_Generated_Ima.png","f":["8","призов на колесе"],"tools":["Salebot","Telegram","Геймификация"],"url":"","p":"Реферальная программа превращена в игру: за каждого приглашённого, который оплатил курс, участник крутит колесо и выигрывает один из восьми призов."},
  {"id":"diva-n","t":"Дива-Н — мебель на заказ","type":"Интернет-магазин","cat":"Tilda","client":false,"img":"https://static.tildacdn.com/tild3837-3263-4666-b961-616664613830/2026-09-12_19-24-33.png","f":["4","категории мебели в каталоге"],"tools":["Tilda","Zero Block","Каталог"],"url":"","p":"Каталог с фильтрами по типу и обивке помогает быстро найти модель и дойти от просмотра до консультации по размеру и ткани."},
  {"id":"webinar-landing","t":"Из Figma в живой сайт: лендинг вебинара","type":"Лендинг","cat":"Tilda","client":false,"img":"https://static.tildacdn.com/tild6263-3537-4466-a531-643139383235/2026-08-21_21-44-46.png","f":["9","ключевых экранов"],"tools":["Tilda","Zero Block","Figma"],"url":"","p":"Лендинг практического вебинара по веб-дизайну: макет из Figma перенесён в Tilda через Zero Block без потери характера и собран под все экраны."},
  {"id":"sb-referral","t":"Реферальная программа без ручного учёта","type":"Автоматизация","cat":"Salebot","client":false,"img":"https://static.tildacdn.com/tild6665-6539-4162-b966-333132363239/Gemini_Generated_Ima.png","f":["1","единая база участников"],"tools":["Salebot","Telegram","Google Таблицы"],"url":"","p":"Бот сам фиксирует, кто кого пригласил, выдаёт промокоды и скидки и складывает всю статистику в Google Таблицу."},
  {"id":"tochka-opory","t":"ТОЧКА ОПОРЫ — курс для родителей подростков","type":"Лендинг","cat":"Tilda","client":false,"img":"https://static.tildacdn.com/tild3833-3734-4436-b139-666638643164/2026-08-30_18-46-25.png","f":["4","недели программы"],"tools":["Tilda","Zero Block","UX/UI"],"url":"","p":"Деликатная подача сложной темы: сайт сначала выстраивает доверие и только потом предлагает участие в программе."},
  {"id":"weekend-reset","t":"WEEKEND RESET — выходные перезагрузки","type":"Лендинг","cat":"Tilda","client":false,"img":"https://static.tildacdn.com/tild3230-3732-4939-a133-643336623937/2026-08-30_18-43-46.png","f":["9","экранов в галерее проекта"],"tools":["Tilda","Zero Block","Адаптивный дизайн"],"url":"","p":"Лендинг загородного wellness-выезда, который передаёт ощущение отдыха ещё до чтения деталей — дизайн здесь продаёт наравне с текстом."},
  {"id":"sb-course","t":"Воронка курса: от знакомства до доступа","type":"Воронка продаж","cat":"Salebot","client":false,"img":"https://static.tildacdn.com/tild6661-3139-4564-b235-336137326533/2026-08-15_21-46-09.png","f":["5","этапов: от знакомства до доступа"],"tools":["Salebot","Telegram","Приём оплат"],"url":"","p":"Бот знакомит с курсом, выдаёт видео и материалы, возвращает тех, кто остановился на полпути, и после оплаты сам открывает доступ к обучению."},
  {"id":"fold8-ozon","t":"Samsung Galaxy Z Fold8 — инфографика для карточки Ozon","type":"Инфографика для маркетплейса","cat":"Figma","client":false,"img":"https://texspeckps.ru/img/fold8-cover.webp","f":["6","слайдов в серии карточки"],"tools":["Figma","Инфографика","Ozon"],"url":"","p":"Серия из шести слайдов для карточки товара: обложка, экран, камера, Galaxy AI, батарея и таблица характеристик."},
  {"id":"figma-webinar","t":"Лендинг вебинара: от пустого холста до готового UI","type":"UX/UI-дизайн","cat":"Figma","client":false,"img":"https://static.tildacdn.com/tild6263-3537-4466-a531-643139383235/2026-08-21_21-44-46.png","f":["4","слоя: UX → каркас → UI → прототип"],"tools":["Figma","UX","UI"],"url":"","p":"Вебинар о старте в веб-дизайне без портфолио."},
  {"id":"sb-portfolio-ai","t":"ИИ-ассистент для сайта-портфолио","type":"ИИ-ассистент","cat":"Salebot","client":false,"img":"https://static.tildacdn.com/tild3637-3736-4162-a461-353833346630/2026-08-15_22-02-00.png","f":["24/7","ответы потенциальным клиентам"],"tools":["Salebot","ИИ","База знаний"],"url":"https://texspeckps.ru/faq","p":"Ассистент отвечает посетителям по базе знаний об услугах, ценах и проектах, а если вопрос нестандартный — передаёт человека и тему обращения напрямую мне."},
  {"id":"sb-cards","t":"Игровой бот «Магические карты»","type":"Игровая механика","cat":"Salebot","client":false,"img":"https://static.tildacdn.com/tild3635-3633-4331-b761-323066633335/2026-05-12_00-52-32.png","f":["1","игровая механика внутри бота"],"tools":["Salebot","Telegram","Геймификация"],"url":"","p":"Пользователь вытягивает случайную карту и получает персональную трактовку своей ситуации — а потом хочет попробовать ещё раз."}];

/* Демо-бот в Telegram (папка test-bot): 8 сценариев, ссылка ?start=<код> открывает сценарий сразу.
   Подписи — факты о сценариях, общие для всех стилей; заголовки блока у каждого стиля свои (voice.demo в site.js). */
window.DATA.bot = {
  user: 'Bot_PortfolioRabot',
  url: 'https://t.me/Bot_PortfolioRabot',
  qr: '../assets/bot-qr.svg',
  scenarios: [
    ['webinar', '🎥', 'Автовебинар', 'Школа съёмки: регистрация, напоминания, эфир, оффер и дожим'],
    ['channel', '🔐', 'Закрытый канал по подписке', 'Фитнес-клуб: оплата, доступ, продление и возврат ушедших'],
    ['leadmagnet', '🎁', 'Лид-магнит', 'Бухгалтер для ИП: чек-лист за подписку, прогрев, консультация'],
    ['quiz', '📝', 'Тест с баллами', 'Агентство: 7 вопросов, результат по баллам и свой оффер'],
    ['wheel', '🎡', 'Колесо фортуны', 'Пиццерия: приз с вероятностью, промокод и напоминания'],
    ['booking', '📅', 'Онлайн-запись', 'Студия красоты: филиал, услуга, мастер, время, напоминания'],
    ['leads', '📨', 'Сбор заявок', 'Кухни на заказ: квиз, фото, карточка менеджеру, замер'],
    ['referral', '🤝', 'Реферальная программа', 'Доставка еды: личная ссылка, бонусы друзьям и уровни']
  ]
};
window.DATA.bot.link = (code) => window.DATA.bot.url + (code ? '?start=' + code : '');

/* Внутренние страницы. Пока ведут на действующий texspeckps.ru —
   когда страницы будут сделаны в стиле, адреса меняются только здесь. */
window.DATA.pages = {
  cases: 'https://texspeckps.ru/keys',
  tilda: 'https://texspeckps.ru/tilda',
  salebot: 'https://texspeckps.ru/salebot',
  getcourse: 'https://texspeckps.ru/getcourse',
  figma: 'https://texspeckps.ru/figma',
  price: 'https://texspeckps.ru/price',
  services: 'https://texspeckps.ru/uslugi/sajty-na-tilda',
  reviews: 'https://texspeckps.ru/otzivi',
  faq: 'https://texspeckps.ru/faq',
  about: 'https://texspeckps.ru/rezume',
  blog: 'https://texspeckps.ru/blog',
  bonus: 'https://texspeckps.ru/iambonus',
  form: 'https://texspeckps.ru/form',
  bot: 'bot.html'
};
/* Ссылка вида service.html?s=salebot#demo: блок рисуется скриптом, а шрифты и картинки догружаются позже,
   поэтому докручиваем к якорю несколько раз — пока человек сам не тронул страницу */
window.scrollToHash = function () {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;
  let touched = false;
  const stop = () => { touched = true; };
  ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach((e) => addEventListener(e, stop, { once: true, passive: true }));
  const go = () => { const el = document.getElementById(id); if (el && !touched) el.scrollIntoView({ behavior: 'instant' }); };
  [60, 400, 1200, 2500].forEach((t) => setTimeout(go, t));
  if (document.fonts) document.fonts.ready.then(go);
  addEventListener('load', () => { go(); setTimeout(go, 300); });
};

/* ИИ-ассистент Salebot прямо в странице вопросов (а не всплывающим окном в углу).
   Виджет Salebot сам создаёт своё окно (iframe #parent_frame) — мы держим его открытым и ставим точно поверх блока el.
   Работает только на texspeckps.ru (Salebot привязан к домену); если не загрузился — в блоке ссылка на Telegram. */
window.dockAssistant = function (el) {
  if (!el || window.__aiDock) return;
  window.__aiDock = true;
  const GUID = 'deff08aa10e87edf46d7e68751d94d';
  const fail = () => {
    if (document.getElementById('parent_frame')) return;
    el.innerHTML = '<div class="ai-dock-fail"><p>Ассистент открывается только на texspeckps.ru.</p><a href="https://t.me/PavelTexSpec" target="_blank" rel="noopener">Написать Павлу в Telegram →</a></div>';
  };
  const css = document.createElement('style');
  document.head.appendChild(css);
  let last = '';
  const place = () => {
    const f = document.getElementById('parent_frame');
    if (!f) return;
    const r = el.getBoundingClientRect();
    const key = [r.top + scrollY, r.left + scrollX, r.width, r.height].map(Math.round).join(',');
    if (key === last) return;
    last = key;
    const [t, l, w, h] = key.split(',');
    css.textContent = `#parent_frame{position:absolute!important;top:${t}px!important;left:${l}px!important;right:auto!important;bottom:auto!important;width:${w}px!important;max-width:none!important;height:${h}px!important;max-height:none!important;transform:none!important;box-shadow:none!important;z-index:2!important;display:block!important;border-radius:16px!important;visibility:visible!important;opacity:1!important}
      .msb_circle_trigger,#msb_social_contacts_container,#msb_prompt_id,#small_preview_msb{display:none!important}`;
  };
  const s = document.createElement('script');
  s.src = 'https://salebot.pro/js/chatbot.js?v=1';
  s.async = true;
  s.onerror = fail;
  s.onload = () => {
    const CB = window.ChatBotPro;
    if (!CB) return fail();
    CB.init({ guid: GUID });
    // открываем, как только окно ассистента появится, и не даём его свернуть
    let tries = 0;
    const t = setInterval(() => {
      tries++;
      if (document.getElementById('parent_frame')) {
        clearInterval(t);
        try { CB.open(); } catch (e) { /* ничего */ }
        CB.close = function () {};
        el.classList.add('ai-dock-on');
        place();
      } else if (tries > 40) { clearInterval(t); fail(); }
    }, 250);
  };
  document.head.appendChild(s);
  addEventListener('resize', place);
  addEventListener('scroll', place, { passive: true });
  setInterval(place, 500); // раскрылся вопрос выше, догрузились шрифты — блок сдвинулся
};

/* Подставляет адреса во все ссылки вида <a data-page="price"> */
window.linkPages = function () {
  document.querySelectorAll('a[data-page]').forEach(a => {
    a.href = window.DATA.pages[a.dataset.page] || '#';
    if (/^https?:/.test(a.href) && !a.href.includes(location.host)) { a.target = '_blank'; a.rel = 'noopener'; }
  });
};

// Длинные слова в крупном тексте (особенно на телефоне): если слово шире своей колонки (или экрана),
// уменьшаем шрифт этого элемента ровно настолько, чтобы слово влезло. Никаких вылезаний и прокрутки вбок.
(function () {
  const SKIP = '[aria-hidden="true"],.mega,.row,.mq,.tick,.marquee,.ticker,.wall,.rows,.reel,svg,script,style,select,option,#parent_frame';
  const blockOf = (el) => { for (let x = el; x; x = x.parentElement) { const d = getComputedStyle(x).display; if (d !== 'inline' && d !== 'contents') return x; } return document.body; };
  function fit() {
    const els = document.querySelectorAll('[data-fit]');
    els.forEach(e => { e.style.fontSize = e.dataset.fit; e.removeAttribute('data-fit'); });
    const VW = document.documentElement.clientWidth;
    for (let pass = 0; pass < 3; pass++) {
      for (const el of document.body.querySelectorAll('*')) {
        if (!el.firstChild || el.closest(SKIP)) continue;
        if (![...el.childNodes].some(n => n.nodeType === 3 && /\S{5,}/.test(n.nodeValue))) continue;
        const cs = getComputedStyle(el), fs = parseFloat(cs.fontSize);
        if (fs < 17 || cs.position === 'fixed') continue;
        let box = blockOf(el);
        // ширина, заданная в символах (max-width: 20ch), сжимается вместе со шрифтом — меряем по внешней колонке
        while (box.parentElement && box !== document.body && getComputedStyle(box).maxWidth !== 'none') box = box.parentElement;
        const bcs = getComputedStyle(box), br = box.getBoundingClientRect();
        if (!br.width) continue;
        const limL = Math.max(br.left + parseFloat(bcs.paddingLeft), 2), limR = Math.min(br.right - parseFloat(bcs.paddingRight), VW - Math.max(8, Math.min(limL, 24)));
        const rg = document.createRange(); rg.selectNodeContents(el);
        let minL = 1e9, maxR = -1e9;
        for (const r of rg.getClientRects()) if (r.width > 1) { minL = Math.min(minL, r.left); maxR = Math.max(maxR, r.right); }
        if (maxR < 0) continue;
        const need = maxR - minL, have = limR - limL, over = Math.max(maxR - limR, limL - minL);
        if (over <= 1 || have <= 40) continue;
        const k = Math.max(0.5, Math.min(0.98, have / need));
        if (!el.hasAttribute('data-fit')) el.dataset.fit = el.style.fontSize || '';
        el.style.fontSize = (fs * k).toFixed(2) + 'px';
      }
    }
  }
  let t; const later = (ms) => { clearTimeout(t); t = setTimeout(fit, ms || 120); };
  window.fitText = fit;
  document.addEventListener('DOMContentLoaded', () => later(30));
  addEventListener('load', () => later(30));
  addEventListener('resize', () => later(150));
  document.addEventListener('toggle', () => later(30), true);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => later(30));
  setTimeout(() => later(1), 1500);
  const mo = new MutationObserver(() => later(200));
  const start = () => mo.observe(document.body, { childList: true, subtree: true, characterData: true });
  document.body ? start() : document.addEventListener('DOMContentLoaded', start);
})();
