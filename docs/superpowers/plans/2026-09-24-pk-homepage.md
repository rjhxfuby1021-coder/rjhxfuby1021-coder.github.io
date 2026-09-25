# Главная texspeckps.ru — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Одностраничная главная портфолио Павла Корчагина, вставляемая в Tilda T123.

**Architecture:** Один файл-фрагмент `tilda-block.html`: `<link>` шрифтов, `<style>` со
стилями под `.pk-root`, разметка `<div class="pk-root">…</div>`, JSON-LD, `<script>` (IIFE).
Никаких внешних JS-библиотек. «Тесты» — проверки в браузерной панели через
`javascript_tool` + скриншоты на 375 / 768 / 1440 px.

**Tech Stack:** HTML, CSS (custom properties, 3D transforms, keyframes), vanilla JS
(IntersectionObserver, localStorage в try/catch), Google Fonts Unbounded + Manrope.

**Spec:** `docs/superpowers/specs/2026-09-24-pk-homepage-design.md`

## Global Constraints

- Все классы начинаются с `pk-`; все стили под селектором `.pk-root`.
- Нет `<html>`, `<head>`, `<body>` в `tilda-block.html`.
- Только факты из спецификации (раздел «Факты»), никаких выдуманных цифр и отзывов.
- Ссылки: `https://texspeckps.ru/keys`, `/price`, `/otzivi`, `/form`, `/faq`,
  `/iambonus`, `/rezume`, `/politica`.
- Счётчики: 10+ · 5 в 1 · 24/7 · 100%.
- Тема по умолчанию тёмная (`pk-theme`), язык по умолчанию RU (`pk-lang`).
- `prefers-reduced-motion: reduce` — контент виден без анимации.
- Проект не git-репозиторий: шаги commit пропускаются.

## Review Focus

1. **Tilda переопределяет стили** (`a`, `h1`, `button`, `box-sizing`) — в `.pk-root`
   заданы явные reset-правила; проверка: `getComputedStyle` у кнопок/заголовков.
2. **localStorage недоступен** (приватный режим) — страница работает, переключатели
   действуют в рамках сессии; проверка: подменить `localStorage.getItem` на throw.
3. **Контент невидим без JS / при reduced-motion** — элементы `.pk-reveal` видимы,
   пока JS не добавил класс `pk-js`; проверка: эмуляция reduced-motion.
4. **Горизонтальный скролл на 375 px** из-за орбиты/свечения — проверка:
   `document.documentElement.scrollWidth <= innerWidth`.
5. **EN-режим оставляет русские строки** — проверка: у всех `[data-i18n]` есть ключ
   в словаре EN.

---

### Task 1: Каркас, токены, темы, шапка, переключатели

**Files:** Create: `tilda-block.html`

- [ ] Шрифты, CSS-переменные тёмной темы на `.pk-root`, светлой на
  `.pk-root[data-theme="light"]`, reset внутри `.pk-root`.
- [ ] Шапка: логотип «ПК», nav (Кейсы/Услуги/Отзывы/Обо мне/FAQ), кнопки темы и
  RU|EN, CTA «Обсудить проект», бургер с полноэкранным меню (Esc, `aria-expanded`).
- [ ] JS: `pkStore.get/set` (try/catch), `applyTheme(t)`, `applyLang(l)` со словарём
  `PK_EN`, обработка `data-i18n` и `data-i18n-attr="attr:key"`.
- [ ] Проверка: клик по теме меняет `data-theme` и фон; после reload выбор сохранён;
  с throw в localStorage ошибок в консоли нет.

### Task 2: Hero + счётчики + орбита

- [ ] H1, подзаголовок, 2 CTA, 4 счётчика (`data-pk-count`), фото с орбитой чипов.
- [ ] Счётчики считают при входе в экран; «5 в 1», «24/7» — статичные с появлением.
- [ ] Проверка: на 375 px нет горизонтального скролла; H1 один на странице.

### Task 3: Боли (flip-карточки) + живая схема воронки

- [ ] 6 карточек, переворот по hover (pointer: fine) и по клику/Enter (`aria-pressed`).
- [ ] SVG-схема 6 узлов; `stroke-dashoffset` зависит от прогресса скролла секции;
  точка-«заявка» бежит по пути (`getPointAtLength`).
- [ ] Проверка: при reduced-motion линии прорисованы полностью.

### Task 4: Услуги, кейсы, процесс, отзывы

- [ ] 5 карточек услуг → `/price`; тизер кейсов → `/keys`; 5 шагов; 3 отзыва → `/otzivi`.

### Task 5: О Павле, FAQ, финальный CTA, подвал, JSON-LD

- [ ] О себе + `/iambonus`, `/rezume`, плашка рефералки 10%.
- [ ] FAQ на `<details>` (3 шт.) + ссылка на ИИ-ассистента `/faq`.
- [ ] Финальный CTA `/form` + Telegram; подвал со всеми 8 ссылками и контактами.
- [ ] JSON-LD `Person` + `ProfessionalService`.

### Task 6: Английский словарь, SEO.md, финальная проверка

- [ ] Полный словарь `PK_EN`; пометка «RU» у внутренних ссылок в EN-режиме.
- [ ] `SEO.md`: title, description, OG, инструкция по вставке в Tilda.
- [ ] Проверки Review Focus 1–5; скриншоты 375/768/1440 в обеих темах и языках;
  все 8 ссылок присутствуют; консоль чистая.
