// Чат с демо-ботом прямо на сайте — без перехода в Telegram.
// Те же сценарии и движок (scenarios.js, engine.js), только «Telegram» здесь — окно чата на странице.
// Собирается в один файл командой: node build-web.js  →  new/assets/botchat.js
//
// Открыть чат: BotChat.open() или BotChat.open('quiz'); любой элемент с data-botchat="<код>" открывает чат по клику.

const { createEngine } = require('engine');

const CHAT = 'web';
const ADMIN = 'admin';
const LEAD_URL = 'https://texspeckps-form.texspeckps.workers.dev';
const TG = 'https://t.me/Bot_PortfolioRabot';
const KEY_USER = 'pk-botchat-user-v2';
const KEY_LOG = 'pk-botchat-log-v2';

const cfg = {
  WEB: true,
  ADMIN_CHAT_ID: ADMIN,
  CHANNEL_ID: '',
  CHANNEL_LINK: 'https://t.me/+aq7mXP_tCQ8yNzVi',
  CONTACT_LINK: 'https://t.me/PavelTexSpec',
  SITE: 'https://texspeckps.ru',
};

const store = (k, val) => {
  try {
    if (val === undefined) return JSON.parse(localStorage.getItem(k) || 'null');
    localStorage.setItem(k, JSON.stringify(val));
  } catch (e) { /* приватный режим — живём без сохранения */ }
  return null;
};
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const CSS = `
:host{all:initial}
*{box-sizing:border-box;margin:0;padding:0}
.panel{position:fixed;left:16px;bottom:16px;z-index:2147483000;width:380px;height:min(620px,calc(100vh - 32px));display:flex;flex-direction:column;
  background:#fff;color:#16161a;border-radius:20px;overflow:hidden;box-shadow:0 30px 80px -20px rgba(0,0,0,.45),0 0 0 1px rgba(0,0,0,.08);
  font:400 15px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;transform-origin:left bottom;animation:pop .28s cubic-bezier(.2,.9,.3,1.2)}
@keyframes pop{from{opacity:0;transform:scale(.92) translateY(10px)}}
@media(max-width:560px){.panel{left:0;bottom:0;width:100vw;height:100dvh;border-radius:0}}
:host(.inline) .panel{position:relative;left:auto;bottom:auto;width:100%;height:100%;animation:none;border-radius:inherit;box-shadow:none}
:host(.inline) [data-close]{display:none}
.hd{display:flex;align-items:center;gap:10px;padding:12px 12px 12px 16px;background:var(--acc);color:var(--acc-ink)}
.ava{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.22);font-size:20px;flex:none}
.who{flex:1;min-width:0}.who b{display:block;font-weight:700;font-size:15px}.who span{font-size:12px;opacity:.85}
.ic{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:none;border:0;color:inherit;cursor:pointer;font-size:18px}
.ic:hover{background:rgba(255,255,255,.18)}
.log{flex:1;overflow-y:auto;padding:16px 12px 8px;background:#eef0f4;display:flex;flex-direction:column;gap:10px;overscroll-behavior:contain}
.msg{max-width:88%;padding:9px 12px 10px;border-radius:16px;white-space:normal;word-wrap:break-word;overflow-wrap:anywhere}
.bot{align-self:flex-start;background:#fff;border-bottom-left-radius:5px;box-shadow:0 1px 1px rgba(0,0,0,.06)}
.me{align-self:flex-end;background:var(--acc);color:var(--acc-ink);border-bottom-right-radius:5px}
.msg i{color:#5d6270}.me i{color:inherit}.msg code{font-family:ui-monospace,Consolas,monospace;background:#f1f2f5;padding:0 4px;border-radius:4px}
.kb{align-self:flex-start;max-width:88%;display:flex;flex-direction:column;gap:6px;margin-top:-4px}
.row{display:flex;gap:6px}
.btn{flex:1;min-height:38px;padding:7px 10px;border-radius:10px;border:0;background:#fff;color:var(--acc-text);font:600 13.5px/1.25 inherit;font-family:inherit;cursor:pointer;
  box-shadow:inset 0 0 0 1.5px var(--acc-soft);text-align:center;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:4px;transition:background .15s}
.btn:hover{background:var(--acc-soft)}
.btn[disabled]{opacity:.45;cursor:default}
.btn.picked{background:var(--acc-soft)}
.ext::after{content:"↗";font-size:12px;opacity:.7}
.typing{align-self:flex-start;background:#fff;border-radius:16px;padding:12px 14px;display:flex;gap:4px}
.typing i{width:7px;height:7px;border-radius:50%;background:#a3a8b5;animation:dot 1s infinite}
.typing i:nth-child(2){animation-delay:.15s}.typing i:nth-child(3){animation-delay:.3s}
@keyframes dot{0%,60%,100%{opacity:.3;transform:none}30%{opacity:1;transform:translateY(-3px)}}
.quick{display:flex;flex-wrap:wrap;gap:6px;padding:8px 12px 0;background:#fff}
.quick:empty{display:none}
.quick .btn{flex:0 1 auto}
.ft{display:flex;gap:8px;padding:10px 12px 12px;background:#fff;border-top:1px solid #e7e8ec}
.ft input{flex:1;min-width:0;height:42px;border-radius:21px;border:1.5px solid #dcdee4;padding:0 16px;font:inherit;color:inherit;background:#fff;outline:none}
.ft input:focus{border-color:var(--acc)}
.send{width:42px;height:42px;border-radius:50%;border:0;background:var(--acc);color:var(--acc-ink);cursor:pointer;display:grid;place-items:center;flex:none}
.note{padding:0 12px 10px;background:#fff;font-size:11.5px;color:#7a7f8c;text-align:center}
.note a{color:var(--acc-text)}
`;

function colors() {
  // берём акцентный цвет текущего стиля сайта, чтобы чат выглядел «своим»
  const cs = getComputedStyle(document.documentElement);
  let acc = (cs.getPropertyValue('--acc') || '').trim() || (cs.getPropertyValue('--acc-text') || '').trim() || '#2d5bff';
  const probe = document.createElement('span');
  probe.style.color = acc; document.body.appendChild(probe);
  const rgb = getComputedStyle(probe).color.match(/\d+(\.\d+)?/g) || [45, 91, 255];
  probe.remove();
  const [r, g, b] = rgb.map(Number);
  const light = (0.299 * r + 0.587 * g + 0.114 * b) > 170;
  return {
    acc: `rgb(${r},${g},${b})`,
    ink: light ? '#16161a' : '#fff',
    text: light ? '#16161a' : `rgb(${r},${g},${b})`, // на белом фоне светлый акцент нечитаем
    soft: `rgba(${r},${g},${b},.16)`,
  };
}

let root, logEl, quickEl, input, engine, opened = false;
let history = [];
let msgSeq = 0; // номер последнего сообщения бота
let queue = Promise.resolve(); // вывод сообщений по одному, с «печатает…»
let act = Promise.resolve();   // действия человека по очереди
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function save() { try { sessionStorage.setItem(KEY_LOG, JSON.stringify(history.slice(-80))); } catch (e) { /* ничего */ } }
function scroll() { logEl.scrollTop = logEl.scrollHeight; }

// у каждого сообщения бота свой номер — чтобы его можно было заменить на месте (пошаговая запись, ответы теста)
function renderBot(m, before) {
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.dataset.mid = m.id || '';
  div.innerHTML = m.text.replace(/\n/g, '<br>');
  logEl.insertBefore(div, before || null);
  if (m.kb) {
    const kb = document.createElement('div');
    kb.className = 'kb';
    kb.dataset.kbfor = m.id || '';
    kb.innerHTML = m.kb.map((row) => '<div class="row">' + row.map((b) => b.url
      ? (/^https?:/.test(b.url) && !b.url.includes(location.host)
        ? `<a class="btn ext" href="${esc(b.url)}" target="_blank" rel="noopener">${esc(b.text)}</a>`
        : `<a class="btn" href="${esc(b.url)}">${esc(b.text)}</a>`)
      : `<button class="btn" type="button" data-cb="${esc(b.callback_data)}" data-mid="${m.id || ''}">${esc(b.text)}</button>`).join('') + '</div>').join('');
    logEl.insertBefore(kb, before || null);
  }
}
function renderMe(text) {
  const div = document.createElement('div');
  div.className = 'msg me';
  div.textContent = text;
  logEl.appendChild(div);
}
function renderQuick(rows) {
  quickEl.innerHTML = (rows || []).flat().map((b) => b.request_contact
    ? '<button class="btn" type="button" data-phone>📱 Ввести номер</button>'
    : `<button class="btn" type="button" data-say="${esc(b.text)}">${esc(b.text)}</button>`).join('');
}

// «Telegram API» для движка: сообщения рисуются в окне чата
const api = {
  sendMessage(chatId, text, extra = {}) {
    if (String(chatId) === ADMIN) return sendLead(text);
    const mk = extra.reply_markup || {};
    queue = queue.then(async () => {
      const t = document.createElement('div');
      t.className = 'typing'; t.innerHTML = '<i></i><i></i><i></i>';
      logEl.appendChild(t); scroll();
      await sleep(Math.min(900, 250 + text.length * 2));
      t.remove();
      const m = { from: 'bot', id: ++msgSeq, text, kb: mk.inline_keyboard || null };
      history.push(m); renderBot(m);
      if (mk.keyboard) { renderQuick(mk.keyboard); history.push({ from: 'quick', rows: mk.keyboard }); }
      if (mk.remove_keyboard) { renderQuick(null); history.push({ from: 'quick', rows: null }); }
      save(); scroll();
    });
    return queue.then(() => ({ message_id: msgSeq }));
  },
  // заменить сообщение на месте — как editMessageText в Telegram
  editMessageText(chatId, id, text, extra = {}) {
    queue = queue.then(() => {
      const m = history.find((x) => x.from === 'bot' && x.id === id);
      if (!m) return;
      m.text = text;
      m.kb = (extra.reply_markup && extra.reply_markup.inline_keyboard) || null;
      const div = logEl.querySelector(`.msg.bot[data-mid="${id}"]`);
      const oldKb = logEl.querySelector(`.kb[data-kbfor="${id}"]`);
      if (div) {
        const after = (oldKb || div).nextSibling;
        if (oldKb) oldKb.remove();
        div.remove();
        renderBot(m, after);
      }
      save();
    });
    return queue;
  },
  async deleteMessage() {},
  async getChatMember() { return { status: 'member' }; },
};

// Заявка из «Сбора заявок» уходит Павлу тем же путём, что и форма сайта
async function sendLead(html) {
  const text = '🤖 Демо-бот на сайте (' + location.pathname + ')\n\n' +
    html.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  try {
    await fetch(LEAD_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
  } catch (e) { /* заявка в демо — не страшно, если не дошла */ }
  return { message_id: 0 };
}

// страница заявки того стиля сайта, где открыт чат
function formUrl() {
  const p = location.pathname;
  if (p.startsWith('/ai/')) return '/ai/form';
  if (p.includes('/creative/')) return 'brief.html';
  const f = window.DATA && window.DATA.pages && window.DATA.pages.form;
  return f && !/^https?:/.test(f) ? f : 'https://texspeckps.ru/ai/form';
}

function makeEngine() {
  cfg.FORM_URL = formUrl();
  const users = {
    has: () => Boolean(store(KEY_USER)),
    load: () => { users._u = users._u || store(KEY_USER) || { vars: {}, state: null }; return users._u; },
    save: (id, u) => { users._u = u; store(KEY_USER, u); },
  };
  return createEngine({ api, cfg, botUsername: 'Bot_PortfolioRabot', users, log: { error: () => {} } });
}

function build(into) {
  const host = document.createElement('div');
  host.id = 'pk-botchat';
  if (into) { host.className = 'inline'; host.style.cssText = 'display:block;height:100%;border-radius:inherit'; into.appendChild(host); }
  else document.body.appendChild(host);
  root = host.attachShadow({ mode: 'open' });
  const c = colors();
  root.innerHTML = `<style>:host{--acc:${c.acc};--acc-ink:${c.ink};--acc-text:${c.text};--acc-soft:${c.soft}}${CSS}</style>
    <section class="panel" role="dialog" aria-label="Демо-бот" hidden>
      <header class="hd"><span class="ava" aria-hidden="true">🤖</span>
        <span class="who"><b>Демо-бот Павла</b><span>отвечает сразу · паузы ускорены</span></span>
        <button class="ic" type="button" data-restart title="Начать сначала" aria-label="Начать сначала">↺</button>
        <button class="ic" type="button" data-close title="Закрыть" aria-label="Закрыть">✕</button></header>
      <div class="log" aria-live="polite"></div>
      <div class="quick"></div>
      <form class="ft"><input type="text" placeholder="Напишите сообщение…" aria-label="Сообщение" autocomplete="off" enterkeyhint="send">
        <button class="send" type="submit" aria-label="Отправить"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12.6 2-12.6 2z"/></svg></button></form>
      <p class="note">Это демо. Тот же бот в Telegram: <a href="${TG}" target="_blank" rel="noopener">@Bot_PortfolioRabot</a></p>
    </section>`;
  logEl = root.querySelector('.log');
  quickEl = root.querySelector('.quick');
  input = root.querySelector('input');
  engine = makeEngine();

  // история переписки — чтобы при переходе по страницам сайта чат не начинался заново
  try { history = JSON.parse(sessionStorage.getItem(KEY_LOG) || '[]'); } catch (e) { history = []; }
  msgSeq = history.reduce((n, m) => Math.max(n, m.id || 0), 0);
  for (const m of history) {
    if (m.from === 'bot') renderBot(m);
    else if (m.from === 'me') renderMe(m.text);
    else if (m.from === 'quick') renderQuick(m.rows);
  }

  root.addEventListener('click', (e) => {
    const t = e.target.closest('button, a');
    if (!t) return;
    if (t.hasAttribute('data-close')) return close();
    if (t.hasAttribute('data-restart')) return restart();
    if (t.hasAttribute('data-phone')) { input.placeholder = 'Номер, например 79001234567'; input.inputMode = 'tel'; input.focus(); return; }
    if (t.dataset.say) return say(t.dataset.say);
    if (t.dataset.cb) {
      t.classList.add("picked"); // как в Telegram: нажатие кнопки не превращается в сообщение, кнопка просто подсвечивается
      act = act.then(() => engine.onButton(CHAT, t.dataset.cb, Number(t.dataset.mid) || null)).catch(() => {});
    }
  });
  root.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    say(text);
  });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && opened) close(); });
}

function me(text) { history.push({ from: 'me', text }); renderMe(text); save(); scroll(); }
function run(cmd) { act = act.then(() => engine.onText(CHAT, cmd, {})).catch(() => {}); }
function say(text) {
  me(text);
  input.placeholder = 'Напишите сообщение…'; input.inputMode = 'text';
  act = act.then(() => engine.onText(CHAT, text, {})).catch(() => {});
}

// Встроить чат в блок страницы (страница «Демо-бот»): сразу запускается, ?start=<код> — сразу сценарий
function mount(el) {
  build(el);
  root.querySelector('.panel').hidden = false; opened = true;
  const code = new URLSearchParams(location.search).get('start');
  if (code) run('/start ' + code.replace(/[^a-z]/g, ''));
  else if (!history.length) act = act.then(() => engine.onText(CHAT, '/start', {})).catch(() => {});
  scroll();
}

function open(code) {
  if (!root) build();
  const panel = root.querySelector('.panel');
  panel.hidden = false; opened = true;
  if (code) run('/start ' + code);
  else if (!history.length) act = act.then(() => engine.onText(CHAT, '/start', {})).catch(() => {});
  scroll();
  if (matchMedia('(min-width: 561px)').matches) setTimeout(() => input.focus(), 50);
}
function close() { if (root && !root.host.classList.contains('inline')) { root.querySelector('.panel').hidden = true; opened = false; } }
function restart() {
  engine.stop();
  history = []; save(); store(KEY_USER, { vars: {}, state: null });
  logEl.innerHTML = ''; renderQuick(null);
  engine = makeEngine();
  queue = Promise.resolve();
  act = Promise.resolve().then(() => engine.onText(CHAT, '/start', {})).catch(() => {});
}

window.BotChat = { open, close };

// Любая ссылка/кнопка с data-botchat открывает чат на сайте вместо Telegram
document.addEventListener('click', (e) => {
  const a = e.target.closest && e.target.closest('[data-botchat]');
  if (!a || e.ctrlKey || e.metaKey || e.shiftKey) return;
  e.preventDefault();
  open(a.dataset.botchat || '');
  if (root && root.host.classList.contains('inline') && matchMedia('(max-width: 900px)').matches) root.host.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
// на странице «Демо-бот» чат встроен в блок #botchat-mount
function boot() {
  if (root) return;
  const spot = document.getElementById('botchat-mount');
  if (spot) mount(spot);
  else if (location.hash === '#botchat') open();
}
boot();
if (!root) document.addEventListener('DOMContentLoaded', boot);
