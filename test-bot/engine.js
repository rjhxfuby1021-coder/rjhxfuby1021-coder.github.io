// Движок: ведёт человека по блокам из scenarios.js, хранит переменные, ставит и снимает отложенные сообщения.
// С Telegram напрямую не работает — получает готовый api. Где хранить людей и паузы, решает тот, кто запускает:
//   bot.js (компьютер)  — файл data.json и таймеры в памяти;
//   worker.js (Cloudflare) — хранилище Durable Object и будильники (alarm);
//   test.js — всё в памяти.

const scenarios = require('./scenarios');

// Коды для ссылок t.me/бот?start=<код> — по ним сайт открывает бота сразу в нужном сценарии
const SCENARIO_LINKS = {
  webinar: 'web_start', channel: 'ch_start', leadmagnet: 'lm_start', quiz: 'quiz_start',
  wheel: 'wh_start', booking: 'bk_start', leads: 'ld_start', referral: 'rf_start', menu: 'menu',
};

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Паузы в памяти — для запуска на компьютере и для проверки
function memoryTimers(delayScale, log) {
  const all = new Map(); // chatId → Set(таймеров)
  return {
    fire: null, // движок подставит сам
    add(chatId, ms, job) {
      if (!all.has(chatId)) all.set(chatId, new Set());
      const set = all.get(chatId);
      const t = setTimeout(() => {
        set.delete(t);
        this.fire(chatId, job).catch((e) => log.error('Отложенное сообщение не ушло:', e.message));
      }, ms * delayScale);
      set.add(t);
    },
    cancel(chatId) {
      const set = all.get(chatId);
      if (set) { set.forEach(clearTimeout); set.clear(); }
    },
    stopAll() { for (const id of all.keys()) this.cancel(id); },
  };
}

function createEngine({ api, cfg, botUsername, store, users, timers, referral, delayScale = 1, log = console }) {
  const { blocks, triggers } = scenarios(cfg);

  // users: { has(id), load(id), save(id, user) } — можно асинхронно
  users = users || {
    has: (id) => store.has(id),
    load: (id) => store.user(id),
    save: () => store.save(),
  };
  // timers: { add(chatId, ms, job), cancel(chatId) }
  timers = timers || memoryTimers(delayScale, log);
  if ('fire' in timers) timers.fire = fire;
  // referral(id пригласившего) → true, если такой человек есть и ему отправлено уведомление
  referral = referral || (async (refId) => {
    if (!(await users.has(refId))) return false;
    await go(refId, 'rf_friend_real');
    return true;
  });

  function context(chatId) {
    return {
      chatId,
      refLink: `https://t.me/${botUsername}?start=ref_${chatId}`,
      isSubscribed: async () => {
        if (!cfg.CHANNEL_ID) return true; // канал для проверки не задан — пропускаем, как в демо Salebot
        try {
          const m = await api.getChatMember(cfg.CHANNEL_ID, chatId);
          return ['creator', 'administrator', 'member', 'restricted'].includes(m.status);
        } catch (e) {
          log.error('Не получилось проверить подписку (бот должен быть админом канала):', e.message);
          return true;
        }
      },
    };
  }

  const fill = (text, v) => text.replace(/#\{(\w+)\}/g, (_, k) => esc(v[k]));

  function markup(id, b) {
    if (b.reply) {
      return {
        keyboard: b.reply.map((row) => row.map((x) => (x.contact ? { text: x.text, request_contact: true } : { text: x.text }))),
        resize_keyboard: true,
      };
    }
    if (!b.buttons) return undefined;
    return {
      inline_keyboard: b.buttons.map((row, r) =>
        row.map((x, c) => (x.url ? { text: x.text, url: x.url } : { text: x.text, callback_data: `${id}:${r}:${c}` }))),
    };
  }

  async function go(chatId, id, hops = 0) {
    const b = blocks[id];
    if (!b) throw new Error(`Нет блока «${id}»`);
    if (hops > 10) throw new Error(`Блоки зациклились на «${id}»`);
    const user = await users.load(chatId);
    const v = user.vars;
    const ctx = context(chatId);

    if (b.cancel) await timers.cancel(chatId);
    if (b.set) b.set(v, ctx);
    user.state = id;
    user.wait = b.wait || null;
    // Обычную клавиатуру («Отправить номер») убираем, когда она больше не нужна
    const removeKb = !b.route && user.replyKb && !b.reply;
    if (removeKb) user.replyKb = false;
    if (b.reply) user.replyKb = true;
    await users.save(chatId, user);

    if (b.route) return go(chatId, await b.route(v, ctx), hops + 1);

    if (removeKb) {
      const tmp = await api.sendMessage(chatId, '…', { reply_markup: { remove_keyboard: true } });
      await api.deleteMessage(chatId, tmp.message_id).catch(() => {});
    }

    let text = typeof b.text === 'function' ? b.text(v, ctx) : b.text;
    // предупреждаем, что следующее сообщение придёт само — чтобы человек не жал всё подряд
    for (const n of b.next || []) {
      if (n.hint) text += `\n\n⏳ <i>${n.hint}</i>`;
      else if (n.real) text += `\n\n⏳ <i>Следующее сообщение придёт само через ${n.after} сек (в рабочем боте — ${n.real}). Можно ничего не нажимать.</i>`;
    }
    await api.sendMessage(chatId, fill(text, v), { reply_markup: markup(id, b) });

    const next = b.next || [];
    for (let i = 0; i < next.length; i++) await timers.add(chatId, next[i].after * 1000, { block: id, idx: i });
  }

  // Сработала пауза: job = { block, idx } — какое отложенное сообщение какого блока
  async function fire(chatId, job) {
    const n = blocks[job.block]?.next?.[job.idx];
    if (!n) return;
    const user = await users.load(chatId);
    if (n.unless && n.unless(user.vars)) return;
    await go(chatId, n.go);
  }

  async function onStart(chatId, payload, from) {
    const isNew = !(await users.has(chatId));
    const user = await users.load(chatId);
    user.name = [from.first_name, from.last_name].filter(Boolean).join(' ');
    user.username = from.username || '';
    await users.save(chatId, user);

    // Реферальная ссылка: t.me/бот?start=ref_<id пригласившего>
    const m = /^ref_(-?\d+)$/.exec(payload || '');
    if (isNew && m && m[1] !== String(chatId)) {
      const ok = await referral(m[1]).catch((e) => { log.error('Не удалось уведомить пригласившего:', e.message); return false; });
      if (ok) { user.invitedBy = m[1]; await users.save(chatId, user); }
    }
    // Ссылка с сайта сразу на сценарий: t.me/бот?start=webinar
    if (SCENARIO_LINKS[payload]) return go(chatId, SCENARIO_LINKS[payload]);
    return go(chatId, 'start');
  }

  async function onText(chatId, text, from = {}) {
    const t = text.trim();
    if (/^\/start(\s|$)/.test(t)) return onStart(chatId, t.split(/\s+/)[1], from);
    if (t === '/myid') return api.sendMessage(chatId, `Ваш chat id: <code>${chatId}</code>`);

    const target = triggers[t.toLowerCase()];
    if (target) return go(chatId, target);

    if ((await users.load(chatId)).wait === 'phone') return onPhone(chatId, t, from);

    return api.sendMessage(chatId, 'Я отвечаю на кнопки 🙂 Нажмите любую кнопку выше или напишите «меню».');
  }

  async function onPhone(chatId, raw, from = {}) {
    let digits = String(raw).replace(/\D/g, '');
    if (digits.length === 10 && digits[0] === '9') digits = '7' + digits;
    if (digits.length === 11 && digits[0] === '8') digits = '7' + digits.slice(1);
    if (!(digits.length === 11 && digits[0] === '7')) return go(chatId, 'ld_bad');

    const user = await users.load(chatId);
    user.vars.phone = '+' + digits;
    await users.save(chatId, user);

    if (cfg.ADMIN_CHAT_ID) {
      const v = user.vars;
      const who = [esc(user.name || from.first_name || ''), from.username ? '@' + esc(from.username) : ''].filter(Boolean).join(' ');
      await api.sendMessage(cfg.ADMIN_CHAT_ID,
        '📝 <b>Новая заявка из демо-бота</b>\n\n' +
        `👤 ${who || 'без имени'}\n` +
        `📌 Интересует: ${esc(v.need)}\n` +
        `💰 Бюджет: ${esc(v.budget)}\n` +
        `📱 Телефон: ${esc(v.phone)}`,
      ).catch((e) => log.error('Заявка не дошла до менеджера (проверьте ADMIN_CHAT_ID):', e.message));
    }
    return go(chatId, 'ld_done');
  }

  async function onContact(chatId, contact, from = {}) {
    if ((await users.load(chatId)).wait !== 'phone') return;
    return onPhone(chatId, contact.phone_number, from);
  }

  async function onButton(chatId, data) {
    const [id, r, c] = String(data).split(':');
    const btn = blocks[id]?.buttons?.[r]?.[c];
    if (!btn || !btn.go) return;
    if (btn.set) {
      const user = await users.load(chatId);
      btn.set(user.vars);
      await users.save(chatId, user);
    }
    return go(chatId, btn.go);
  }

  // Одно обновление от Telegram (getUpdates или вебхук)
  async function onUpdate(u) {
    if (u.callback_query) {
      const q = u.callback_query;
      if (api.answerCallbackQuery) await api.answerCallbackQuery(q.id).catch(() => {});
      if (q.message) await onButton(q.message.chat.id, q.data);
    } else if (u.message && u.message.chat.type === 'private') {
      const m = u.message;
      if (m.contact) await onContact(m.chat.id, m.contact, m.from);
      else if (m.text) await onText(m.chat.id, m.text, m.from);
    }
  }

  return {
    go, fire, onText, onContact, onButton, onUpdate, blocks,
    stop: () => timers.stopAll && timers.stopAll(),
  };
}

// id чата, к которому относится обновление (или null — не наше)
function chatOf(u) {
  if (u.callback_query) return u.callback_query.message?.chat.id ?? null;
  if (u.message && u.message.chat.type === 'private') return u.message.chat.id;
  return null;
}

module.exports = { createEngine, chatOf, SCENARIO_LINKS };
