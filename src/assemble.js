/*
  Сборка страницы для Tilda из общих частей и содержимого страницы.
  Работает и в Node (build.js), и в браузере (admin/admin.html) — поэтому без зависимостей.

  Tilda ограничивает размер одного блока T123, поэтому страница собирается как
  несколько блоков подряд: стили → разметка → «хранилища» (тексты кейсов) → скрипты.
  Каждый блок не больше MAX_BLOCK символов.
*/
(function (global) {
  var MAX_BLOCK = 40000;
  var NAV = ['keys', 'price', 'otzivi', 'iambonus', 'faq'];

  // экранирование для вставки JSON внутрь <script>
  function jsonForScript(obj) {
    return JSON.stringify(obj || {}).replace(/</g, '\\u003c');
  }

  function markCurrent(html, current) {
    if (!current) return html;
    var re = new RegExp('href="https://texspeckps\\.ru/' + current + '"', 'g');
    return html.replace(re, 'href="https://texspeckps.ru/' + current + '" aria-current="page"');
  }

  // сжатие без изменения смысла: комментарии и лишние пробелы
  function minCss(css) {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*([{};,>])\s*/g, '$1')
      .replace(/;}/g, '}')
      .trim();
  }
  function minJs(js) {
    return js.split('\n').map(function (l) { return l.trim(); })
      .filter(function (l) { return l && l.indexOf('//') !== 0; }).join('\n');
  }
  function minHtml(html) {
    return html.replace(/<!--[\s\S]*?-->/g, '').replace(/\n\s+/g, '\n').replace(/\n{2,}/g, '\n').trim();
  }

  // CSS режем только между правилами верхнего уровня (не внутри @media)
  function splitCss(css, max) {
    var chunks = [], depth = 0, start = 0, last = 0;
    for (var i = 0; i < css.length; i++) {
      var ch = css[i];
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) {
          if (i + 1 - start > max && last > start) { chunks.push(css.slice(start, last)); start = last; }
          last = i + 1;
        }
      }
    }
    chunks.push(css.slice(start));
    return chunks.filter(Boolean);
  }

  // делим разметку на секции верхнего уровня (вложенные <section> не разрываем)
  function topSections(html) {
    var out = [], depth = 0, start = 0, re = /<(\/?)section\b[^>]*>/g, m;
    while ((m = re.exec(html))) {
      if (!m[1]) { if (depth === 0 && m.index > start) { out.push(html.slice(start, m.index)); start = m.index; } depth++; }
      else depth--;
    }
    out.push(html.slice(start));
    return out.filter(function (s) { return s.trim(); });
  }

  /*
    kit:  { baseCss, baseJs, header, menu, footer, commonEn }
    page: { slug, title, html, after, stores, en, ru, css, js, jsonld, nav }
    → массив сегментов по порядку (каждый — законченный кусок HTML)
  */
  function segments(kit, page, max) {
    var nav = page.nav || (NAV.indexOf(page.slug) >= 0 ? page.slug : '');
    var en = {};
    Object.keys(kit.commonEn).forEach(function (k) { en[k] = kit.commonEn[k]; });
    Object.keys(page.en || {}).forEach(function (k) { en[k] = page.en[k]; });

    max = max - 1500; // запас под служебную строку блока
    var segs = [];
    var head ='<meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
      '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Unbounded:wght@500;600;700&display=swap">';
    var css = minCss(kit.baseCss + '\n' + (page.css || ''));
    splitCss(css, max - head.length - 20).forEach(function (c, i) { segs.push((i === 0 ? head : '') + '<style>' + c + '</style>'); });

    function rootWith(mainHtml) {
      return minHtml('<div class="pk-root" data-theme="dark" lang="ru" data-page="' + page.slug + '">' +
        '<div class="pk-bgfx" aria-hidden="true"><span></span><span></span></div><div class="pk-grain" aria-hidden="true"></div>' +
        markCurrent(kit.header, nav) + markCurrent(kit.menu, nav) +
        '<main>' + mainHtml + '</main>' + kit.footer + (page.after || '') + '</div>');
    }
    var stores = (page.stores || []).slice();
    var root = rootWith(page.html);
    if (root.length > max) {
      // разметка не помещается в один блок: первые секции остаются, остальные уезжают в хранилище main
      var secs = topSections(page.html), keep = '', i = 0;
      while (i < secs.length && rootWith(keep + secs[i]).length <= max) keep += secs[i++];
      if (i === 0) { keep = secs[0]; i = 1; }
      root = rootWith(keep);
      stores.unshift({ target: 'main', items: secs.slice(i) });
    }
    segs.push(root);

    // хранилища: порции содержимого, которые скрипт переносит в target при загрузке
    stores.forEach(function (st) {
      var open = '<div hidden data-pk-move="' + st.target + '">', close = '</div>';
      var cur = '';
      st.items.forEach(function (item) {
        var it = minHtml(item);
        if (cur && (open + cur + it + close).length > max) { segs.push(open + cur + close); cur = ''; }
        cur += it;
      });
      if (cur) segs.push(open + cur + close);
    });

    var js = minJs(kit.baseJs)
      .replace('/*@PK_EN@*/{}', jsonForScript(en))
      .replace('/*@PK_RU@*/{}', jsonForScript(page.ru));
    var scripts = [];
    if (page.jsonld) scripts.push('<script type="application/ld+json">' + JSON.stringify(JSON.parse(page.jsonld)) + '</script>');
    scripts.push('<script>' + js + '</script>');
    if (page.js) scripts.push('<script>' + minJs(page.js) + '</script>');
    scripts.forEach(function (s) { segs.push(s); });
    return segs;
  }

  // упаковываем сегменты по порядку в блоки не больше max
  function assembleParts(kit, page, max) {
    max = max || MAX_BLOCK;
    var segs = segments(kit, page, max);
    var blocks = [], cur = '';
    segs.forEach(function (s) {
      if (cur && (cur + '\n' + s).length > max - 120) { blocks.push(cur); cur = ''; }
      cur += (cur ? '\n' : '') + s;
    });
    if (cur) blocks.push(cur);
    var total = blocks.length;
    return blocks.map(function (b, i) {
      return '<!-- texspeckps.ru/' + (page.slug === 'index' ? '' : page.slug) + ' · блок ' + (i + 1) + ' из ' + total +
        ' · вставьте в ' + (i + 1) + '-й блок T123 сверху -->\n' + b + '\n';
    });
  }

  // одним файлом — для предпросмотра и локальной проверки
  function assemble(kit, page, max) {
    return assembleParts(kit, page, max).join('\n');
  }

  var api = { assemble: assemble, assembleParts: assembleParts, segments: segments, jsonForScript: jsonForScript, MAX_BLOCK: MAX_BLOCK };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.PKAssemble = api;
})(this);
