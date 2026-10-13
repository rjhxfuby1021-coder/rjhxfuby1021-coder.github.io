// Проверка общей панели в браузере. Запуск: node new/tests/nav-bar.check.js (нужен сервер site-merged на :5183 после node build.js)
const path = require('path');
const { chromium } = require(path.join(process.env.USERPROFILE, '.claude/skills/gstack/node_modules/playwright'));
const BASE = process.env.BASE || 'http://localhost:5183';
const PAGES = ['/business/', '/business/cases.html', '/creative/', '/retro/', '/ai/', '/ai/keys', '/bold/bot.html', '/retro/cases.html'];
(async () => {
  const b = await chromium.launch(); let bad = 0;
  for (const [w, h] of [[1440, 900], [360, 740]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } }); const seen = new Set();
    for (const p of PAGES) {
      const page = await ctx.newPage(); const errs = [];
      page.on('pageerror', (e) => errs.push(e.message));
      await page.goto(BASE + p, { waitUntil: 'domcontentloaded', timeout: 60000 }); await page.waitForTimeout(1500);
      const r = await page.evaluate(() => {
        const n = document.getElementById('pk-nav'); if (!n) return { ok: false, why: 'нет панели' };
        const rc = n.getBoundingClientRect();
        return { ok: rc.left >= 0 && rc.right <= innerWidth + 1 && rc.bottom <= innerHeight + 1, why: 'вне экрана ' + JSON.stringify(rc),
          links: [...n.querySelectorAll('a')].map((a) => a.getAttribute('href')), tip: !!document.getElementById('pk-nav-tip'),
          old: !!document.querySelector('.style-switch') };
      });
      const st = p.split("/")[1], first = !seen.has(st); seen.add(st);
      const tme = (r.links || []).some((h) => /t.me/.test(h));
      const fail = tme || !r.ok || r.old || errs.length || (first ? !r.tip : r.tip);
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
  // узкий телефон: содержимое плашки помещается во всех 18 стилях
  const N = require('../assets/nav-bar.js');
  const narrow = await b.newContext({ viewport: { width: 320, height: 640 } });
  for (const st of N.STYLES) {
    const page = await narrow.newPage();
    await page.goto(BASE + N.urlFor(st.slug, 'home'), { waitUntil: 'domcontentloaded', timeout: 60000 }); await page.waitForTimeout(1200);
    const r = await page.evaluate(() => { const n = document.getElementById('pk-nav'); if (!n) return 'нет панели'; if (getComputedStyle(n).display === 'none') return 'панель скрыта';
      const btn = n.querySelector('.pk-st').getBoundingClientRect();
      return n.scrollWidth > n.clientWidth + 1 || btn.right > innerWidth ? 'не помещается: ' + n.scrollWidth + '/' + n.clientWidth + ' кнопка до ' + Math.round(btn.right) : ''; });
    if (r) { bad++; console.log('FAIL 320 ' + st.slug + ' ' + r); }
    await page.close();
  }
  // окно кейса в ИИшном стиле: панель не закрывает его
  const mp = await narrow.newPage();
  await mp.goto(BASE + '/ai/tilda', { waitUntil: 'domcontentloaded', timeout: 60000 }); await mp.waitForTimeout(1500);
  await mp.click('[data-case-open]'); await mp.waitForTimeout(800);
  const opened = await mp.evaluate(() => { const m = document.querySelector('.pk-cmodal'); return !!m && !m.hidden; });
  if (!opened) { bad++; console.log('FAIL окно кейса не открылось в проверке'); }
  const covered = await mp.evaluate(() => { const n = document.getElementById('pk-nav'); const cs = n && getComputedStyle(n); return !!n && cs.display !== 'none' && cs.visibility !== 'hidden'; });
  if (covered) { bad++; console.log('FAIL панель видна поверх открытого кейса'); }
  await narrow.close();
  // ссылки Telegram: «Telegram …» остаются в Telegram, кнопки связи без слова Telegram ведут на страницу связи
  const tc = await b.newContext({ viewport: { width: 1280, height: 800 } }); let stats = { tg: 0, contact: 0 };
  for (const pg of ['/', '/ai/', '/ai/form', '/business/', '/business/contact.html', '/bold/', '/creative/', '/terminal/', '/cafe/']) {
    const tp = await tc.newPage();
    await tp.goto(BASE + pg, { waitUntil: 'domcontentloaded', timeout: 60000 }); await tp.waitForTimeout(1200);
    const res = await tp.evaluate(() => [...document.querySelectorAll('a[href]')].filter((a) => /t\.me\/paveltexspec/i.test(a.href)).map((a) => {
      const label = [a.innerText, a.getAttribute('aria-label'), a.title].filter(Boolean).join(' ').trim();
      let prevented = false; const stop = (e) => { prevented = e.defaultPrevented; e.preventDefault(); };
      document.addEventListener('click', stop, { once: true });
      a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }));
      return { label: label.slice(0, 40), want: !!label && !/telegram|телеграм|@|\btg\b/i.test(label), prevented };
    }));
    for (const r of res) { if (r.want) stats.contact++; else stats.tg++; if (r.want !== r.prevented) { bad++; console.log('FAIL ' + pg + ' «' + r.label + '»: ' + (r.want ? 'должна вести на страницу связи' : 'должна вести в Telegram')); } }
    await tp.close();
  }
  console.log('ссылки Telegram: остаются в Telegram ' + stats.tg + ', ведут на страницу связи ' + stats.contact);
  await tc.close();
  await b.close(); console.log(bad ? bad + ' ошибок' : 'всё ок'); process.exit(bad ? 1 : 0);
})();
