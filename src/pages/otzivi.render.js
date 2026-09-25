// /otzivi — полные отзывы клиентов со ссылками на их проекты.
const { Dict, esc } = require('./_dict.js');
const SITE = 'https://texspeckps.ru/';

const REVIEWS = [
  {
    ini: 'ВН', name: { ru: 'Вера Н.', en: 'Vera N.' }, role: { ru: 'Веб-дизайнер', en: 'Web designer' },
    text: { ru: 'Супер, мне очень нравится! 😍 Получилось именно так, как я себе представляла — стильно, чисто и со вкусом. Вообще огонь 🔥 Особенно понравилось, что сайт не выглядит шаблонным, всё смотрится цельно и дорого. Остальное вообще прекрасно, даже придраться не к чему. Спасибо огромное за такую работу! ❤️', en: 'Amazing, I love it! 😍 It turned out exactly as I imagined — stylish, clean and tasteful. Absolutely fire 🔥 I especially loved that the site doesn’t look templated; everything feels cohesive and premium. The rest is just perfect, nothing to nitpick. Thank you so much for this work! ❤️' },
    project: { ru: 'Сайт-портфолио', en: 'Portfolio website' }, link: SITE + 'tilda#vera-portfolio'
  },
  {
    ini: 'РШ', name: { ru: 'Рубен Ш.', en: 'Ruben Sh.' }, role: { ru: 'Владелец кафе «Приятного аппетита»', en: 'Owner of “Priyatnogo Appetita” café' },
    text: { ru: 'Спасибо большое за работу! Всё сделали именно так, как я хотел. Сайт получился красивый, удобный, теперь клиенты легко оформляют заказы и доставку. Работать было приятно, всегда на связи. Однозначно рекомендую!', en: 'Thank you so much for the work! Everything was done exactly the way I wanted. The site is beautiful and convenient — customers now easily place orders and arrange delivery. A pleasure to work with, always in touch. Highly recommend!' },
    project: { ru: 'Сайт-магазин и чат-бот кафе', en: 'Café web store and chatbot' }, link: SITE + 'tilda#cafe-shop'
  },
  {
    ini: 'СА', name: { ru: 'Светлана А.', en: 'Svetlana A.' }, role: { ru: 'Школа фитнес-тренеров FitbasePro', en: 'FitbasePro fitness coach school' },
    text: { ru: 'Очень довольна сотрудничеством! Все задачи выполнялись оперативно, чётко и без лишних вопросов. Сайт получился современным, удобным и полностью соответствует нашим требованиям. Все пожелания учитывались, а любые правки вносились быстро. Спасибо за профессиональный подход и ответственность, работать было действительно комфортно. Рекомендую!', en: 'Very happy with the collaboration! Every task was done quickly, precisely and without unnecessary questions. The site is modern, convenient and fully meets our requirements. All wishes were taken into account, and edits were made fast. Thank you for the professional approach and responsibility — it was genuinely comfortable to work together. Recommend!' },
    project: { ru: 'Сайт школы MAXFIT', en: 'MAXFIT school website' }, link: SITE + 'tilda#maxfit'
  }
];

const STAR = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l3 6.9 7.5.7-5.7 5 1.7 7.4L12 18.3 5.5 22l1.7-7.4-5.7-5 7.5-.7z"/></svg>';
const ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

module.exports = function render() {
  const d = new Dict();
  d.en['a.stars'] = '5 out of 5';
  const cards = REVIEWS.map((r, i) => {
    const k = 'rv.' + i;
    return '<figure class="pk-rv pk-reveal" style="--d:' + i + '">' +
      '<div class="pk-rv__top"><span class="pk-stars" role="img" aria-label="5 из 5" data-i18n-attr="aria-label:a.stars">' + STAR.repeat(5) + '</span><span class="pk-rv__q" aria-hidden="true">“</span></div>' +
      d.tag('blockquote', k + '.t', r.text) +
      '<figcaption><span class="pk-ava" aria-hidden="true">' + esc(r.ini) + '</span><span>' + d.tag('b', k + '.n', r.name) + d.tag('small', k + '.r', r.role) + '</span></figcaption>' +
      '<a class="pk-rv__proj" href="' + esc(r.link) + '"><span>' + d.tag('small', 'rv.proj', { ru: 'Проект', en: 'Project' }) + d.tag('b', k + '.p', r.project) + '</span>' + ARROW + '</a>' +
    '</figure>';
  }).join('');

  const html = '' +
    '<section class="pk-hero pk-dirhero" aria-labelledby="pk-h1"><div class="pk-wrap">' +
      d.tag('p', 'rv.eye', { ru: 'Отзывы', en: 'Reviews' }, 'class="pk-eyebrow pk-reveal"') +
      d.tag('h1', 'rv.h1', { ru: 'Что говорят клиенты', en: 'What clients say' }, 'class="pk-h1 pk-reveal" id="pk-h1" style="--d:1"') +
      '<div class="pk-dirhero__row pk-reveal" style="--d:2">' +
        d.tag('p', 'rv.lead', { ru: 'Реальные отзывы без редактуры — и ссылки на проекты, о которых они написаны. Ноль отрицательных отзывов — не случайность, а подход: на связи на каждом этапе и правки до результата.', en: 'Real, unedited reviews — with links to the projects they’re about. Zero negative reviews isn’t luck, it’s an approach: in touch at every stage and edits until it’s right.' }, 'class="pk-lead"') +
        '<p class="pk-dirhero__count"><b>5.0</b>' + d.tag('span', 'rv.avg', { ru: 'средняя оценка', en: 'average rating' }) + '</p>' +
      '</div>' +
    '</div></section>' +
    '<section class="pk-section" style="padding-top:0"><div class="pk-wrap"><div class="pk-rvs">' + cards + '</div></div></section>' +
    '<section class="pk-section" style="padding-top:0"><div class="pk-wrap"><div class="pk-final pk-reveal">' +
      d.tag('h2', 'rv.cta.h', { ru: 'Работали со мной? Буду рад вашему отзыву', en: 'Worked with me? I’d love your review' }, 'class="pk-h2"') +
      d.tag('p', 'rv.cta.p', { ru: 'Напишите пару строк в Telegram — опубликую его здесь. А если только присматриваетесь — начнём с короткого брифа.', en: 'Drop a couple of lines on Telegram — I’ll publish it here. And if you’re just looking — let’s start with a short brief.' }, 'class="pk-lead"') +
      '<div class="pk-final__btns">' +
        '<a class="pk-btn pk-magnet" href="' + SITE + 'form">' + d.tag('span', 'rv.cta.b1', { ru: 'Обсудить проект', en: 'Discuss a project' }) + ARROW + '</a>' +
        '<a class="pk-btn pk-btn--ghost" href="https://t.me/PavelTexSpec" target="_blank" rel="noopener">' + d.tag('span', 'rv.cta.b2', { ru: 'Оставить отзыв', en: 'Leave a review' }) + '</a>' +
      '</div>' +
    '</div></div></section>';

  return {
    html,
    en: d.en,
    jsonld: JSON.stringify({
      '@context': 'https://schema.org', '@type': 'ProfessionalService', name: 'Павел Корчагин — технический специалист', url: SITE,
      aggregateRating: { '@type': 'AggregateRating', ratingValue: '5', bestRating: '5', reviewCount: String(REVIEWS.length) },
      review: REVIEWS.map((r) => ({ '@type': 'Review', author: { '@type': 'Person', name: r.name.ru }, reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' }, reviewBody: r.text.ru }))
    }, null, 2)
  };
};
