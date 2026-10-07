(function () {
  // ИИ-ассистент Salebot — живым чатом прямо в блоке страницы, а не всплывающим окном в углу.
  // Виджет сам создаёт своё окно (iframe #parent_frame); мы держим его открытым и ставим точно поверх блока #ai-dock.
  // Salebot привязан к домену texspeckps.ru: если виджет не загрузился — в блоке ссылка на Telegram.
  var PK = window.PK;
  if (!PK) return;
  var el = PK.root.querySelector('#ai-dock');
  if (!el) return;
  var GUID = 'deff08aa10e87edf46d7e68751d94d';

  function fail() {
    if (document.getElementById('parent_frame')) return;
    el.innerHTML = '<div class="ai-dock-fail"><p>Ассистент открывается только на texspeckps.ru.</p>' +
      '<a href="https://t.me/PavelTexSpec" target="_blank" rel="noopener">Написать Павлу в Telegram →</a></div>';
  }

  var css = document.createElement('style');
  document.head.appendChild(css);
  var last = '';
  function place() {
    if (!document.getElementById('parent_frame')) return;
    var r = el.getBoundingClientRect();
    var key = [r.top + window.scrollY, r.left + window.scrollX, r.width, r.height].map(Math.round).join(',');
    if (key === last) return;
    last = key;
    var p = key.split(',');
    css.textContent = '#parent_frame{position:absolute!important;top:' + p[0] + 'px!important;left:' + p[1] + 'px!important;right:auto!important;bottom:auto!important;' +
      'width:' + p[2] + 'px!important;max-width:none!important;height:' + p[3] + 'px!important;max-height:none!important;transform:none!important;box-shadow:none!important;' +
      'z-index:2!important;display:block!important;border-radius:20px!important;visibility:visible!important;opacity:1!important}' +
      '.msb_circle_trigger,#msb_social_contacts_container,#msb_prompt_id,#small_preview_msb{display:none!important}';
  }

  var s = document.createElement('script');
  s.src = 'https://salebot.pro/js/chatbot.js?v=1';
  s.async = true;
  s.onerror = fail;
  s.onload = function () {
    var CB = window.ChatBotPro;
    if (!CB) return fail();
    CB.init({ guid: GUID });
    // открываем, как только окно ассистента появится, и не даём его свернуть
    var tries = 0;
    var t = setInterval(function () {
      tries++;
      if (document.getElementById('parent_frame')) {
        clearInterval(t);
        try { CB.open(); } catch (e) { /* ничего */ }
        CB.close = function () {};
        el.classList.add('ai-dock-on');
        place();
      } else if (tries > 40) { clearInterval(t); fail(); }
    }, 250);
  };
  document.head.appendChild(s);
  window.addEventListener('resize', place);
  window.addEventListener('scroll', place, { passive: true });
  setInterval(place, 500); // раскрылся вопрос выше, догрузились шрифты — блок сдвинулся
})();
