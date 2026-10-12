// Проверка экрана выбора стиля: node new/tests/chooser.check.js (сервер :5183 после node build.js)
const path = require('path');
const { chromium } = require(path.join(process.env.USERPROFILE, '.claude/skills/gstack/node_modules/playwright'));
(async () => {
  const b = await chromium.launch(); let bad = 0; const ok = (c, m) => { if (!c) { bad++; console.log('FAIL', m); } };
  for (const [w, h] of [[1440, 900], [360, 740]]) {
    const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
    await p.goto((process.env.BASE || 'http://localhost:5183') + '/', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(800);
    const r = await p.evaluate(() => {
      const vis = (el) => el && el.getBoundingClientRect().height > 0 && getComputedStyle(el).visibility !== 'hidden';
      const main = document.querySelector('a.ch-main'), cases = document.querySelector('a.ch-cases');
      return { main: main && main.getAttribute('href'), mainTop: main && main.getBoundingClientRect().bottom,
        cases: cases && cases.getAttribute('href'), moodVisible: [...document.querySelectorAll('a.c[data-group=mood]')].filter(vis).length,
        sphereVisible: [...document.querySelectorAll('a[data-group=sphere]')].filter(vis).length, scrollX: document.documentElement.scrollWidth > innerWidth };
    });
    ok(/один сайт/i.test(await p.textContent('body')), w + ' нет объяснения «один сайт»');
    ok(r.main === '/ai/' && r.mainTop < h, w + ' кнопка «Показать сайт» не на первом экране: ' + JSON.stringify(r));
    ok(r.cases === '/ai/keys', w + ' нет «Сразу к кейсам»');
    ok(r.moodVisible === 6 && r.sphereVisible === 0, w + ' видно стилей: ' + r.moodVisible + '/' + r.sphereVisible);
    ok(!r.scrollX, w + ' горизонтальная прокрутка');
    if (await p.$('button.ch-more')) {
      await p.click('button.ch-more'); ok((await p.$$eval('a.c[data-group=mood]', (a) => a.filter((e) => e.getBoundingClientRect().height > 0).length)) === 11, w + ' «Ещё 5» не раскрыло');
      await p.click('button[data-tab=sphere]'); ok((await p.$$eval('a[data-group=sphere]', (a) => a.filter((e) => e.getBoundingClientRect().height > 0).length)) === 7, w + ' вкладка сфер');
    } else ok(false, w + ' нет кнопки «Ещё 5 стилей»');
  }
  await b.close(); console.log(bad ? bad + ' ошибок' : 'всё ок'); process.exit(bad ? 1 : 0);
})();
