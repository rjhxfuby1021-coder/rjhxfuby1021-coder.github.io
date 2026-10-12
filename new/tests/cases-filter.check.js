// Проверка фильтров кейсов: node new/tests/cases-filter.check.js (сервер :5183 после node build.js)
const path = require('path');
const { chromium } = require(path.join(process.env.USERPROFILE, '.claude/skills/gstack/node_modules/playwright'));
const BASE = process.env.BASE || 'http://localhost:5183';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage(); let bad = 0; const ok = (c, m) => { if (!c) { bad++; console.log('FAIL', m); } };
  const vis = () => p.$$eval('article.card', (a) => a.filter((e) => e.offsetParent !== null).length);
  await p.goto(BASE + '/business/cases.html?f=Tilda&s=food', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1200);
  const n1 = await vis(); ok(n1 >= 1, 'Tilda+еда: ' + n1);
  ok(await p.$$eval('article.card', (a) => a.filter((e) => e.offsetParent !== null).every((e) => e.dataset.cat === 'Tilda' && e.dataset.sphere === 'food')), 'фильтр пропустил чужие');
  await p.goto(BASE + '/business/cases.html?f=GetCourse&s=beauty', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(1200);
  ok((await vis()) === 0 && await p.isVisible('.cases-empty'), 'пустая комбинация без сообщения');
  if (await p.isVisible('.cases-reset')) { await p.click('.cases-reset'); await p.waitForTimeout(300); ok((await vis()) === 35, 'сброс не показал все 35: ' + await vis()); }
  if (await p.$('button[data-s=auto]')) { await p.click('button[data-s=auto]'); await p.waitForTimeout(300); ok(/s=auto/.test(p.url()), 'сфера не попала в адрес'); } else ok(false, 'нет кнопок сферы');
  await b.close(); console.log(bad ? bad + ' ошибок' : 'всё ок'); process.exit(bad ? 1 : 0);
})();
