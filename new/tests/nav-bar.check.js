// Проверка общей панели в браузере. Запуск: node new/tests/nav-bar.check.js (нужен сервер site-merged на :5183 после node build.js)
const path = require('path');
const { chromium } = require(path.join(process.env.USERPROFILE, '.claude/skills/gstack/node_modules/playwright'));
const BASE = process.env.BASE || 'http://localhost:5183';
const PAGES = ['/business/', '/business/cases.html', '/creative/', '/retro/', '/ai/', '/ai/keys', '/bold/bot.html'];
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
      const fail = !r.ok || r.old || errs.length || (first ? !r.tip : r.tip);
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
