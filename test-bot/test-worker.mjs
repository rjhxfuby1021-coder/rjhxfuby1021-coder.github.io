// Проверка Cloudflare-версии без публикации: node test-worker.mjs
// Подделывает хранилища Durable Object, будильники, время и Telegram.

import assert from 'node:assert';
import worker, { ChatDO } from './worker.js';

let now = Date.now();
Date.now = () => now;

const sent = [];
globalThis.fetch = async (url, init) => {
  const method = String(url).split('/').pop();
  const body = JSON.parse(init.body || '{}');
  if (method === 'sendMessage') sent.push({ chat: String(body.chat_id), text: body.text, markup: body.reply_markup });
  if (method === 'editMessageText') { const m = sent[body.message_id - 1]; if (m) { m.text = body.text; m.markup = body.reply_markup; } }
  return new Response(JSON.stringify({ ok: true, result: { message_id: sent.length, username: 'Bot_PortfolioRabot' } }));
};

class Storage {
  constructor() { this.map = new Map(); this.alarm = null; }
  async get(k) { return structuredClone(this.map.get(k)); }
  async put(k, v) { this.map.set(k, structuredClone(v)); }
  async delete(k) { this.map.delete(k); }
  async setAlarm(t) { this.alarm = t; }
  async deleteAlarm() { this.alarm = null; }
}

const objects = new Map();
const env = {
  BOT_TOKEN: '123:test', BOT_USERNAME: 'Bot_PortfolioRabot', ADMIN_CHAT_ID: '999',
  CHAT: {
    idFromName: (n) => n,
    get(id) {
      if (!objects.has(id)) {
        const storage = new Storage();
        objects.set(id, { storage, obj: new ChatDO({ storage }, env) });
      }
      const o = objects.get(id).obj;
      return { fetch: (url, init) => o.fetch(new Request(url, init)) };
    },
  },
};

const secret = await (async () => {
  const h = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('webhook:' + env.BOT_TOKEN));
  return [...new Uint8Array(h)].slice(0, 24).map((b) => b.toString(16).padStart(2, '0')).join('');
})();

let uid = 1;
async function send(update) {
  const waits = [];
  const res = await worker.fetch(
    new Request('https://bot.example/tg', { method: 'POST', body: JSON.stringify({ update_id: uid++, ...update }), headers: { 'X-Telegram-Bot-Api-Secret-Token': secret } }),
    env, { waitUntil: (p) => waits.push(p) },
  );
  assert.strictEqual(res.status, 200);
  await Promise.all(waits);
}
const msg = (chat, text) => send({ message: { chat: { id: chat, type: 'private' }, from: { id: chat, first_name: 'Тест' }, text } });
async function press(chat, label) {
  const m = [...sent].reverse().find((x) => x.chat === String(chat) && x.markup?.inline_keyboard?.flat().some((b) => b.text === label));
  assert(m, `нет кнопки «${label}»`);
  const b = m.markup.inline_keyboard.flat().find((x) => x.text === label);
  await send({ callback_query: { id: 'q', data: b.callback_data, message: { message_id: sent.indexOf(m) + 1, chat: { id: chat, type: 'private' } } } });
}
// Перемотать время и прозвонить будильник, если он должен был сработать
async function passSeconds(chat, sec) {
  now += sec * 1000;
  const o = objects.get(String(chat));
  if (o.storage.alarm && o.storage.alarm <= now) { o.storage.alarm = null; await o.obj.alarm(); }
}
const plain = (s) => String(s).replace(/<[^>]+>/g, '');
const lastText = (chat) => plain([...sent].reverse().find((m) => m.chat === String(chat)).text);
const recent = (chat) => sent.filter((m) => m.chat === String(chat)).slice(-3).map((m) => plain(m.text)).join('\n---\n');
const expect = (chat, s) => assert(recent(chat).includes(s), `ждал «${s}», а пришло:\n${recent(chat)}`);

const checks = {
  async 'Чужой запрос без пароля отклоняется'() {
    const res = await worker.fetch(new Request('https://bot.example/tg', { method: 'POST', body: '{}' }), env, { waitUntil() {} });
    assert.strictEqual(res.status, 403);
  },
  async 'Старт и меню'() {
    await msg(100, '/start'); expect(100, 'Здравствуйте, Тест!');
    await msg(100, '/menu'); expect(100, 'Выберите сценарий');
  },
  async 'Автовебинар: сноска сразу, сообщение — по будильнику через 5 сек, /menu останавливает'() {
    await press(100, '🎥 Автовебинар'); await press(100, 'Начать'); await press(100, 'Сегодня в 19:00'); await press(100, 'Товары');
    expect(100, 'В реальном боте это сообщение придёт через 30 минут после регистрации');
    await passSeconds(100, 3); expect(100, 'Записал: Товары');
    await passSeconds(100, 3); expect(100, 'мини-урок на 2 минуты');
    await passSeconds(100, 6); expect(100, 'Доброе утро, Тест!');
    await msg(100, '/menu');
    const n = sent.length;
    for (let i = 0; i < 6; i++) await passSeconds(100, 6);
    assert.strictEqual(sent.length, n, 'после меню цепочка должна остановиться');
  },
  async 'Тест: вопрос сворачивается в ответ (правка сообщения)'() {
    await msg(100, '📝 Тест с баллами'); await press(100, 'Начать'); await press(100, 'Начать тест');
    await press(100, 'В течение часа');
    assert(sent.some((m) => m.chat === '100' && m.text.includes('Вопрос 1: ваш ответ — В течение часа')));
  },
  async 'Онлайн-запись: шаги меняют одно сообщение'() {
    await msg(100, '📅 Онлайн-запись'); await press(100, 'Начать');
    const n = sent.length;
    await press(100, '📅 Записаться'); await press(100, 'Юг — ул. Лесная, 3 · 10:00–21:00'); await press(100, '💆 Массаж');
    assert.strictEqual(sent.length, n, 'новых сообщений быть не должно — только правки');
    expect(100, 'Студия: Юг → Массаж');
  },
  async 'Хочу такого бота → заявка Павлу'() {
    await msg(100, '/start want'); await press(100, 'Оставить заявку здесь');
    await msg(100, 'Нужна запись для салона'); await msg(100, '+79001234567');
    expect(100, 'Заявка у Павла');
    assert(lastText('999').includes('Нужна запись для салона'));
  },
  async 'Рефералка между разными людьми'() {
    await msg(200, '/start ref_100'); expect(200, 'Здравствуйте'); expect(100, 'По вашей ссылке пришёл новый друг');
    await msg(300, '/start ref_555'); expect(300, 'Здравствуйте');
  },
};

let failed = 0;
for (const [name, fn] of Object.entries(checks)) {
  try { await fn(); console.log('✅', name); } catch (e) { failed++; console.log('❌', name, '\n  ', e.message); }
}
console.log(failed ? `\nНе прошло: ${failed}` : '\nCloudflare-версия работает.');
process.exit(failed ? 1 : 0);
