// Мини-помощник для генераторов страниц: RU кладётся в разметку, EN — в словарь.
function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

class Dict {
  constructor() { this.en = {}; }
  // val: { ru, en } — строка текста; html: true — разрешить разметку (только для своих строк)
  tag(tagName, key, val, attrs, html) {
    this.en[key] = val.en;
    const body = html ? val.ru : esc(val.ru);
    return '<' + tagName + (attrs ? ' ' + attrs : '') + ' data-i18n="' + key + '">' + body + '</' + tagName + '>';
  }
  put(key, val) { this.en[key] = val.en; return val.ru; }
}

module.exports = { Dict, esc };
