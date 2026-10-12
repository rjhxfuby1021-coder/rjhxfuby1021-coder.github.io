# Упрощение навигации — план работ (этапы 1 и 2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Сделать сайт понятным с первого экрана: ясный экран выбора стиля, одна и та же панель «Кейсы · Цены · Написать · Стиль ⇄» во всех 18 стилях и фильтр кейсов по сфере.

**Architecture:** Новый самостоятельный скрипт `new/assets/nav-bar.js` (без зависимостей, стили внутри) рисует панель и подсказку; во все 17 стилей он попадает через уже существующий вызов `styleSwitch()` из `new/assets/data.js`, в ИИшный стиль `/ai/` — через `src/merge-new.js`. Логика (список стилей, перевод адреса страницы между стилями) вынесена в чистые функции, которые тестируются `node --test` без браузера. Экран выбора `new/index.html` переписывается; фильтр сферы добавляется в `engine.js` (стили) и `src/cases/render.js` (ИИшный).

**Tech Stack:** статический HTML/CSS/JS без сборщиков; Node 20+ (`node --test`, `node build.js`); Playwright из `~/.claude/skills/gstack/node_modules/playwright` для проверки в браузере.

**Spec:** `docs/superpowers/specs/2026-10-13-navigation-simplify-design.md`

Этап 3 (короткие главные в 18 стилях) — отдельный план после того, как этапы 1–2 опубликованы и проверены Павлом.

## Global Constraints

- Тексты интерфейса — по-русски, без англицизмов там, где есть русское слово; правило «у каждого стиля свой голос» для текстов стилей сохраняется.
- Не выдумывать цифры, отзывы, даты; содержание кейсов, цен и отзывов не меняется (кроме нового поля `sphere`).
- Telegram для связи: `https://t.me/PavelTexSpec`.
- Стиль по умолчанию для кнопки «Показать сайт» — ИИшный, адрес `/ai/`.
- localStorage только для подсказки, каждое обращение в `try/catch`; без него всё работает.
- После правок в `new/` запускать `node new/tools/bump-version.js` (сброс кэша), затем `node build.js` в корне.
- Коммитить только свои файлы; не трогать `qledger-tilda/`, `worker/`.
- Откат: тег `backup-2026-10-13-before-navigation`.

## Review Focus

- Узкий телефон (320–390 px): панель не вылезает за экран и не перекрывает кнопку отправки формы и последний блок страницы.
- Страница, которой нет в выбранном стиле (например `/ai/rezume`, `bonus.html`): переход «⇄» ведёт на главную стиля, а не в 404.
- Отключённый/запрещённый localStorage (приватный режим): подсказка показывается, ошибок в консоли нет.
- Стили со своими нижними плашками (демо-чат, cookie): панель не налезает на них — проверить `bot.html` и главную ИИшного.
- Фильтр кейсов с комбинацией без результатов: видно «В этой сфере пока нет кейсов этого направления» и кнопка «Сбросить», а не пустая страница.

---

### Task 1: Чистая логика панели (стили и адреса)

**Files:**
- Create: `new/assets/nav-bar.js`
- Test: `new/tests/nav-bar.test.js`

**Interfaces:**
- Produces (через `module.exports` в Node и `window.PKNav` в браузере):
  - `STYLES: Array<{slug: string, name: string, group: 'mood'|'sphere'}>` — 18 стилей, `slug` `'ai'` для ИИшного.
  - `currentStyle(pathname: string): string|null` — slug по адресу (`/business/cases.html` → `'business'`, `/ai/keys` → `'ai'`, `/` → `null`).
  - `pageKey(pathname: string): string` — ключ страницы (`'home'|'cases'|'services'|'reviews'|'blog'|'faq'|'other'`).
  - `urlFor(slug: string, key: string): string` — адрес той же страницы в другом стиле (`urlFor('ai','cases')` → `'/ai/keys'`, `urlFor('bold','reviews')` → `'/bold/reviews.html'`, `'other'` → главная стиля).

- [ ] **Step 1: Написать падающий тест**

```js
// new/tests/nav-bar.test.js
const test = require('node:test');
const assert = require('node:assert');
const N = require('../assets/nav-bar.js');

test('18 стилей, ИИшный первый', () => {
  assert.strictEqual(N.STYLES.length, 18);
  assert.strictEqual(N.STYLES[0].slug, 'ai');
  assert.strictEqual(N.STYLES.filter((s) => s.group === 'sphere').length, 7);
});
test('currentStyle', () => {
  assert.strictEqual(N.currentStyle('/business/cases.html'), 'business');
  assert.strictEqual(N.currentStyle('/business/'), 'business');
  assert.strictEqual(N.currentStyle('/ai/keys'), 'ai');
  assert.strictEqual(N.currentStyle('/ai/'), 'ai');
  assert.strictEqual(N.currentStyle('/'), null);
  assert.strictEqual(N.currentStyle('/index.html'), null);
  assert.strictEqual(N.currentStyle('/img/x.webp'), null);
});
test('pageKey', () => {
  assert.strictEqual(N.pageKey('/bold/'), 'home');
  assert.strictEqual(N.pageKey('/bold/index.html'), 'home');
  assert.strictEqual(N.pageKey('/bold/case.html'), 'cases');
  assert.strictEqual(N.pageKey('/bold/services.html'), 'services');
  assert.strictEqual(N.pageKey('/bold/service.html'), 'services');
  assert.strictEqual(N.pageKey('/ai/keys'), 'cases');
  assert.strictEqual(N.pageKey('/ai/tilda'), 'cases');
  assert.strictEqual(N.pageKey('/ai/price'), 'services');
  assert.strictEqual(N.pageKey('/ai/otzivi'), 'reviews');
  assert.strictEqual(N.pageKey('/ai/blog/slug'), 'blog');
  assert.strictEqual(N.pageKey('/ai/rezume'), 'other');
  assert.strictEqual(N.pageKey('/bold/bonus.html'), 'other');
});
test('urlFor', () => {
  assert.strictEqual(N.urlFor('ai', 'cases'), '/ai/keys');
  assert.strictEqual(N.urlFor('ai', 'services'), '/ai/price');
  assert.strictEqual(N.urlFor('ai', 'home'), '/ai/');
  assert.strictEqual(N.urlFor('ai', 'other'), '/ai/');
  assert.strictEqual(N.urlFor('bold', 'reviews'), '/bold/reviews.html');
  assert.strictEqual(N.urlFor('bold', 'home'), '/bold/');
  assert.strictEqual(N.urlFor('bold', 'other'), '/bold/');
});
```

- [ ] **Step 2: Запустить — тест падает**

Run: `node --test new/tests/` (в корне репозитория)
Expected: FAIL — `Cannot find module '../assets/nav-bar.js'`

- [ ] **Step 3: Минимальная реализация логики**

```js
// new/assets/nav-bar.js
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

  const currentStyle = (p) => { const s = String(p).split('/')[1] || ''; return SLUGS.includes(s) ? s : null; };
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

  const api = { STYLES, currentStyle, pageKey, urlFor };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PKNav = api;
})(typeof window !== 'undefined' ? window : globalThis);
```

- [ ] **Step 4: Запустить — тесты проходят**

Run: `node --test new/tests/`
Expected: PASS, 4 теста

- [ ] **Step 5: Commit**

```bash
git add new/assets/nav-bar.js new/tests/nav-bar.test.js
git commit -m "Общая панель: список стилей и перевод адресов между стилями (с тестами)"
```

### Task 2: Панель и подсказка в браузере

**Files:**
- Modify: `new/assets/nav-bar.js` (добавить отрисовку в ту же IIFE, перед `const api`)
- Create: `new/tests/nav-bar.check.js` (проверка Playwright)

**Interfaces:**
- Consumes: `STYLES`, `currentStyle`, `pageKey`, `urlFor` из Task 1.
- Produces: `PKNav.mount()` — рисует панель один раз (повторный вызов ничего не делает); элемент `nav#pk-nav`, подсказка `#pk-nav-tip`, меню `#pk-nav-menu`. Глобальная `window.PKNav`.

- [ ] **Step 1: Написать проверку в браузере (падает, панели ещё нет)**

```js
// new/tests/nav-bar.check.js — запуск: node new/tests/nav-bar.check.js (нужен сервер site-merged на :5183 после node build.js)
const path = require('path');
const { chromium } = require(path.join(process.env.USERPROFILE, '.claude/skills/gstack/node_modules/playwright'));
const BASE = process.env.BASE || 'http://localhost:5183';
const PAGES = ['/business/', '/business/cases.html', '/creative/', '/retro/', '/ai/', '/ai/keys', '/bold/bot.html'];
(async () => {
  const b = await chromium.launch(); let bad = 0;
  for (const [w, h] of [[1440, 900], [360, 740]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } });
    for (const p of PAGES) {
      const page = await ctx.newPage(); const errs = [];
      page.on('pageerror', (e) => errs.push(e.message));
      await page.goto(BASE + p, { waitUntil: 'load' }); await page.waitForTimeout(800);
      const r = await page.evaluate(() => {
        const n = document.getElementById('pk-nav'); if (!n) return { ok: false, why: 'нет панели' };
        const rc = n.getBoundingClientRect();
        return { ok: rc.left >= 0 && rc.right <= innerWidth + 1 && rc.bottom <= innerHeight + 1, why: 'вне экрана ' + JSON.stringify(rc),
          links: [...n.querySelectorAll('a')].map((a) => a.getAttribute('href')), tip: !!document.getElementById('pk-nav-tip'),
          old: !!document.querySelector('.style-switch') };
      });
      const fail = !r.ok || r.old || errs.length || !r.tip;
      if (fail) bad++;
      console.log((fail ? 'FAIL ' : 'ok   ') + w + ' ' + p, fail ? JSON.stringify({ ...r, errs }) : '');
      await page.close();
    }
    // подсказка один раз: второй заход в тот же стиль — без подсказки
    const page = await ctx.newPage(); await page.goto(BASE + '/business/'); await page.waitForTimeout(500);
    const again = await page.evaluate(() => !!document.getElementById('pk-nav-tip'));
    if (again) { bad++; console.log('FAIL подсказка показалась повторно'); }
    await ctx.close();
  }
  await b.close(); console.log(bad ? bad + ' ошибок' : 'всё ок'); process.exit(bad ? 1 : 0);
})();
```

- [ ] **Step 2: Запустить — падает**

Run: `node build.js && node new/tests/nav-bar.check.js` (сервер site-merged уже запущен на 5183 или `npx serve site -l 5183`)
Expected: FAIL `нет панели` на всех страницах

- [ ] **Step 3: Реализовать отрисовку**

Вставить в `new/assets/nav-bar.js` перед строкой `const api = ...`:

```js
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
#pk-nav-menu a{display:flex;width:100%;box-sizing:border-box;padding:9px 10px;border-radius:10px;font-weight:500}
#pk-nav-menu a[aria-current]{color:#d5ff45}
#pk-nav-menu a[aria-current]::after{content:"✓";margin-left:auto}
#pk-nav-menu .pk-all{margin-top:6px;border-top:1px solid rgba(255,255,255,.08);border-radius:0 0 10px 10px;padding-top:12px}
#pk-nav-tip{position:fixed;left:50%;bottom:78px;transform:translateX(-50%);z-index:2147483000;width:min(420px,calc(100vw - 32px));box-sizing:border-box;
 padding:14px 40px 14px 16px;border-radius:16px;background:#d5ff45;color:#0a0a0d;font:500 14px/1.4 Manrope,system-ui,sans-serif;box-shadow:0 12px 40px -12px rgba(0,0,0,.5)}
#pk-nav-tip button{all:unset;cursor:pointer;position:absolute;top:8px;right:10px;font-size:20px;line-height:1;padding:4px}
@media(max-width:560px){#pk-nav{left:12px;right:12px;transform:none;justify-content:space-between;font-size:13px}
 #pk-nav a,#pk-nav button{padding:10px 9px}#pk-nav .pk-st span{display:none}#pk-nav-menu{width:min(280px,calc(100vw - 24px))}}
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
    // место под панель внизу страницы
    const pad = () => { document.body.style.paddingBottom = (nav.offsetHeight + 32) + 'px'; };
    pad(); addEventListener('resize', pad);
    // подсказка — один раз на стиль, не на служебных страницах
    const TIP = 'pk-nav-tip-' + slug;
    if (!store.get(TIP) && !/404|spasibo|thanks/.test(location.pathname)) {
      const tip = document.createElement('div');
      tip.id = 'pk-nav-tip'; tip.setAttribute('role', 'status');
      tip.innerHTML = 'Вы смотрите мой сайт в оформлении «' + esc(me.name) + '». Кейсы и цены одинаковые во всех стилях — сменить можно здесь ↓'
        + '<button type="button" aria-label="Закрыть подсказку">×</button>';
      document.body.appendChild(tip);
      const close = () => { tip.remove(); store.set(TIP, '1'); };
      tip.querySelector('button').addEventListener('click', close);
      setTimeout(close, 8000);
    }
  }
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
  }
```

И добавить `mount` в экспорт: `const api = { STYLES, currentStyle, pageKey, urlFor, mount };`

- [ ] **Step 4: Подключить к стилям через `styleSwitch` и в ретро**

В `new/assets/data.js` заменить тело `window.styleSwitch`:

```js
/* Общая панель навигации (assets/nav-bar.js) вместо старой кнопки «сменить стиль» */
window.styleSwitch = function () {
  if (window.linkPages) window.linkPages();
  if (window.PKNav) return window.PKNav.mount();
  const s = document.createElement('script');
  s.src = (window.ROOT || '../') + 'assets/nav-bar.js?v=' + (document.querySelector('script[src*="data.js?v="]') || { src: 'v=0' }).src.split('v=')[1];
  document.head.appendChild(s);
};
```

В `new/retro/index.html` перед `</body>` добавить `<script>if (window.styleSwitch) styleSwitch();</script>` (у ретро на главной вызова нет).

- [ ] **Step 5: Подключить к /ai/ вместо зелёной кнопки**

В `src/merge-new.js` заменить константу `SWITCH` на:

```js
  const SWITCH = '<script src="/assets/nav-bar.js" defer></script>';
```

(строка вставки `html.replace('</body>', SWITCH + '</body>')` остаётся; /404 и /spasibo по-прежнему без неё).

- [ ] **Step 6: Запустить тесты и проверку**

Run: `node --test new/tests/ && node new/tools/bump-version.js && node build.js && node new/tests/nav-bar.check.js`
Expected: unit — PASS; проверка — `всё ок`

- [ ] **Step 7: Commit**

```bash
git add new/assets/nav-bar.js new/assets/data.js new/retro/index.html src/merge-new.js new/tests/nav-bar.check.js new/*/*.html new/index.html
git commit -m "Общая панель «Кейсы · Цены · Написать · Стиль» и подсказка при первом входе во всех стилях и /ai/"
```

### Task 3: Одинаковое меню в шапке стилей

**Files:**
- Modify: `new/assets/engine.js:102` (список `NAV` внутренних страниц)
- Modify: шапки главных `new/<стиль>/index.html` для 17 стилей (строки с `data-page="bot"` в `<nav>`/меню шапки)
- Modify: `new/creative/*.html` и `new/creative/site.js` (у творческого своя разметка)

**Interfaces:**
- Consumes: ничего из Task 1–2.
- Produces: во всех стилях пункты меню шапки по порядку `cases, services|price, reviews, blog`; `bot` в шапке нет.

- [ ] **Step 1: Проверка (падает)**

Добавить в конец `new/tests/nav-bar.test.js`:

```js
const fs = require('fs'), pth = require('path');
test('в шапках стилей нет пункта «Демо-бот»', () => {
  const dir = pth.join(__dirname, '..');
  const bad = fs.readdirSync(dir).filter((d) => fs.existsSync(pth.join(dir, d, 'index.html'))).filter((d) => {
    const html = fs.readFileSync(pth.join(dir, d, 'index.html'), 'utf8');
    const head = (html.match(/<header[\s\S]*?<\/header>/) || [''])[0];
    return /data-page="bot"/.test(head);
  });
  assert.deepStrictEqual(bad, []);
});
test('NAV движка: кейсы, услуги, отзывы, блог', () => {
  const src = fs.readFileSync(pth.join(__dirname, '../assets/engine.js'), 'utf8');
  const m = src.match(/const NAV = \[(.*?)\];/);
  assert.deepStrictEqual([...m[1].matchAll(/\['(\w+)'/g)].map((x) => x[1]), ['cases', 'services', 'reviews', 'blog']]);
});
```

Run: `node --test new/tests/` — Expected: FAIL (список стилей с `bot` в шапке; NAV длиннее)

- [ ] **Step 2: Исправить движок**

`new/assets/engine.js:102`:

```js
  const NAV = [['cases', P.cases], ['services', P.services], ['reviews', P.reviews], ['blog', P.blog]];
```

(`about`, `faq`, `bot` остаются доступны из подвала — строка 95 и соседние, их не трогать.)

- [ ] **Step 3: Убрать «Демо-бот» из шапок главных**

Для каждого файла из списка, который выдал тест, удалить из `<header>…</header>` элемент `<a data-page="bot">…</a>` (и пустые разделители рядом, если остаются). Пример для `new/business/index.html:164`:

было `<nav class="menu"><a data-page="cases">Кейсы</a><a data-page="price">Услуги и цены</a><a data-page="reviews">Отзывы</a><a data-page="blog">Блог</a><a data-page="bot">Демо-бот</a></nav>`
стало `<nav class="menu"><a data-page="cases">Кейсы</a><a data-page="price">Услуги и цены</a><a data-page="reviews">Отзывы</a><a data-page="blog">Блог</a></nav>`

Если в шапке стиля порядок другой — привести к `cases → price → reviews → blog`, подписи оставить в голосе стиля. Ссылка на демо-бот в подвале стиля сохраняется (если её нет — не добавлять).

- [ ] **Step 4: Тесты проходят**

Run: `node --test new/tests/` — Expected: PASS

- [ ] **Step 5: Проверить в браузере и закоммитить**

Run: `node new/tools/bump-version.js && node build.js && node new/tests/nav-bar.check.js` — Expected: `всё ок`

```bash
git add new/assets/engine.js new/*/index.html new/creative new/tests/nav-bar.test.js
git commit -m "Одинаковое меню в шапке всех стилей: Кейсы · Услуги и цены · Отзывы · Блог"
```

### Task 4: Новый экран выбора стиля

**Files:**
- Modify: `new/index.html` (разметка `<body>` и стили в `<style>`; превью-карточки `.c sN` переиспользуются)
- Test: `new/tests/chooser.check.js`

**Interfaces:**
- Consumes: ничего (страница самостоятельная; ссылки `/ai/`, `/ai/keys`, `<slug>/`).
- Produces: на странице `h1`, кнопки `a.ch-main[href="/ai/"]`, `a.ch-cases[href="/ai/keys"]`, вкладки `button[role=tab][data-tab=mood|sphere]`, кнопка `button.ch-more`, карточки `a.c` с `data-group="mood|sphere"` и `data-extra` у 5 скрытых по умолчанию.

- [ ] **Step 1: Проверка (падает)**

```js
// new/tests/chooser.check.js — node new/tests/chooser.check.js (сервер :5183)
const path = require('path');
const { chromium } = require(path.join(process.env.USERPROFILE, '.claude/skills/gstack/node_modules/playwright'));
(async () => {
  const b = await chromium.launch(); let bad = 0; const ok = (c, m) => { if (!c) { bad++; console.log('FAIL', m); } };
  for (const [w, h] of [[1440, 900], [360, 740]]) {
    const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
    await p.goto((process.env.BASE || 'http://localhost:5183') + '/'); await p.waitForTimeout(500);
    const r = await p.evaluate(() => {
      const vis = (el) => el && el.getBoundingClientRect().height > 0 && getComputedStyle(el).visibility !== 'hidden';
      const main = document.querySelector('a.ch-main'), cases = document.querySelector('a.ch-cases');
      return { h1: (document.querySelector('h1') || {}).textContent || '', main: main && main.getAttribute('href'), mainTop: main && main.getBoundingClientRect().top,
        cases: cases && cases.getAttribute('href'), moodVisible: [...document.querySelectorAll('a.c[data-group=mood]')].filter(vis).length,
        sphereVisible: [...document.querySelectorAll('a.c[data-group=sphere]')].filter(vis).length, scrollX: document.documentElement.scrollWidth > innerWidth };
    });
    ok(/один сайт/i.test(await p.textContent('body')), w + ' нет объяснения «один сайт»');
    ok(r.main === '/ai/' && r.mainTop < h, w + ' кнопка «Показать сайт» не на первом экране');
    ok(r.cases === '/ai/keys', w + ' нет «Сразу к кейсам»');
    ok(r.moodVisible === 6 && r.sphereVisible === 0, w + ' видно стилей: ' + r.moodVisible + '/' + r.sphereVisible);
    ok(!r.scrollX, w + ' горизонтальная прокрутка');
    await p.click('button.ch-more'); ok((await p.$$eval('a.c[data-group=mood]', (a) => a.filter((e) => e.getBoundingClientRect().height > 0).length)) === 11, w + ' «Ещё 5» не раскрыло');
    await p.click('button[data-tab=sphere]'); ok((await p.$$eval('a.c[data-group=sphere]', (a) => a.filter((e) => e.getBoundingClientRect().height > 0).length)) === 7, w + ' вкладка сфер');
  }
  await b.close(); console.log(bad ? bad + ' ошибок' : 'всё ок'); process.exit(bad ? 1 : 0);
})();
```

Run: `node build.js && node new/tests/chooser.check.js` — Expected: FAIL (нет `a.ch-main` и т. д.)

- [ ] **Step 2: Переписать шапку и сетку `new/index.html`**

Заменить блок `<div class="intro">…</div>` + `<a class="c-ai" …>…</a>` на:

```html
  <header class="ch-head">
    <div class="ch-who"><span class="pk-logo pk-logo--chooser"><span class="pk-mark" aria-hidden="true">ПК</span><span class="pk-word">Павел Корчагин</span></span><span class="ch-status">беру новые проекты</span></div>
    <h1>Сайты на Tilda, чат-боты, онлайн-школы <span>и дизайн — под ключ</span></h1>
    <p class="ch-lead">Это <b>один сайт в 18 оформлениях</b>. Кейсы, цены и отзывы везде одинаковые — выберите подачу, которая вам ближе, или смотрите обычную.</p>
    <div class="ch-acts">
      <a class="ch-main" href="/ai/">Показать сайт →</a>
      <a class="ch-cases" href="/ai/keys">Сразу к кейсам</a>
    </div>
    <ol class="ch-steps"><li>Выберите стиль</li><li>Смотрите кейсы и цены</li><li>Сменить стиль — в любой момент кнопкой внизу</li></ol>
  </header>
  <div class="ch-tabs" role="tablist" aria-label="Стили сайта">
    <button role="tab" data-tab="mood" aria-selected="true">По настроению</button>
    <button role="tab" data-tab="sphere" aria-selected="false">Под вашу сферу</button>
  </div>
```

Карточки: в `<nav class="grid">` поставить первой карточку ИИшного стиля (бывший `.c-ai`) в той же разметке, что и остальные `.c`:
`<a class="c s0" href="/ai/" data-group="mood"><div class="top"><i>00</i><em>нынешний сайт</em></div><div class="nm"><b>ИИшный</b><span>Тёмный экран и ИИ-ассистент 24/7</span></div><span class="go" aria-hidden="true">→</span></a>`.
Каждой карточке стиля по настроению добавить `data-group="mood"`; карточкам Ностальгия, Современный, Технарь, Дружелюбный, Экспериментальный — ещё `data-extra`. Отраслевые карточки (блок «Под вашу сферу») перенести в ту же сетку с `data-group="sphere"`. Подпись внутри карточки сократить до одной строки (`.nm span`), оставив её текст. После сетки: `<button type="button" class="ch-more">Ещё 5 стилей</button>`.

Стили (дописать в `<style>`, цвета и шрифты — как у страницы сейчас):

```css
.ch-head{padding:28px 0 18px;display:grid;gap:16px;max-width:860px}
.ch-who{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.ch-status{font:600 12px Manrope;color:#4a7d00;background:#eef9d0;padding:6px 10px;border-radius:999px}
.ch-head h1{font:800 clamp(30px,4.4vw,60px)/1.02 Unbounded,Manrope,sans-serif;letter-spacing:-.03em}
.ch-head h1 span{color:#8a867c}
.ch-lead{font:500 clamp(16px,1.5vw,19px)/1.5 Manrope;max-width:60ch}
.ch-acts{display:flex;gap:12px;flex-wrap:wrap}
.ch-main,.ch-cases{display:inline-flex;align-items:center;justify-content:center;min-height:52px;padding:0 26px;border-radius:999px;font:700 16px Manrope}
.ch-main{background:#0a0a0d;color:#d5ff45}
.ch-cases{border:1.5px solid #0a0a0d}
.ch-steps{display:flex;gap:10px 22px;flex-wrap:wrap;list-style:none;counter-reset:s;padding:0;font:500 14px Manrope;color:#5d5a52}
.ch-steps li{counter-increment:s}.ch-steps li::before{content:counter(s) ". ";font-weight:700;color:#0a0a0d}
.ch-tabs{display:flex;gap:8px;margin:18px 0 14px}
.ch-tabs button{all:unset;cursor:pointer;padding:10px 18px;border-radius:999px;font:700 14px Manrope;border:1.5px solid #d8d4ca}
.ch-tabs button[aria-selected=true]{background:#0a0a0d;color:#fff;border-color:#0a0a0d}
.grid .c[hidden]{display:none}
.ch-more{all:unset;cursor:pointer;display:block;margin:16px auto 0;padding:12px 22px;border-radius:999px;border:1.5px solid #0a0a0d;font:700 14px Manrope}
@media(max-width:560px){.ch-main,.ch-cases{width:100%}.grid{grid-template-columns:1fr}}
```

Скрипт (перед `</body>`, после `data.js`):

```html
<script>
(function () {
  const cards = [...document.querySelectorAll('.grid .c')], more = document.querySelector('.ch-more');
  let tab = 'mood', open = false;
  function show() {
    cards.forEach((c) => { c.hidden = c.dataset.group !== tab || (tab === 'mood' && !open && c.hasAttribute('data-extra')); });
    more.hidden = tab !== 'mood' || open;
    document.querySelectorAll('.ch-tabs button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === tab)));
  }
  document.querySelectorAll('.ch-tabs button').forEach((b) => b.addEventListener('click', () => { tab = b.dataset.tab; show(); }));
  more.addEventListener('click', () => { open = true; show(); });
  show();
})();
</script>
```

Удалить старый отдельный блок «Под вашу сферу» (заголовок + его сетку), его карточки уже в общей сетке.

- [ ] **Step 3: Проверка проходит**

Run: `node new/tools/bump-version.js && node build.js && node new/tests/chooser.check.js`
Expected: `всё ок`

- [ ] **Step 4: Скриншоты для Павла (десктоп и телефон) и commit**

Run: скриншоты `http://localhost:5183/` на 1440 и 390 через Browser pane.

```bash
git add new/index.html new/tests/chooser.check.js
git commit -m "Экран выбора стиля: «один сайт в 18 оформлениях», кнопки «Показать сайт» и «Сразу к кейсам», вкладки и «Ещё 5 стилей»"
```

- [ ] **Step 5: Публикация этапа 1**

```bash
git push
```

Через 1–2 минуты проверить https://texspeckps.ru/, https://texspeckps.ru/business/, https://texspeckps.ru/ai/ (панель видна, меню стилей открывается). Показать Павлу скриншоты и дождаться его отзыва перед этапом 2.

### Task 5: Поле «сфера» у кейсов

**Files:**
- Modify: `src/data/cases.json` (поле `sphere` у каждого из 35 кейсов)
- Modify: `new/assets/content.js`, `new/assets/data.js` (то же поле в копиях)
- Create: `tools/set-sphere.js` (одноразово проставляет сферу во все три файла)
- Test: `new/tests/sphere.test.js`

**Interfaces:**
- Produces: `sphere ∈ {'food','auto','edu','b2b','beauty','other'}` у каждого кейса в `src/data/cases.json`, в `window.CONTENT.cases[]` и в `window.DATA.all[]`.

- [ ] **Step 1: Тест (падает)**

```js
// new/tests/sphere.test.js
const test = require('node:test'), assert = require('node:assert'), fs = require('fs'), path = require('path');
const OK = ['food', 'auto', 'edu', 'b2b', 'beauty', 'other'];
const R = path.join(__dirname, '../..');
test('у каждого кейса есть сфера — во всех трёх копиях данных', () => {
  const src = JSON.parse(fs.readFileSync(path.join(R, 'src/data/cases.json'), 'utf8'));
  const w = {}; new Function('window', fs.readFileSync(path.join(R, 'new/assets/content.js'), 'utf8') + fs.readFileSync(path.join(R, 'new/assets/data.js'), 'utf8').replace(/^[\s\S]*?(window\.DATA\.all)/m, '$1'))(w);
  for (const [name, list] of [['cases.json', src], ['content.js', w.CONTENT.cases], ['data.js', w.DATA.all]]) {
    const bad = list.filter((c) => !OK.includes(c.sphere)).map((c) => c.id);
    assert.deepStrictEqual(bad, [], name + ': без сферы ' + bad.join(', '));
  }
});
```

Run: `node --test new/tests/sphere.test.js` — Expected: FAIL со списком всех 35 id.

- [ ] **Step 2: Скрипт простановки**

```js
// tools/set-sphere.js — node tools/set-sphere.js
const fs = require('fs');
const SPHERE = {
  food: ['cafe-shop', 'sb-cafe', 'cafe-card', 'skobar-stm'],
  auto: ['mechanic', 'nizhavtovykup', 'spectech'],
  edu: ['pro-technik', 'maxfit', 'webinar-landing', 'figma-webinar', 'tochka-opory', 'sb-course', 'sb-autowebinar', 'sb-channel', 'habits-card'],
  b2b: ['qledger', 'bukh-hero', 'yurdirect', 'cyberhygiene', 'service-cards', 'sb-referral', 'sb-wheel'],
  beauty: ['sb-jador', 'piercing-shop'],
  other: ['ekskurpiter', 'wave-sup', 'weekend-reset', 'diva-n', 'kromka', 'vera-portfolio', 'fold8-ozon', 'nova-symphony', 'sb-portfolio-ai', 'sb-cards']
};
const of = {}; for (const [s, ids] of Object.entries(SPHERE)) ids.forEach((id) => { of[id] = s; });
const P = 'src/data/cases.json', raw = fs.readFileSync(P, 'utf8'), arr = JSON.parse(raw);
const miss = arr.filter((c) => !of[c.id]).map((c) => c.id); if (miss.length) throw new Error('нет сферы: ' + miss.join(', '));
arr.forEach((c) => { c.sphere = of[c.id]; });
fs.writeFileSync(P, JSON.stringify(arr, null, raw.match(/\n( +)/)[1].length) + (raw.endsWith('\n') ? '\n' : ''));
const CP = 'new/assets/content.js', cr = fs.readFileSync(CP, 'utf8'), m = cr.match(/^([\s\S]*?window\.CONTENT = )(\{[\s\S]*\})(;\s*)$/), C = JSON.parse(m[2]);
C.cases.forEach((c) => { c.sphere = of[c.id]; }); fs.writeFileSync(CP, m[1] + JSON.stringify(C) + m[3]);
const DP = 'new/assets/data.js';
fs.writeFileSync(DP, fs.readFileSync(DP, 'utf8').replace(/^(\s*\{"id":"([\w-]+)",)/gm, (all, head, id) => of[id] && !all.includes('"sphere"') ? head + '"sphere":"' + of[id] + '",' : all));
console.log('сферы проставлены:', arr.length);
```

Перед запуском свериться: id в списке совпадают с `node -e "console.log(require('./src/data/cases.json').map(c=>c.id).join(' '))"`; скрипт сам упадёт, если кого-то не хватает.

- [ ] **Step 3: Запустить и проверить**

Run: `node tools/set-sphere.js && node --test new/tests/` — Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add tools/set-sphere.js src/data/cases.json new/assets/content.js new/assets/data.js new/tests/sphere.test.js
git commit -m "Кейсы: поле «сфера» (еда, авто, обучение, B2B, красота, прочее)"
```

### Task 6: Двойной фильтр на странице кейсов стилей

**Files:**
- Modify: `new/assets/engine.js:116-121` (`cases()`) и обработчик фильтров (поиск по `data-f` в engine.js)
- Modify: `new/assets/inner-base.css` (вторая строка фильтров, сообщение «пусто»)
- Test: `new/tests/cases-filter.check.js`

**Interfaces:**
- Consumes: `c.sphere` из Task 5 (в `D.all`).
- Produces: карточка `article.card` получает `data-sphere`; кнопки сфер `button[data-s]`; адрес `?f=<cat>&s=<sphere>`; блок `.cases-empty` с кнопкой `.cases-reset`.

- [ ] **Step 1: Проверка (падает)**

```js
// new/tests/cases-filter.check.js — node new/tests/cases-filter.check.js
const path = require('path');
const { chromium } = require(path.join(process.env.USERPROFILE, '.claude/skills/gstack/node_modules/playwright'));
const BASE = process.env.BASE || 'http://localhost:5183';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage(); let bad = 0; const ok = (c, m) => { if (!c) { bad++; console.log('FAIL', m); } };
  const vis = () => p.$$eval('article.card', (a) => a.filter((e) => e.offsetParent !== null).length);
  await p.goto(BASE + '/business/cases.html?f=Tilda&s=food'); await p.waitForTimeout(600);
  const n1 = await vis(); ok(n1 >= 1, 'Tilda+еда: ' + n1);
  ok(await p.$$eval('article.card', (a) => a.filter((e) => e.offsetParent !== null).every((e) => e.dataset.cat === 'Tilda' && e.dataset.sphere === 'food')), 'фильтр пропустил чужие');
  await p.goto(BASE + '/business/cases.html?f=GetCourse&s=beauty'); await p.waitForTimeout(600);
  ok((await vis()) === 0 && await p.isVisible('.cases-empty'), 'пустая комбинация без сообщения');
  await p.click('.cases-reset'); await p.waitForTimeout(300); ok((await vis()) === 35, 'сброс не показал все 35');
  await p.click('button[data-s=auto]'); await p.waitForTimeout(300); ok(/s=auto/.test(p.url()), 'сфера не попала в адрес');
  await b.close(); console.log(bad ? bad + ' ошибок' : 'всё ок'); process.exit(bad ? 1 : 0);
})();
```

Run: `node build.js && node new/tests/cases-filter.check.js` — Expected: FAIL

- [ ] **Step 2: Разметка `cases()`**

В `engine.js` в `U.card` добавить `data-sphere="${c.sphere || 'other'}"` рядом с `data-cat`. В `cases()`:

```js
      const SP = [['all', v('cases.sAll', 'Все сферы')], ['food', 'Еда и кафе'], ['auto', 'Авто и техника'], ['edu', 'Обучение'], ['b2b', 'Финансы и B2B'], ['beauty', 'Красота и здоровье'], ['other', 'Услуги и прочее']];
      const ns = (k) => k === 'all' ? ALL.length : ALL.filter((c) => c.sphere === k).length;
      const filters = `<div class="filters" role="tablist">${T5.map(([k, l]) => `<button role="tab" data-f="${k}">${l}<sup>${n(k)}</sup></button>`).join('')}</div>`
        + `<div class="filters filters-s" role="group" aria-label="Сфера">${SP.map(([k, l]) => `<button type="button" data-s="${k}">${l}<sup>${ns(k)}</sup></button>`).join('')}</div>`;
      const empty = `<div class="cases-empty" hidden><p>В этой сфере пока нет кейсов этого направления.</p><button type="button" class="cases-reset">Сбросить фильтры</button></div>`;
```

и `body: filters + U.cards(ALL) + empty`.

- [ ] **Step 3: Логика фильтра**

Найти в `engine.js` обработчик кнопок `[data-f]` (ищется по `data-f`) и заменить на общий:

```js
  const fl = document.querySelector('.sec-cases');
  if (fl) {
    const q = new URLSearchParams(location.search); let f = q.get('f') || 'all', s = q.get('s') || 'all';
    const apply = (push) => {
      let shown = 0;
      fl.querySelectorAll('article.card').forEach((el) => { const on = (f === 'all' || el.dataset.cat === f) && (s === 'all' || el.dataset.sphere === s); el.hidden = !on; if (on) shown++; });
      fl.querySelectorAll('[data-f]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.f === f)));
      fl.querySelectorAll('[data-s]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.s === s)));
      fl.querySelector('.cases-empty').hidden = shown > 0;
      if (push) { const u = new URL(location.href); f === 'all' ? u.searchParams.delete('f') : u.searchParams.set('f', f); s === 'all' ? u.searchParams.delete('s') : u.searchParams.set('s', s); history.replaceState(null, '', u); }
    };
    fl.addEventListener('click', (e) => {
      const b = e.target.closest('[data-f],[data-s],.cases-reset'); if (!b) return;
      if (b.classList.contains('cases-reset')) { f = 'all'; s = 'all'; } else if (b.dataset.f) f = b.dataset.f; else s = b.dataset.s;
      apply(true);
    });
    apply(false);
  }
```

CSS в `inner-base.css`:

```css
.filters-s{margin-top:8px}
.filters-s button{font-size:.9em;opacity:.85}
.filters-s button[aria-pressed=true]{opacity:1}
article.card[hidden]{display:none}
.cases-empty{padding:40px 0;text-align:center}
.cases-empty .cases-reset{margin-top:12px;cursor:pointer;padding:10px 18px;border-radius:999px;border:1.5px solid currentColor;background:none;font:inherit}
```

Существующие стили `.filters button[aria-selected=true]` в стилях применяются и ко второй строке через `aria-pressed` — если в каком-то стиле выделение не видно, добавить `[aria-pressed=true]` в его `style.css` рядом с `[aria-selected=true]`.

- [ ] **Step 4: Проверка проходит**

Run: `node new/tools/bump-version.js && node build.js && node new/tests/cases-filter.check.js && node new/tests/nav-bar.check.js`
Expected: `всё ок` ×2

- [ ] **Step 5: Commit**

```bash
git add new/assets/engine.js new/assets/inner-base.css new/tests/cases-filter.check.js new/*/style.css new/*/*.html
git commit -m "Кейсы в стилях: фильтр по сфере вместе с направлением, сброс и адрес с фильтрами"
```

### Task 7: Тот же фильтр в ИИшном стиле (`/ai/keys`)

**Files:**
- Modify: `src/cases/render.js:285-300` (блок `pk-filter`) и клиентский скрипт фильтра в том же файле/`src/cases/cases.js`
- Modify: `src/cases/cases.css`
- Test: `new/tests/cases-filter.check.js` (дописать проверку `/ai/keys`)

**Interfaces:**
- Consumes: `sphere` из `src/data/cases.json` (Task 5).
- Produces: на `/ai/keys` и страницах направлений карточки с `data-sphere`, вторая строка `button[data-sphere-filter]`, `?s=<sphere>` в адресе, блок `.pk-empty`.

- [ ] **Step 1: Дописать проверку (падает)**

В конец асинхронной функции `cases-filter.check.js` перед `b.close()`:

```js
  await p.goto(BASE + '/ai/keys?s=food'); await p.waitForTimeout(800);
  const ai = await p.$$eval('[data-sphere]', (a) => a.filter((e) => e.offsetParent !== null && e.matches('article, li, .pk-case, a')).map((e) => e.dataset.sphere));
  ok(ai.length >= 1 && ai.every((x) => x === 'food'), '/ai/keys?s=food: ' + ai.join(','));
```

Run: `node new/tests/cases-filter.check.js` — Expected: FAIL `/ai/keys?s=food`

- [ ] **Step 2: Разметка и фильтр**

Прочитать `src/cases/render.js` вокруг строки 285 (`pk-filter`) и `src/cases/cases.js` (обработчик `data-filter`). По тому же образцу:
- карточке кейса добавить атрибут `data-sphere="<c.sphere>"`;
- под `pk-filter` добавить вторую группу `<div class="pk-filter pk-filter--s" role="group" aria-label="Сфера">` с кнопками `data-sphere-filter="all|food|auto|edu|b2b|beauty|other"` и подписями из Task 6 (EN: `All fields, Food & cafés, Auto & machinery, Education, Finance & B2B, Beauty & health, Services & other` — через `d.tag` с ключами `cs.s.<key>` в `TOOL_EN`-подобной таблице `L`);
- в обработчике фильтра хранить два значения (направление и сфера), прятать карточку, если не совпадает любое; при нуле показывать `.pk-empty` с кнопкой сброса; писать `?s=` в адрес через `history.replaceState`.
Код писать по образцу существующего обработчика `data-filter` в этом же файле, не меняя его поведения для направления.

- [ ] **Step 3: Проверка проходит**

Run: `node build.js && node new/tests/cases-filter.check.js && node new/tests/nav-bar.check.js` — Expected: `всё ок` ×2

- [ ] **Step 4: Commit и публикация этапа 2**

```bash
git add src/cases new/tests/cases-filter.check.js
git commit -m "ИИшный стиль: фильтр кейсов по сфере"
git push
```

Проверить на https://texspeckps.ru/ai/keys?s=food и https://texspeckps.ru/business/cases.html?f=Tilda&s=food, показать Павлу.

---

## Самопроверка плана по спецификации

- 1.1 экран выбора → Task 4; 1.2 панель → Tasks 1–2; 1.3 меню в шапке → Task 3.
- Этап 2: поле `sphere` → Task 5; фильтр в стилях → Task 6; в ИИшном → Task 7; «карточка короче» — описание в карточках уже одной строкой у `U.card` (`c.p`), отдельная задача не нужна; если Павел попросит короче — в этапе 3.
- Этап 3 → отдельный план после публикации этапов 1–2.
