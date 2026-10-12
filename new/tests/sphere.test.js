const test = require('node:test'), assert = require('node:assert'), fs = require('fs'), path = require('path');
const OK = ['food', 'auto', 'edu', 'b2b', 'beauty', 'other'];
const R = path.join(__dirname, '../..');
test('у каждого кейса есть сфера — во всех трёх копиях данных', () => {
  const src = JSON.parse(fs.readFileSync(path.join(R, 'src/data/cases.json'), 'utf8'));
  const w = {};
  new Function('window', fs.readFileSync(path.join(R, 'new/assets/content.js'), 'utf8'))(w);
  const data = fs.readFileSync(path.join(R, 'new/assets/data.js'), 'utf8');
  const all = JSON.parse(data.match(/window\.DATA\.all = (\[[\s\S]*?\]);\n/)[1]);
  for (const [name, list] of [['cases.json', src], ['content.js', w.CONTENT.cases], ['data.js', all]]) {
    const bad = list.filter((c) => !OK.includes(c.sphere)).map((c) => c.id);
    assert.deepStrictEqual(bad, [], name + ': без сферы ' + bad.join(', '));
  }
});
