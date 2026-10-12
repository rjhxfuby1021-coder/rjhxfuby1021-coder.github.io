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
