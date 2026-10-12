(function () {
  var PK = window.PK;
  var root = PK ? PK.root : document.querySelector('.pk-root');
  if (!root) return;
  var html = document.documentElement;

  /* ---------- фильтр витрины: подкатегория, направление и сфера вместе ---------- */
  var st = { cat: '*', dir: '*', sphere: '*' };
  var q = new URLSearchParams(location.search);
  if (q.get('d')) st.dir = q.get('d');
  if (q.get('s')) st.sphere = q.get('s');
  var ATTR = { cat: 'data-filter', dir: 'data-filter-dir', sphere: 'data-filter-sphere' };
  function applyFilter(push) {
    Object.keys(ATTR).forEach(function (k) {
      if (st[k] !== '*' && !root.querySelector('[' + ATTR[k] + '="' + st[k] + '"]')) st[k] = '*';
      root.querySelectorAll('[' + ATTR[k] + ']').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute(ATTR[k]) === st[k])); });
    });
    var shown = 0;
    root.querySelectorAll('.pk-ccard').forEach(function (card) {
      var show = (st.cat === '*' || card.getAttribute('data-cat') === st.cat) && (st.dir === '*' || card.getAttribute('data-dir') === st.dir) &&
        (st.sphere === '*' || card.getAttribute('data-sphere') === st.sphere);
      card.classList.toggle('is-hidden', !show);
      if (show) { card.classList.add('is-in'); shown++; }
    });
    root.querySelectorAll('.pk-empty').forEach(function (e) { e.hidden = shown > 0; });
    if (push && window.history && history.replaceState) {
      var u = new URL(location.href);
      st.dir === '*' ? u.searchParams.delete('d') : u.searchParams.set('d', st.dir);
      st.sphere === '*' ? u.searchParams.delete('s') : u.searchParams.set('s', st.sphere);
      history.replaceState(history.state, '', u);
    }
  }
  root.addEventListener('click', function (e) {
    var b = e.target.closest('[data-filter],[data-filter-dir],[data-filter-sphere],.pk-empty__reset');
    if (!b) return;
    if (b.classList.contains('pk-empty__reset')) st = { cat: '*', dir: '*', sphere: '*' };
    else Object.keys(ATTR).forEach(function (k) { if (b.hasAttribute(ATTR[k])) st[k] = b.getAttribute(ATTR[k]); });
    applyFilter(true);
  });
  if (root.querySelector('.pk-ccard')) applyFilter(false);

  /* ---------- маленькие картинки не растягиваем (иначе скриншоты расплываются) ---------- */
  function fitImage(img) {
    if (!img.naturalWidth || !img.closest('.pk-ccard__media, .pk-case__cover, .pk-gallery')) return;
    var box = img.parentElement.clientWidth;
    if (!box) return; // скрытая картинка — проверим, когда покажется
    img.classList.toggle('pk-img-small', img.naturalWidth < box * 0.98);
  }
  function fitAll() { root.querySelectorAll('img').forEach(fitImage); }
  root.addEventListener('load', function (e) { if (e.target.tagName === 'IMG') fitImage(e.target); }, true);
  var fitTimer; window.addEventListener('resize', function () { clearTimeout(fitTimer); fitTimer = setTimeout(fitAll, 150); });
  fitAll();

  var modal = root.querySelector('[data-case-modal]');
  if (!modal) return;
  var scroller = modal.querySelector('.pk-cmodal__scroll');
  var counter = modal.querySelector('.pk-cmodal__count');
  var articles = Array.prototype.slice.call(modal.querySelectorAll('.pk-cstory'));
  var ids = articles.map(function (a) { return a.getAttribute('data-case'); });
  var current = null;
  var opener = null;
  var pushed = false;

  function byId(id) { return modal.querySelector('.pk-cstory[data-case="' + (window.CSS && CSS.escape ? CSS.escape(id) : id) + '"]'); }

  function show(id, fromHistory) {
    var art = byId(id);
    if (!art) return false; // неизвестный якорь — просто остаёмся на витрине
    articles.forEach(function (a) { a.hidden = a !== art; });
    current = id;
    var wasOpen = !modal.hidden;
    if (modal.hidden) {
      opener = document.activeElement;
      modal.hidden = false;
      modal.classList.remove('is-open'); void modal.offsetWidth; modal.classList.add('is-open');
      html.style.overflow = 'hidden';
    }
    modal.setAttribute('aria-labelledby', 'case-title-' + id);
    counter.textContent = (ids.indexOf(id) + 1) + ' / ' + ids.length;
    scroller.scrollTop = 0;
    requestAnimationFrame(function () { art.querySelectorAll('img').forEach(fitImage); });
    // одна запись в истории на открытие окна: листание кейсов внутри её только заменяет,
    // поэтому «назад» и Esc всегда возвращают на витрину
    if (!fromHistory && location.hash !== '#' + id) {
      if (wasOpen) history.replaceState({ pkCase: id }, '', '#' + id);
      else { history.pushState({ pkCase: id }, '', '#' + id); pushed = true; }
    }
    setTimeout(function () { modal.querySelector('[data-case-close]').focus({ preventScroll: true }); }, 30);
    return true;
  }

  function hide(fromHistory) {
    if (modal.hidden) return;
    modal.hidden = true;
    html.style.overflow = '';
    current = null;
    if (!fromHistory) {
      if (pushed) { pushed = false; history.back(); }
      else history.replaceState(null, '', location.pathname + location.search);
    }
    var target = opener && document.contains(opener) ? opener : null;
    if (target) target.focus({ preventScroll: true });
    opener = null;
  }

  root.addEventListener('click', function (e) {
    var a = e.target.closest('[data-case-open]');
    if (a && root.contains(a)) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // открыть в новой вкладке — как обычная ссылка
      e.preventDefault();
      show(a.getAttribute('data-case-open'));
    }
    if (e.target.closest('[data-case-close]')) hide();
  });

  window.addEventListener('popstate', function () {
    var id = location.hash.slice(1);
    if (id && byId(id)) { pushed = true; show(id, true); }
    else { pushed = false; hide(true); }
  });

  // прямая ссылка /tilda#maxfit
  var initial = decodeURIComponent(location.hash.slice(1));
  if (initial && byId(initial)) {
    history.replaceState({ pkCase: initial }, '', '#' + initial);
    show(initial, true);
  }

  // фокус внутри открытого окна
  function trap(container, e) {
    var f = container.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
    var list = Array.prototype.filter.call(f, function (el) { return el.offsetParent !== null || el === document.activeElement; });
    if (!list.length) return;
    var first = list[0], last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------- лайтбокс ---------- */
  var lb = root.querySelector('[data-lb-root]');
  var lbImg = lb.querySelector('[data-lb-img]');
  var lbCap = lb.querySelector('[data-lb-cap]');
  var lbCount = lb.querySelector('[data-lb-count]');
  var shots = [];
  var shotIdx = 0;
  var lbOpener = null;

  function collect(art) {
    return Array.prototype.map.call(art.querySelectorAll('.pk-zoom'), function (b) {
      var fig = b.closest('figure');
      var cap = fig && fig.querySelector('figcaption');
      return { src: b.querySelector('img').getAttribute('src'), cap: cap ? cap.textContent : '', n: +b.getAttribute('data-lb') };
    }).sort(function (a, b) { return a.n - b.n; });
  }
  function render() {
    var s = shots[shotIdx];
    lbImg.src = s.src;
    lbCap.textContent = s.cap;
    lbCount.textContent = (shotIdx + 1) + ' / ' + shots.length;
    var many = shots.length > 1;
    lb.querySelector('[data-lb-prev]').hidden = !many;
    lb.querySelector('[data-lb-next]').hidden = !many;
  }
  function openLb(art, n) {
    shots = collect(art);
    shotIdx = Math.max(0, shots.findIndex(function (s) { return s.n === n; }));
    lbOpener = document.activeElement;
    lb.hidden = false;
    render();
    lb.querySelector('[data-lb-close]').focus({ preventScroll: true });
  }
  function closeLb() {
    lb.hidden = true;
    lbImg.removeAttribute('src');
    if (lbOpener) lbOpener.focus({ preventScroll: true });
  }
  function step(d) { shotIdx = (shotIdx + d + shots.length) % shots.length; render(); }

  modal.addEventListener('click', function (e) {
    var z = e.target.closest('.pk-zoom');
    if (z) openLb(z.closest('.pk-cstory'), +z.getAttribute('data-lb'));
  });
  lb.addEventListener('click', function (e) {
    if (e.target.closest('[data-lb-close]') || e.target === lb) closeLb();
    else if (e.target.closest('[data-lb-prev]')) step(-1);
    else if (e.target.closest('[data-lb-next]')) step(1);
  });
  var tx = null;
  lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (tx === null) return;
    var dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50 && shots.length > 1) step(dx < 0 ? 1 : -1);
    tx = null;
  });

  // клавиатура: Esc закрывает только верхнее окно
  document.addEventListener('keydown', function (e) {
    if (!lb.hidden) {
      if (e.key === 'Escape') { e.preventDefault(); closeLb(); }
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'Tab') trap(lb, e);
      return;
    }
    if (!modal.hidden) {
      if (e.key === 'Escape') { e.preventDefault(); hide(); }
      else if (e.key === 'Tab') trap(modal, e);
    }
  });
})();
