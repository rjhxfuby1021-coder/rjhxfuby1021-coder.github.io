// Сфера бизнеса у каждого кейса (для фильтра «Сфера»): node tools/set-sphere.js
// Пишет поле sphere в src/data/cases.json и в копии для стилей new/assets/content.js, new/assets/data.js.
const fs = require('fs');
const SPHERE = {
  food: ['cafe-shop', 'sb-cafe', 'cafe-card', 'skobar-stm'],
  auto: ['mechanic', 'nizhavtovykup', 'spectech'],
  edu: ['pro-technik', 'maxfit', 'webinar-landing', 'figma-webinar', 'tochka-opory', 'sb-course', 'sb-autowebinar', 'sb-channel', 'habits-card'],
  b2b: ['qledger', 'bukh-hero', 'yurdirect', 'cyberhygiene', 'service-cards', 'sb-referral', 'sb-wheel'],
  beauty: ['sb-jador', 'piercing-shop'],
  other: ['ekskurpiter', 'wave-sup', 'weekend-reset', 'diva-n', 'kromka', 'vera-portfolio', 'fold8-ozon', 'nova-symphony', 'sb-portfolio-ai', 'sb-cards']
};
const of = {};
for (const [s, ids] of Object.entries(SPHERE)) ids.forEach((id) => { of[id] = s; });

const P = 'src/data/cases.json', raw = fs.readFileSync(P, 'utf8'), arr = JSON.parse(raw);
const miss = arr.filter((c) => !of[c.id]).map((c) => c.id);
if (miss.length) throw new Error('нет сферы: ' + miss.join(', '));
arr.forEach((c) => { c.sphere = of[c.id]; });
fs.writeFileSync(P, JSON.stringify(arr, null, raw.match(/\n( +)/)[1].length) + (raw.endsWith('\n') ? '\n' : ''));

const CP = 'new/assets/content.js', cr = fs.readFileSync(CP, 'utf8');
const m = cr.match(/^([\s\S]*?window\.CONTENT = )(\{[\s\S]*\})(;\s*)$/), C = JSON.parse(m[2]);
C.cases.forEach((c) => { if (of[c.id]) c.sphere = of[c.id]; });
fs.writeFileSync(CP, m[1] + JSON.stringify(C) + m[3]);

const DP = 'new/assets/data.js';
fs.writeFileSync(DP, fs.readFileSync(DP, 'utf8').replace(/^(\s*(?:window\.DATA\.all = \[)?\{"id":"([\w-]+)",)("sphere":"\w+",)?/gm,
  (all, head, id) => of[id] ? head + '"sphere":"' + of[id] + '",' : all));
console.log('сферы проставлены:', arr.length);
