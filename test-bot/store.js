// Хранилище: переменные каждого человека в файле data.json рядом с ботом.
// Без пути к файлу (в проверке test.js) всё живёт только в памяти.

const fs = require('fs');

function createStore(file) {
  let data = { users: {} };
  if (file && fs.existsSync(file)) {
    try { data = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { console.error('data.json повреждён, начинаю с пустого:', e.message); }
  }
  let timer = null;

  return {
    has: (id) => Boolean(data.users[id]),
    user(id) {
      if (!data.users[id]) data.users[id] = { vars: {}, state: null, created: new Date().toISOString() };
      return data.users[id];
    },
    count: () => Object.keys(data.users).length,
    save() {
      if (!file || timer) return;
      timer = setTimeout(() => {
        timer = null;
        fs.writeFileSync(file + '.tmp', JSON.stringify(data, null, 1));
        fs.renameSync(file + '.tmp', file);
      }, 500);
    },
  };
}

module.exports = { createStore };
