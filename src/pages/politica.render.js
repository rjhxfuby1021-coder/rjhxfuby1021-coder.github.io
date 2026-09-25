// /politica — политика конфиденциальности (RU + EN; при расхождениях приоритет у русской редакции).
const { Dict } = require('./_dict.js');

const L = (ru, en) => ({ ru, en });
const link = (href, text) => '<a class="pk-link" href="' + href + '">' + text + '</a>';

const SECTIONS = [
  [L('Общие положения', 'General provisions'), [
    L('Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок обработки и защиты персональных данных пользователей сайта texspeckps.ru (далее — «Сайт»).',
      'This Privacy Policy (the “Policy”) sets out how the personal data of users of texspeckps.ru (the “Site”) is processed and protected.'),
    L('Оператором персональных данных является Корчагин Павел Сергеевич, осуществляющий деятельность под брендом PavelTexSpec (далее — «Оператор»).',
      'The personal data controller is Pavel Sergeevich Korchagin, operating under the PavelTexSpec brand (the “Operator”).'),
    L('Используя Сайт и оставляя свои данные через формы обратной связи, мессенджеры или иные каналы связи, указанные на Сайте, пользователь подтверждает своё согласие с условиями настоящей Политики.',
      'By using the Site and submitting data via feedback forms, messengers or other contact channels listed on the Site, the user confirms their agreement with this Policy.')
  ]],
  [L('Какие данные собираются', 'What data is collected'), [
    L('При обращении через Сайт Оператор может получать следующие данные:', 'When contacted via the Site, the Operator may receive the following data:'),
    [L('имя;', 'name;'), L('номер телефона;', 'phone number;'), L('адрес электронной почты;', 'email address;'),
     L('никнейм или контакт в мессенджере (Telegram, WhatsApp и др.);', 'messenger username or contact (Telegram, WhatsApp, etc.);'),
     L('содержание сообщения или заявки, оставленной пользователем;', 'the content of the message or request left by the user;'),
     L('технические данные — IP-адрес, тип браузера, данные файлов cookie, информация о посещении страниц, собираемая с помощью сервисов веб-аналитики.', 'technical data — IP address, browser type, cookie data and page-visit information collected by web analytics services.')]
  ]],
  [L('Цели обработки данных', 'Purposes of processing'), [
    L('Персональные данные пользователей используются исключительно для:', 'Users’ personal data is used solely for:'),
    [L('обратной связи по заявке, оставленной на Сайте;', 'responding to a request left on the Site;'),
     L('подготовки коммерческого предложения и обсуждения условий сотрудничества;', 'preparing a commercial proposal and discussing terms of cooperation;'),
     L('оказания услуг, согласованных с пользователем;', 'providing services agreed with the user;'),
     L('улучшения работы Сайта и анализа посещаемости;', 'improving the Site and analyzing traffic;'),
     L('информирования об акциях и предложениях — только при наличии отдельного согласия пользователя.', 'informing about promotions and offers — only with the user’s separate consent.')]
  ]],
  [L('Правовые основания обработки', 'Legal basis for processing'), [
    L('Обработка персональных данных осуществляется на основании добровольного согласия пользователя, выраженного в момент заполнения формы обратной связи или обращения через контакты, указанные на Сайте.',
      'Personal data is processed on the basis of the user’s voluntary consent, given when filling in a feedback form or contacting the Operator via the contacts listed on the Site.')
  ]],
  [L('Передача данных третьим лицам', 'Transfer of data to third parties'), [
    L('Оператор не продаёт и не передаёт персональные данные третьим лицам, за исключением случаев, необходимых для функционирования Сайта и оказания услуг:',
      'The Operator does not sell or transfer personal data to third parties, except where necessary for the Site to function and for services to be provided:'),
    [L('GitHub Pages (GitHub, Inc.) — используется для хостинга Сайта;', 'GitHub Pages (GitHub, Inc.) — used to host the Site;'),
     L('Google Fonts — используется для загрузки шрифтов Сайта;', 'Google Fonts — used to load the Site’s fonts;'),
     L('Salebot — используется для обработки заявок и связи через чат-бота;', 'Salebot — used to process requests and communicate via the chatbot;'),
     L('Telegram — используется для доставки заявок, отправленных через форму на Сайте;', 'Telegram — used to deliver requests sent via the form on the Site;'),
     L('Яндекс Метрика — используется для сбора обезличенной статистики посещений;', 'Yandex Metrica — used to collect anonymized visit statistics;'),
     L('мессенджеры (Telegram, WhatsApp) — используются как канал связи по инициативе самого пользователя.', 'messengers (Telegram, WhatsApp) — used as a communication channel at the user’s own initiative.')],
    L('Указанные сервисы обрабатывают данные в соответствии с собственными политиками конфиденциальности.', 'These services process data in accordance with their own privacy policies.')
  ]],
  [L('Файлы cookie', 'Cookies'), [
    L('Сайт использует файлы cookie и аналогичные технологии для корректной работы страниц, аналитики посещаемости и улучшения пользовательского опыта. Продолжая использовать Сайт, пользователь соглашается на использование файлов cookie. Пользователь может отключить cookie в настройках своего браузера, однако это может повлиять на работу отдельных функций Сайта.',
      'The Site uses cookies and similar technologies for pages to work correctly, for traffic analytics and to improve the user experience. By continuing to use the Site, the user agrees to the use of cookies. The user can disable cookies in their browser settings, although this may affect some Site features.'),
    L('Сайт также сохраняет в браузере пользователя выбранные тему оформления и язык интерфейса; эти настройки не передаются Оператору.',
      'The Site also stores the chosen color theme and interface language in the user’s browser; these settings are not sent to the Operator.')
  ]],
  [L('Срок хранения данных', 'Data retention'), [
    L('Персональные данные хранятся в течение срока, необходимого для достижения целей их обработки, указанных в разделе 3, либо до момента отзыва согласия пользователем.',
      'Personal data is stored for as long as needed to achieve the purposes set out in section 3, or until the user withdraws consent.')
  ]],
  [L('Права пользователя', 'User rights'), [
    L('Пользователь вправе:', 'The user has the right to:'),
    [L('запросить информацию о том, какие его данные обрабатываются;', 'request information about which of their data is processed;'),
     L('потребовать уточнения, исправления или удаления своих данных;', 'demand that their data be clarified, corrected or deleted;'),
     L('отозвать согласие на обработку персональных данных в любой момент;', 'withdraw consent to the processing of personal data at any time;'),
     L('направить обращение по вопросам обработки данных на контакты, указанные ниже.', 'send an inquiry about data processing to the contacts below.')]
  ]],
  [L('Меры защиты данных', 'Data protection measures'), [
    L('Оператор принимает необходимые организационные и технические меры для защиты персональных данных пользователей от неправомерного доступа, изменения, раскрытия или уничтожения.',
      'The Operator takes the necessary organizational and technical measures to protect users’ personal data from unauthorized access, alteration, disclosure or destruction.')
  ]],
  [L('Изменение Политики', 'Changes to the Policy'), [
    L('Оператор оставляет за собой право вносить изменения в настоящую Политику. Актуальная редакция всегда доступна на данной странице Сайта.',
      'The Operator reserves the right to amend this Policy. The current version is always available on this page of the Site.')
  ]],
  [L('Контакты', 'Contacts'), [
    L('По всем вопросам, связанным с обработкой персональных данных, можно обратиться:', 'For any questions regarding the processing of personal data, please contact:'),
    [L('Telegram: ' + link('https://t.me/PavelTexSpec', '@PavelTexSpec'), 'Telegram: ' + link('https://t.me/PavelTexSpec', '@PavelTexSpec')),
     L('Email: ' + link('mailto:TexSpecKor@yandex.ru', 'TexSpecKor@yandex.ru'), 'Email: ' + link('mailto:TexSpecKor@yandex.ru', 'TexSpecKor@yandex.ru')),
     L('Телефон: ' + link('tel:+79507041398', '+7 (950) 704-13-98'), 'Phone: ' + link('tel:+79507041398', '+7 (950) 704-13-98'))]
  ]]
];

module.exports = function render() {
  const d = new Dict();
  const toc = SECTIONS.map(([t], i) => '<li><a href="#p' + (i + 1) + '"><span>' + (i + 1) + '</span>' + d.tag('span', 'pl.t' + i, t) + '</a></li>').join('');
  const body = SECTIONS.map(([t, parts], i) => {
    const k = 'pl.s' + i;
    return '<section id="p' + (i + 1) + '" class="pk-doc__sec"><h2><span>' + (i + 1) + '.</span> ' + d.tag('span', 'pl.t' + i, t) + '</h2>' +
      parts.map((p, j) => (Array.isArray(p)
        ? '<ul>' + p.map((li, n) => d.tag('li', k + '.' + j + '.' + n, li, '', true)).join('') + '</ul>'
        : d.tag('p', k + '.' + j, p))).join('') +
    '</section>';
  }).join('');

  const html = '' +
    '<section class="pk-hero pk-dirhero" aria-labelledby="pk-h1"><div class="pk-wrap">' +
      d.tag('p', 'pl.eye', L('Документ', 'Document'), 'class="pk-eyebrow pk-reveal"') +
      d.tag('h1', 'pl.h1', L('Политика конфиденциальности', 'Privacy policy'), 'class="pk-h1 pk-reveal" id="pk-h1" style="--d:1"') +
      d.tag('p', 'pl.date', L('Действует с 15 августа 2026 года', 'Effective from 15 August 2026'), 'class="pk-lead pk-reveal" style="--d:2"') +
      d.tag('p', 'pl.note', L('', 'This is a translation for convenience. In case of any discrepancy, the Russian version prevails.'), 'class="pk-doc__note"') +
    '</div></section>' +
    '<section class="pk-section" style="padding-top:0"><div class="pk-wrap pk-doc">' +
      '<nav class="pk-doc__toc" aria-label="Содержание" data-i18n-attr="aria-label:pl.toc"><p class="pk-case__label" data-i18n="pl.toc">Содержание</p><ol>' + toc + '</ol></nav>' +
      '<article class="pk-doc__body">' + body + '</article>' +
    '</div></section>';

  d.en['pl.toc'] = 'Contents';
  return { html, en: d.en, jsonld: '' };
};
