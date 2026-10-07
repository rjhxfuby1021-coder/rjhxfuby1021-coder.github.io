/* Движок внутренних страниц для всех стилей.
   Данные: DATA (data.js) и CONTENT (content.js). Тексты и шапка/подвал — в site.js каждого стиля (объект темы T).
   Страница выбирается по <body data-page="...">. Разметка — общие классы (pg-hd, sec, cards, card, chap, prow, pack…),
   а внешний вид задаёт style.css стиля. Любой рендер можно заменить через T.render[page]. */
window.ROOT = '../';
window.ENGINE = function (T) {
  const D = window.DATA, C = window.CONTENT, V = T.voice || {};
  const page = document.body.dataset.page || '';
  const F = T.files || {};
  const P = {
    home: 'index.html', cases: 'cases.html', case: 'case.html', services: 'services.html', service: 'service.html',
    reviews: 'reviews.html', faq: 'faq.html', about: 'about.html', blog: 'blog.html', post: 'post.html',
    bonus: 'bonus.html', contact: 'contact.html', thanks: 'thanks.html', privacy: 'privacy.html', bot: 'bot.html', ...F
  };
  Object.assign(D.pages, {
    cases: P.cases, tilda: P.cases + '?f=Tilda', salebot: P.cases + '?f=Salebot', getcourse: P.cases + '?f=GetCourse', figma: P.cases + '?f=Figma',
    price: P.services, services: P.services, bot: P.bot, reviews: P.reviews, faq: P.faq, about: P.about, blog: P.blog, bonus: P.bonus, form: P.contact, privacy: P.privacy
  });

  // кейс «ИИ-ассистент для сайта-портфолио» живёт в разделе вопросов — ведём в раздел этого стиля
  D.all.forEach((c) => { if (c.url === 'https://texspeckps.ru/faq') c.url = P.faq; });
  if (C) C.cases.forEach((c) => { if (c.url === 'https://texspeckps.ru/faq') c.url = P.faq; });

  /* ---------- помощники ---------- */
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const param = (k) => new URLSearchParams(location.search).get(k);
  const rr = (n = 2.5) => ((Math.random() * n * 2 - n).toFixed(1)) + 'deg';
  const DIR = { tilda: 'Tilda', salebot: 'Salebot', getcourse: 'GetCourse', figma: 'Figma' };
  const short = (id) => D.all.find((c) => c.id === id);
  const full = (id) => C && C.cases.find((c) => c.id === id);
  // отраслевые стили: близкие сфере кейсы — первыми
  const EX = T.exclude || [];
  const HIDE = T.hide ? new RegExp(T.hide, 'i') : null; // скрыть пункты списков с этими словами
  const keep = (arr) => HIDE ? arr.filter((x) => !HIDE.test([].concat(x).join(' '))) : arr;
  const ALL0 = T.featured ? [...T.featured.map((id) => D.all.find((c) => c.id === id)).filter(Boolean), ...D.all.filter((c) => !T.featured.includes(c.id))] : D.all;
  const ALL = ALL0.filter((c) => !EX.includes(c.id));
  const caseUrl = (id) => P.case + '?id=' + encodeURIComponent(id);
  const fmtDate = (d) => new Date(d + 'T12:00:00').toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  const cover = (b) => b.cover.startsWith('case:') ? (full(b.cover.slice(5)) || {}).cover : (b.cover.startsWith('/') ? 'https://texspeckps.ru' + b.cover : b.cover);
  const MAP = [[/https?:\/\/texspeckps\.ru\/price\/?/g, P.services], [/https?:\/\/texspeckps\.ru\/form\/?/g, P.contact],
    [/https?:\/\/texspeckps\.ru\/otzivi\/?/g, P.reviews], [/https?:\/\/texspeckps\.ru\/rezume\/?/g, P.about],
    [/https?:\/\/texspeckps\.ru\/iambonus\/?/g, P.bonus], [/https?:\/\/texspeckps\.ru\/faq\/?/g, P.faq],
    [/https?:\/\/texspeckps\.ru\/(tilda|salebot|getcourse|figma)#([\w-]+)/g, P.case + '?id=$2'],
    [/https?:\/\/texspeckps\.ru\/(tilda|salebot|getcourse|figma)\/?(?=["'])/g, (m, d) => P.cases + '?f=' + DIR[d]],
    [/https?:\/\/texspeckps\.ru\/keys\/?/g, P.cases], [/https?:\/\/texspeckps\.ru\/blog\/([\w-]+)/g, P.post + '?slug=$1'],
    [/https?:\/\/texspeckps\.ru\/blog\/?/g, P.blog], [/https?:\/\/texspeckps\.ru\/uslugi\/[\w-]+/g, P.services],
    [/(href=")\/(price|form|otzivi|rezume|faq|iambonus)\/?"/g, (m, h, p) => h + ({ price: P.services, form: P.contact, otzivi: P.reviews, rezume: P.about, faq: P.faq, iambonus: P.bonus }[p]) + '"']];
  const fixLinks = (html) => MAP.reduce((s, [re, to]) => s.replace(re, to), String(html)).replace(/class="pk-link"/g, 'class="inl"');
  const v = (path, def) => { const r = path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : undefined), V); return r == null ? def : r; };
  const H = { esc, param, rr, DIR, short, full, caseUrl, fmtDate, cover, fixLinks, v, P, D, C };

  /* ---------- базовые блоки (тема может переопределить через T.ui) ---------- */
  const U = Object.assign({
    btn: (t, href, k = 1, ext) => `<a class="btn btn-${k}" href="${href}"${ext ? ' target="_blank" rel="noopener"' : ''}>${t}</a>`,
    crumbs: (items) => `<nav class="crumbs" aria-label="Навигация"><a href="${P.home}">${v('home', 'Главная')}</a>${items.map(([t, h]) => ` <span class="sep">${v('sep', '/')}</span> ${h ? `<a href="${h}">${t}</a>` : `<span>${t}</span>`}`).join('')}</nav>`,
    hd: (o) => `<section class="pg-hd${o.cls ? ' ' + o.cls : ''}"><div class="w">${o.crumbs || ''}${o.kicker ? `<p class="kicker">${o.kicker}</p>` : ''}<h1 class="pg-title">${o.h1}</h1>${o.lead ? `<p class="pg-lead">${o.lead}</p>` : ''}${o.note ? `<p class="pg-note">${o.note}</p>` : ''}${o.acts ? `<div class="acts">${o.acts}</div>` : ''}${o.extra || ''}</div></section>`,
    sec: (o) => `<section class="sec${o.cls ? ' ' + o.cls : ''}"${o.id ? ` id="${o.id}"` : ''}><div class="w">${o.title || o.kicker ? `<div class="sec-hd">${o.kicker ? `<p class="kicker">${o.kicker}</p>` : ''}${o.title ? `<h2 class="sec-title">${o.title}</h2>` : ''}${o.lead ? `<p class="sec-lead">${o.lead}</p>` : ''}</div>` : ''}${o.body}</div></section>`,
    cta: (o) => `<section class="cta"><div class="w"><h2 class="cta-title">${o.h}</h2>${o.p ? `<p class="cta-text">${o.p}</p>` : ''}<div class="acts">${U.btn(o.btn || v('cta.btn', 'Оставить заявку'), P.contact, 1)}${U.btn(v('cta.btn2', 'Telegram'), 'https://t.me/PavelTexSpec', 2, true)}</div></div></section>`,
    card: (c, i) => `<article class="card" data-cat="${c.cat}"><a class="card-img" href="${caseUrl(c.id)}"><img src="${c.img}" alt="${esc(c.t)}" loading="lazy"></a><div class="card-body"><p class="card-type">${esc(c.type)} · ${c.client ? v('cases.client', 'клиент') : v('cases.own', 'свой проект')}</p><h3 class="card-title"><a href="${caseUrl(c.id)}">${esc(c.t)}</a></h3><p class="card-text">${esc(c.p)}</p>${c.f ? `<p class="card-fact"><b>${esc(c.f[0])}</b> <span>${esc(c.f[1])}</span></p>` : ''}<a class="card-more" href="${caseUrl(c.id)}">${v('cases.more', 'Подробнее →')}</a></div></article>`,
    cards: (list) => `<div class="cards">${list.map((c, i) => U.card(c, i)).join('')}</div>`,
    prow: ([n, d, p, t]) => `<div class="prow"><div class="prow-main"><b class="prow-name">${esc(n)}</b><p class="prow-desc">${esc(d)}${t ? ` <span class="prow-time">${v('services.time', '·')} ${esc(t)}</span>` : ''}</p></div><span class="prow-price">${esc(p)}</span></div>`,
    pack: ([n, d, o, p]) => `<div class="pack"><b>${esc(n)}</b><p>${esc(d)}</p><p class="pack-price"><s>${esc(o)}</s> <strong>${esc(p)}</strong></p></div>`,
    review: (r, c) => `<article class="review"><blockquote><p>${esc(r.text)}</p></blockquote><footer><span class="rev-ava">${esc(r.ini)}</span><span><b class="rev-name">${esc(r.name)}</b><span class="rev-role">${esc(r.role)} · ${esc(r.project)}</span></span></footer>${c ? `<a class="rev-proj" href="${caseUrl(c.id)}"><img src="${c.img}" alt="${esc(c.t)}" loading="lazy"><span>${v('reviews.proj', 'Проект')} →</span></a>` : ''}</article>`,
    // Демо-бот в Telegram (DATA.bot): only — коды сценариев, которые показать; без него — все восемь
    demo: (only) => {
      const B = D.bot; if (!B) return '';
      const list = only ? B.scenarios.filter((x) => only.includes(x[0])) : B.scenarios;
      const one = list.length === 1;
      const item = ([code, ico, name, desc]) => `<a class="demo-item" href="${P.bot}?start=${code}"><span class="demo-ico" aria-hidden="true">${ico}</span><span class="demo-txt"><b>${esc(name)}</b><span>${esc(desc)}</span></span><span class="demo-go" aria-hidden="true">${v('demo.go', '→')}</span></a>`;
      return `<section class="sec sec-demo" id="demo"><div class="w"><div class="demo">
        <div class="demo-hd"><p class="kicker">${v('demo.k', 'Демо · Telegram')}</p>
          <h2 class="sec-title">${one ? v('demo.webH', 'Пройдите автовебинар в боте') : v('demo.h', 'Протестируйте бота сами')}</h2>
          <p class="sec-lead">${one ? v('demo.webP', 'Регистрация, напоминания, эфир, продажа и дожим — паузы сокращены до секунд.') : v('demo.p', 'Восемь сценариев, которые я собираю для клиентов. Выберите любой — бот откроется в Telegram сразу на нём.')}</p>
          <div class="acts">${U.btn(v('demo.btn', 'Запустить бота на сайте'), P.bot + (one ? '?start=' + list[0][0] : ''), 1)}${U.btn(v('bot.tg', 'Открыть в Telegram'), B.url, 2, true)}</div></div>
        <figure class="demo-qr"><img src="${B.qr}" alt="QR-код бота @${B.user}" width="150" height="150" loading="lazy"><figcaption>${v('demo.qr', 'Наведите камеру телефона')}</figcaption></figure>
      </div>
      <div class="demo-list${one ? ' demo-list--one' : ''}">${list.map(item).join('')}</div>
      <p class="demo-note">${one ? v('demo.webMore', 'В меню бота — ещё семь сценариев: закрытый канал, лид-магнит, тест, колесо фортуны, запись, заявки и рефералка.') : v('demo.note', 'Бот настоящий: долгие паузы сокращены до секунд, оплата — демонстрационная. Выйти из сценария — кнопка «Главное меню».')}</p>
      </div></section>`;
    },
    qa: ([q, a], i) => `<details class="qa"${i ? '' : ' open'}><summary>${esc(q)}</summary><div class="qa-a">${fixLinks(a)}</div></details>`
  }, T.ui || {});
  H.U = U;

  /* ---------- шапка и подвал ---------- */
  // стандартные шапка/подвал: тема задаёт только слова (T.hdLogo, T.hdCta, T.ft…) или пишет свою разметку в T.header/T.footer
  const stdHeader = (nav) => `<header class="site-hd"><div class="w"><a class="logo" href="${P.home}">${T.hdLogo || 'Павел Корчагин'}</a>
    <nav aria-label="Разделы">${nav.map((n) => `<a href="${n.h}" class="${n.on ? 'on' : ''}">${n.t}</a>`).join('')}</nav>
    <a class="btn btn-1 hd-cta" href="${P.contact}">${T.hdCta || 'Связаться'}</a>
    <button class="burger" data-burger aria-expanded="false" aria-controls="mnav">${T.hdMenu || 'Меню'}</button></div>
    <div class="mnav" id="mnav">${nav.map((n) => `<a href="${n.h}">${n.t}</a>`).join('')}<a href="${P.contact}">${T.hdCta || 'Связаться'}</a></div></header>`;
  const FT = T.ft || {};
  const stdFooter = () => `<footer class="site-ft"><div class="w"><div class="ft-cols">
    <div><b class="ft-logo">${T.hdLogo || 'Павел Корчагин'}</b><p style="margin-top:10px;color:var(--muted);max-width:32ch">${FT.about || 'Сайты, чат-боты и онлайн-школы — одним специалистом.'}</p></div>
    <div><h4>${FT.h1 || 'Работы'}</h4><a href="${P.cases}">${v('nav.cases', 'Кейсы')}</a><a href="${P.cases}?f=Tilda">${v('cases.cats.Tilda', 'Сайты')}</a><a href="${P.cases}?f=Salebot">${v('cases.cats.Salebot', 'Боты')}</a><a href="${P.cases}?f=GetCourse">${v('cases.cats.GetCourse', 'Школы')}</a></div>
    <div><h4>${FT.h2 || 'Информация'}</h4><a href="${P.services}">${v('nav.services', 'Услуги')}</a><a href="${P.reviews}">${v('nav.reviews', 'Отзывы')}</a><a href="${P.blog}">${v('nav.blog', 'Блог')}</a><a href="${P.faq}">${v('nav.faq', 'Вопросы')}</a><a href="${P.bonus}">${FT.bonus || '10% за рекомендацию'}</a></div>
    <div><h4>${FT.h3 || 'Связь'}</h4><a href="${P.contact}">${T.hdCta || 'Связаться'}</a><a href="https://t.me/PavelTexSpec" target="_blank" rel="noopener">Telegram</a><a href="${P.about}">${v('nav.about', 'Обо мне')}</a></div>
    </div><div class="ft-base"><span>© 2026 Павел Корчагин · ${FT.city || 'Троицк (Москва)'}</span><a href="${P.privacy}">${FT.privacy || 'Политика конфиденциальности'}</a></div></div></footer>`;
  if (!T.header) T.header = stdHeader;
  if (!T.footer) T.footer = stdFooter;
  const here = location.pathname.split('/').pop() || 'index.html';
  const NAV = [['cases', P.cases], ['services', P.services], ['bot', P.bot], ['reviews', P.reviews], ['blog', P.blog], ['about', P.about], ['faq', P.faq]];
  const navItems = NAV.map(([k, h]) => ({ k, h, t: v('nav.' + k, k), on: here === h || (k === 'cases' && here === P.case) || (k === 'blog' && here === P.post) || (k === 'services' && here === P.service) }));
  const hd = document.getElementById('hd'), ft = document.getElementById('ft');
  // шапку и подвал подставляем только на внутренних страницах (у главных стилей они свои)
  if (page && hd && T.header) { hd.outerHTML = T.header(navItems, H); }
  if (page && ft && T.footer) { ft.outerHTML = T.footer(H); }
  document.querySelectorAll('[data-burger]').forEach((b) => {
    const m = document.getElementById(b.getAttribute('aria-controls'));
    b.addEventListener('click', () => { const o = m.classList.toggle('open'); b.setAttribute('aria-expanded', o); });
  });

  /* ---------- страницы ---------- */
  const SV = [['salebot', 'Чат-бот'], ['tilda', 'Сайт на Tilda'], ['figma', 'Дизайн в Figma'], ['getcourse', 'GetCourse'], ['webinar', 'Вебинары и рассылки'], ['complex', 'Всё под ключ']];
  const R = {
    cases() {
      const T5 = [['all', v('cases.all', 'Все')], ['Tilda', v('cases.cats.Tilda', 'Сайты')], ['Salebot', v('cases.cats.Salebot', 'Боты')], ['GetCourse', v('cases.cats.GetCourse', 'Школы')], ['Figma', v('cases.cats.Figma', 'Дизайн')]];
      const n = (k) => k === 'all' ? ALL.length : ALL.filter((c) => c.cat === k).length;
      return U.hd({ crumbs: U.crumbs([[v('nav.cases', 'Кейсы')]]), kicker: v('cases.kicker'), h1: v('cases.h1', 'Кейсы'), lead: v('cases.lead'), note: v('cases.note') })
        + U.sec({ cls: 'sec-cases', body: `<div class="filters" role="tablist">${T5.map(([k, l]) => `<button role="tab" data-f="${k}">${l}<sup>${n(k)}</sup></button>`).join('')}</div>${U.cards(ALL)}` })
        + U.cta({ h: v('cases.endH', 'Обсудим ваш проект?'), p: v('cases.endP'), btn: v('cases.endBtn') });
    },
    case() {
      const id = param('id'), c = full(id), s = short(id);
      if (!c) return U.hd({ crumbs: U.crumbs([[v('nav.cases', 'Кейсы'), P.cases], ['?']]), h1: v('case.nfH', 'Кейс не найден'), lead: v('case.nfP', 'Возможно, ссылка устарела.'), acts: U.btn(v('case.nfBtn', 'Все кейсы'), P.cases) });
      document.title = c.title + ' — ' + v('case.titleSfx', 'кейс · Павел Корчагин');
      const ch = v('case.chapters', ['Задача', 'Как устроено', 'Что сделано', 'Результат']);
      const facts = (c.facts || []).map((f) => `<div class="fact"><b>${esc(f.v)}</b><span>${esc(f.l)}</span></div>`).join('');
      const chap = (no, t, body) => `<div class="chap"><div class="chap-hd"><span class="chap-no">${no}</span><h2 class="chap-title">${t}</h2></div><div class="chap-body">${body}</div></div>`;
      let k = 0; const no = () => String(++k).padStart(2, '0');
      const order = ALL.map((x) => x.id), i = order.indexOf(id);
      const prev = short(order[(i - 1 + order.length) % order.length]), next = short(order[(i + 1) % order.length]);
      const rel = c.related && !EX.includes(c.related) && short(c.related);
      return `<section class="pg-hd case-hd"><div class="w">${U.crumbs([[v('nav.cases', 'Кейсы'), P.cases], [esc(c.type)]])}
        <div class="case-top"><div class="case-info"><p class="kicker">${esc(c.type)} · ${c.year} · ${c.status === 'client' ? v('case.client', 'для клиента') : v('case.own', 'собственный проект')}</p>
        <h1 class="pg-title">${esc(c.title)}</h1><p class="pg-lead">${esc(c.lead)}</p><div class="case-facts">${facts}</div>
        <div class="acts">${c.url ? U.btn(v('case.live', 'Открыть сайт ↗'), c.url, 1, true) : ''}${U.btn(v('case.similar', 'Хочу похожее'), P.contact + '?task=' + encodeURIComponent((v('case.similarTask', 'Похоже на') + ' «' + c.title + '»')), c.url ? 2 : 1)}</div></div>
        <figure class="case-cover"><img src="${c.cover}" alt="${esc(c.title)}"></figure></div></div></section>
        <section class="sec sec-chaps"><div class="w">
        ${chap(no(), ch[0], `<p class="lead-p">${esc(c.task)}</p>`)}
        ${(c.flow || []).length ? chap(no(), ch[1], `<div class="flow">${c.flow.map((f, j) => `<div class="flow-step"><span class="flow-n">${j + 1}</span><b>${esc(f.t)}</b><span>${esc(f.d)}</span></div>`).join('')}</div>`) : ''}
        ${chap(no(), ch[2], `<ul class="done-list">${(c.done || []).map((d) => `<li>${esc(d)}</li>`).join('')}</ul>`)}
        ${chap(no(), esc(c.result.title) || ch[3], `<p class="result">${esc(c.result.text)}</p><p class="kicker" style="margin-top:28px">${v('case.toolsH', 'Инструменты')}</p><div class="tags">${(c.tools || []).map((t) => `<span>${esc(t)}</span>`).join('')}</div>`)}
        </div></section>
        ${(c.gallery || []).length ? U.sec({ cls: 'sec-gallery', kicker: v('case.galleryH', 'Экраны проекта'), body: `<div class="gallery">${c.gallery.map((g, j) => `<button class="gal-item" data-src="${g.src}"><img src="${g.src}" alt="${esc(c.title)} — ${j + 1}" loading="lazy"></button>`).join('')}</div>` }) : ''}
        ${U.sec({ cls: 'sec-pager', body: `${rel ? `<p class="kicker">${v('case.relatedH', 'Продолжение')}</p><div class="cards cards-one">${U.card(rel, 0)}</div>` : ''}<p class="kicker">${v('case.pagerH', 'Другие кейсы')}</p><div class="pager"><a href="${caseUrl(prev.id)}"><small>${v('case.prev', '← Предыдущий')}</small><b>${esc(prev.t)}</b></a><a href="${caseUrl(next.id)}"><small>${v('case.next', 'Следующий →')}</small><b>${esc(next.t)}</b></a></div>` })}
        ${U.cta({ h: v('case.ctaH', 'Хотите так же?'), p: v('case.ctaP') })}
        <div class="lb" id="lb" role="dialog" aria-label="Изображение"><img alt=""></div>`;
    },
    // Демо-бот: чат встроен в страницу (assets/botchat.js), рядом — сценарии и кнопка «Открыть в Telegram»
    bot() {
      const B = D.bot;
      return U.hd({ cls: 'pg-hd-bot', crumbs: U.crumbs([[v('nav.bot', 'Демо-бот')]]), kicker: v('demo.k', 'Демо'), h1: v('bot.h1', 'Демо-бот прямо на сайте'), lead: v('bot.lead', 'Восемь сценариев, которые я собираю для клиентов. Бот работает в окне ниже — переходить в Telegram не нужно.'),
        acts: U.btn(v('bot.tg', 'Открыть в Telegram'), B.url, 2, true) })
        + `<section class="sec sec-bot"><div class="w bot-grid">
          <div class="bot-chat" id="botchat-mount"><noscript>Для чата нужен JavaScript — или откройте бота в Telegram: <a href="${B.url}">@${B.user}</a></noscript></div>
          <aside class="bot-side"><p class="kicker">${v('bot.listH', 'Сценарии')}</p>
            <div class="bot-list">${B.scenarios.map(([code, ico, name, desc]) => `<a class="demo-item" href="${P.bot}?start=${code}" data-botchat="${code}"><span class="demo-ico" aria-hidden="true">${ico}</span><span class="demo-txt"><b>${esc(name)}</b><span>${esc(desc)}</span></span><span class="demo-go" aria-hidden="true">${v('demo.go', '→')}</span></a>`).join('')}</div>
            <div class="bot-tg"><img src="${B.qr}" alt="QR-код бота @${B.user}" width="110" height="110" loading="lazy"><p>${v('bot.tgP', 'Тот же бот в Telegram — с настоящими уведомлениями и паузами.')}</p>${U.btn(v('bot.tg', 'Открыть в Telegram'), B.url, 1, true)}</div>
            <p class="demo-note">${v('demo.note', 'Долгие паузы сокращены до секунд, оплата — демонстрационная.')}</p>
          </aside></div></section>`;
    },
    services() {
      const G = C.price;
      return U.hd({ crumbs: U.crumbs([[v('nav.services', 'Услуги')]]), kicker: v('services.kicker'), h1: v('services.h1', 'Услуги и цены'), lead: v('services.lead'), note: v('services.note'), extra: `<nav class="price-nav">${G.map((g) => `<a href="#${g.id}">${esc(g.tab)}</a>`).join('')}</nav>` })
        + G.map((g) => { const [no, h, lead] = v('services.intro.' + g.id, [g.num, g.title, g.lead]);
          return `<section class="pgroup" id="${g.id}"><div class="w"><div class="pgroup-hd"><p class="kicker">${no}</p><h2 class="sec-title">${h}</h2><p class="sec-lead">${lead}</p>${U.btn(v('services.groupBtn', 'Подробнее о направлении'), P.service + '?s=' + g.id, 2)}${g.id === 'salebot' && D.bot ? U.btn(v('demo.try', 'Протестировать бота'), P.service + '?s=salebot#demo', 2) : ''}</div>
            <div class="prows">${g.items.map(U.prow).join('')}</div>${(g.packs || []).length ? `<p class="kicker packs-h">${v('services.packsH', 'Готовые пакеты')}</p><div class="packs">${g.packs.map(U.pack).join('')}</div>` : ''}</div></section>`; }).join('')
        + U.sec({ cls: 'sec-how', kicker: v('services.howK'), title: v('services.howH', 'Как формируется цена'), body: `<ol class="steps">${v('services.how', []).map(([b, t]) => `<li><b>${b}</b><span>${t}</span></li>`).join('')}</ol>` })
        + U.cta({ h: v('services.endH', 'Не нашли нужное?'), p: v('services.endP'), btn: v('services.endBtn') });
    },
    service() {
      const DEMO = { salebot: 'all', webinar: ['webinar'] }; // где показывать демо-бота
      const s = param('s'), S = C.services.find((x) => x.dir === s), G = C.price.find((g) => g.id === s);
      if (!S) return U.hd({ h1: v('service.nf', 'Направление не найдено'), acts: U.btn(v('nav.services', 'Услуги'), P.services) });
      const I = v('service.intro.' + s, { h: esc(S.h1), p: esc(S.lead) }); document.title = S.name + ' — ' + v('titleSfx', 'Павел Корчагин');
      const cases = (S.cases || []).filter((id) => !EX.includes(id)).map(short).filter(Boolean);
      return U.hd({ crumbs: U.crumbs([[v('nav.services', 'Услуги'), P.services], [esc(S.name)]]), kicker: esc(S.eye), h1: I.h, lead: I.p, note: I.note, acts: U.btn(v('service.ctaBtn', 'Обсудить задачу'), P.contact + '?service=' + s) + (DEMO[s] ? U.btn(v('demo.try', 'Протестировать бота'), '#demo', 2) : U.btn(v('service.priceBtn', 'Цены'), '#menu', 2)) })
        + (DEMO[s] ? U.demo(DEMO[s] === 'all' ? null : DEMO[s]) : '')
        + U.sec({ cls: 'sec-who', kicker: v('service.whoK'), title: v('service.whoH', 'Кому подойдёт'), body: `<div class="who">${keep(S.who).map(([w, t]) => `<div class="who-item"><b>${esc(w)}</b><span>${esc(t)}</span></div>`).join('')}</div>` })
        + U.sec({ id: 'menu', cls: 'sec-menu', kicker: v('service.menuK'), title: v('service.menuH', 'Что можно заказать'), body: `<div class="prows">${G.items.map(U.prow).join('')}</div>${(G.packs || []).length ? `<div class="packs">${G.packs.map(U.pack).join('')}</div>` : ''}` })
        + (cases.length ? U.sec({ cls: 'sec-scases', kicker: v('service.casesK'), title: v('service.casesH', 'Кейсы направления'), body: U.cards(cases) }) : '')
        + U.sec({ cls: 'sec-how', kicker: v('service.stepsK'), title: v('service.stepsH', 'Как пойдёт работа'), body: `<ol class="steps">${v('service.steps', []).map(([b, t]) => `<li><b>${b}</b><span>${t}</span></li>`).join('')}</ol>` })
        + U.sec({ cls: 'sec-faq', kicker: v('service.faqK'), title: v('service.faqH', 'Вопросы'), body: `<div class="qa-list">${keep(S.faq).map(U.qa).join('')}</div>` })
        + U.cta({ h: v('service.ctaH', 'Обсудим задачу?'), p: v('service.ctaP'), btn: v('service.ctaBtn') });
    },
    reviews() {
      return U.hd({ crumbs: U.crumbs([[v('nav.reviews', 'Отзывы')]]), kicker: v('reviews.kicker'), h1: v('reviews.h1', 'Отзывы'), lead: v('reviews.lead'), note: v('reviews.note') })
        + U.sec({ cls: 'sec-reviews', body: `<div class="reviews">${C.reviews.filter((r) => !EX.includes((r.link || '').split('#')[1])).map((r) => U.review(r, short((r.link || '').split('#')[1]))).join('')}</div>` })
        + U.cta({ h: v('reviews.endH', 'Работали вместе?'), p: v('reviews.endP'), btn: v('reviews.endBtn') });
    },
    faq() {
      return U.hd({ crumbs: U.crumbs([[v('nav.faq', 'Вопросы')]]), kicker: v('faq.kicker'), h1: v('faq.h1', 'Вопросы и ответы'), lead: v('faq.lead') })
        + U.sec({ cls: 'sec-faq', body: `<div class="faq-grid"><div class="qa-list">${keep(C.faq).map(U.qa).join('')}</div><aside class="assistant"><p class="kicker">${v('faq.aiK', 'ИИ-ассистент 24/7')}</p><h2 class="sec-title">${v('faq.aiH', 'Не нашли ответ?')}</h2><p>${v('faq.aiP', 'Ассистент знает всё об услугах, сроках и ценах.')}</p><button class="btn btn-1" data-open-chat>${v('faq.aiBtn', 'Задать вопрос')}</button><p class="assistant-alt">${v('faq.aiAlt', 'Или напишите мне в')} <a href="https://t.me/PavelTexSpec" target="_blank" rel="noopener">Telegram</a></p></aside></div>` })
        + U.cta({ h: v('faq.endH', 'Остались вопросы?'), p: v('faq.endP') });
    },
    about() {
      const Rz = C.resume;
      return U.hd({ crumbs: U.crumbs([[v('nav.about', 'Обо мне')]]), kicker: v('about.kicker'), h1: v('about.h1', 'Обо мне'), cls: 'about-hd',
          extra: `<div class="about-grid"><figure class="about-photo"><img src="https://static.tildacdn.com/tild3366-6336-4861-a230-666439386134/noroot.png" alt="Павел Корчагин"></figure><div class="about-text">${v('about.text', []).map((p) => `<p>${p}</p>`).join('')}</div></div>` })
        + U.sec({ cls: 'sec-facts', body: `<div class="two"><div><p class="kicker">${v('about.factsH', 'Коротко')}</p><table class="facts-table">${Rz.FACTS.map(([a, b]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join('')}</table><div class="acts">${U.btn(v('about.hh', 'Резюме на hh.ru ↗'), Rz.HH, 2, true)}</div></div>
          <div><p class="kicker">${v('about.traitsH', 'Характер')}</p><div class="tags">${C.bonus.TRAITS.map(([t, d]) => `<span title="${esc(d)}">${esc(t)}</span>`).join('')}</div><p class="kicker" style="margin-top:30px">${v('about.eduH', 'Образование')}</p><ul class="timeline">${Rz.EDU.map(([y, w, p]) => `<li><small>${esc(y)}</small><b>${esc(w)}</b><span>${esc(p)}</span></li>`).join('')}</ul></div></div>` })
        + U.sec({ cls: 'sec-spec', kicker: v('about.specK'), title: v('about.specH', 'Чем занимаюсь'), body: `<div class="spec-grid">${Rz.SPEC.map(([h, t]) => `<div class="spec"><b>${esc(h)}</b><span>${esc(t)}</span></div>`).join('')}</div><p class="kicker" style="margin-top:36px">${v('about.skillsH', 'Навыки')}</p><div class="tags">${Rz.SKILLS.map((s) => `<span>${esc(s)}</span>`).join('')}</div>` })
        + U.cta({ h: v('about.ctaH', 'Познакомимся?'), p: v('about.ctaP') });
    },
    blog() {
      return U.hd({ crumbs: U.crumbs([[v('nav.blog', 'Блог')]]), kicker: v('blog.kicker'), h1: v('blog.h1', 'Блог'), lead: v('blog.lead'), note: v('blog.note') })
        + U.sec({ cls: 'sec-posts', body: `<div class="posts">${C.blog.map((b) => `<a class="post-card" href="${P.post}?slug=${b.slug}"><span class="post-img"><img src="${cover(b)}" alt="" loading="lazy"></span><span class="post-meta">${esc(b.tag)} · ${fmtDate(b.date)} · ${b.read} ${v('blog.read', 'мин')}</span><b class="post-title">${esc(b.title)}</b><span class="post-desc">${esc(b.desc)}</span></a>`).join('')}</div>` })
        + U.cta({ h: v('blog.endH', 'Есть тема для статьи?'), p: v('blog.endP'), btn: v('blog.endBtn') });
    },
    post() {
      const b = C.blog.find((x) => x.slug === param('slug'));
      if (!b) return U.hd({ h1: v('post.nf', 'Статья не найдена'), acts: U.btn(v('nav.blog', 'Блог'), P.blog) });
      document.title = b.title + ' — ' + v('titleSfx', 'Павел Корчагин');
      const block = (x) => x.p ? `<p>${fixLinks(x.p)}</p>` : x.h ? `<h2>${esc(x.h)}</h2>` : x.ul ? `<ul>${x.ul.map((li) => `<li>${fixLinks(li)}</li>`).join('')}</ul>`
        : x.note ? `<aside class="note"><b>${v('post.noteH', 'Важно')}</b> ${fixLinks(x.note)}</aside>`
        : x.case ? (() => { const c = short(x.case); return c ? `<a class="case-embed" href="${caseUrl(c.id)}"><img src="${c.img}" alt=""><span><small>${v('post.caseK', 'Кейс')}</small><b>${esc(c.t)}</b><em>${esc(c.f[0])} — ${esc(c.f[1])}</em></span></a>` : ''; })() : '';
      const others = C.blog.filter((x) => x.slug !== b.slug);
      return U.hd({ cls: 'post-hd', crumbs: U.crumbs([[v('nav.blog', 'Блог'), P.blog], [esc(b.tag)]]), kicker: `${fmtDate(b.date)} · ${b.read} ${v('blog.read', 'мин')}`, h1: esc(b.title), lead: esc(b.desc), extra: `<figure class="post-cover"><img src="${cover(b)}" alt=""></figure>` })
        + U.sec({ cls: 'sec-prose', body: `<article class="prose">${b.body.map(block).join('')}</article>` })
        + U.cta({ h: v('post.ctaH', 'Хотите так же?'), p: v('post.ctaP'), btn: v('post.ctaBtn') })
        + U.sec({ cls: 'sec-pager', kicker: v('post.moreH', 'Ещё статьи'), body: `<div class="pager">${others.map((o) => `<a href="${P.post}?slug=${o.slug}"><small>${esc(o.tag)}</small><b>${esc(o.title)}</b></a>`).join('')}</div>` });
    },
    bonus() {
      return U.hd({ crumbs: U.crumbs([[v('bonus.crumb', 'Реферальная программа')]]), kicker: v('bonus.kicker'), h1: v('bonus.h1', '10% за рекомендацию'), lead: v('bonus.lead'), extra: `<p class="big-num">${v('bonus.big', '10%')}</p>` })
        + U.sec({ cls: 'sec-how', kicker: v('bonus.stepsK'), title: v('bonus.stepsH', 'Как это работает'), body: `<ol class="steps">${C.bonus.REF.map(([b, t]) => `<li><b>${esc(b)}</b><span>${esc(t)}</span></li>`).join('')}</ol>` })
        + U.sec({ cls: 'sec-terms', kicker: v('bonus.whyK'), title: v('bonus.whyH', 'Почему меня можно советовать'), body: `<div class="who">${C.bonus.TRAITS.map(([b, t]) => `<div class="who-item"><b>${esc(b)}</b><span>${esc(t)}</span></div>`).join('')}</div><div class="terms"><p class="kicker">${v('bonus.termsH', 'Условия')}</p><ul>${v('bonus.terms', ['Выплачиваю 10% от фактически оплаченной суммы — после полной оплаты заказа.', 'Если проект уходит на сопровождение — 10% с каждой ежемесячной оплаты.', 'Чтобы я знал, от кого пришёл человек, пусть упомянет ваше имя — или напишите мне сами.']).map((t) => `<li>${t}</li>`).join('')}</ul></div>` })
        + U.cta({ h: v('bonus.ctaH', 'Есть кого порекомендовать?'), p: v('bonus.ctaP'), btn: v('bonus.ctaBtn') });
    },
    contact() {
      const L = v('contact.labels', {});
      return U.hd({ crumbs: U.crumbs([[v('contact.crumb', 'Заявка')]]), kicker: v('contact.kicker'), h1: v('contact.h1', 'Оставить заявку'), lead: v('contact.lead') })
        + U.sec({ cls: 'sec-form', body: `<form class="form" id="lead-form" novalidate>
          <label class="field"><span>${L.name || 'Имя'}</span><input name="name" autocomplete="name" required placeholder="${L.namePh || ''}"></label>
          <div class="field"><span>${L.service || 'Что нужно'}</span><div class="chips">${SV.map(([val, l]) => `<label><input type="radio" name="service" value="${val}"><span>${l}</span></label>`).join('')}</div></div>
          <label class="field"><span>${L.task || 'Задача'}</span><input name="task" placeholder="${L.taskPh || ''}"></label>
          <div class="field-row"><label class="field"><span>${L.budget || 'Бюджет, ₽'}</span><input name="budget" inputmode="numeric" placeholder="${L.budgetPh || ''}"></label>
          <label class="field"><span>${L.contact || 'Контакт'}</span><input name="contact" required placeholder="${L.contactPh || '@telegram или телефон'}"></label></div>
          <label class="field"><span>${L.comment || 'Комментарий'}</span><textarea name="comment" rows="4" placeholder="${L.commentPh || ''}"></textarea></label>
          <label class="consent"><input type="checkbox" name="agree"> <span>${L.agree || 'Согласен на обработку персональных данных по'} <a href="${P.privacy}" target="_blank">${L.agreeLink || 'политике конфиденциальности'}</a></span></label>
          <div class="acts"><button class="btn btn-1" type="submit" id="send">${L.send || 'Отправить'}</button><span class="form-hint">${L.hint || 'Отвечаю в течение рабочего дня'}</span></div>
          <p class="form-status" id="st" role="status" aria-live="polite"></p></form>
          <p class="form-alt">${v('contact.alt', 'Удобнее написать самому?')} <a href="https://t.me/PavelTexSpec" target="_blank" rel="noopener">Telegram @PavelTexSpec</a></p>` });
    },
    thanks() {
      return U.hd({ cls: 'thanks-hd', kicker: v('thanks.kicker'), h1: v('thanks.h1', 'Спасибо!'), lead: v('thanks.lead'), acts: U.btn(v('thanks.btn', 'Посмотреть кейсы'), P.cases) + U.btn('Telegram', 'https://t.me/PavelTexSpec', 2, true) })
        + U.sec({ cls: 'sec-pager', kicker: v('thanks.moreH', 'Пока ждёте'), body: `<div class="pager">${C.blog.slice(0, 2).map((o) => `<a href="${P.post}?slug=${o.slug}"><small>${esc(o.tag)}</small><b>${esc(o.title)}</b></a>`).join('')}</div>` });
    },
    privacy() {
      return U.hd({ crumbs: U.crumbs([[v('privacy.crumb', 'Политика')]]), h1: v('privacy.h1', 'Политика конфиденциальности'), lead: v('privacy.lead') })
        + U.sec({ cls: 'sec-prose', body: `<article class="prose prose-doc">${C.policy.map(([h, ps], i) => `<h2>${i + 1}. ${esc(h)}</h2>${[].concat(ps).map((p) => Array.isArray(p) ? `<ul>${p.map((li) => `<li>${fixLinks(li)}</li>`).join('')}</ul>` : `<p>${fixLinks(p)}</p>`).join('')}`).join('')}</article>` });
    },
    nf() {
      return U.hd({ cls: 'nf-hd', kicker: '404', h1: v('nf.h1', 'Страница не найдена'), lead: v('nf.lead'), acts: U.btn(v('nf.btn', 'На главную'), P.home) + U.btn(v('nav.cases', 'Кейсы'), P.cases, 2) });
    }
  };
  Object.assign(R, T.render || {});

  const titles = { cases: 'cases.title', services: 'services.title', reviews: 'reviews.title', faq: 'faq.title', about: 'about.title', blog: 'blog.title', bonus: 'bonus.title', bot: 'bot.title', contact: 'contact.title', thanks: 'thanks.title', privacy: 'privacy.h1', nf: 'nf.h1' };
  const main = document.getElementById('main');
  if (main && R[page]) {
    if (titles[page]) document.title = String(v(titles[page], document.title)).replace(/<[^>]+>/g, '') + ' — ' + v('titleSfx', 'Павел Корчагин');
    main.innerHTML = R[page](H);
    // ссылка вида service.html?s=salebot#demo: страница рисуется скриптом, поэтому докручиваем сами, когда встанут шрифты
    // (повторяем, пока догружаются шрифты и картинки — и пока человек сам не начал листать)
    if (location.hash.length > 1) window.scrollToHash();
  }

  /* ---------- поведение ---------- */
  // фильтр кейсов
  const fl = document.querySelector('.filters');
  if (fl) {
    const apply = (f) => {
      if (![...fl.querySelectorAll('button')].some((b) => b.dataset.f === f)) f = 'all';
      fl.querySelectorAll('button').forEach((b) => { const on = b.dataset.f === f; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
      document.querySelectorAll('.sec-cases .card').forEach((c) => c.classList.toggle('hide', f !== 'all' && c.dataset.cat !== f));
      history.replaceState(null, '', f === 'all' ? P.cases : P.cases + '?f=' + f);
    };
    fl.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) apply(b.dataset.f); });
    apply(param('f') || 'all');
  }
  // увеличение картинок
  const lb = document.getElementById('lb');
  if (lb) {
    document.addEventListener('click', (e) => { const b = e.target.closest('[data-src]'); if (b) { lb.querySelector('img').src = b.dataset.src; lb.classList.add('open'); } });
    lb.addEventListener('click', () => lb.classList.remove('open'));
    addEventListener('keydown', (e) => { if (e.key === 'Escape') lb.classList.remove('open'); });
  }
  // ИИ-ассистент Salebot
  if (document.querySelector('[data-open-chat]')) {
    let ready = false, want = false;
    const open = () => { try { window.ChatBotPro.open(); } catch (e) {} setTimeout(() => { if (!document.getElementById('parent_frame')) { window.open('https://t.me/PavelTexSpec', '_blank', 'noopener'); document.querySelectorAll('.assistant-alt').forEach((p) => { p.textContent = 'Ассистент работает на texspeckps.ru — здесь открыл Telegram.'; }); } }, 1200); };
    const s = document.createElement('script'); s.src = 'https://salebot.pro/js/chatbot.js?v=1'; s.async = true;
    s.onload = () => { if (!window.ChatBotPro) return; window.ChatBotPro.init({ guid: 'deff08aa10e87edf46d7e68751d94d' }); ready = true; if (want) open(); };
    document.head.appendChild(s);
    document.querySelectorAll('[data-open-chat]').forEach((b) => b.addEventListener('click', () => { if (ready) { open(); return; } want = true; setTimeout(() => { if (!ready) window.open('https://t.me/PavelTexSpec', '_blank', 'noopener'); }, 4000); }));
  }
  // форма заявки
  const f = document.getElementById('lead-form');
  if (f) {
    const st = document.getElementById('st'), send = document.getElementById('send'), E = v('contact.errs', {});
    const pS = param('service'), pT = param('task');
    if (pS) { const r = f.querySelector(`input[name="service"][value="${pS.replace(/[^a-z]/g, '')}"]`); if (r) r.checked = true; }
    if (pT) f.task.value = pT;
    f.querySelectorAll('input').forEach((i) => i.addEventListener('input', () => i.removeAttribute('aria-invalid')));
    const say = (t, c) => { st.textContent = t; st.className = 'form-status ' + (c || ''); };
    window.leadMessage = () => {
      const sv = f.querySelector('input[name="service"]:checked'), L = sv ? SV.find((x) => x[0] === sv.value)[1] : 'не выбрано';
      return ['Новая заявка с сайта (стиль: ' + (T.name || '') + ')', 'Имя: ' + f.name.value.trim(), 'Что нужно: ' + L, 'Задача: ' + (f.task.value.trim() || '—'),
        'Бюджет: ' + (f.budget.value.trim() ? f.budget.value.trim() + ' ₽' : '—'), 'Контакт: ' + f.contact.value.trim(), 'Комментарий: ' + (f.comment.value.trim() || '—')].join('\n');
    };
    f.addEventListener('submit', (e) => {
      e.preventDefault(); let ok = true;
      ['name', 'contact'].forEach((n) => { if (!f[n].value.trim()) { f[n].setAttribute('aria-invalid', 'true'); ok = false; } });
      if (!ok) { say(E.need || 'Заполните имя и контакт для связи', 'err'); return; }
      if (!f.agree.checked) { say(E.agree || 'Отметьте согласие на обработку данных', 'err'); return; }
      const label = send.textContent; send.disabled = true; send.textContent = E.sending || 'Отправляю…'; say('');
      const text = window.leadMessage();
      fetch('https://texspeckps-form.texspeckps.workers.dev', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) })
        .then((r) => { if (!r.ok) throw 0; return r.json(); }).then((d) => { if (!d.ok) throw 0; say(E.sent || 'Отправлено!', 'ok'); setTimeout(() => { location.href = P.thanks; }, 700); })
        .catch(() => {
          const fallback = () => { say(E.fail || 'Напрямую отправить не вышло — текст заявки скопирован. Вставьте его в открывшийся Telegram.', 'err'); window.open('https://t.me/PavelTexSpec', '_blank', 'noopener'); };
          (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(fallback, () => say(E.fail2 || 'Не получилось отправить. Напишите, пожалуйста, в Telegram @PavelTexSpec.', 'err'));
          send.disabled = false; send.textContent = label;
        });
    });
  }
  if (T.after) T.after(H);
  // анимация появления, кнопка смены стиля, ссылки
  // на главной: карточки проектов с картинкой ведут на разбор кейса в этом стиле (живой сайт — внутри разбора)
  if (!page) addEventListener('load', () => {
    const byUrl = {}, byImg = {};
    D.all.forEach((c) => { if (c.url) byUrl[c.url] = c.id; byImg[c.img] = c.id; });
    document.querySelectorAll('a').forEach((a) => {
      const img = a.querySelector('img'); if (!img || a.closest('.style-switch')) return;
      const href = a.getAttribute('href') || '';
      const loose = !href || href === '#' || href === '#contact' || href === '#work' || href === P.cases || a.dataset.page === 'cases';
      const id = byUrl[href] || (loose ? byImg[img.getAttribute('src')] : null);
      if (id) { a.href = caseUrl(id); a.removeAttribute('target'); a.removeAttribute('data-page'); }
    });
    // строки-индекс с превью в data-img (экспериментальный)
    document.querySelectorAll('a[data-img]').forEach((a) => { const id = byImg[a.dataset.img]; if (id) { a.href = caseUrl(id); a.removeAttribute('target'); a.removeAttribute('data-page'); } });
    // карточки без общей ссылки (дерзкий, деловой): название становится ссылкой на разбор
    document.querySelectorAll('.card, .row').forEach((el) => {
      if (el.closest('a')) return;
      const img = el.querySelector('img'), h = el.querySelector('h4, h3'); if (!img || !h || h.querySelector('a')) return;
      const id = byImg[img.getAttribute('src')]; if (!id) return;
      h.innerHTML = `<a href="${caseUrl(id)}" class="case-link">${h.innerHTML}</a>`;
    });
  });
  // на главной стиля (без data-page) всё это делает сама главная — здесь только адреса страниц
  if (page) {
    if (!T.noReveal) document.querySelectorAll('.sec .w > *, .pg-hd .w > *, .card, .prow, .review').forEach((el) => el.setAttribute('data-rv', ''));
    if (window.reveal) reveal();
    if (window.styleSwitch && !T.noSwitch) styleSwitch(T.switchLabel || 'Сменить стиль'); else if (window.linkPages) linkPages();
  }
  return H;
};
