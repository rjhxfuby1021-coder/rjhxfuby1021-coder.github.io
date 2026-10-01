/* Для айтишников (Stripe Docs, GitHub Docs): страницы как разделы документации, слева оглавление */
const PGI = document.body.dataset.page || '';
ENGINE({
  name: 'для айтишников',
  featured: ['qledger', 'pro-technik', 'sb-portfolio-ai', 'sb-autowebinar', 'kromka', 'figma-webinar', 'webinar-landing'],
  switchLabel: 'style.switch()',
  header: (nav, H) => `<header class="site-hd"><div class="top"><a class="brand" href="${H.P.home}">${LOGO('it')}<small>/ docs</small></a><span class="search">🔍 Поиск по документации <kbd>Ctrl K</kbd></span>
    <a class="btn btn-1 hd-cta" href="${H.P.contact}">Начать проект</a><button class="burger" data-burger aria-expanded="false" aria-controls="mnav">☰</button></div>
    <aside class="side mnav" id="mnav"><h5>Начало</h5><a href="${H.P.home}">Обзор</a><a href="${H.P.about}" class="${PGI === 'about' ? 'on' : ''}">Об исполнителе</a>
    <h5>Справочник</h5><a href="${H.P.services}" class="${PGI === 'services' ? 'on' : ''}"><span class="m get">GET</span>/pricing</a>${['salebot', 'tilda', 'figma', 'getcourse', 'webinar'].map((s) => `<a href="${H.P.service}?s=${s}" class="${PGI === 'service' && H.param('s') === s ? 'on' : ''}"><span class="m get">GET</span>/services/${s}</a>`).join('')}<a href="${H.P.contact}" class="${PGI === 'contact' ? 'on' : ''}"><span class="m post">POST</span>/projects</a>
    <h5>Ресурсы</h5><a href="${H.P.cases}" class="${['cases', 'case'].includes(PGI) ? 'on' : ''}">Changelog (кейсы)</a><a href="${H.P.blog}" class="${['blog', 'post'].includes(PGI) ? 'on' : ''}">Гайды</a><a href="${H.P.reviews}" class="${PGI === 'reviews' ? 'on' : ''}">Отзывы</a><a href="${H.P.faq}" class="${PGI === 'faq' ? 'on' : ''}">FAQ</a><a href="${H.P.bonus}" class="${PGI === 'bonus' ? 'on' : ''}">Партнёрам</a><a href="${H.P.privacy}" class="${PGI === 'privacy' ? 'on' : ''}">Privacy</a></aside></header>`,
  footer: (H) => `<footer class="site-ft"><div class="w"><div class="next-links"><a href="${H.P.contact}"><small>Следующий шаг</small><b>Отправить бриф →</b></a><a href="https://t.me/PavelTexSpec" target="_blank" rel="noopener"><small>Или напрямую</small><b>Telegram @PavelTexSpec →</b></a></div><div class="ft-base"><span>© 2026 Павел Корчагин · Троицк (Москва)</span><span>Последнее обновление: 2026</span></div></div></footer>`,
  voice: {
    titleSfx: 'Docs · Павел Корчагин', home: 'Docs', sep: '›',
    nav: { cases: 'Changelog', services: 'Pricing', reviews: 'Отзывы', blog: 'Гайды', about: 'Об исполнителе', faq: 'FAQ' },
    cta: { btn: 'Отправить бриф', btn2: 'Telegram' },
    cases: { title: 'Changelog', kicker: 'Ресурсы', h1: 'Changelog · <span>кейсы</span>', lead: 'Все релизы — 25 проектов. Первыми — ближе всего к IT: лендинг финансового ядра с вкладками кода, онлайн-школа для техспециалистов, ИИ-ассистент на базе знаний, автоворонки.', note: '',
      all: 'all', cats: { Tilda: 'sites', Salebot: 'bots', GetCourse: 'schools', Figma: 'design' }, client: 'client', own: 'own', more: 'Читать релиз →',
      endH: 'Следующий релиз — <span>ваш</span>', endP: 'Готовое ТЗ не нужно: вопросы задам на созвоне.', endBtn: 'Отправить бриф' },
    case: { titleSfx: 'релиз', client: 'client', own: 'own', live: 'Открыть ↗', similar: 'Запросить похожий', similarTask: 'Проект как',
      chapters: ['Контекст', 'Архитектура', 'Изменения', 'Результат'], toolsH: 'Stack', galleryH: 'Скриншоты', relatedH: 'См. также', pagerH: 'Навигация', prev: '← Предыдущий', next: 'Следующий →',
      ctaH: 'Нужен похожий <span>релиз?</span>', ctaP: 'Опишите задачу — пришлю план и смету.', nfH: '404 · релиз не найден', nfP: 'Проверьте параметр id.', nfBtn: 'Changelog' },
    services: { title: 'Pricing', kicker: 'Справочник · GET /pricing', h1: 'Pricing', lead: 'Диапазоны цен и сроки по каждому ресурсу. Итоговая стоимость фиксируется до старта и не меняется.', note: '',
      groupBtn: 'Документация ресурса →', packsH: 'Bundles', time: 'eta',
      intro: { salebot: ['/services/salebot', 'Chat-bots', 'Сценарии, интеграции, ИИ на базе знаний, онлайн-запись.'], tilda: ['/services/tilda', 'Sites', 'Tilda + Zero Block + HTML/CSS/JS, SEO и аналитика.'], figma: ['/services/figma', 'Design', 'Прототип, UI, UX-аудит.'], getcourse: ['/services/getcourse', 'Online schools', 'GetCourse: процессы, автоматизации, оплаты.'], webinar: ['/services/webinar', 'Webinars', 'Bizon365, напоминания, рассылки.'] },
      howK: 'Lifecycle', howH: 'Жизненный цикл проекта', how: [['call', 'Созвон, без ТЗ.'], ['estimate', 'Смета и сроки.'], ['build', 'Демо по ходу.'], ['support', 'Поддержка после релиза.']],
      endH: 'Нет нужного ресурса?', endP: 'Опишите задачу — подготовлю смету.', endBtn: 'Отправить бриф' },
    service: { whoK: 'Use cases', whoH: 'Сценарии использования', menuK: 'Endpoints', menuH: 'Состав и стоимость', casesK: 'Examples', casesH: 'Примеры', stepsK: 'Lifecycle', stepsH: 'Жизненный цикл', faqK: 'FAQ', faqH: 'Частые вопросы', ctaH: 'Начать <span>проект</span>', ctaP: 'Смета — до старта.', ctaBtn: 'Отправить бриф', priceBtn: 'Pricing',
      steps: [['call', 'Задача и цели.'], ['estimate', 'Объём и цена.'], ['build', 'Промежуточные демо.'], ['release', 'Тест и поддержка.']],
      intro: { salebot: { h: 'Chat-bots <span>API</span>', p: 'Боты в Salebot: воронки, приём заявок, онлайн-запись, платные каналы, ИИ-ассистент на вашей базе знаний. Интеграции с CRM и Google Sheets.' }, tilda: { h: 'Sites <span>reference</span>', p: 'Лендинги для сложных технических продуктов — понятные и бизнесу, и инженерам: схемы, таблицы, вкладки кода. Tilda, Zero Block, свой код.' },
        figma: { h: 'Design <span>reference</span>', p: 'Прототипы, интерфейсы и дизайн-системы в Figma, готовые к вёрстке.' }, getcourse: { h: 'GetCourse <span>reference</span>', p: 'Платформа обучения от пустого конструктора до рабочего процесса: курсы, доступы, процессы, оплаты.' }, webinar: { h: 'Webinars <span>reference</span>', p: 'Bizon365, бот-напоминалка, цепочки писем.' } } },
    reviews: { title: 'Отзывы', kicker: 'Ресурсы', h1: 'Отзывы', lead: 'Тексты заказчиков без изменений. negative_reviews: 0.', proj: 'Релиз →', endH: 'Станете следующим?', endP: 'Начнём с созвона.', endBtn: 'Отправить бриф' },
    faq: { title: 'FAQ', kicker: 'Ресурсы', h1: 'FAQ', lead: 'Не нашли ответ — спросите ИИ-ассистента.', aiK: 'assistant · online', aiH: 'Спросить ассистента', aiP: 'Обучен на базе знаний об услугах, сроках и ценах. Сложные вопросы эскалирует исполнителю.', aiBtn: 'Открыть чат', aiAlt: 'Или напрямую в', endH: 'Нужна поддержка?', endP: 'Ответ — в течение рабочего дня.' },
    about: { title: 'Об исполнителе', kicker: 'Начало', h1: 'Об <span>исполнителе</span>', text: ['Павел Корчагин, 31 год. Родился в Брянске, живу в Троицке (Москва). Remote.', 'Stack: Figma, Tilda, Zero Block, Salebot, GetCourse, Bizon365, HTML/CSS/JS.', 'Делаю лендинги для сложных продуктов, автоматизации и школы — и отвечаю за результат целиком.'],
      factsH: 'Параметры', traitsH: 'Свойства', eduH: 'Образование', specK: 'Модули', specH: 'Направления', skillsH: 'Skills', hh: 'Резюме на hh.ru ↗', ctaH: 'Начать <span>проект</span>', ctaP: 'Созвон — 20 минут.' },
    blog: { title: 'Гайды', kicker: 'Ресурсы', h1: 'Гайды', lead: 'Стоимость ботов, структура лендинга, автоматизация записи.', read: 'мин', endH: 'Предложить гайд', endP: 'Пришлите вопрос.', endBtn: 'Предложить' },
    post: { noteH: 'Note:', caseK: 'Релиз', ctaH: 'Применить к вашему <span>продукту?</span>', ctaP: 'Пришлю смету.', ctaBtn: 'Отправить бриф', moreH: 'Другие гайды', nf: '404 · гайд не найден' },
    bonus: { title: 'Партнёрам', crumb: 'Партнёрам', kicker: 'Ресурсы', h1: 'Партнёрская <span>программа</span>', lead: 'reward: 10% от оплаченной суммы заказа; при сопровождении — с каждого ежемесячного платежа.', big: '10%',
      stepsK: 'Flow', stepsH: 'Как это работает', whyK: 'Why', whyH: 'Надёжность', termsH: 'Terms', ctaH: 'Передать <span>контакт</span>', ctaP: 'Или ссылку на сайт.', ctaBtn: 'Передать' },
    contact: { title: 'POST /projects', crumb: 'POST /projects', kicker: 'Справочник · POST /projects', h1: 'POST /projects', lead: 'Создаёт заявку. Ответ приходит в Telegram в течение рабочего дня.', alt: 'Альтернатива:',
      labels: { name: 'name · string · required', namePh: 'Иван', service: 'service · enum', task: 'task · string', taskPh: 'лендинг для SaaS', budget: 'budget · number, ₽', budgetPh: '50000', contact: 'contact · string · required', contactPh: '@telegram | phone', comment: 'comment · string', commentPh: 'ссылки, сроки, требования', agree: 'Согласен на обработку данных по', send: 'Отправить запрос', hint: '200 OK → ответ в течение рабочего дня' },
      errs: { need: '400 Bad Request: name и contact обязательны', agree: '400 Bad Request: требуется согласие', sending: 'Отправка…', sent: '200 OK' } },
    thanks: { title: '200 OK', kicker: '200 OK', h1: 'Запрос <span>принят</span>', lead: 'Ответ — в течение рабочего дня.', btn: 'Changelog', moreH: 'Пока ждёте' },
    privacy: { crumb: 'Privacy', h1: 'Privacy policy', lead: 'Обработка персональных данных.' },
    nf: { h1: '404 Not Found', lead: 'Раздел документации не найден.', btn: 'Docs' }
  }
});
