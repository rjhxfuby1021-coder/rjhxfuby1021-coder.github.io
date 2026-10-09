// Вызовы Telegram Bot API — общие для компьютера (bot.js) и Cloudflare (worker.js)

function createApi(token) {
  async function call(method, params = {}) {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(params),
    });
    const json = await res.json();
    if (!json.ok) {
      const err = new Error(`${method}: ${json.description}`);
      err.code = json.error_code;
      throw err;
    }
    return json.result;
  }

  return {
    call,
    sendMessage: (chat_id, text, extra = {}) =>
      call('sendMessage', { chat_id, text, parse_mode: 'HTML', link_preview_options: { is_disabled: true }, ...extra }),
    deleteMessage: (chat_id, message_id) => call('deleteMessage', { chat_id, message_id }),
    sendAnimation: (chat_id, animation, extra = {}) => call('sendAnimation', { chat_id, animation, parse_mode: 'HTML', ...extra }),
    editMessageText: (chat_id, message_id, text, extra = {}) =>
      call('editMessageText', { chat_id, message_id, text, parse_mode: 'HTML', link_preview_options: { is_disabled: true }, ...extra })
        .catch((e) => { if (!/not modified/.test(e.message)) throw e; }),
    getChatMember: (chat_id, user_id) => call('getChatMember', { chat_id, user_id }),
    answerCallbackQuery: (callback_query_id) => call('answerCallbackQuery', { callback_query_id }),
  };
}

const COMMANDS = [
  { command: 'start', description: 'Начать сначала' },
  { command: 'menu', description: 'Главное меню' },
];

module.exports = { createApi, COMMANDS };
