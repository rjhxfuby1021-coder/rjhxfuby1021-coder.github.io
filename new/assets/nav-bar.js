/* Общая панель навигации для всех стилей: «Кейсы · Цены · Написать · Стиль ⇄» + подсказка при первом входе.
   Подключается сама: в стилях — через styleSwitch() из data.js, в /ai/ — тегом <script> из src/merge-new.js. */
(function (root) {
  const STYLES = [
    ['ai', 'ИИшный', 'mood'], ['business', 'Деловой', 'mood'], ['creative', 'Творческий', 'mood'], ['bold', 'Дерзкий', 'mood'],
    ['premium', 'Премиальный', 'mood'], ['bento', 'Технологичный', 'mood'], ['retro', 'Ностальгия', 'mood'], ['glass', 'Современный', 'mood'],
    ['terminal', 'Технарь', 'mood'], ['friendly', 'Дружелюбный', 'mood'], ['kinetic', 'Экспериментальный', 'mood'],
    ['cafe', 'Для кафе', 'sphere'], ['auto', 'Для автосервисов', 'sphere'], ['medical', 'Для медицины', 'sphere'], ['expert', 'Для экспертов', 'sphere'],
    ['lawyer', 'Для юристов', 'sphere'], ['accountant', 'Для бухгалтеров', 'sphere'], ['it', 'Для айтишников', 'sphere']
  ].map(([slug, name, group]) => ({ slug, name, group }));
  const SLUGS = STYLES.map((s) => s.slug);

  // стиль по адресу страницы: первая папка пути
  const currentStyle = (p) => { const s = String(p).split('/')[1] || ''; return SLUGS.includes(s) ? s : null; };
  // какая это страница — чтобы при смене стиля открыть ту же
  const AI = { cases: /^(keys|tilda|salebot|getcourse|figma)$/, services: /^(price|uslugi)$/, reviews: /^otzivi$/, blog: /^blog$/, faq: /^faq$/ };
  const ST = { cases: /^(cases|case)$/, services: /^(services|service)$/, reviews: /^reviews$/, blog: /^(blog|post)$/, faq: /^faq$/ };
  const pageKey = (p) => {
    const parts = String(p).split('/').filter(Boolean);
    const leaf = (parts[1] || '').replace(/\.html$/, '');
    if (!leaf || leaf === 'index') return 'home';
    const table = parts[0] === 'ai' ? AI : ST;
    for (const k of Object.keys(table)) if (table[k].test(leaf)) return k;
    return 'other';
  };
  const AI_URL = { home: '/ai/', cases: '/ai/keys', services: '/ai/price', reviews: '/ai/otzivi', blog: '/ai/blog', faq: '/ai/faq' };
  const ST_URL = { cases: 'cases.html', services: 'services.html', reviews: 'reviews.html', blog: 'blog.html', faq: 'faq.html' };
  const urlFor = (slug, key) => slug === 'ai' ? (AI_URL[key] || '/ai/') : '/' + slug + '/' + (ST_URL[key] || '');

  const api = { STYLES, currentStyle, pageKey, urlFor };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PKNav = api;
})(typeof window !== 'undefined' ? window : globalThis);
