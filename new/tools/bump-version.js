// Ставит метку версии ко всем локальным .js и .css в HTML-файлах (src="x.js?v=…", href="x.css?v=…"),
// чтобы браузер не брал старые копии из кэша. Запускать после любых правок: node tools/bump-version.js
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..');
const V = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
let files = 0, refs = 0;
(function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) { if (!['tools', 'node_modules'].includes(f)) walk(p); continue; }
    if (!f.endsWith('.html')) continue;
    let s = fs.readFileSync(p, 'utf8');
    const out = s.replace(/((?:src|href)=")((?!https?:|\/\/|#|mailto:|tel:)[^"?#]+\.(?:js|css))(?:\?v=[^"]*)?(")/g, (m, a, u, b) => { refs++; return a + u + '?v=' + V + b; });
    if (out !== s) { fs.writeFileSync(p, out); files++; }
  }
})(R);
// внутри CSS: @import каркаса тоже с версией
(function walkCss(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) { if (!['tools', 'node_modules'].includes(f)) walkCss(p); continue; }
    if (!f.endsWith('.css')) continue;
    const s = fs.readFileSync(p, 'utf8');
    const out = s.replace(/@import url\("([^"?]+\.css)(?:\?v=[^"]*)?"\)/g, (m, u) => `@import url("${u}?v=${V}")`);
    if (out !== s) fs.writeFileSync(p, out);
  }
})(R);
console.log('version', V, '· files', files, '· refs', refs);
