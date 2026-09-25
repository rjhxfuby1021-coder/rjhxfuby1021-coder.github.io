(function () {
  var PK = window.PK;
  if (!PK) return;
  var GUID = 'deff08aa10e87edf46d7e68751d94d'; // виджет ИИ-ассистента Salebot
  var ready = false;
  var wantOpen = false;

  function init() {
    if (!window.ChatBotPro) return;
    window.ChatBotPro.init({ guid: GUID });
    ready = true;
    if (wantOpen) open();
  }
  function open() {
    try { window.ChatBotPro.open(); } catch (e) { window.open('https://t.me/PavelTexSpec', '_blank', 'noopener'); }
  }

  var s = document.createElement('script');
  s.src = 'https://salebot.pro/js/chatbot.js?v=1';
  s.async = true;
  s.onload = init;
  s.onerror = function () { ready = false; };
  document.head.appendChild(s);

  PK.root.querySelectorAll('[data-open-chat]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (ready) { open(); return; }
      // виджет ещё грузится: откроем, как только будет готов; если так и не загрузился — ведём в Telegram
      wantOpen = true;
      setTimeout(function () { if (!ready) window.open('https://t.me/PavelTexSpec', '_blank', 'noopener'); }, 4000);
    });
  });
})();
