// Проверка без Telegram: node test.js
// Прогоняет все сценарии на поддельном Telegram, паузы ускорены в 1000 раз.

const assert = require('assert');
const { createEngine } = require('./engine');
const { createStore } = require('./store');

const sent = []; // { chat, text, markup }
let msgId = 0;
const api = {
  async sendMessage(chat, text, extra = {}) { sent.push({ chat: String(chat), text, markup: extra.reply_markup }); return { message_id: ++msgId }; },
  async deleteMessage() {},
  async getChatMember() { return { status: 'member' }; },
};
const cfg = { CONTACT_LINK: 'https://t.me/x', CHANNEL_LINK: 'https://t.me/y', SITE: 'https://texspeckps.ru', ADMIN_CHAT_ID: '999' };
const store = createStore(null);
const engine = createEngine({ api, store, cfg, botUsername: 'demo_bot', delayScale: 0.001, log: { error: (...a) => { throw new Error(a.join(' ')); } } });

const ME = '100';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const last = (chat = ME) => [...sent].reverse().find((m) => m.chat === chat);
const lastText = (chat) => last(chat).text;

async function press(label, chat = ME) {
  for (let i = sent.length - 1; i >= 0; i--) {
    const m = sent[i];
    if (m.chat !== chat || !m.markup?.inline_keyboard) continue;
    const btn = m.markup.inline_keyboard.flat().find((b) => b.text === label);
    if (btn) { assert(btn.callback_data, `«${label}» — ссылка, а не кнопка`); return engine.onButton(chat, btn.callback_data); }
  }
  throw new Error(`Не нашёл кнопку «${label}». Последнее сообщение: ${lastText(chat)}`);
}

async function until(fragment, chat) {
  for (let i = 0; i < 100 && !lastText(chat).includes(fragment); i++) await wait(5);
  expect(fragment, chat);
}

function expect(fragment, chat) {
  assert(lastText(chat).includes(fragment), `Ждал «${fragment}», а бот написал:\n${lastText(chat)}`);
}

const checks = {
  async 'Приветствие и меню'() {
    await engine.onText(ME, '/start', { first_name: 'Павел' });
    expect('Привет! Я — ассистент');
    assert.strictEqual(last().markup.inline_keyboard.flat().length, 8);
    await engine.onText(ME, 'Меню');
    expect('Главное меню');
  },
  async 'Автовебинар: напоминания, эфир, продажа, оплата'() {
    await press('🎥 Автовебинар'); await press('✅ Зарегистрироваться'); expect('Вы зарегистрированы');
    await until('Доброе утро');
    await until('Через час начинаем');
    await press('🔴 Войти в эфир'); expect('Вы в эфире');
    await until('Предложение только для участников');
    assert(!sent.some((m) => m.text.includes('Мы уже начали')), 'не должно быть «не пришёл» — человек зашёл');
    await until('уже в записи');
    await press('💳 Оплатить (демо)'); expect('Оплата прошла');
    const n = sent.length; await wait(40);
    assert.strictEqual(sent.length, n, 'после оплаты дожим должен остановиться');
  },
  async 'Автовебинар: не пришёл на эфир'() {
    await engine.onText(ME, '🎥 Автовебинар'); await press('✅ Зарегистрироваться');
    await until('Мы уже начали');
    await engine.onText(ME, '🏠 Главное меню');
    const n = sent.length; await wait(40);
    assert.strictEqual(sent.length, n, 'главное меню должно остановить цепочку');
  },
  async 'Закрытый канал'() {
    await engine.onText(ME, '🔐 Закрытый канал'); await press('💳 Оформить подписку');
    await press('3 месяца — 2 490 ₽'); await press('✅ Оплатить (демо)'); expect('Тариф: 3 месяца');
    await until('через 3 дня');
    await until('последний день');
    await until('Подписка закончилась');
  },
  async 'Лид-магнит'() {
    await engine.onText(ME, '🎁 Лид-магнит'); await press('📥 Получить гайд'); await press('✅ Я подписался');
    expect('Держите гайд');
    await until('Удалось посмотреть');
    await until('Павел соберёт');
  },
  async 'Тест с баллами: 0, 4 и 8 баллов'() {
    for (const [answers, score, verdict] of [
      [['До 5', 'Сам, вручную', 'Не знаю', 'Пока изучаю'], 0, 'Старт.'],
      [['5–20', 'Есть менеджер', 'Долго отвечаем', 'В этом месяце'], 4, 'Пора автоматизировать'],
      [['Больше 20', 'Уже есть бот', 'Не доходят до оплаты', 'Нужно вчера 🙂'], 8, 'теряете деньги'],
    ]) {
      await engine.onText(ME, '🧮 Тест с баллами'); await press('▶️ Начать тест');
      for (const a of answers) await press(a);
      expect('Считаю баллы');
      await until(`${score} из 8`); expect(verdict);
    }
  },
  async 'Колесо фортуны'() {
    await engine.onText(ME, '🎡 Колесо фортуны'); await press('🎡 Крутить колесо'); expect('крутится');
    for (let i = 0; i < 30 && !lastText().includes('Попытки закончились'); i++) {
      for (let k = 0; k < 100 && lastText().includes('крутится'); k++) await wait(5);
      assert(/Вы выиграли|ещё одна попытка/.test(lastText()), lastText());
      await press('🎡 Крутить ещё');
    }
    expect('Попытки закончились');
  },
  async 'Онлайн-запись: перенос и отмена'() {
    await engine.onText(ME, '📅 Онлайн-запись'); await press('✍️ Записаться');
    await press('✂️ Стрижка'); await press('Завтра'); await press('14:00');
    expect('Услуга: ✂️ Стрижка'); expect('Время: 14:00');
    await until('Напоминаю: Завтра в 14:00');
    await press('🔁 Перенести'); await press('Послезавтра'); await press('18:00'); expect('День: Послезавтра');
    await until('Напоминаю: Послезавтра'); await press('✅ Приду'); expect('ждём вас');
    await until('Через 2 часа');
    await engine.onText(ME, '📅 Онлайн-запись'); await press('✍️ Записаться');
    await press('💅 Маникюр'); await press('Завтра'); await press('10:00'); await press('❌ Отменить запись');
    const n = sent.length; await wait(40);
    assert.strictEqual(sent.length, n, 'после отмены напоминаний быть не должно');
  },
  async 'Сбор заявок: неверный и верный номер, заявка менеджеру'() {
    await engine.onText(ME, '📝 Сбор заявок'); await press('🚀 Оставить заявку');
    await press('Чат-бот'); await press('от 50 000 ₽');
    assert(last().markup.keyboard, 'нужна кнопка «Отправить номер»');
    await engine.onText(ME, 'позвоните мне'); expect('не номер телефона');
    await engine.onText(ME, '8 (900) 123-45-67'); expect('Заявка принята'); expect('Бюджет: от 50 000 ₽');
    const admin = last('999').text;
    assert(admin.includes('+79001234567') && admin.includes('Чат-бот'), admin);
    await engine.onText(ME, '79001234567'); expect('Я отвечаю на кнопки');
  },
  async 'Ссылка с сайта открывает сценарий сразу'() {
    await engine.onText('300', '/start quiz', { first_name: 'Гость' }); expect('Тест с подсчётом баллов', '300');
    await engine.onText('301', '/start webinar', {}); expect('Сценарий «Автовебинар»', '301');
    await engine.onText('302', '/start nonsense', {}); expect('Привет! Я — ассистент', '302');
  },
  async 'Реферальная программа: симуляция и настоящий друг'() {
    await engine.onText(ME, '🤝 Реферальная программа'); await press('🔗 Моя ссылка');
    expect('https://t.me/demo_bot?start=ref_100');
    await press('➕ Симулировать приход друга'); expect('Всего друзей: 1');
    await engine.onText('200', '/start ref_100', { first_name: 'Друг' });
    expect('Всего друзей: 2'); expect('Привет!', '200');
    await engine.onText('200', '/start ref_100', { first_name: 'Друг' });
    expect('Всего друзей: 2');
  },
};

(async () => {
  let failed = 0;
  for (const [name, fn] of Object.entries(checks)) {
    try { await fn(); console.log('✅', name); } catch (e) { failed++; console.log('❌', name, '\n  ', e.message); }
  }
  engine.stop();
  console.log(failed ? `\nНе прошло: ${failed}` : '\nВсе сценарии работают.');
  process.exit(failed ? 1 : 0);
})();
