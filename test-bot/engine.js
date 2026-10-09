// Движок: ведёт человека по блокам из scenarios.js, хранит переменные, ставит и снимает отложенные сообщения.
// С Telegram напрямую не работает — получает готовый api. Где хранить людей и паузы, решает тот, кто запускает:
//   bot.js (компьютер)  — файл data.json и таймеры в памяти;
//   worker.js (Cloudflare) — хранилище Durable Object и будильники (alarm);
//   web/widget.js (сайт) — localStorage и таймеры в памяти;
//   test.js — всё в памяти.

const scenarios = require('./scenarios');

// Коды для ссылок t.me/бот?start=<код> и bot.html?start=<код> — открывают сценарий сразу
const SCENARIO_LINKS = {
  webinar: 'web_intro', channel: 'ch_intro', leadmagnet: 'lm_intro', quiz: 'quiz_intro',
  wheel: 'wh_intro', booking: 'bk_intro', leads: 'ld_intro', referral: 'rf_intro', menu: 'menu', want: 'want',
};

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Паузы в памяти — для запуска на компьютере, на сайте и для проверки
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
      cfg,
      refLink: `https://t.me/${botUsername}?start=ref_${chatId}`,
      isSubscribed: async () => {
        if (!cfg.CHANNEL_ID) return true; // канал для проверки не задан — пропускаем с пометкой в тексте
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

  // #{переменная} → значение. Если имени нет (чат на сайте), обращение выпадает:
  // «Здравствуйте, #{name}!» → «Здравствуйте!», «#{name}, привет!» → «Привет!», в карточках — «Гость»
  const fill = (text, v) => {
    let s = String(text);
    if (!v.name) {
      s = s.replace(/,\s*#\{name\}(?=[!?.])/g, '')
        .replace(/(^|\n)#\{name\},\s*(\S)/g, (m, start, c) => start + c.toUpperCase());
    }
    return s.replace(/#\{(\w+)\}/g, (_, k) => esc(k === 'name' && !v.name ? 'Гость' : v[k]));
  };
  const getButtons = (b, v, ctx) => (typeof b.buttons === 'function' ? b.buttons(v, ctx) : b.buttons) || null;

  function markup(id, b, v, ctx) {
    if (b.reply) {
      return {
        keyboard: b.reply.map((row) => row.map((x) => (x.contact ? { text: x.text, request_contact: true } : { text: fill(x.text, v) }))),
        resize_keyboard: true,
      };
    }
    const rows = getButtons(b, v, ctx);
    if (!rows) return undefined;
    return {
      inline_keyboard: rows.map((row, r) =>
        row.map((x, c) => (x.url
          ? { text: fill(x.text, v), url: typeof x.url === 'function' ? x.url(v, ctx) : x.url }
          : { text: fill(x.text, v), callback_data: `${id}:${r}:${c}` }))),
    };
  }

  // opts.editId — заменить сообщение с кнопкой, а не присылать новое (пошаговые меню в одном сообщении)
  async function go(chatId, id, hops = 0, opts = {}) {
    const b = blocks[id];
    if (!b) throw new Error(`Нет блока «${id}»`);
    if (hops > 12) throw new Error(`Блоки зациклились на «${id}»`);
    const user = await users.load(chatId);
    const v = user.vars;
    const ctx = context(chatId);

    if (b.cancel) { await timers.cancel(chatId); user.pending = {}; }
    if (b.set) b.set(v, ctx);
    user.state = id;
    user.wait = b.wait ? { ...b.wait } : null;
    // Обычную клавиатуру («Отправить номер») убираем, когда она больше не нужна
    const removeKb = !b.route && user.replyKb && !b.reply;
    if (removeKb) user.replyKb = false;
    if (b.reply) user.replyKb = true;
    await users.save(chatId, user);

    if (b.route) return go(chatId, await b.route(v, ctx), hops + 1, opts);

    if (removeKb) {
      const tmp = await api.sendMessage(chatId, '…', { reply_markup: { remove_keyboard: true } });
      await api.deleteMessage(chatId, tmp.message_id).catch(() => {});
    }

    const text = fill(typeof b.text === 'function' ? b.text(v, ctx) : b.text, v);
    const mk = markup(id, b, v, ctx);
    if (opts.editId && b.inplace && !b.reply && api.editMessageText) {
      await api.editMessageText(chatId, opts.editId, text, { reply_markup: mk }).catch(async () => {
        await api.sendMessage(chatId, text, { reply_markup: mk });
      });
    } else if (b.animation && api.sendAnimation) {
      const src = typeof b.animation === 'function' ? b.animation(v, ctx) : b.animation;
      await api.sendAnimation(chatId, src, { caption: text, reply_markup: mk }).catch(async (e) => {
        log.error('Гифка не отправилась:', e.message);
        await api.sendMessage(chatId, text, { reply_markup: mk });
      });
    } else {
      await api.sendMessage(chatId, text, { reply_markup: mk });
    }

    // уведомление владельцу бота (по-настоящему — только заявка из «Хочу такого бота»)
    if (b.notify && cfg.ADMIN_CHAT_ID) {
      await api.sendMessage(cfg.ADMIN_CHAT_ID, fill(b.notify(v, ctx), v))
        .catch((e) => log.error('Уведомление не дошло (проверьте ADMIN_CHAT_ID):', e.message));
    }

    // сразу следом — ещё одно сообщение (например, «так это видит менеджер»)
    if (b.then) await go(chatId, b.then, hops + 1);

    // отложенные сообщения: сразу — серая сноска «в реальном боте придёт …», через паузу — само сообщение
    const next = b.next || [];
    for (let i = 0; i < next.length; i++) {
      const n = next[i];
      if (!n.real) { await timers.add(chatId, n.after * 1000, { block: id, idx: i }); continue; }
      // у сообщения есть свои кнопки — ждём человека, иначе следующее придёт само
      const tap = n.tap ?? Boolean(mk && mk.inline_keyboard);
      const key = `${id}:${i}:${Math.random().toString(36).slice(2, 6)}`;
      const note = `<i>⏳ В реальном боте следующее сообщение придёт ${n.real}.</i>`;
      const sentNote = await api.sendMessage(chatId, note, {
        reply_markup: { inline_keyboard: [[{ text: tap ? '⏩ Показать следующее сообщение' : '⏩ Не ждать', callback_data: '__n:' + key }]] },
      });
      user.pending = user.pending || {};
      user.pending[key] = { mid: sentNote && sentNote.message_id, text: note };
      await users.save(chatId, user);
      if (!tap) await timers.add(chatId, n.after * 1000, { block: id, idx: i, key });
    }

  }

  // Сработала пауза: job = { block, idx } — какое отложенное сообщение какого блока
  async function fire(chatId, job) {
    const n = blocks[job.block]?.next?.[job.idx];
    if (!n) return;
    const user = await users.load(chatId);
    if (job.key) {
      const p = user.pending && user.pending[job.key];
      if (!p) return; // уже показали по кнопке или цепочку остановили
      delete user.pending[job.key];
      await users.save(chatId, user);
      if (p.mid && api.editMessageText) await api.editMessageText(chatId, p.mid, p.text, {}).catch(() => {});
    }
    if (n.unless && n.unless(user.vars)) return;
    await go(chatId, n.go);
  }

  async function onStart(chatId, payload, from) {
    const isNew = !(await users.has(chatId));
    const user = await users.load(chatId);
    user.name = [from.first_name, from.last_name].filter(Boolean).join(' ');
    user.username = from.username || '';
    user.vars.name = from.first_name || user.vars.name || '';
    user.vars.username = from.username || '';
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

  // Ввод текстом: телефон, произвольный ответ, контакт
  async function onInput(chatId, user, text, from) {
    const w = user.wait;
    const v = user.vars;
    if (w.skip && text === w.skip) return go(chatId, w.go);
    if (w.kind === 'phone') {
      let digits = String(text).replace(/\D/g, '');
      if (digits.length === 10 && digits[0] === '9') digits = '7' + digits;
      if (digits.length === 11 && digits[0] === '8') digits = '7' + digits.slice(1);
      if (!(digits.length === 11 && digits[0] === '7')) {
        if (w.bad) return go(chatId, w.bad);
        return api.sendMessage(chatId, 'Кажется, это не номер телефона 🤔 Напишите 11 цифр, например 79001234567, или нажмите кнопку «Отправить номер».');
      }
      v[w.key] = '+' + digits;
    } else if (w.kind === 'photo') {
      return api.sendMessage(chatId, 'Пришлите фото помещения или нажмите кнопку под сообщением выше 👆');
    } else {
      v[w.key] = String(text).slice(0, 1000);
    }
    await users.save(chatId, user);
    return go(chatId, w.go);
  }

  async function onText(chatId, text, from = {}) {
    const t = text.trim();
    if (/^\/start(\s|$)/.test(t)) return onStart(chatId, t.split(/\s+/)[1], from);
    if (t === '/myid') return api.sendMessage(chatId, `Ваш chat id: <code>${chatId}</code>`);

    const target = triggers[t.toLowerCase()];
    if (target) return go(chatId, target);

    const user = await users.load(chatId);
    if (user.wait) return onInput(chatId, user, t, from);

    return api.sendMessage(chatId, 'Я отвечаю на кнопки 🙂 Нажмите любую кнопку выше или напишите /menu.');
  }

  async function onContact(chatId, contact, from = {}) {
    const user = await users.load(chatId);
    if (!user.wait || !['phone', 'text'].includes(user.wait.kind)) return;
    return onInput(chatId, user, contact.phone_number, from);
  }

  async function onPhoto(chatId) {
    const user = await users.load(chatId);
    if (!user.wait || user.wait.kind !== 'photo') return api.sendMessage(chatId, 'Фото сейчас не нужно 🙂 Нажмите кнопку выше или напишите /menu.');
    user.vars[user.wait.key] = (Number(user.vars[user.wait.key]) || 0) + 1;
    await users.save(chatId, user);
    return api.sendMessage(chatId, `📷 Фото получено (${user.vars[user.wait.key]}). Можно прислать ещё или нажать «Готово, фото отправлены».`);
  }

  async function onButton(chatId, data, msgId) {
    // «⏩ Показать следующее сообщение» / «⏩ Не ждать»
    if (String(data).startsWith('__n:')) {
      const key = String(data).slice(4);
      const [block, idx] = key.split(':');
      const user = await users.load(chatId);
      if (!user.pending || !user.pending[key]) {
        if (msgId && api.editMessageText) await api.editMessageText(chatId, msgId, '<i>⏳ Эта цепочка уже завершена.</i>', {}).catch(() => {});
        return;
      }
      return fire(chatId, { block, idx: Number(idx), key });
    }
    const [id, r, c] = String(data).split(':');
    const src = blocks[id];
    if (!src) return;
    const user = await users.load(chatId);
    const v = user.vars;
    const ctx = context(chatId);
    const btn = getButtons(src, v, ctx)?.[r]?.[c];
    if (!btn) return;

    v.answer = btn.text;
    if (btn.set) btn.set(v, ctx);
    await users.save(chatId, user);

    // ответ на вопрос: вопрос превращается в «Вопрос N: ваш ответ — …», чтобы чат не разрастался
    if (src.answered && !btn.keep && msgId && api.editMessageText) {
      await api.editMessageText(chatId, msgId, fill(src.answered, v), {}).catch(() => {});
    }
    // кнопка-подсказка: короткий ответ без перехода
    if (btn.say) await api.sendMessage(chatId, fill(typeof btn.say === 'function' ? btn.say(v, ctx) : btn.say, v));
    if (btn.go) return go(chatId, btn.go, 0, { editId: src.inplace && !btn.fresh ? msgId : null });
  }

  // Одно обновление от Telegram (getUpdates или вебхук)
  async function onUpdate(u) {
    if (u.callback_query) {
      const q = u.callback_query;
      if (api.answerCallbackQuery) await api.answerCallbackQuery(q.id).catch(() => {});
      if (q.message) await onButton(q.message.chat.id, q.data, q.message.message_id);
    } else if (u.message && u.message.chat.type === 'private') {
      const m = u.message;
      if (m.contact) await onContact(m.chat.id, m.contact, m.from);
      else if (m.photo) await onPhoto(m.chat.id);
      else if (m.text) await onText(m.chat.id, m.text, m.from);
    }
  }

  return {
    go, fire, onText, onContact, onPhoto, onButton, onUpdate, blocks,
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
