(function () {
  var root = document.querySelector('.pk-root');
  if (!root) return;

  // Большие страницы разбиты на несколько блоков Tilda: содержимое из блоков-«хранилищ»
  // переносим на своё место до того, как остальной код начнёт искать элементы.
  document.querySelectorAll('[data-pk-move]').forEach(function (store) {
    var target = root.querySelector(store.getAttribute('data-pk-move'));
    if (target) while (store.firstChild) target.appendChild(store.firstChild);
    store.parentNode.removeChild(store);
  });

  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) {} }
  };
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var motion = !mqReduce.matches;
  root.classList.add('pk-js');
  if (motion) root.classList.add('pk-motion');

  /* ---------- словарь EN ---------- */
  var PK_EN = /*@PK_EN@*/{};
  var PK_RU = {
    "a.toLight": "Включить светлую тему",
    "a.toDark": "Включить тёмную тему",
    "a.menuOpen": "Открыть меню",
    "a.menuClose": "Закрыть меню"
  };
  // строки, которых нет в разметке (статусы форм и т. п.) — подставляет сборка
  var PK_RU_EXTRA = /*@PK_RU@*/{};
  Object.keys(PK_RU_EXTRA).forEach(function (k) { PK_RU[k] = PK_RU_EXTRA[k]; });

  var textEls = root.querySelectorAll('[data-i18n]');
  var attrEls = root.querySelectorAll('[data-i18n-attr]');
  // Русский оригинал берём из разметки — он же индексируется поисковиками.
  textEls.forEach(function (el) { PK_RU[el.getAttribute('data-i18n')] = el.innerHTML; });
  attrEls.forEach(function (el) {
    el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
      var p = pair.split(':');
      PK_RU[p[1]] = el.getAttribute(p[0]);
    });
  });

  var lang = 'ru';
  function t(key) { return (lang === 'en' && PK_EN[key]) || PK_RU[key] || ''; }

  function applyLang(l) {
    lang = l === 'en' ? 'en' : 'ru';
    root.setAttribute('lang', lang);
    textEls.forEach(function (el) { el.innerHTML = t(el.getAttribute('data-i18n')); });
    attrEls.forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':');
        el.setAttribute(p[0], t(p[1]));
      });
    });
    root.querySelectorAll('[data-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
    });
    syncThemeLabel();
    syncMenuLabel();
    root.dispatchEvent(new CustomEvent('pk:lang', { detail: lang }));
  }

  // API для скриптов конкретных страниц
  window.PK = {
    root: root,
    motion: motion,
    store: store,
    t: function (key) { return t(key); },
    lang: function () { return lang; }
  };

  /* ---------- тема ---------- */
  var themeBtn = root.querySelector('.pk-theme');
  function syncThemeLabel() {
    var light = root.getAttribute('data-theme') === 'light';
    themeBtn.setAttribute('aria-label', t(light ? 'a.toDark' : 'a.toLight'));
    themeBtn.setAttribute('aria-pressed', String(light));
  }
  function applyTheme(th) {
    root.setAttribute('data-theme', th === 'light' ? 'light' : 'dark');
    syncThemeLabel();
  }
  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
    store.set('pk-theme', next);
  });
  root.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () {
      var l = b.getAttribute('data-lang');
      applyLang(l);
      store.set('pk-lang', l);
    });
  });

  /* ---------- меню ---------- */
  var burger = root.querySelector('.pk-burger');
  var menu = root.querySelector('.pk-menu');
  function syncMenuLabel() {
    burger.setAttribute('aria-label', t(root.classList.contains('pk-menu-open') ? 'a.menuClose' : 'a.menuOpen'));
  }
  function setMenu(open) {
    root.classList.toggle('pk-menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.documentElement.style.overflow = open ? 'hidden' : '';
    syncMenuLabel();
    // меню становится видимым только после пересчёта стилей — фокусируем кадром позже
    if (open) setTimeout(function () { var first = menu.querySelector('a'); if (first) first.focus(); }, 60);
  }
  burger.addEventListener('click', function () { setMenu(!root.classList.contains('pk-menu-open')); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && root.classList.contains('pk-menu-open')) { setMenu(false); burger.focus(); }
  });
  window.matchMedia('(min-width: 1080px)').addEventListener('change', function (e) { if (e.matches) setMenu(false); });

  applyTheme(store.get('pk-theme') || 'dark');
  applyLang(store.get('pk-lang') || 'ru');

  /* ---------- шапка при скролле ---------- */
  var header = root.querySelector('.pk-header');
  function onScrollHeader() { header.classList.toggle('is-scrolled', window.scrollY > 8); }

  /* ---------- карточки-перевёртыши ---------- */
  root.querySelectorAll('.pk-flip').forEach(function (card) {
    function toggle() {
      var on = !card.classList.contains('is-flipped');
      card.classList.toggle('is-flipped', on);
      card.setAttribute('aria-pressed', String(on));
    }
    card.addEventListener('click', toggle);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });

  /* ---------- счётчики ---------- */
  function runCounter(el) {
    var to = parseInt(el.getAttribute('data-pk-count'), 10);
    if (!motion) { el.textContent = to; return; }
    var start = null, dur = 1600;
    function step(ts) {
      if (start === null) start = ts;
      var k = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    }
    el.textContent = '0';
    requestAnimationFrame(step);
  }

  /* ---------- появление при скролле ---------- */
  var reveals = root.querySelectorAll('.pk-reveal');
  var counters = root.querySelectorAll('[data-pk-count]');
  if ('IntersectionObserver' in window && motion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        runCounter(en.target);
        co.unobserve(en.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- живая схема воронки ---------- */
  var flow = root.querySelector('[data-pk-flow]');
  var nodes = flow ? flow.querySelectorAll('.pk-node') : [];
  function updateFlow() {
    if (!flow) return;
    var p = 1;
    if (motion) {
      // Старт — когда схема входит в нижнюю часть экрана; путь растянут минимум на полэкрана,
      // чтобы короткая горизонтальная схема на десктопе не вспыхивала целиком.
      var r = flow.getBoundingClientRect();
      var vh = window.innerHeight;
      p = (vh * 0.85 - r.top) / Math.max(r.height, vh * 0.5);
      p = Math.max(0, Math.min(1, p));
    }
    flow.style.setProperty('--p', p.toFixed(4));
    var last = nodes.length - 1;
    nodes.forEach(function (n, i) { n.classList.toggle('is-on', p >= (last ? i / last : 0) - 0.001); });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; onScrollHeader(); updateFlow(); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScrollHeader();
  updateFlow();

  /* ---------- подсветка карточек и магнитные кнопки (только мышь) ---------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && motion) {
    root.querySelectorAll('.pk-spot').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
    root.querySelectorAll('.pk-magnet').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        btn.style.setProperty('--bx', ((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1) + 'px');
        btn.style.setProperty('--by', ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + 'px');
      });
      btn.addEventListener('pointerleave', function () {
        btn.style.setProperty('--bx', '0px');
        btn.style.setProperty('--by', '0px');
      });
    });
  }
})();
