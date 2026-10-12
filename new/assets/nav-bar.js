/* Общая панель навигации для всех стилей: «Кейсы · Цены · Написать · Стиль ⇄» + подсказка при первом входе.
   Подключается сама: в стилях — через styleSwitch() из data.js, в /ai/ — тегом <script> из src/merge-new.js. */
(function (root) {
  const STYLES = [
    ['ai', 'ИИшный', 'mood'], ['business', 'Деловой', 'mood'], ['creative', 'Творческий', 'mood'], ['bold', 'Дерзкий', 'mood'],
    ['premium', 'Премиальный', 'mood'], ['bento', 'Технологичный', 'mood'], ['retro', 'Ностальгия', 'mood'], ['glass', 'Современный', 'mood'],
    ['terminal', 'Технарь', 'mood'], ['friendly', 'Дружелюбный', 'mood'], ['kinetic', 'Экспериментальный', 'mood'],
    ['cafe', 'Для кафе', 'sphere'], ['auto', 'Для автосервисов', 'sphere'], ['medical', 'Для медицины', 'sphere'], ['expert', 'Для экспертов', 'sphere'],
    ['lawyer', 'Для юристов', 'sphere'], ['accountant', 'Для бухгалтеров', 'sphere'], ['it', 'Для айтишников', 'sphere']
  ].map(([slug, name, group]) => ({ slug, name, group }));
  const SLUGS = STYLES.map((s) => s.slug);

  // стиль по адресу страницы: первая папка пути
  const currentStyle = (p) => { const s = String(p).split('/')[1] || ''; return SLUGS.includes(s) ? s : null; };
  // какая это страница — чтобы при смене стиля открыть ту же
  const AI = { cases: /^(keys|tilda|salebot|getcourse|figma)$/, services: /^(price|uslugi)$/, reviews: /^otzivi$/, blog: /^blog$/, faq: /^faq$/ };
  const ST = { cases: /^(cases|case)$/, services: /^(services|service)$/, reviews: /^reviews$/, blog: /^(blog|post)$/, faq: /^faq$/ };
  const pageKey = (p) => {
    const parts = String(p).split('/').filter(Boolean);
    const leaf = (parts[1] || '').replace(/\.html$/, '');
    if (!leaf || leaf === 'index') return 'home';
    const table = parts[0] === 'ai' ? AI : ST;
    for (const k of Object.keys(table)) if (table[k].test(leaf)) return k;
    return 'other';
  };
  const AI_URL = { home: '/ai/', cases: '/ai/keys', services: '/ai/price', reviews: '/ai/otzivi', blog: '/ai/blog', faq: '/ai/faq' };
  const ST_URL = { cases: 'cases.html', services: 'services.html', reviews: 'reviews.html', blog: 'blog.html', faq: 'faq.html' };
  const urlFor = (slug, key) => slug === 'ai' ? (AI_URL[key] || '/ai/') : '/' + slug + '/' + (ST_URL[key] || '');

  const TG = 'https://t.me/PavelTexSpec';
  const CSS = `
#pk-nav{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:2147483000;display:flex;align-items:center;gap:4px;
 padding:6px;border-radius:999px;background:rgba(14,14,18,.88);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
 box-shadow:0 12px 40px -12px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.08);font:600 14px/1 Manrope,system-ui,-apple-system,Segoe UI,sans-serif;color:#f4f4f5}
#pk-nav a,#pk-nav button{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:6px;padding:10px 14px;border-radius:999px;white-space:nowrap;color:inherit}
#pk-nav a:hover,#pk-nav button:hover{background:rgba(255,255,255,.1)}
#pk-nav a:focus-visible,#pk-nav button:focus-visible{outline:2px solid #d5ff45;outline-offset:2px}
#pk-nav .pk-go{background:#d5ff45;color:#0a0a0d}
#pk-nav .pk-go:hover{background:#e3ff7a}
#pk-nav .pk-st{color:#b4b4bb;font-weight:500}
#pk-nav .pk-st b{color:#f4f4f5;font-weight:700}
#pk-nav-menu{position:absolute;bottom:calc(100% + 10px);right:0;width:260px;max-height:min(70vh,520px);overflow:auto;padding:8px;border-radius:18px;
 background:#141418;box-shadow:0 20px 50px -15px rgba(0,0,0,.7),0 0 0 1px rgba(255,255,255,.08)}
#pk-nav-menu[hidden]{display:none}
#pk-nav-menu p{margin:8px 10px 4px;font:600 11px/1.2 Manrope,system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#7c7c86}
#pk-nav #pk-nav-menu a{display:flex;width:100%;box-sizing:border-box;padding:9px 10px;border-radius:10px;font-weight:500}
#pk-nav #pk-nav-menu a[aria-current]{color:#d5ff45}
#pk-nav #pk-nav-menu a[aria-current]::after{content:"✓";margin-left:auto}
#pk-nav #pk-nav-menu .pk-all{margin-top:6px;border-top:1px solid rgba(255,255,255,.08);border-radius:0 0 10px 10px;padding-top:12px}
#pk-nav-tip{position:fixed;left:50%;bottom:78px;transform:translateX(-50%);z-index:2147483000;width:min(420px,calc(100vw - 32px));box-sizing:border-box;
 padding:14px 40px 14px 16px;border-radius:16px;background:#d5ff45;color:#0a0a0d;font:500 14px/1.4 Manrope,system-ui,sans-serif;box-shadow:0 12px 40px -12px rgba(0,0,0,.5)}
#pk-nav-tip button{all:unset;cursor:pointer;position:absolute;top:8px;right:10px;font-size:20px;line-height:1;padding:4px}
@media(max-width:560px){#pk-nav{left:12px;right:12px;transform:none;justify-content:space-between;font-size:13px}
 #pk-nav a,#pk-nav button{padding:10px 8px}#pk-nav .pk-st b{display:none}#pk-nav-menu{width:min(280px,calc(100vw - 24px))}}
@media print{#pk-nav,#pk-nav-tip{display:none}}`;

  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* приватный режим */ } } };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  function mount() {
    if (typeof document === 'undefined' || document.getElementById('pk-nav')) return;
    const slug = currentStyle(location.pathname); if (!slug) return;
    const me = STYLES.find((s) => s.slug === slug), key = pageKey(location.pathname);
    document.querySelectorAll('.style-switch').forEach((e) => e.remove());
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const group = (g, title) => '<p>' + title + '</p>' + STYLES.filter((s) => s.group === g).map((s) =>
      '<a href="' + urlFor(s.slug, key) + '"' + (s.slug === slug ? ' aria-current="true"' : '') + '>' + esc(s.name) + '</a>').join('');
    const nav = document.createElement('nav');
    nav.id = 'pk-nav'; nav.setAttribute('aria-label', 'Навигация по сайту');
    nav.innerHTML = '<a href="' + urlFor(slug, 'cases') + '">Кейсы</a><a href="' + urlFor(slug, 'services') + '">Цены</a>'
      + '<a class="pk-go" href="' + TG + '" target="_blank" rel="noopener">Написать</a>'
      + '<button type="button" class="pk-st" aria-haspopup="true" aria-expanded="false" aria-controls="pk-nav-menu"><span>Стиль:</span> <b>' + esc(me.name) + '</b> ⇄</button>'
      + '<div id="pk-nav-menu" hidden>' + group('mood', 'По настроению') + group('sphere', 'Под вашу сферу') + '<a class="pk-all" href="/">На экран выбора стиля</a></div>';
    document.body.appendChild(nav);
    const btn = nav.querySelector('.pk-st'), menu = nav.querySelector('#pk-nav-menu');
    const toggle = (open) => { menu.hidden = !open; btn.setAttribute('aria-expanded', String(open)); if (open) (menu.querySelector('[aria-current]') || menu.querySelector('a')).focus(); };
    btn.addEventListener('click', (e) => { e.stopPropagation(); toggle(menu.hidden); });
    document.addEventListener('click', (e) => { if (!nav.contains(e.target)) toggle(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { toggle(false); btn.focus(); } });
    // если у стиля своя полоса, прибитая к низу экрана (панель задач у ретро), — встаём над ней
    let lift = 0;
    const place = () => {
      lift = 0;
      for (const el of document.body.children) {
        if (el === nav || el.id === 'pk-nav-tip') continue;
        const cs = getComputedStyle(el); if (cs.position !== 'fixed' || cs.display === 'none') continue;
        const r = el.getBoundingClientRect();
        if (r.bottom >= innerHeight - 2 && r.width > innerWidth * 0.6 && r.height < 120) lift = Math.max(lift, r.height);
      }
      nav.style.bottom = (16 + lift) + 'px';
      const tip = document.getElementById('pk-nav-tip'); if (tip) tip.style.bottom = (16 + lift + nav.offsetHeight + 12) + 'px';
      document.body.style.paddingBottom = (nav.offsetHeight + 32 + lift) + 'px';
    };
    place(); addEventListener('resize', place); addEventListener('load', place);
    const locked = () => [document.documentElement, document.body].some((el) => el.style.overflow === 'hidden' || getComputedStyle(el).overflow === 'hidden' && el.classList.length && /open|lock|modal/i.test(el.className));
    const sync = () => { const off = locked(); nav.style.display = off ? 'none' : ''; const t = document.getElementById('pk-nav-tip'); if (t) t.style.display = off ? 'none' : ''; };
    new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class'] });
    new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['style', 'class'] });
    // подсказка — один раз на стиль, не на служебных страницах
    const TIP = 'pk-nav-tip-' + slug;
    if (!store.get(TIP) && !/404|spasibo|thanks/.test(location.pathname)) {
      const tip = document.createElement('div');
      tip.id = 'pk-nav-tip'; tip.setAttribute('role', 'status');
      tip.innerHTML = 'Вы смотрите мой сайт в оформлении «' + esc(me.name) + '». Кейсы и цены одинаковые во всех стилях — сменить можно здесь ↓'
        + '<button type="button" aria-label="Закрыть подсказку">×</button>';
      document.body.appendChild(tip); place();
      store.set(TIP, '1');
      const close = () => tip.remove();
      tip.querySelector('button').addEventListener('click', close);
      setTimeout(close, 8000);
    }
  }
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
  }

  const api = { STYLES, currentStyle, pageKey, urlFor, mount };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PKNav = api;
})(typeof window !== 'undefined' ? window : globalThis);
