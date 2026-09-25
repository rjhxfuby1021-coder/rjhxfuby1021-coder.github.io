# Редизайн сайта texspeckps.ru — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** 13 блоков T123 в стиле главной + локальная админка кейсов.
**Architecture:** `src/` (общие стили/скрипты/партиалы, страницы, данные) → `build.js` → `dist/`.
**Tech Stack:** HTML, CSS, vanilla JS, Node (сборка, без зависимостей).
**Spec:** `docs/superpowers/specs/2026-09-24-pk-site-redesign-design.md`

## Global Constraints

- Всё из спецификации главной: префикс `pk-`, `.pk-root`, `:where()`-reset, защита `#allrecords`.
- Никаких выдуманных процентов в кейсах; только факты из исходных страниц.
- Ключи `localStorage`: `pk-theme`, `pk-lang` — общие для всех страниц.
- Проект не git-репозиторий: шаги commit пропускаются.

## Review Focus

1. Прямая ссылка `/tilda#id` на несуществующий кейс — витрина открывается без ошибки.
2. Кейс без галереи / без ссылки на сайт / без шагов — секции скрываются, вёрстка не ломается.
3. Две модалки (кейс + лайтбокс): Esc закрывает только верхнюю, «назад» — кейс.
4. `?service=` с неизвестным значением — форма работает, чип не выбран.
5. Админка: пустые обязательные поля — понятная подсветка, код не генерируется.

---

### Task 1: Извлечение данных кейсов
- [ ] Скрипт в браузере: по каждой странице направления — кейсы, их тексты и картинки → `src/data/raw-cases.json`.
- [ ] Проверка: 9 + 10 + 1 + 1 = 21 кейс, у каждого ≥ 1 картинки.

### Task 2: Общая система и перенос главной
- [ ] `src/base.css`, `src/base.js`, `src/partials/*`, `src/i18n/common.en.json`, `src/pages/index.*` из `tilda-block.html`.
- [ ] `build.js` → `dist/index.html`.
- [ ] Проверка: визуально идентично `tilda-block.html` (скриншоты 1440/375), консоль чистая.

### Task 3: `cases.json` — переписанные тексты RU + EN, факты, статусы
### Task 4: Шаблон страниц направлений + модалка кейса + лайтбокс; `/keys`
- [ ] Проверки Review Focus 1–3.
### Task 5: `/price`, `/form`
- [ ] Проверка Review Focus 4; отправка — через перехват `fetch`.
### Task 6: `/faq`, `/otzivi`, `/iambonus`, `/rezume`, `/politica`
### Task 7: `admin/admin.html`
- [ ] Проверка Review Focus 5; сгенерированный код совпадает со сборкой `build.js`.
### Task 8: `SEO.md`, полная проверка всех страниц (375/768/1440, темы, языки, эмуляция Tilda)
