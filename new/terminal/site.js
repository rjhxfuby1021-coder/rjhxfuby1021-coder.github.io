/* Технарь (Warp, Vercel CLI): страницы как вывод команд, пояснения — комментариями */
ENGINE({
  name: 'технарь',
  switchLabel: '$ cd ../styles',
  header: (nav, H) => `<header class="site-hd"><div class="w"><a class="logo" href="${H.P.home}">${LOGO('terminal')}</a>
    <nav aria-label="Разделы">${nav.map((n) => `<a href="${n.h}" class="${n.on ? 'on' : ''}">./${({ cases: 'cases', services: 'price', bot: 'bot', reviews: 'reviews', blog: 'blog', about: 'whoami', faq: 'faq' })[n.k]}</a>`).join('')}</nav>
    <a class="btn btn-1 hd-cta" href="${H.P.contact}">$ brief</a><button class="burger" data-burger aria-expanded="false" aria-controls="mnav">menu</button></div>
    <div class="mnav" id="mnav">${nav.map((n) => `<a href="${n.h}">./${n.k}</a>`).join('')}<a href="${H.P.contact}">./brief</a></div></header>`,
  footer: (H) => `<footer class="site-ft"><div class="w"><pre class="ft-pre"><span class="c"># sitemap</span>
<a href="${H.P.cases}">./cases</a>      <a href="${H.P.services}">./price</a>      <a href="${H.P.reviews}">./reviews</a>     <a href="${H.P.blog}">./blog</a>
<a href="${H.P.about}">./whoami</a>     <a href="${H.P.faq}">./faq</a>        <a href="${H.P.bonus}">./referral</a>    <a href="${H.P.contact}">./brief</a>
<a href="https://t.me/PavelTexSpec" target="_blank" rel="noopener">telegram</a>     <a href="${H.P.privacy}">./privacy</a></pre>
    <div class="ft-base"><span>© 2026 Павел Корчагин · Троицк, Москва</span><span>exit code 0</span></div></div></footer>`,
  voice: {
    bot: { title: 'Демо-бот', h1: '$ ./bot --web', lead: '# бот запущен в окне ниже. выберите сценарий справа или пишите в stdin.', listH: '# scenarios', tgP: '# тот же бот, транспорт — Telegram.' },
    demo: { k: '# demo', h: '$ open t.me/Bot_PortfolioRabot', p: '# 8 сценариев, запускаются прямо на сайте: bot.html?start=&lt;сценарий&gt;. задержки hours/days → seconds.', btn: '$ run --web', try: '$ demo --bot', go: '↵', qr: '# scan с телефона', note: '# payments: mock. exit: «Главное меню» — снимает все таймеры цепочки.', webH: '$ run webinar --demo', webP: '# register → remind → live → offer → follow-up. таймеры ускорены до секунд.' },
    titleSfx: 'pavel@texspeckps', home: '~', sep: '/',
    nav: { bot: 'bot', cases: 'cases', services: 'price', reviews: 'reviews', blog: 'blog', about: 'whoami', faq: 'faq' },
    cta: { btn: '$ brief --send', btn2: '$ open telegram' },
    cases: { title: 'cases', kicker: '// 25 проектов', h1: '$ ls ./cases --all', lead: '# сайты, боты, школы и дизайн. у каждого — задача, решение, метрика.', note: '',
      all: '--all', cats: { Tilda: '--sites', Salebot: '--bots', GetCourse: '--schools', Figma: '--design' }, client: 'client', own: 'own', more: 'cat README →',
      endH: '$ ./start-project.sh', endP: '# готовое ТЗ не нужно — вопросы задам сам', endBtn: '$ brief --send' },
    case: { titleSfx: 'case', client: 'client', own: 'own', live: '$ open site ↗', similar: '$ fork --like-this', similarTask: 'fork:',
      chapters: ['## task', '## flow', '## done', '## result'], toolsH: '# stack', galleryH: '# screenshots', relatedH: '# see also', pagerH: '# navigate', prev: '← prev', next: 'next →',
      ctaH: '$ git checkout -b ваш-проект', ctaP: '# опишите задачу — пришлю смету', nfH: 'error: case not found', nfP: '# проверьте id в адресе', nfBtn: '$ ls ./cases' },
    services: { title: 'price', kicker: '// price.json', h1: '$ cat price.json', lead: '# вилки «от–до». итоговая сумма фиксируется до старта и не растёт.', note: '',
      groupBtn: '$ man service', packsH: '# bundles (дешевле)', time: 'eta',
      intro: { salebot: ['01 · bots/', 'chat-bots', '# отвечают, записывают, продают. uptime 24/7.'], tilda: ['02 · sites/', 'sites', '# tilda + zero block + свой код где нужно'], figma: ['03 · design/', 'design', '# прототип → ui → вёрстка'], getcourse: ['04 · schools/', 'getcourse', '# курсы, доступы, оплаты — автоматически'], webinar: ['05 · webinars/', 'webinars', '# bizon365 + напоминания + письма'] },
      howK: '// pipeline', howH: '$ ./pipeline.sh', how: [['call', 'без ТЗ'], ['estimate', 'цена и срок заранее'], ['build', 'промежуточные демо'], ['deploy', 'и поддержка']],
      endH: '$ grep ваша-задача price.json', endP: '# ничего не нашлось? опишите — разложу на позиции', endBtn: '$ brief --send' },
    service: { whoK: '// users', whoH: '## для кого', menuK: '// items', menuH: '## позиции', casesK: '// examples', casesH: '## кейсы', stepsK: '// pipeline', stepsH: '## процесс', faqK: '// faq', faqH: '## вопросы', ctaH: '$ brief --service', ctaP: '# цена и срок — до старта', ctaBtn: '$ brief --send', priceBtn: '$ cat price',
      steps: [['call', 'задача и цели'], ['estimate', 'объём и цена'], ['build', 'демо по ходу'], ['deploy', 'тест и поддержка']],
      intro: { salebot: { h: '$ man chat-bots', p: '# Salebot + ИИ: воронки, приём заявок, онлайн-запись, платные каналы. работает 24/7 без деплоя по выходным.' }, tilda: { h: '$ man sites', p: '# Tilda + Zero Block + HTML/CSS/JS там, где конструктор упирается в потолок. SEO и аналитика из коробки.' },
        figma: { h: '$ man design', p: '# прототип, ui и дизайн-система в Figma. решения — до вёрстки, где они дешевле.' }, getcourse: { h: '$ man getcourse', p: '# курсы, процессы, автоматизации, оплаты. новый поток — по шаблону.' }, webinar: { h: '$ man webinars', p: '# Bizon365, бот-напоминалка, цепочки писем.' } } },
    reviews: { title: 'reviews', kicker: '// reviews.log', h1: '$ tail -f reviews.log', lead: '# INFO: отрицательных записей — 0. тексты без правок.', proj: 'project →', endH: '$ echo "ваш отзыв" >> reviews.log', endP: '# начнём с короткого созвона', endBtn: '$ brief --send' },
    faq: { title: 'faq', kicker: '// faq.md', h1: '$ man faq', lead: '# нет ответа — спросите ассистента, он не спит', aiK: '// ai-assistant · online', aiH: '$ ask --assistant', aiP: '# знает услуги, сроки и цены. сложное — форвардит мне.', aiBtn: '$ ask', aiAlt: '# или напрямую:', endH: '$ ping pavel', endP: '# отвечаю в течение рабочего дня' },
    about: { title: 'whoami', kicker: '// resume.md', h1: '$ whoami', text: ['Павел Корчагин, 31. Родом из Брянска, живу в Троицке (Москва). remote.', 'stack: Figma · Tilda · Zero Block · Salebot · GetCourse · Bizon365 · HTML/CSS/JS', '# беру сложные задачи и отвечаю за весь результат, а не за свой кусок.'],
      factsH: '// facts', traitsH: '// traits', eduH: '// education', specK: '// modules', specH: '## направления', skillsH: '// skills', hh: '$ open hh.ru ↗', ctaH: '$ ./start-project.sh', ctaP: '# созвон 20 минут' },
    blog: { title: 'blog', kicker: '// posts', h1: '$ ls ./blog', lead: '# сколько стоит бот, как устроен лендинг, как ИИ разгружает салон', read: 'min', endH: '$ suggest --topic', endP: '# лучшие вопросы становятся постами', endBtn: '$ suggest' },
    post: { noteH: 'NOTE:', caseK: 'case', ctaH: '$ apply --to ваш-бизнес', ctaP: '# посчитаю под вашу задачу', ctaBtn: '$ brief --send', moreH: '// more posts', nf: 'error: post not found' },
    bonus: { title: 'referral', crumb: 'referral', kicker: '// referral.md', h1: '$ referral --reward=10%', lead: '# рекомендуете — получаете 10% от оплаченной суммы. при сопровождении — каждый месяц.', big: '10%',
      stepsK: '// flow', stepsH: '## как работает', whyK: '// why', whyH: '## почему не стыдно', termsH: '// terms', ctaH: '$ refer --contact', ctaP: '# передайте контакт или ссылку', ctaBtn: '$ refer' },
    contact: { title: 'brief', crumb: 'brief', kicker: '// brief.sh', h1: '$ ./brief.sh', lead: '# заполните, что знаете. заявка уйдёт в Telegram, ответ — в течение рабочего дня.', alt: '# или напрямую:',
      labels: { name: '--name', namePh: 'Иван', service: '--service', task: '--task', taskPh: '"бот для записи"', budget: '--budget (₽)', budgetPh: '50000', contact: '--contact', contactPh: '@telegram | phone', comment: '--comment', commentPh: 'ссылки, сроки, детали', agree: 'согласен на обработку данных по', send: '$ send', hint: '# exit 0 = отправлено' },
      errs: { need: 'error: --name и --contact обязательны', agree: 'error: требуется --agree', sending: 'sending…', sent: '200 OK' } },
    thanks: { title: '200 OK', kicker: '// 200 OK', h1: '$ brief sent ✓', lead: '# отвечу в течение рабочего дня. срочно — пингуйте в Telegram.', btn: '$ ls ./cases', moreH: '// while you wait' },
    privacy: { crumb: 'privacy', h1: '$ cat privacy.md', lead: '# как обрабатываются данные, которые вы оставляете' },
    nf: { h1: '404: command not found', lead: '# попробуйте вернуться в ~', btn: '$ cd ~' }
  }
});
