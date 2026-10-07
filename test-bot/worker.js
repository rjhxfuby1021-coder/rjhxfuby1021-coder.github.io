// Бот на Cloudflare Workers: Telegram присылает сообщения сюда (вебхук), компьютер не нужен.
//
// У каждого человека своё мини-хранилище (Durable Object «ChatDO»): переменные и отложенные сообщения.
// Паузы делает будильник хранилища (alarm) — переживают перезапуски.
//
// Адреса:
//   /setup — подключить бота к этому воркеру (открыть один раз в браузере после публикации)
//   /tg    — сюда стучится Telegram

import { createEngine, chatOf } from './engine.js';
import { createApi, COMMANDS } from './telegram.js';

const config = (env) => ({
  ADMIN_CHAT_ID: env.ADMIN_CHAT_ID || '',
  CHANNEL_ID: env.CHANNEL_ID || '',
  CHANNEL_LINK: env.CHANNEL_LINK || 'https://t.me/PavelTexSpec',
  CONTACT_LINK: env.CONTACT_LINK || 'https://t.me/PavelTexSpec',
  SITE: (env.SITE || 'https://texspeckps.ru').replace(/\/$/, ''),
});

// Пароль вебхука выводится из токена — отдельный секрет заводить не нужно
async function hookSecret(token) {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('webhook:' + token));
  return [...new Uint8Array(hash)].slice(0, 24).map((b) => b.toString(16).padStart(2, '0')).join('');
}

const chatStub = (env, chatId) => env.CHAT.get(env.CHAT.idFromName(String(chatId)));
const text = (body, status = 200) => new Response(body, { status, headers: { 'content-type': 'text/plain; charset=utf-8' } });

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (!env.BOT_TOKEN) return text('Не задан BOT_TOKEN: выполните «npx.cmd wrangler secret put BOT_TOKEN» в папке test-bot.', 500);

    if (url.pathname === '/setup') {
      const api = createApi(env.BOT_TOKEN);
      try {
        await api.call('setWebhook', {
          url: `${url.origin}/tg`,
          secret_token: await hookSecret(env.BOT_TOKEN),
          allowed_updates: ['message', 'callback_query'],
        });
        await api.call('setMyCommands', { commands: COMMANDS });
        const me = await api.call('getMe');
        return text(`✅ Готово: бот @${me.username} теперь работает на Cloudflare.\nОткройте https://t.me/${me.username} и нажмите /start.`);
      } catch (e) {
        return text('❌ Не получилось подключить бота: ' + e.message, 500);
      }
    }

    if (url.pathname === '/tg' && request.method === 'POST') {
      if (request.headers.get('X-Telegram-Bot-Api-Secret-Token') !== (await hookSecret(env.BOT_TOKEN))) return text('forbidden', 403);
      const update = await request.json();
      const chatId = chatOf(update);
      if (chatId != null) {
        // Отвечаем Telegram сразу, а сообщение обрабатывает хранилище этого человека
        ctx.waitUntil(
          chatStub(env, chatId)
            .fetch('https://chat/update', { method: 'POST', body: JSON.stringify({ chatId, update }) })
            .catch((e) => console.error('update', e.message)),
        );
      }
      return text('ok');
    }

    return text('Демо-бот texspeckps работает.');
  },
};

export class ChatDO {
  constructor(state, env) {
    this.storage = state.storage;
    this.env = env;
    this.user = null;
  }

  engine(chatId) {
    const st = this.storage;
    const env = this.env;
    const own = (id) => {
      if (String(id) !== String(chatId)) throw new Error(`Хранилище ${chatId} не отвечает за ${id}`);
    };

    const users = {
      has: async (id) => { own(id); return Boolean(this.user || (await st.get('user'))); },
      load: async (id) => {
        own(id);
        if (!this.user) this.user = (await st.get('user')) || { vars: {}, state: null, created: new Date().toISOString() };
        return this.user;
      },
      save: async (id, user) => { own(id); this.user = user; await st.put('user', user); },
    };

    const timers = {
      add: async (id, ms, job) => {
        own(id);
        const list = (await st.get('timers')) || [];
        list.push({ at: Date.now() + ms, job, gen: (await st.get('gen')) || 0 });
        await st.put('timers', list);
        await st.setAlarm(Math.min(...list.map((t) => t.at)));
      },
      cancel: async (id) => {
        own(id);
        await st.put('gen', ((await st.get('gen')) || 0) + 1);
        await st.delete('timers');
        await st.deleteAlarm();
      },
    };

    // Пригласивший живёт в своём хранилище — спрашиваем его
    const referral = async (refId) => {
      const res = await chatStub(env, refId).fetch('https://chat/referral', {
        method: 'POST',
        body: JSON.stringify({ chatId: refId }),
      });
      return (await res.json()).ok;
    };

    return createEngine({
      api: createApi(env.BOT_TOKEN),
      cfg: config(env),
      botUsername: env.BOT_USERNAME,
      users,
      timers,
      referral,
    });
  }

  async fetch(request) {
    const { pathname } = new URL(request.url);
    const body = await request.json();
    await this.storage.put('chatId', body.chatId);

    try {
      if (pathname === '/update') {
        await this.engine(body.chatId).onUpdate(body.update);
        return Response.json({ ok: true });
      }
      if (pathname === '/referral') {
        if (!(await this.storage.get('user'))) return Response.json({ ok: false });
        await this.engine(body.chatId).go(body.chatId, 'rf_friend_real');
        return Response.json({ ok: true });
      }
    } catch (e) {
      console.error(pathname, e.message);
      return Response.json({ ok: false, error: e.message }, { status: 500 });
    }
    return Response.json({ ok: false }, { status: 404 });
  }

  // Будильник: отправляем все отложенные сообщения, время которых пришло
  async alarm() {
    const st = this.storage;
    const chatId = await st.get('chatId');
    const list = (await st.get('timers')) || [];
    const now = Date.now() + 500;
    const due = list.filter((t) => t.at <= now).sort((a, b) => a.at - b.at);
    await st.put('timers', list.filter((t) => t.at > now));

    const engine = this.engine(chatId);
    for (const t of due) {
      if (t.gen !== ((await st.get('gen')) || 0)) continue; // цепочку остановили (главное меню, оплата…)
      await engine.fire(chatId, t.job).catch((e) => console.error('alarm', e.message));
    }

    const rest = (await st.get('timers')) || [];
    if (rest.length) await st.setAlarm(Math.min(...rest.map((t) => t.at)));
  }
}
