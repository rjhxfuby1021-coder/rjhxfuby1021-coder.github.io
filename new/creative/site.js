/* Творческий стиль: общая шапка, подвал и помощники для всех страниц папки creative/ */
window.ROOT = '../';
(function () {
  const D = window.DATA, C = window.CONTENT || null;

  // внутренние страницы этого стиля
  Object.assign(D.pages, {
    cases: 'cases.html', tilda: 'cases.html?f=Tilda', salebot: 'cases.html?f=Salebot', getcourse: 'cases.html?f=GetCourse', figma: 'cases.html?f=Figma',
    price: 'services.html', services: 'services.html', reviews: 'reviews.html', faq: 'faq.html', about: 'about.html',
    blog: 'blog.html', bonus: 'bonus.html', form: 'brief.html', privacy: 'privacy.html'
  });

  // кейс «ИИ-ассистент для сайта-портфолио» живёт в разделе вопросов — ведём в раздел этого стиля
  D.all.forEach((c) => { if (c.url === 'https://texspeckps.ru/faq') c.url = 'faq.html'; });
  if (C) C.cases.forEach((c) => { if (c.url === 'https://texspeckps.ru/faq') c.url = 'faq.html'; });
  const here = location.pathname.split('/').pop() || 'index.html';
  const NAV = [['cases.html', 'Работы'], ['services.html', 'Услуги'], ['bot.html', 'Демо-бот'], ['reviews.html', 'Отзывы'], ['blog.html', 'Журнал'], ['about.html', 'Обо мне']];
  const isOn = (f) => here === f || (f === 'cases.html' && here === 'case.html') || (f === 'blog.html' && here === 'post.html') || (f === 'services.html' && here === 'service.html');

  const mast = document.getElementById('mast');
  if (mast) {
    mast.className = 'mast';
    mast.innerHTML = `<div class="w">
      <span>Мастерская · осень 2026</span>
      <a class="logo" href="index.html">${LOGO('creative')}</a>
      <nav>${NAV.map(([f, t]) => `<a href="${f}" class="${isOn(f) ? 'on' : ''}">${t}</a>`).join('')}<a href="brief.html" class="${here === 'brief.html' ? 'on' : ''}">Написать</a></nav>
      <button class="burger" aria-expanded="false" aria-controls="mmenu">меню ✳</button>
    </div>
    <div class="mmenu" id="mmenu">${NAV.map(([f, t]) => `<a href="${f}">${t}</a>`).join('')}<a href="faq.html">Вопросы</a><a href="brief.html">Написать мне</a></div>`;
    const b = mast.querySelector('.burger'), m = mast.querySelector('.mmenu');
    b.addEventListener('click', () => { const o = m.classList.toggle('open'); b.setAttribute('aria-expanded', o); b.textContent = o ? 'закрыть ✕' : 'меню ✳'; });
  }

  const foot = document.getElementById('foot');
  if (foot) {
    foot.className = 'foot';
    foot.innerHTML = `<div class="w"><div class="cols4">
      <div><div class="sig">${LOGO('creative')}</div><p style="margin-top:12px;color:var(--g);max-width:30ch">Мастерская сайтов, ботов и онлайн-школ. Одна голова — одна история от эскиза до оплаты.</p></div>
      <div><h4>Работы</h4><a href="cases.html">Весь альбом</a><a href="cases.html?f=Tilda">Сайты</a><a href="cases.html?f=Salebot">Боты</a><a href="cases.html?f=GetCourse">Школы</a><a href="cases.html?f=Figma">Дизайн</a></div>
      <div><h4>Мастерская</h4><a href="services.html">Услуги и цены</a><a href="reviews.html">Письма заказчиков</a><a href="blog.html">Журнал</a><a href="faq.html">Вопросы</a><a href="bonus.html">10% за рекомендацию</a></div>
      <div><h4>Связь</h4><a href="brief.html">Рассказать об идее</a><a href="https://t.me/PavelTexSpec" target="_blank" rel="noopener">Telegram</a><a href="about.html">Обо мне</a></div>
    </div><div class="base"><span>© 2026 Павел Корчагин · Троицк (Москва)</span><span><a href="privacy.html" style="display:inline">Политика конфиденциальности</a></span></div></div>`;
  }

  // помощники
  const rr = () => ((Math.random() * 5 - 2.5).toFixed(1)) + 'deg';
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const CAT = { Tilda: 'Сайты', Salebot: 'Боты', GetCourse: 'Школы', Figma: 'Дизайн' };
  const DIR = { tilda: 'Tilda', salebot: 'Salebot', getcourse: 'GetCourse', figma: 'Figma' };
  const full = (id) => C && C.cases.find((c) => c.id === id);
  const short = (id) => D.all.find((c) => c.id === id);
  const caseUrl = (id) => 'case.html?id=' + encodeURIComponent(id);
  const param = (k) => new URLSearchParams(location.search).get(k);
  const fmtDate = (d) => new Date(d + 'T12:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

  // полароид-карточка кейса (общая для альбома и подборок)
  function card(c, i, opts = {}) {
    const ratio = ['4/5', '4/3', '1/1'][i % 3];
    return `<article class="card" style="--r:${rr()}" data-cat="${c.cat}" ${opts.rv === false ? '' : 'data-rv'}>
      <a class="cover" href="${caseUrl(c.id)}"><img src="${c.img}" alt="${esc(c.t)}" loading="lazy" style="aspect-ratio:${ratio}"></a>
      <h4><a href="${caseUrl(c.id)}">${esc(c.t)}</a></h4><p>${esc(c.p)}</p>
      ${c.f ? `<span class="hand">${esc(c.f[0])} — ${esc(c.f[1])}</span>` : ''}
      <div class="meta"><span>${esc(c.type)}${c.client ? ' · для клиента' : ' · свой проект'}</span><a href="${caseUrl(c.id)}">история →</a></div></article>`;
  }

  // ссылки старого сайта внутри текстов (FAQ, статьи) -> страницы этого стиля
  const MAP = [[/https?:\/\/texspeckps\.ru\/price\/?/g, 'services.html'], [/https?:\/\/texspeckps\.ru\/form\/?/g, 'brief.html'],
    [/https?:\/\/texspeckps\.ru\/otzivi\/?/g, 'reviews.html'], [/https?:\/\/texspeckps\.ru\/rezume\/?/g, 'about.html'],
    [/https?:\/\/texspeckps\.ru\/iambonus\/?/g, 'bonus.html'], [/https?:\/\/texspeckps\.ru\/faq\/?/g, 'faq.html'],
    [/https?:\/\/texspeckps\.ru\/(tilda|salebot|getcourse|figma)#([\w-]+)/g, 'case.html?id=$2'],
    [/https?:\/\/texspeckps\.ru\/(tilda|salebot|getcourse|figma)\/?(?=["'])/g, (m, d) => 'cases.html?f=' + DIR[d]],
    [/https?:\/\/texspeckps\.ru\/keys\/?/g, 'cases.html'], [/https?:\/\/texspeckps\.ru\/blog\/([\w-]+)/g, 'post.html?slug=$1'],
    [/https?:\/\/texspeckps\.ru\/blog\/?/g, 'blog.html'], [/https?:\/\/texspeckps\.ru\/uslugi\/[\w-]+/g, 'services.html'],
    [/(href=")\/(price|form|otzivi|rezume|faq|iambonus)\/?"/g, (m, h, p) => h + ({ price: 'services', form: 'brief', otzivi: 'reviews', rezume: 'about', faq: 'faq', iambonus: 'bonus' }[p]) + '.html"']];
  const fixLinks = (html) => MAP.reduce((s, [re, to]) => s.replace(re, to), String(html)).replace(/class="pk-link"/g, 'class="inl"');

  function done() { if (window.reveal) reveal(); if (window.styleSwitch) styleSwitch('↺ другой стиль'); }

  window.CR = { rr, esc, CAT, DIR, full, short, caseUrl, param, fmtDate, card, done, fixLinks };
})();
