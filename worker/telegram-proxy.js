/*
  Прослойка между формой заявки на сайте и Telegram-ботом (Cloudflare Worker).
  Токен бота хранится в секрете воркера (BOT_TOKEN) и не попадает в код страницы.
  Принимает только POST с сайта texspeckps.ru, только текст заявки, с ограничением длины.

  Секреты (задаются командой `npx wrangler secret put <ИМЯ>`):
    BOT_TOKEN — токен бота от @BotFather
    CHAT_ID   — куда присылать заявки (id чата Павла)
*/
const ALLOWED = ['https://texspeckps.ru', 'http://texspeckps.ru', 'https://www.texspeckps.ru', 'http://www.texspeckps.ru'];

function cors(origin) {
  return {
    'Access-Control-Allow-Origin': ALLOWED.includes(origin) ? origin : ALLOWED[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin'
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });
    if (request.method !== 'POST' || !ALLOWED.includes(origin)) {
      return new Response('Forbidden', { status: 403, headers: cors(origin) });
    }

    let text = '';
    try { text = String((await request.json()).text || '').trim(); } catch (e) { /* пусто — ниже вернём 400 */ }
    if (!text || text.length > 3500) {
      return Response.json({ ok: false, error: 'bad request' }, { status: 400, headers: cors(origin) });
    }

    const ip = request.headers.get('CF-Connecting-IP') || '—';
    const tg = await fetch('https://api.telegram.org/bot' + env.BOT_TOKEN + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: env.CHAT_ID, text: text + '\n\nIP: ' + ip })
    });
    const ok = tg.ok && (await tg.json()).ok;
    return Response.json({ ok }, { status: ok ? 200 : 502, headers: cors(origin) });
  }
};
