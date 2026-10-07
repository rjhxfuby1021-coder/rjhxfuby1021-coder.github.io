// Запуск бота в Telegram: node bot.js (или двойной щелчок по ЗАПУСК.bat).
// Настройки — в файле .env рядом (образец — .env.example).

const fs = require('fs');
const path = require('path');
const { createEngine } = require('./engine');
const { createStore } = require('./store');
const { createApi, COMMANDS } = require('./telegram');

function loadEnv(file) {
  const env = {};
  if (!fs.existsSync(file)) return env;
  for (const line of fs.readFileSync(file, 'utf8').replace(/^﻿/, '').split(/\r?\n/)) {
    const m = /^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/.exec(line);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return env;
}

const env = { ...loadEnv(path.join(__dirname, '.env')), ...process.env };
const cfg = {
  BOT_TOKEN: env.BOT_TOKEN || '',
  ADMIN_CHAT_ID: env.ADMIN_CHAT_ID || '',
  CHANNEL_ID: env.CHANNEL_ID || '',
  CHANNEL_LINK: env.CHANNEL_LINK || 'https://t.me/PavelTexSpec',
  CONTACT_LINK: env.CONTACT_LINK || 'https://t.me/PavelTexSpec',
  TAKE_OVER: env.TAKE_OVER === '1',
  SITE: (env.SITE || 'https://texspeckps.ru').replace(/\/$/, ''),
};

if (!/^\d+:[\w-]{30,}$/.test(cfg.BOT_TOKEN)) {
  console.error('\n❌ Не найден токен бота.\n   Откройте файл .env в папке test-bot и впишите BOT_TOKEN=... (токен даёт @BotFather).\n');
  process.exit(1);
}

const api = createApi(cfg.BOT_TOKEN);
const call = api.call;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const me = await call('getMe');

  // Бот подключён к Salebot (или к Cloudflare) — тогда Telegram не отдаёт сообщения сюда
  const hook = await call('getWebhookInfo');
  if (hook.url) {
    if (hook.url.includes('workers.dev')) {
      console.error(`\n❌ Бот @${me.username} уже работает на Cloudflare — запускать его на компьютере не нужно.\n`);
      process.exit(1);
    }
    if (!cfg.TAKE_OVER) {
      console.error(`\n❌ Бот @${me.username} сейчас подключён к другому сервису (например, к Salebot).`);
      console.error('   Чтобы забрать его сюда, впишите в .env строку TAKE_OVER=1. Salebot при этом перестанет отвечать в этом боте.\n');
      process.exit(1);
    }
    await call('deleteWebhook');
    console.log('⚠️  Бот был подключён к Salebot — отключил. Вернуть: Salebot → Каналы → Telegram → подключить токен заново.');
  }
  const store = createStore(path.join(__dirname, 'data.json'));
  const engine = createEngine({ api, store, cfg, botUsername: me.username });

  await call('setMyCommands', { commands: COMMANDS }).catch(() => {});

  console.log(`\n✅ Бот @${me.username} запущен. Откройте https://t.me/${me.username} и нажмите «Старт».`);
  console.log(`   Пользователей в базе: ${store.count()}. Заявки уходят: ${cfg.ADMIN_CHAT_ID || 'никуда (ADMIN_CHAT_ID не задан)'}`);
  console.log('   Чтобы остановить бота — закройте это окно или нажмите Ctrl+C.\n');

  let offset = 0;
  for (;;) {
    let updates;
    try {
      updates = await call('getUpdates', { offset, timeout: 30, allowed_updates: ['message', 'callback_query'] });
    } catch (e) {
      if (e.code === 409) {
        console.error('\n❌ Бота забрал другой сервис (Salebot или Cloudflare), или он запущен во втором окне. Останавливаюсь.\n');
        process.exit(1);
      }
      console.error('Нет связи с Telegram, пробую снова через 5 сек:', e.message);
      await sleep(5000);
      continue;
    }

    for (const u of updates) {
      offset = u.update_id + 1;
      await engine.onUpdate(u).catch((e) => console.error('Ошибка при ответе:', e.message));
    }
  }
}

main().catch((e) => {
  console.error('\n❌ Бот не запустился:', e.message);
  if (e.code === 401) console.error('   Токен неверный — скопируйте его заново из @BotFather.');
  if (e.message === 'fetch failed') console.error('   Нет связи с api.telegram.org. Проверьте интернет; если Telegram у провайдера заблокирован — включите VPN.');
  process.exit(1);
});
