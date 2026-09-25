/*
  Шаблоны страниц кейсов: /keys и /salebot /tilda /figma /getcourse.
  Работает в Node (build.js) и в браузере (админка) — без зависимостей.
  Весь текст попадает в HTML (индексируется), английский — через словарь data-i18n.
*/
(function (global) {
  var SITE = 'https://texspeckps.ru/';

  var DIRS = [
    {
      id: 'salebot', name: 'Salebot',
      title: { ru: 'Чат-боты и автоматизация', en: 'Chatbots & automation' },
      eyebrow: 'Salebot · AI · Telegram',
      lead: {
        ru: 'Боты, которые продают, записывают, напоминают и играют с аудиторией — пока вы занимаетесь делом.',
        en: 'Bots that sell, book, remind and play with your audience — while you focus on the business.'
      },
      cats: { funnel: { ru: 'Воронки продаж', en: 'Sales funnels' }, ai: { ru: 'ИИ-ассистенты', en: 'AI assistants' }, automation: { ru: 'Автоматизация', en: 'Automation' }, game: { ru: 'Игровые механики', en: 'Gamification' } }
    },
    {
      id: 'tilda', name: 'Tilda',
      title: { ru: 'Сайты на Tilda', en: 'Websites on Tilda' },
      eyebrow: 'Tilda · Zero Block · UX/UI',
      lead: {
        ru: 'Не просто красивые страницы: структура, смыслы и путь пользователя, которые приводят человека к нужному действию.',
        en: 'Not just pretty pages: structure, meaning and a user path that lead people to the action that matters.'
      },
      cats: { landing: { ru: 'Лендинги', en: 'Landing pages' }, multipage: { ru: 'Многостраничные', en: 'Multi-page' }, shop: { ru: 'Интернет-магазины', en: 'Online stores' } }
    },
    {
      id: 'figma', name: 'Figma',
      title: { ru: 'UX/UI-дизайн в Figma', en: 'UX/UI design in Figma' },
      eyebrow: 'Figma · UX · UI',
      lead: {
        ru: 'Сначала сценарий и каркас, потом визуал: макеты, которые ведут к действию и сразу готовы к вёрстке.',
        en: 'Scenario and wireframe first, visuals second: mockups that drive action and are ready to build.'
      },
      cats: {}
    },
    {
      id: 'getcourse', name: 'GetCourse',
      title: { ru: 'Онлайн-школы на GetCourse', en: 'Online schools on GetCourse' },
      eyebrow: 'GetCourse · Email · Salebot',
      lead: {
        ru: 'Кабинеты, каталоги, рассылки и автоматизации — школа работает сама, а вы занимаетесь контентом.',
        en: 'Cabinets, catalogs, email and automations — the school runs itself while you focus on content.'
      },
      cats: {}
    }
  ];

  var TOOL_EN = {
    'Google Таблицы': 'Google Sheets', 'Приём оплат': 'Payments', 'ИИ': 'AI', 'База знаний': 'Knowledge base',
    'Онлайн-чат': 'Live chat', 'Автовебинар': 'Automated webinar', 'Геймификация': 'Gamification',
    'Формы заявок': 'Lead forms', 'Адаптивный дизайн': 'Responsive design', 'Портфолио': 'Portfolio',
    'Онлайн-заказ': 'Online ordering', 'Каталог': 'Catalog', 'Прототип': 'Prototype', 'Яндекс Карты': 'Yandex Maps', 'Инфографика': 'Infographics'
  };

  var L = {
    'cs.all': { ru: 'Все', en: 'All' },
    'cs.cases': { ru: 'кейсов', en: 'cases' },
    'cs.open': { ru: 'Смотреть кейс', en: 'View case' },
    'cs.site': { ru: 'Открыть сайт', en: 'Visit site' },
    'cs.same': { ru: 'Хочу так же', en: 'I want the same' },
    'cs.task': { ru: 'Задача', en: 'The task' },
    'cs.flow': { ru: 'Сценарий', en: 'The flow' },
    'cs.done': { ru: 'Что сделал', en: 'What I did' },
    'cs.gallery': { ru: 'Экраны проекта', en: 'Project screens' },
    'cs.result': { ru: 'Итог', en: 'The result' },
    'cs.tools': { ru: 'Инструменты', en: 'Tools' },
    'cs.related': { ru: 'Этот же проект в другом направлении', en: 'The same project in another area' },
    'cs.prev': { ru: 'Предыдущий', en: 'Previous' },
    'cs.next': { ru: 'Следующий', en: 'Next' },
    'cs.close': { ru: 'Закрыть кейс', en: 'Close case' },
    'cs.zoom': { ru: 'Открыть экран в полном размере', en: 'Open screen full size' },
    'cs.st.client': { ru: 'Для клиента', en: 'Client project' },
    'cs.st.own': { ru: 'Авторский проект', en: 'Personal project' },
    'cs.other': { ru: 'Другие направления', en: 'Other areas' },
    'cs.cta.h': { ru: 'Хотите такой же результат для своего проекта?', en: 'Want the same result for your project?' },
    'cs.cta.p': { ru: 'Расскажите о задаче — предложу решение и сроки. Отвечаю в течение рабочего дня.', en: 'Tell me about your task — I’ll suggest a solution and timeline. I reply within one business day.' },
    'cs.cta.b': { ru: 'Обсудить проект', en: 'Discuss a project' },
    'cs.lb.close': { ru: 'Закрыть просмотр', en: 'Close viewer' },
    'cs.lb.prev': { ru: 'Предыдущий экран', en: 'Previous screen' },
    'cs.lb.next': { ru: 'Следующий экран', en: 'Next screen' },
    'cs.back': { ru: 'Все направления', en: 'All areas' }
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function ru(v) { return v && typeof v === 'object' ? (v.ru || '') : (v || ''); }
  function enOf(v) { return v && typeof v === 'object' ? (v.en || v.ru || '') : (v || ''); }
  function dirById(id) { for (var i = 0; i < DIRS.length; i++) if (DIRS[i].id === id) return DIRS[i]; return null; }
  function casesOf(dir, data) { return data.filter(function (c) { return c.dir === dir; }); }
  function plural(n, one, few, many) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
    return many;
  }

  // словарь: собираем EN-строки, а в разметку кладём RU
  function Dict() { this.en = {}; }
  Dict.prototype.put = function (key, val) { this.en[key] = enOf(val); return key; };
  Dict.prototype.tag = function (tagName, key, val, attrs) {
    this.put(key, val);
    return '<' + tagName + (attrs ? ' ' + attrs : '') + ' data-i18n="' + key + '">' + esc(ru(val)) + '</' + tagName + '>';
  };
  Dict.prototype.label = function (tagName, key, attrs) { return this.tag(tagName, key, L[key], attrs); };

  var ARROW = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var EXT = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9"/></svg>';
  var CHECK = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>';
  var CLOSE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  var PREV = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>';
  var NEXT = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';

  function statusBadge(d, c) {
    var key = 'cs.st.' + (c.status === 'client' ? 'client' : 'own');
    return d.label('span', key, 'class="pk-badge pk-badge--' + (c.status === 'client' ? 'client' : 'own') + '"');
  }

  function renderCard(d, c, i) {
    var k = 'c.' + c.id + '.';
    var facts = (c.facts || []).slice(0, 2).map(function (f, j) {
      return '<li><b>' + esc(f.v) + '</b>' + d.tag('span', k + 'f' + j, f.l) + '</li>';
    }).join('');
    return '' +
      '<li class="pk-ccard pk-reveal" style="--d:' + (i % 3) + '" data-cat="' + esc(c.cat || '') + '">' +
        '<a class="pk-ccard__link" href="#' + esc(c.id) + '" data-case-open="' + esc(c.id) + '">' +
          '<span class="pk-ccard__media">' +
            (c.cover ? '<img src="' + esc(c.cover) + '" alt="" loading="lazy" decoding="async">' : '') +
            '<span class="pk-ccard__badges">' + d.tag('span', k + 'type', c.type, 'class="pk-badge"') + statusBadge(d, c) + '</span>' +
          '</span>' +
          '<span class="pk-ccard__body">' +
            '<span class="pk-ccard__meta"><span>' + esc(String(i + 1).padStart(2, '0')) + '</span><span>' + esc(c.year || '') + '</span></span>' +
            d.tag('span', k + 'title', c.title, 'class="pk-ccard__title"') +
            d.tag('span', k + 'lead', c.lead, 'class="pk-ccard__lead"') +
            (facts ? '<ul class="pk-ccard__facts">' + facts + '</ul>' : '') +
            '<span class="pk-ccard__more">' + d.label('span', 'cs.open') + ARROW + '</span>' +
          '</span>' +
        '</a>' +
      '</li>';
  }

  function renderArticle(d, c, all, idx) {
    var k = 'c.' + c.id + '.';
    var dir = dirById(c.dir);
    var parts = [];

    // шапка кейса
    parts.push(
      '<header class="pk-case__head">' +
        '<p class="pk-case__meta">' + d.tag('span', k + 'type', c.type) + '<span aria-hidden="true">·</span><span>' + esc(c.year || '') + '</span>' + statusBadge(d, c) + '</p>' +
        d.tag('h2', k + 'title', c.title, 'class="pk-case__title" id="case-title-' + esc(c.id) + '"') +
        d.tag('p', k + 'lead', c.lead, 'class="pk-case__lead"') +
        '<div class="pk-case__actions">' +
          (c.url ? '<a class="pk-btn" href="' + esc(c.url) + '" target="_blank" rel="noopener">' + d.label('span', 'cs.site') + EXT + '</a>' : '') +
          '<a class="pk-btn ' + (c.url ? 'pk-btn--ghost' : '') + '" href="' + SITE + 'form?service=' + esc(c.dir) + '">' + d.label('span', 'cs.same') + ARROW + '</a>' +
        '</div>' +
      '</header>'
    );

    if (c.cover) {
      parts.push('<figure class="pk-case__cover"><button type="button" class="pk-zoom" data-lb="0" aria-label="' + esc(ru(L['cs.zoom'])) + '" data-i18n-attr="aria-label:cs.zoom"><img src="' + esc(c.cover) + '" alt="" loading="lazy" decoding="async"></button></figure>');
      d.put('cs.zoom', L['cs.zoom']);
    }

    if (c.facts && c.facts.length) {
      parts.push('<ul class="pk-case__facts">' + c.facts.map(function (f, j) {
        return '<li><b>' + esc(f.v) + '</b>' + d.tag('span', k + 'f' + j, f.l) + '</li>';
      }).join('') + '</ul>');
    }

    if (ru(c.task)) {
      parts.push('<section class="pk-case__row">' + d.label('h3', 'cs.task', 'class="pk-case__label"') + d.tag('p', k + 'task', c.task, 'class="pk-case__text"') + '</section>');
    }

    if (c.flow && c.flow.length) {
      parts.push('<section class="pk-case__block">' + d.label('h3', 'cs.flow', 'class="pk-case__label"') +
        '<ol class="pk-steps2" style="--n:' + c.flow.length + '">' + c.flow.map(function (s, j) {
          return '<li><span class="pk-steps2__n">' + String(j + 1).padStart(2, '0') + '</span>' + d.tag('b', k + 'fl' + j + 't', s.t) + d.tag('span', k + 'fl' + j + 'd', s.d) + '</li>';
        }).join('') + '</ol></section>');
    }

    if (c.done && c.done.length) {
      parts.push('<section class="pk-case__block">' + d.label('h3', 'cs.done', 'class="pk-case__label"') +
        '<ul class="pk-done">' + c.done.map(function (x, j) {
          return '<li>' + CHECK + d.tag('span', k + 'dn' + j, x) + '</li>';
        }).join('') + '</ul></section>');
    }

    var gal = c.gallery || [];
    if (gal.length) {
      var base = c.cover ? 1 : 0;
      parts.push('<section class="pk-case__block">' + d.label('h3', 'cs.gallery', 'class="pk-case__label"') +
        '<ul class="pk-gallery' + (gal.length === 1 ? ' pk-gallery--one' : '') + (c.dir === 'salebot' ? ' pk-gallery--wide' : '') + '">' + gal.map(function (g, j) {
          var cap = g.cap ? d.tag('figcaption', k + 'g' + j, g.cap) : '';
          return '<li><figure><button type="button" class="pk-zoom" data-lb="' + (j + base) + '" aria-label="' + esc(ru(L['cs.zoom'])) + '" data-i18n-attr="aria-label:cs.zoom"><img src="' + esc(g.src) + '" alt="" loading="lazy" decoding="async"></button>' + cap + '</figure></li>';
        }).join('') + '</ul></section>');
      d.put('cs.zoom', L['cs.zoom']);
    }

    if (c.result && ru(c.result.title)) {
      parts.push('<section class="pk-case__result">' + d.label('p', 'cs.result', 'class="pk-eyebrow"') +
        d.tag('h3', k + 'rt', c.result.title, 'class="pk-case__rtitle"') + d.tag('p', k + 'rx', c.result.text) + '</section>');
    }

    if (c.tools && c.tools.length) {
      parts.push('<section class="pk-case__row">' + d.label('h3', 'cs.tools', 'class="pk-case__label"') +
        '<ul class="pk-tags pk-tags--lg">' + c.tools.map(function (t, j) {
          return TOOL_EN[t] ? d.tag('li', k + 't' + j, { ru: t, en: TOOL_EN[t] }) : '<li>' + esc(t) + '</li>';
        }).join('') + '</ul></section>');
    }

    if (c.related) {
      var r = all.filter(function (x) { return x.id === c.related; })[0];
      if (r) {
        parts.push('<a class="pk-related" href="' + SITE + r.dir + '#' + esc(r.id) + '">' +
          (r.cover ? '<img src="' + esc(r.cover) + '" alt="" loading="lazy">' : '') +
          '<span>' + d.label('small', 'cs.related') + d.tag('b', 'c.' + r.id + '.title', r.title) + '</span>' + ARROW + '</a>');
      }
    }

    // соседние кейсы
    var list = casesOf(c.dir, all);
    var prev = list[(idx - 1 + list.length) % list.length];
    var next = list[(idx + 1) % list.length];
    if (list.length > 1) {
      parts.push('<nav class="pk-case__nav" aria-label="' + esc(dir ? ru(dir.title) : '') + '">' +
        '<a href="#' + esc(prev.id) + '" data-case-open="' + esc(prev.id) + '">' + PREV + '<span>' + d.label('small', 'cs.prev') + d.tag('b', 'c.' + prev.id + '.title', prev.title) + '</span></a>' +
        '<a href="#' + esc(next.id) + '" data-case-open="' + esc(next.id) + '"><span>' + d.label('small', 'cs.next') + d.tag('b', 'c.' + next.id + '.title', next.title) + '</span>' + NEXT + '</a>' +
      '</nav>');
    }

    return '<article class="pk-cstory" id="case-' + esc(c.id) + '" data-case="' + esc(c.id) + '" hidden aria-labelledby="case-title-' + esc(c.id) + '">' + parts.join('') + '</article>';
  }

  function ctaBlock(d, service) {
    return '' +
      '<section class="pk-section" style="padding-top:0"><div class="pk-wrap">' +
        '<div class="pk-final pk-reveal">' +
          d.label('h2', 'cs.cta.h', 'class="pk-h2"') +
          d.label('p', 'cs.cta.p', 'class="pk-lead"') +
          '<div class="pk-final__btns"><a class="pk-btn pk-magnet" href="' + SITE + 'form' + (service ? '?service=' + service : '') + '">' + d.label('span', 'cs.cta.b') + ARROW + '</a></div>' +
        '</div>' +
      '</div></section>';
  }

  function dirTile(d, dir, data, i, compact) {
    var list = casesOf(dir.id, data);
    var covers = list.slice(0, 3).map(function (c) { return c.cover; }).filter(Boolean);
    var n = list.length;
    d.put('dir.' + dir.id + '.title', dir.title);
    d.put('dir.' + dir.id + '.lead', dir.lead);
    d.put('dir.' + dir.id + '.count', { ru: n + ' ' + plural(n, 'кейс', 'кейса', 'кейсов'), en: n + (n === 1 ? ' case' : ' cases') });
    return '' +
      '<li class="pk-dtile pk-reveal' + (compact ? ' pk-dtile--compact' : '') + '" style="--d:' + (i % 2) + '">' +
        '<a href="' + SITE + dir.id + '">' +
          '<span class="pk-dtile__stack" aria-hidden="true">' + covers.map(function (s, j) { return '<img src="' + esc(s) + '" alt="" loading="lazy" style="--j:' + j + '">'; }).join('') + '</span>' +
          '<span class="pk-dtile__body">' +
            '<span class="pk-dtile__top"><span class="pk-dtile__name">' + esc(dir.name) + '</span><span class="pk-dtile__count" data-i18n="dir.' + dir.id + '.count">' + esc(n + ' ' + plural(n, 'кейс', 'кейса', 'кейсов')) + '</span></span>' +
            '<span class="pk-dtile__title" data-i18n="dir.' + dir.id + '.title">' + esc(dir.title.ru) + '</span>' +
            (compact ? '' : '<span class="pk-dtile__lead" data-i18n="dir.' + dir.id + '.lead">' + esc(dir.lead.ru) + '</span>') +
            '<span class="pk-dtile__go">' + ARROW + '</span>' +
          '</span>' +
        '</a>' +
      '</li>';
  }

  /* ---------- страница направления ---------- */
  function renderDirPage(dirId, data) {
    var dir = dirById(dirId);
    var d = new Dict();
    var list = casesOf(dirId, data);
    var n = list.length;

    var cats = [];
    list.forEach(function (c) { if (c.cat && dir.cats[c.cat] && cats.indexOf(c.cat) < 0) cats.push(c.cat); });

    d.put('dir.title', dir.title);
    d.put('dir.lead', dir.lead);
    d.put('dir.count', { ru: plural(n, 'кейс', 'кейса', 'кейсов'), en: n === 1 ? 'case' : 'cases' });

    var filter = cats.length > 1
      ? '<div class="pk-filter pk-reveal" role="group" aria-label="Фильтр" data-i18n-attr="aria-label:cs.filter">' +
          '<button type="button" aria-pressed="true" data-filter="*">' + d.label('span', 'cs.all') + '<i>' + n + '</i></button>' +
          cats.map(function (cat) {
            var cnt = list.filter(function (c) { return c.cat === cat; }).length;
            return '<button type="button" aria-pressed="false" data-filter="' + cat + '">' + d.tag('span', 'cat.' + cat, dir.cats[cat]) + '<i>' + cnt + '</i></button>';
          }).join('') +
        '</div>'
      : '';
    d.put('cs.filter', { ru: 'Фильтр', en: 'Filter' });

    var cards = list.map(function (c, i) { return renderCard(d, c, i); }).join('');
    var articles = list.map(function (c, i) { return renderArticle(d, c, data, i); });
    var others = DIRS.filter(function (x) { return x.id !== dirId; }).map(function (x, i) { return dirTile(d, x, data, i, true); }).join('');

    var html = '' +
      '<section class="pk-hero pk-dirhero" aria-labelledby="pk-h1">' +
        '<div class="pk-wrap">' +
          '<a class="pk-back pk-reveal" href="' + SITE + 'keys">' + PREV + d.label('span', 'cs.back') + '</a>' +
          '<p class="pk-eyebrow pk-reveal">' + esc(dir.eyebrow) + '</p>' +
          '<h1 class="pk-h1 pk-reveal" id="pk-h1" style="--d:1" data-i18n="dir.title">' + esc(dir.title.ru) + '</h1>' +
          '<div class="pk-dirhero__row pk-reveal" style="--d:2">' +
            '<p class="pk-lead" data-i18n="dir.lead">' + esc(dir.lead.ru) + '</p>' +
            '<p class="pk-dirhero__count"><b>' + n + '</b><span data-i18n="dir.count">' + esc(plural(n, 'кейс', 'кейса', 'кейсов')) + '</span></p>' +
          '</div>' +
        '</div>' +
      '</section>' +
      '<section class="pk-section" style="padding-top:0" aria-labelledby="pk-h1">' +
        '<div class="pk-wrap">' + filter +
          '<ul class="pk-cgrid' + (n === 1 ? ' pk-cgrid--one' : '') + '">' + cards + '</ul>' +
        '</div>' +
      '</section>' +
      '<section class="pk-section" style="padding-top:0" aria-labelledby="pk-other-h">' +
        '<div class="pk-wrap">' +
          '<div class="pk-head">' + d.label('h2', 'cs.other', 'class="pk-h2 pk-reveal" id="pk-other-h"') + '</div>' +
          '<ul class="pk-dtiles pk-dtiles--3">' + others + '</ul>' +
        '</div>' +
      '</section>' +
      ctaBlock(d, dirId);
    var after = caseDialog(d, '');

    return {
      slug: dirId,
      title: dir.title.ru,
      html: html,
      after: after,
      // статьи кейсов переезжают в окно при загрузке — так страницу можно разбить на блоки Tilda
      stores: [{ target: '.pk-cmodal__in', items: articles }],
      en: d.en,
      jsonld: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Кейсы — ' + dir.title.ru,
        url: SITE + dirId,
        author: { '@type': 'Person', name: 'Павел Корчагин', url: SITE },
        hasPart: list.map(function (c) {
          return { '@type': 'CreativeWork', name: ru(c.title), description: ru(c.lead), url: SITE + dirId + '#' + c.id, image: c.cover || undefined, dateCreated: String(c.year || '') };
        })
      }, null, 2)
    };
  }

  function caseDialog(d, articles) {
    return '' +
      '<div class="pk-cmodal" role="dialog" aria-modal="true" hidden data-case-modal>' +
        '<div class="pk-cmodal__bar">' +
          '<span class="pk-cmodal__count" aria-live="polite"></span>' +
          '<button type="button" class="pk-cmodal__close" data-case-close aria-label="' + esc(ru(L['cs.close'])) + '" data-i18n-attr="aria-label:cs.close">' + CLOSE + '</button>' +
        '</div>' +
        '<div class="pk-cmodal__scroll"><div class="pk-wrap pk-cmodal__in">' + articles + '</div></div>' +
      '</div>' +
      '<div class="pk-lb" role="dialog" aria-modal="true" hidden data-lb-root>' +
        '<button type="button" class="pk-lb__btn pk-lb__close" data-lb-close aria-label="' + esc(ru(L['cs.lb.close'])) + '" data-i18n-attr="aria-label:cs.lb.close">' + CLOSE + '</button>' +
        '<button type="button" class="pk-lb__btn pk-lb__prev" data-lb-prev aria-label="' + esc(ru(L['cs.lb.prev'])) + '" data-i18n-attr="aria-label:cs.lb.prev">' + PREV + '</button>' +
        '<figure class="pk-lb__fig"><img alt="" data-lb-img><figcaption data-lb-cap></figcaption></figure>' +
        '<button type="button" class="pk-lb__btn pk-lb__next" data-lb-next aria-label="' + esc(ru(L['cs.lb.next'])) + '" data-i18n-attr="aria-label:cs.lb.next">' + NEXT + '</button>' +
        '<span class="pk-lb__count" data-lb-count></span>' +
      '</div>' +
      (function () { d.put('cs.close', L['cs.close']); d.put('cs.lb.close', L['cs.lb.close']); d.put('cs.lb.prev', L['cs.lb.prev']); d.put('cs.lb.next', L['cs.lb.next']); return ''; })();
  }

  /* ---------- /keys ---------- */
  function renderKeysPage(data) {
    var d = new Dict();
    var total = data.length;
    var feat = data.filter(function (c) { return c.status === 'client'; }).slice(0, 3);

    d.put('k.eye', { ru: 'Портфолио', en: 'Portfolio' });
    d.put('k.h1', { ru: 'Кейсы', en: 'Case studies' });
    var K_LEAD = { ru: 'Сайты, боты, дизайн и онлайн-школы. Выберите направление — внутри каждый проект разобран отдельно: задача, сценарий, экраны и итог.', en: 'Websites, bots, design and online schools. Pick an area — inside, every project is broken down on its own: task, flow, screens and result.' };
    d.put('k.s1', { ru: plural(total, 'проект', 'проекта', 'проектов') + ' в портфолио', en: 'projects in the portfolio' });
    d.put('k.s2', { ru: 'направления', en: 'areas' });
    d.put('k.feat', { ru: 'Проекты для клиентов', en: 'Client projects' });
    d.put('k.tg', { ru: 'Свежие работы — в Telegram-канале', en: 'Latest work — on the Telegram channel' });

    var tiles = DIRS.map(function (x, i) { return dirTile(d, x, data, i, false); }).join('');
    var featured = feat.map(function (c, i) {
      var k = 'c.' + c.id + '.';
      return '<li class="pk-reveal" style="--d:' + i + '"><a class="pk-feat" href="' + SITE + c.dir + '#' + esc(c.id) + '">' +
        (c.cover ? '<img src="' + esc(c.cover) + '" alt="" loading="lazy">' : '') +
        '<span class="pk-feat__body">' + d.tag('small', k + 'type', c.type) + d.tag('b', k + 'title', c.title) + '</span>' + ARROW + '</a></li>';
    }).join('');

    var html = '' +
      '<section class="pk-hero pk-dirhero" aria-labelledby="pk-h1">' +
        '<div class="pk-wrap">' +
          '<p class="pk-eyebrow pk-reveal" data-i18n="k.eye">Портфолио</p>' +
          '<h1 class="pk-h1 pk-reveal" id="pk-h1" style="--d:1" data-i18n="k.h1">Кейсы</h1>' +
          d.tag('p', 'k.lead', K_LEAD, 'class="pk-lead pk-reveal" style="--d:2"') +
          '<ul class="pk-stats pk-stats--3 pk-reveal" style="--d:3">' +
            '<li class="pk-stat"><p class="pk-stat__v"><span data-pk-count="' + total + '">' + total + '</span></p><p class="pk-stat__l" data-i18n="k.s1">' + esc(plural(total, 'проект', 'проекта', 'проектов') + ' в портфолио') + '</p></li>' +
            '<li class="pk-stat"><p class="pk-stat__v">' + DIRS.length + '</p><p class="pk-stat__l" data-i18n="k.s2">направления</p></li>' +
            '<li class="pk-stat"><p class="pk-stat__v">2026</p><p class="pk-stat__l"><a class="pk-link" href="https://t.me/+aq7mXP_tCQ8yNzVi" target="_blank" rel="noopener" data-i18n="k.tg">Свежие работы — в Telegram-канале</a></p></li>' +
          '</ul>' +
        '</div>' +
      '</section>' +
      '<section class="pk-section" style="padding-top:0" aria-label="Направления">' +
        '<div class="pk-wrap"><ul class="pk-dtiles">' + tiles + '</ul></div>' +
      '</section>' +
      (featured ? '<section class="pk-section" style="padding-top:0" aria-labelledby="pk-feat-h"><div class="pk-wrap">' +
        '<div class="pk-head"><h2 class="pk-h2 pk-reveal" id="pk-feat-h" data-i18n="k.feat">Проекты для клиентов</h2></div>' +
        '<ul class="pk-feats">' + featured + '</ul></div></section>' : '') +
      ctaBlock(d, '');

    return {
      slug: 'keys',
      title: 'Кейсы',
      html: html,
      en: d.en,
      jsonld: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Кейсы — Павел Корчагин', url: SITE + 'keys',
        hasPart: DIRS.map(function (x) { return { '@type': 'CollectionPage', name: x.title.ru, url: SITE + x.id }; })
      }, null, 2)
    };
  }

  var api = { DIRS: DIRS, renderDirPage: renderDirPage, renderKeysPage: renderKeysPage, esc: esc };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.PKCases = api;
})(this);
