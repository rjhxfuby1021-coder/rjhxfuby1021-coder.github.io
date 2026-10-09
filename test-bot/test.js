// Проверка без Telegram: node test.js
// Прогоняет все сценарии на поддельном Telegram, паузы ускорены в 1000 раз.

const assert = require('assert');
const { createEngine } = require('./engine');
const { createStore } = require('./store');

const sent = []; // { id, chat, text, markup }
let msgId = 0;
let edits = 0;
const api = {
  async sendMessage(chat, text, extra = {}) { const m = { id: ++msgId, chat: String(chat), text, markup: extra.reply_markup }; sent.push(m); return { message_id: m.id }; },
  async editMessageText(chat, id, text, extra = {}) { const m = sent.find((x) => x.id === id); if (m) { m.text = text; m.markup = extra.reply_markup; } edits++; },
  async deleteMessage() {},
  async getChatMember() { return { status: 'member' }; },
};
const cfg = { CONTACT_LINK: 'https://t.me/x', CHANNEL_LINK: 'https://t.me/y', SITE: 'https://texspeckps.ru', ADMIN_CHAT_ID: '999' };
const store = createStore(null);
const engine = createEngine({ api, store, cfg, botUsername: 'demo_bot', delayScale: 0.001, log: { error: (...a) => { throw new Error(a.join(' ')); } } });

const ME = '100';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const mine = (chat = ME) => sent.filter((m) => m.chat === chat);
const plain = (s) => String(s).replace(/<[^>]+>/g, '');
const lastText = (chat = ME) => plain(mine(chat).at(-1).text);
const recent = (chat = ME, n = 3) => mine(chat).slice(-n).map((m) => plain(m.text)).join('\n---\n');
const has = (s, chat = ME) => mine(chat).some((m) => plain(m.text).includes(s));

async function press(label, chat = ME) {
  for (let i = sent.length - 1; i >= 0; i--) {
    const m = sent[i];
    if (m.chat !== chat || !m.markup?.inline_keyboard) continue;
    const btn = m.markup.inline_keyboard.flat().find((b) => b.text === label);
    if (btn) { assert(btn.callback_data, `«${label}» — ссылка, а не кнопка`); return engine.onButton(chat, btn.callback_data, m.id); }
  }
  throw new Error(`Не нашёл кнопку «${label}». Последнее сообщение: ${lastText(chat)}`);
}
const type = (t, chat = ME) => engine.onText(chat, t, { first_name: 'Павел' });
async function until(fragment, chat = ME) {
  for (let i = 0; i < 200 && !has(fragment, chat); i++) await wait(5);
  assert(has(fragment, chat), `Ждал «${fragment}», а бот последним написал:\n${lastText(chat)}`);
}
const expect = (fragment, chat = ME) => assert(recent(chat).includes(fragment), `Ждал «${fragment}», а бот написал:\n${recent(chat)}`);
async function quiet(ms = 60) { const n = sent.length; await wait(ms); assert.strictEqual(sent.length, n, 'после этого бот должен молчать, а написал: ' + lastText()); }

const checks = {
  async 'Приветствие и меню'() {
    await type('/start');
    expect('Здравствуйте, Павел!');
    await press('Открыть меню');
    expect('Выберите сценарий');
    assert.strictEqual(mine().at(-1).markup.inline_keyboard.length, 9);
  },
  async 'Автовебинар: напоминания со сносками, эфир, оффер, оплата'() {
    await press('🎥 Автовебинар'); expect('🎬 Демо: Автовебинар');
    await press('Начать'); await press('Завтра в 19:00'); expect('завтра, 19:00 по Москве');
    await press('Товары'); await until('Записал: Товары');
    expect('В реальном боте это сообщение придёт через 30 минут после регистрации. В демо — через 5 секунд');
    await until('мини-урок на 2 минуты'); await until('Доброе утро, Павел! Сегодня в 19:00');
    await until('Через час начинаем'); await until('Комната открыта'); await until('Мы в эфире');
    await press('Смотреть сейчас'); await until('с какого смартфона'); await until('упор на тему «товары»');
    await press('Занять место за 9 900 ₽'); await press('Оплатить (демо)'); expect('добро пожаловать на курс');
    await until('✅ Это был сценарий «Автовебинар»');
    await quiet();
  },
  async 'Автовебинар: «если промолчать» и /menu останавливает цепочку'() {
    await press('🔁 Пройти ещё раз'); await press('Начать'); await press('Сегодня в 19:00'); await press('Еду');
    await until('Мы в эфире');
    await press('Показать, что будет, если промолчать'); expect('не увидели вас на эфире');
    await press('Сегодня в 21:00'); await until('Записал на повтор: сегодня в 21:00');
    await until('Это был сценарий «Автовебинар»');
    await press('🔁 Пройти ещё раз'); await press('Начать'); await press('Сегодня в 19:00'); await press('Еду');
    await type('/menu'); expect('Выберите сценарий');
    await quiet();
  },
  async 'Закрытый канал: тариф, оплата, продление, исключение, /subscription'() {
    await type('🔐 Закрытый канал по подписке'); await press('Начать');
    await press('Вопросы и ответы'); await press('Подойдёт ли новичку?'); expect('облегчённый вариант');
    await press('Тарифы'); await press('3 месяца — 2 490 ₽'); expect('3 месяца — 2 490 ₽');
    await press('Показать, что будет, если промолчать'); expect('Счёт ещё действует');
    await press('Оплатить 2 490 ₽'); expect('Добро пожаловать в клуб');
    await until('Первая тренировка уже в канале'); await until('заканчивается'); await until('банк отклонил');
    await until('Через 3 часа доступ'); await until('доступ в канал закрыт'); await until('«Сильная спина»');
    await type('/subscription'); expect('Тариф: 3 месяца');
    await until('Это был сценарий «Закрытый канал по подписке»');
  },
  async 'Лид-магнит: чек-лист, вопрос эксперту, прогрев, запись'() {
    await type('🎁 Лид-магнит'); await press('Начать');
    await press('Я подписался(ась) ✅'); expect('Держите чек-лист'); expect('проверил бы подписку автоматически');
    await until('успели заглянуть'); await press('Есть вопрос'); await type('Нужна ли касса?');
    await until('Так это видит эксперт'); await until('Нужна ли касса?');
    await until('История из практики'); await until('Обещанная схема');
    await press('Никак 😅'); await until('наведём порядок с нуля');
    await press('Записаться на консультацию'); await press('Пятница'); await press('15:00');
    assert(mine().at(-1).markup.keyboard, 'нужна кнопка «Отправить номер»');
    await type('8 900 111-22-33'); expect('Записала: пятница, 15:00');
    await until('Это был сценарий «Лид-магнит»');
  },
  async 'Тест с баллами: 21 балл, ответы сворачиваются, «если промолчать»'() {
    await type('📝 Тест с баллами'); await press('Начать'); await press('Начать тест');
    const e0 = edits;
    await press('Как получится');
    assert(has('Вопрос 1: ваш ответ — Как получится'), 'вопрос должен свернуться в ответ');
    await press('Показать, что будет, если промолчать'); expect('остановились на вопросе 2 из 7');
    await press('Продолжить'); expect('Вопрос 2 из 7');
    for (const a of ['Честно — часть теряется', 'В голове и в блокноте', 'Ждём, что вернётся сам', 'Нет', 'Нет', 'Не считал(а), много']) await press(a);
    assert.strictEqual(edits - e0, 7);
    await until('21 из 21 — «Решето»'); expect('скорость первого ответа');
    await until('отправляю разбор'); await until('бесплатный разбор, 30 минут');
    await until('Это был сценарий «Тест с баллами»');
  },
  async 'Колесо фортуны: номер, приз, промокод, суперприз'() {
    await type('🎡 Колесо фортуны'); await press('Начать'); await press('🎡 Крутить колесо');
    assert(mine().at(-1).markup.keyboard, 'нужна клавиатура с номером');
    await type('Пропустить (только в демо)'); await until('Колесо крутится');
    await until('Ваш промокод'); assert(/[A-Z0-9]+-[A-Z0-9]{5}/.test(recent()), recent());
    const rnd = Math.random; Math.random = () => 0.999; // суперприз
    try {
      await press('Крутить ещё раз (только в демо)'); await until('Пицца каждый месяц целый год'); await until('Так это видит менеджер');
    } finally { Math.random = rnd; }
    await until('ваш приз ждёт'); await until('сгорит'); await until('Промокод сгорел'); await until('колесо снова ваше');
    await until('Оцените заказ'); await press('⭐️⭐️'); await type('Остыла'); await until('Оценка ⭐️⭐️');
    await until('Это был сценарий «Колесо фортуны»');
  },
  async 'Онлайн-запись: всё в одном сообщении, «Назад», запись, напоминания'() {
    await type('📅 Онлайн-запись'); await press('Начать');
    const e0 = edits;
    await press('📅 Записаться'); await press('Центр — ул. Садовая, 14 · 10:00–22:00');
    await press('🎨 Окрашивание'); await press('← Назад'); await press('🎨 Окрашивание');
    await press('Окрашивание в один тон · 120 мин · от 4 500 ₽'); await press('До плеч');
    await press('Анна · топ-мастер · ⭐️ 4,9 · +20% к цене'); await press('Другая дата →'); await press('← Ближе');
    await press('Завтра'); await press('☀️ День, 12:00–17:00'); await press('14:00');
    await press('+ Уход для волос · 900 ₽');
    assert(edits - e0 >= 12, 'шаги записи должны менять одно сообщение, правок: ' + (edits - e0));
    await type('89001234567'); await type('Без разговоров, пожалуйста');
    expect('Проверьте запись'); expect('Окрашивание в один тон + уход для волос'); expect('7 400 ₽');
    await press('✅ Подтвердить'); await until('Так это видит администратор');
    await until('напоминаю: завтра в 14:00'); await until('Через 2 часа ждём вас'); await until('как вам визит? Мастер — Анна');
    await press('😕 Есть замечания'); await type('Долго ждала'); await until('Замечание по визиту');
    await until('прошло 3 недели'); await until('Это был сценарий «Онлайн-запись»');
  },
  async 'Сбор заявок: квиз кухни, фото, звонок, карточка менеджера, замер'() {
    await type('📨 Сбор заявок'); await press('Начать'); await press('Рассчитать кухню');
    for (const a of ['Угловая', '3–4 метра', 'Современный', 'Эмаль', 'Не нужна', '150 000–300 000 ₽', 'Как можно скорее']) await press(a);
    expect('Пришлите фото'); await engine.onPhoto(ME); expect('Фото получено (1)');
    await press('Готово, фото отправлены'); await type('79001234567');
    await press('Звонком'); await press('Вечером, 17–20');
    await until('Новая заявка №'); expect('Приоритет: горячая 🔥'); expect('Фото: 1 шт.');
    await until('Вашу заявку взяла в работу Елена'); await until('расчёт готов'); expect('от 240 000 ₽');
    await press('Записаться на замер'); await press(mine().at(-1).markup.inline_keyboard[0][0].text); await press('13:00');
    await until('Замер назначен'); await until('Это был сценарий «Сбор заявок»');
  },
  async 'Реферальная программа: ссылка, друг, бонусы, уровень, кабинет'() {
    await type('🤝 Реферальная программа'); await press('Начать'); await press('Получить мою ссылку');
    await until('Так бота увидит ваш друг'); await until('пришёл Илья'); await until('Илья оплатил'); expect('Баланс: 500 ₽');
    await until('Маша заглянула'); await until('вы достигли уровня «Свой»'); expect('Баланс: 2500 ₽');
    await type('/ref'); expect('Уровень: Свой'); expect('Оплатили заказ: 3');
    await until('Рейтинг'); await until('сгорят 2500'); await until('Это был сценарий «Реферальная программа»');
  },
  async 'Хочу такого бота: заявка уходит Павлу по-настоящему'() {
    const exitBtn = mine().at(-1).markup.inline_keyboard[0][0];
    assert(exitBtn.url && exitBtn.url.includes('service=salebot') && decodeURIComponent(exitBtn.url).includes('Бот как в демо: Реферальная программа'), 'кнопка выхода должна вести на форму сайта: ' + exitBtn.url);
    await type('/start want'); await press('Оставить заявку здесь');
    await type('Онлайн-школа, нужна воронка как в автовебинаре'); await type('@client_nick');
    expect('Заявка у Павла');
    const admin = mine('999').at(-1).text;
    assert(admin.includes('@client_nick') && admin.includes('Онлайн-школа') && admin.includes('Реферальная программа'), admin);
  },
  async 'Ссылки с сайта открывают сценарий сразу'() {
    await engine.onText('300', '/start quiz', { first_name: 'Гость' }); expect('🎬 Демо: Тест с баллами', '300');
    await engine.onText('301', '/start booking', {}); expect('🎬 Демо: Онлайн-запись', '301');
    await engine.onText('302', '/start nonsense', {}); expect('Здравствуйте, Павел!'.replace('Павел', 'друг'), '302');
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
