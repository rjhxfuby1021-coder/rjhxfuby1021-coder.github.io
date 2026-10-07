// Собирает чат для сайта в один файл: node build-web.js → ../new/assets/botchat.js
// Внутри — те же scenarios.js и engine.js, что у бота в Telegram, плюс окно чата web/widget.js.

const fs = require('fs');
const path = require('path');

const files = {
  scenarios: 'scenarios.js',
  engine: 'engine.js',
  widget: 'web/widget.js',
};

const defs = Object.entries(files).map(([name, file]) => {
  const code = fs.readFileSync(path.join(__dirname, file), 'utf8');
  return `defs[${JSON.stringify(name)}] = function (module, exports, require) {\n${code}\n};`;
}).join('\n');

const out = `/* Демо-бот на сайте — собрано из test-bot (node build-web.js), руками не править */
(function () {
'use strict';
if (window.BotChat) return;
var defs = {}, cache = {};
function require(name) {
  name = name.replace(/^\\.\\//, '');
  if (cache[name]) return cache[name].exports;
  var m = { exports: {} };
  cache[name] = m;
  defs[name](m, m.exports, require);
  return m.exports;
}
${defs}
require('widget');
})();
`;

const dst = path.join(__dirname, '..', 'new', 'assets', 'botchat.js');
fs.writeFileSync(dst, out);
console.log('Собрано:', path.relative(process.cwd(), dst), Math.round(out.length / 1024) + ' КБ');
