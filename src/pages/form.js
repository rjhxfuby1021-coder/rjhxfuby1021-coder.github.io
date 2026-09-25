(function () {
  var PK = window.PK;
  var form = PK && PK.root.querySelector('[data-letter]');
  if (!form) return;

  // По решению владельца заявки уходят напрямую через бота (токен виден в коде страницы).
  var TELEGRAM_BOT_TOKEN = '8846765812:AAEEoh8-hKoAceggLWREm6-_3KY7Z7DX2AE';
  var TELEGRAM_CHAT_ID = '7706477564';

  var SERVICE_RU = { salebot: 'Чат-боты', tilda: 'Сайт на Tilda', figma: 'Дизайн в Figma', getcourse: 'GetCourse', complex: 'Система под ключ' };
  var preview = form.querySelector('[data-preview]');
  var statusEl = form.querySelector('[data-status]');
  var sendBtn = form.querySelector('[data-send]');
  var copyBtn = form.querySelector('[data-copy]');
  var f = form.elements;

  function v(name) { return (f[name].value || '').trim(); }
  function service() { var c = form.querySelector('input[name="service"]:checked'); return c ? c.value : ''; }

  // сообщение Павлу всегда на русском — он его читает
  function buildMessage() {
    var s = service();
    var text = 'Новая заявка с сайта\n\n';
    text += 'Имя: ' + (v('name') || '—') + '\n';
    if (s) text += 'Интересует: ' + SERVICE_RU[s] + '\n';
    text += 'Задача: ' + (v('task') || '—') + '\n';
    text += 'Бюджет: ' + (v('budget') ? v('budget') + ' ₽' : 'не указан') + '\n';
    text += 'Контакт: ' + (v('contact') || '—') + '\n';
    if (v('comment')) text += '\nКомментарий:\n' + v('comment') + '\n';
    if (PK.lang() === 'en') text += '\nЯзык сайта: EN';
    return text.replace(/\s+$/, '');
  }

  // поля внутри предложения растут вместе с текстом
  function fit(input) {
    var len = Math.max(input.value.length, (input.placeholder || '').length);
    input.size = Math.min(Math.max(len, 4), 38);
  }

  function update() { preview.textContent = buildMessage(); }

  function setStatus(key, type) {
    statusEl.textContent = key ? PK.t(key) : '';
    statusEl.className = 'pk-letter__status' + (type ? ' ' + type : '');
  }

  function validate() {
    var ok = true;
    ['name', 'contact'].forEach(function (n) {
      var bad = !v(n);
      f[n].setAttribute('aria-invalid', String(bad));
      if (bad && ok) { f[n].focus(); ok = false; }
    });
    if (!ok) setStatus('fm.err.required', 'is-error');
    return ok;
  }

  function copy() {
    var text = buildMessage();
    function done() { setStatus('fm.ok.copied', 'is-success'); }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { setStatus('fm.err.copy', 'is-error'); }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  }

  function label(btn, key) { btn.querySelector('[data-i18n]').textContent = PK.t(key); }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sendBtn.disabled || !validate()) return;
    sendBtn.disabled = true;
    label(sendBtn, 'fm.sending');
    setStatus('', '');
    fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: buildMessage() })
    })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (data) {
        if (!data.ok) throw new Error('Telegram API');
        setStatus('fm.ok.sent', 'is-success');
        label(sendBtn, 'fm.sent');
      })
      .catch(function () {
        setStatus('fm.err.send', 'is-error');
        sendBtn.disabled = false;
        label(sendBtn, 'fm.retry');
      });
  });
  copyBtn.addEventListener('click', copy);

  form.addEventListener('input', function (e) {
    if (e.target.matches('.pk-blank input')) { fit(e.target); e.target.removeAttribute('aria-invalid'); }
    update();
  });
  form.addEventListener('change', update);
  PK.root.addEventListener('pk:lang', function () {
    form.querySelectorAll('.pk-blank input').forEach(fit);
    update();
    if (!sendBtn.disabled) label(sendBtn, 'fm.send');
  });

  // предзаполнение со страниц цен и кейсов: /form?service=tilda&task=…
  var params = new URLSearchParams(location.search);
  var s = params.get('service');
  var radio = s && form.querySelector('input[name="service"][value="' + s.replace(/[^a-z]/g, '') + '"]');
  if (radio) radio.checked = true;
  if (params.get('task')) f.task.value = params.get('task').slice(0, 200);

  form.querySelectorAll('.pk-blank input').forEach(fit);
  update();
})();
