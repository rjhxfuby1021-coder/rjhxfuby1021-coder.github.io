// Переносит статьи блога из src/data/blog.json в assets/content.js (русский текст), чтобы новые
// статьи появились во всех стилях. Запускать после добавления статьи: node new/tools/sync-blog.js
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..');
const SRC = path.join(R, '..', 'src', 'data', 'blog.json');
const OUT = path.join(R, 'assets', 'content.js');

const ru = (v) => (v && typeof v === 'object' && !Array.isArray(v) && 'ru' in v ? v.ru : v);
const flat = (v) => Array.isArray(v) ? v.map(flat)
  : v && typeof v === 'object' ? ('ru' in v ? v.ru : Object.fromEntries(Object.entries(v).map(([k, x]) => [k, flat(x)])))
  : v;

const blog = JSON.parse(fs.readFileSync(SRC, 'utf8')).map(flat);
const raw = fs.readFileSync(OUT, 'utf8');
const m = raw.match(/^([\s\S]*?window\.CONTENT = )(\{[\s\S]*\})(;\s*)$/);
if (!m) throw new Error('content.js: не найден window.CONTENT');
const C = JSON.parse(m[2]);
const before = (C.blog || []).map((b) => b.slug);
C.blog = blog;
fs.writeFileSync(OUT, m[1] + JSON.stringify(C) + m[3]);
const added = blog.map((b) => b.slug).filter((s) => !before.includes(s));
console.log('статей:', blog.length, added.length ? '· новые: ' + added.join(', ') : '· новых нет');
