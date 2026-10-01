/* Экспериментальный стиль (кинетическая типографика): рубленые фразы, крупные слова, движение */
// проекты списком-индексом: строка заливается цветом, рядом с курсором — превью
const kinCard = (c, i) => `<a class="card idx-row" data-cat="${c.cat}" href="case.html?id=${c.id}" data-img="${c.img}"><span class="idx-n">${String(i + 1).padStart(2, '0')}</span><b class="card-title">${c.t.split(/ — |: /)[0]}</b><span class="idx-meta">${c.type}<br>${c.f ? c.f[0] : ''}</span></a>`;
ENGINE({
  name: 'экспериментальный',
  hdLogo: LOGO('kinetic'), hdCta: 'Связь ↗', hdMenu: 'Меню',
  switchLabel: 'Стиль ↺',
  ft: { about: 'Делаю сайты. Делаю ботов. Делаю школы. Сам.', h1: 'Проекты', h2: 'Разделы', h3: 'Связь', bonus: '10% за друга' },
  ui: { card: kinCard, cards: (list) => '<div class="cards idx">' + list.map(kinCard).join('') + '</div>' },
  after: () => {
    const ci = document.createElement('img'); ci.className = 'cursor-img'; ci.alt = ''; document.body.appendChild(ci);
    document.querySelectorAll('.idx-row').forEach((a) => { a.addEventListener('mouseenter', () => { ci.src = a.dataset.img; ci.classList.add('on'); }); a.addEventListener('mouseleave', () => ci.classList.remove('on')); });
    addEventListener('mousemove', (e) => { ci.style.left = e.clientX + 'px'; ci.style.top = e.clientY + 'px'; });
    // заголовки страниц сдвигаются при прокрутке
    const t = document.querySelector('.pg-title'); if (t && !matchMedia('(prefers-reduced-motion: reduce)').matches) addEventListener('scroll', () => { t.style.transform = `translateX(${-scrollY * .25}px)`; }, { passive: true });
  },
  voice: {
    titleSfx: 'Павел К.', home: 'Главная', sep: '✳',
    nav: { cases: 'Кейсы', services: 'Цены', reviews: 'Отзывы', blog: 'Блог', about: 'Кто', faq: 'Вопросы' },
    cta: { btn: 'Заявка ↗', btn2: 'Telegram ↗' },
    cases: { title: 'Кейсы', kicker: 'Проекты · наведите', h1: 'Проекты<br><span class="o">25 штук</span>', lead: 'Сайты. Боты. Школы. Дизайн. Наведите на строку — увидите работу.', note: '',
      all: 'Всё', cats: { Tilda: 'Сайты', Salebot: 'Боты', GetCourse: 'Школы', Figma: 'Дизайн' }, client: 'клиент', own: 'своё', more: '↗',
      endH: 'Давайте <span class="o">начнём</span>', endP: 'Пара строк о задаче. Ответ в течение рабочего дня.', endBtn: 'Начать ↗' },
    case: { titleSfx: 'кейс · Павел К.', client: 'клиент', own: 'свой проект', live: 'Сайт ↗', similar: 'Хочу так ↗', similarTask: 'Как',
      chapters: ['Задача', 'Механика', 'Сделано', 'Итог'], toolsH: 'Стек', galleryH: 'Кадры', relatedH: 'Продолжение', pagerH: 'Дальше', prev: '← Назад', next: 'Вперёд →',
      ctaH: 'Ваш <span class="o">следующий</span>', ctaP: 'Опишите задачу — посчитаю.', nfH: 'Нет<br><span class="o">такого</span>', nfP: 'Кейс не найден.', nfBtn: 'Все кейсы' },
    services: { title: 'Цены', kicker: 'Что делаю', h1: 'Цены<br><span class="o">прямо</span>', lead: 'Вилки от и до. Точная сумма — после созвона. Дальше не растёт.', note: '',
      groupBtn: 'Направление ↗', packsH: 'Наборы', time: 'срок',
      intro: { salebot: ['01', 'Боты', 'Говорят. Продают. Записывают. Ночью тоже.'], tilda: ['02', 'Сайты', 'Ведут к заявке. Не висят для красоты.'], figma: ['03', 'Дизайн', 'Сначала логика. Потом форма.'], getcourse: ['04', 'Школы', 'Доступ открывается сам.'], webinar: ['05', 'Эфиры', 'Приходят. Слушают. Покупают.'] },
      howK: 'Процесс', howH: 'Четыре такта', how: [['Созвон', 'Без ТЗ.'], ['Смета', 'Цена заранее.'], ['Работа', 'Показываю по ходу.'], ['Запуск', 'И поддержка.']],
      endH: 'Не <span class="o">нашли?</span>', endP: 'Опишите своими словами.', endBtn: 'Описать ↗' },
    service: { whoK: 'Кому', whoH: 'Для кого', menuK: 'Позиции', menuH: 'Меню', casesK: 'Кейсы', casesH: 'Сделано', stepsK: 'Процесс', stepsH: 'Четыре такта', faqK: 'Вопросы', faqH: 'Вопросы', ctaH: 'Ну <span class="o">что?</span>', ctaP: 'Цена до старта.', ctaBtn: 'Обсудить ↗', priceBtn: 'Цены',
      steps: [['Созвон', 'Задача.'], ['Смета', 'Цена.'], ['Работа', 'Показы.'], ['Запуск', 'Поддержка.']],
      intro: { salebot: { h: 'Боты<br><span class="o">24/7</span>', p: 'Salebot, ИИ, запись, оплаты. Бот работает — вы отдыхаете.' }, tilda: { h: 'Сайты<br><span class="o">с заявками</span>', p: 'Tilda, Zero Block, код. Сайт, который продаёт с первого дня.' },
        figma: { h: 'Дизайн<br><span class="o">с логикой</span>', p: 'Прототип. Интерфейс. Без переделок на вёрстке.' }, getcourse: { h: 'Школы<br><span class="o">сами</span>', p: 'GetCourse: уроки, доступы, оплаты — без ручной работы.' }, webinar: { h: 'Эфиры<br><span class="o">полные</span>', p: 'Bizon365, напоминания, письма.' } } },
    reviews: { title: 'Отзывы', kicker: 'Отзывы · 0 отрицательных', h1: 'Слова<br><span class="o">заказчиков</span>', lead: 'Целиком. Без правок.', proj: 'Проект ↗', endH: 'Следующий <span class="o">вы?</span>', endP: 'Начнём с созвона.', endBtn: 'Начать ↗' },
    faq: { title: 'Вопросы', kicker: 'Вопросы', h1: 'Вопросы<br><span class="o">и ответы</span>', lead: 'Нет ответа — спросите ассистента.', aiK: 'Ассистент 24/7', aiH: 'Спросить ↗', aiP: 'Услуги, сроки, цены. Круглосуточно.', aiBtn: 'Задать вопрос', aiAlt: 'Или в', endH: 'Ещё <span class="o">вопросы?</span>', endP: 'Пишите.' },
    about: { title: 'Кто', kicker: 'Кто', h1: 'Павел<br><span class="o">Корчагин</span>', text: ['31 год. Родился в Брянске. Живу в Троицке, Москва.', 'Дизайн. Сайты. Боты. Школы. Рассылки. Сам — от эскиза до оплаты.', 'Где конструктор заканчивается — пишу код.'],
      factsH: 'Факты', traitsH: 'Характер', eduH: 'Учёба', specK: 'Что делаю', specH: 'Направления', skillsH: 'Стек', hh: 'hh.ru ↗', ctaH: 'Давайте <span class="o">начнём</span>', ctaP: 'Созвон — 20 минут.' },
    blog: { title: 'Блог', kicker: 'Блог', h1: 'Блог<br><span class="o">коротко</span>', lead: 'Цены. Устройство. Практика.', read: 'мин', endH: 'Ваша <span class="o">тема?</span>', endP: 'Пришлите вопрос.', endBtn: 'Предложить ↗' },
    post: { noteH: 'NB.', caseK: 'Кейс', ctaH: 'Так же <span class="o">у вас?</span>', ctaP: 'Посчитаю.', ctaBtn: 'Посчитать ↗', moreH: 'Ещё', nf: 'Нет статьи' },
    bonus: { title: '10% за друга', crumb: '10%', kicker: 'Рекомендации', h1: 'Друг<br><span class="o">= 10%</span>', lead: 'Рекомендуете — получаете десятую часть его оплаты. При сопровождении — каждый месяц.', big: '10%',
      stepsK: 'Схема', stepsH: 'Четыре шага', whyK: 'Почему', whyH: 'Не подведу', termsH: 'Условия', ctaH: 'Есть <span class="o">кто?</span>', ctaP: 'Передайте контакт.', ctaBtn: 'Передать ↗' },
    contact: { title: 'Связь', crumb: 'Связь', kicker: 'Связь', h1: 'Давайте<br><span class="o">начнём</span>', lead: 'Пара строк — и в работе. Ответ в течение рабочего дня.', alt: 'Или напрямую:',
      labels: { name: 'Имя', namePh: '', service: 'Что нужно', task: 'Задача', taskPh: 'коротко', budget: 'Бюджет, ₽', budgetPh: '', contact: 'Контакт', contactPh: '@telegram / телефон', comment: 'Ещё', commentPh: 'ссылки, сроки', agree: 'Согласен на обработку данных по', send: 'Отправить ↗', hint: 'Ответ — в течение рабочего дня' },
      errs: { need: 'Имя и контакт обязательны', agree: 'Нужна галочка согласия', sending: 'Отправка…', sent: 'Отправлено' } },
    thanks: { title: 'Принято', kicker: 'Принято', h1: 'Принято<br><span class="o">спасибо</span>', lead: 'В течение рабочего дня.', btn: 'Кейсы ↗', moreH: 'Пока ждёте' },
    privacy: { crumb: 'Политика', h1: 'Политика', lead: 'Как обрабатываются ваши данные.' },
    nf: { h1: '404<br><span class="o">пусто</span>', lead: 'Страница не найдена.', btn: 'На главную ↗' }
  }
});
