---
layout: home
pageClass: portfolio-home
description: Макс Шведов — full-stack веб-специалист. Разработка, автоматизация, безопасность и технические контентные системы.

hero:
  name: "Макс Шведов"
  text: "Создаю веб-системы, которые выдерживают реальную сложность"
  tagline: "Full-stack разработка, автоматизация, безопасность и контентная инфраструктура — от постановки задачи и архитектуры до production и QA."
  actions:
    - theme: brand
      text: Смотреть проекты
      link: "#projects"
    - theme: alt
      text: Обо мне
      link: /ru/about-me
---

<script setup>
import { withBase } from 'vitepress'
</script>

<!-- Custom HTML оставлен без отступов: Markdown воспринимает вложенные блоки как код. -->
<main class="home-portfolio">
<section class="home-metrics" aria-label="Ключевые результаты">
<div class="home-metric">
<strong>15+</strong>
<span>лет в вебе и технологиях</span>
</div>
<div class="home-metric">
<strong>4 000+</strong>
<span>статей в одном пайплайне</span>
</div>
<div class="home-metric">
<strong>1 656</strong>
<span>статей методов API стандартизировано</span>
</div>
<div class="home-metric">
<strong>152</strong>
<span>ручных QA-кейса документировано</span>
</div>
</section>

<section id="projects" class="home-section home-projects">
<header class="home-section__header">
<div class="home-section__icon"><SolarIcon name="folder" :size="22" /></div>
<div>
<p class="home-section__eyebrow">Избранные работы</p>
<h2>Проекты с полным путём до результата</h2>
<p>Архитектура, реализация, компромиссы, QA и итог — не только финальный скриншот.</p>
</div>
</header>

<div class="home-project-grid">
<article class="home-project-card home-project-card--featured">
<div class="home-project-card__content">
<div class="home-project-card__meta">
<span>PHP / Legacy</span>
<span>Безопасность</span>
<span>QA</span>
</div>
<h3>Защита формы создания компаний</h3>
<p>Полная переработка legacy-потока <code>contact/create</code>: изоляция авторизации, 2FA, валидация, защита от дублей ИНН/КПП, аудит-логи и 152 документированных ручных QA-кейса.</p>
<div class="home-project-card__facts" aria-label="Факты о проекте">
<span><strong>11</strong> этапов</span>
<span><strong>152</strong> QA-кейса</span>
<span><strong>2FA</strong> и аудит действий</span>
</div>
<a class="home-card-link" :href="withBase('/ru/contact-create-page.html')">
Открыть кейс
<SolarIcon name="arrow-right" :size="19" />
</a>
</div>
<a class="home-project-card__media" :href="withBase('/ru/contact-create-page.html')" aria-label="Открыть кейс защиты формы создания компаний">
<img
:src="withBase('/images/contact-create-page/duplicate-found.png')"
alt="Предупреждение о найденном дубле компании в защищённой форме"
width="779"
height="587"
loading="lazy"
decoding="async"
/>
</a>
</article>

<article class="home-project-card">
<a class="home-project-card__media home-project-card__media--wide" :href="withBase('/ru/r7-document-api.html')" aria-label="Открыть кейс API Документ Конструктора Р7-Офис">
<img
src="/ru/images/r7-document-api/r7-api-main.png"
alt="Интерфейс базы знаний API Документ Конструктора Р7-Офис"
width="1920"
height="922"
loading="lazy"
decoding="async"
/>
</a>
<div class="home-project-card__content">
<div class="home-project-card__meta"><span>WordPress</span><span>Информационная архитектура</span></div>
<h3>API Документ Конструктора Р7-Офис</h3>
<p>Масштабируемая архитектура справочника для 107 классов API и 1 656 статей методов — с быстрой навигацией и единой структурой контента.</p>
<div class="home-project-card__facts">
<span><strong>107</strong> рубрик API</span>
<span><strong>1 неделя</strong> на стандартизацию контента</span>
</div>
<a class="home-card-link" :href="withBase('/ru/r7-document-api.html')">
Открыть кейс
<SolarIcon name="arrow-right" :size="19" />
</a>
</div>
</article>

<article class="home-project-card">
<a class="home-project-card__media home-project-card__media--diagram" :href="withBase('/ru/content-processing.html')" aria-label="Открыть кейс обработки контента">
<img
src="/ru/images/content-processing/content-architecture.png"
alt="Архитектура системы автоматизированной обработки WordPress-контента"
width="1024"
height="1024"
loading="lazy"
decoding="async"
/>
</a>
<div class="home-project-card__content">
<div class="home-project-card__meta"><span>Автоматизация</span><span>AI-агенты</span><span>Git</span></div>
<h3>Детерминированная обработка контента</h3>
<p>Контролируемый пайплайн массовых обновлений WordPress: декларативные правила, Python-утилиты, AI-обработка, проверка diff и безопасный откат.</p>
<div class="home-project-card__facts">
<span><strong>4 000+</strong> статей</span>
<span><strong>20+</strong> правил обработки</span>
</div>
<a class="home-card-link" :href="withBase('/ru/content-processing.html')">
Открыть кейс
<SolarIcon name="arrow-right" :size="19" />
</a>
</div>
</article>
</div>

<nav class="home-more-projects" aria-label="Другие проектные кейсы">
<a :href="withBase('/ru/pdf-to-audiobook.html')">
  <span class="home-more-projects__icon"><SolarIcon name="speaker" :size="21" /></span>
  <span><strong>pdf2audiobook: интерактивная CLI</strong><small>PDF в MP3, OCR fallback и надёжная пакетная TTS-генерация</small></span>
  <SolarIcon name="arrow-right" :size="18" />
</a>
<a :href="withBase('/ru/bibliobot.html')">
  <span class="home-more-projects__icon"><SolarIcon name="layers" :size="21" /></span>
  <span><strong>BiblioBot: книги по подписке</strong><small>Telegram-бот, Google Drive CMS и рекуррентные платежи</small></span>
  <SolarIcon name="arrow-right" :size="18" />
</a>
<a :href="withBase('/ru/priya-sleep.html')">
  <span class="home-more-projects__icon"><SolarIcon name="cpu" :size="21" /></span>
  <span><strong>Priya Sleep: Telegram Mini App</strong><small>Трекер детского сна и бот оповещений</small></span>
  <SolarIcon name="arrow-right" :size="18" />
</a>
<a :href="withBase('/ru/r7-download-preview.html')">
  <span class="home-more-projects__icon"><SolarIcon name="rocket" :size="21" /></span>
  <span><strong>Лендинг превью-версий</strong><small>Каталог 14 ОС и гранулярный RBAC</small></span>
  <SolarIcon name="arrow-right" :size="18" />
</a>
<a :href="withBase('/ru/r7-category-faq.html')">
<span class="home-more-projects__icon"><SolarIcon name="bolt" :size="21" /></span>
<span><strong>Категорийный FAQ-шаблон</strong><small>Ускорение загрузки в 8.5 раза</small></span>
<SolarIcon name="arrow-right" :size="18" />
</a>
<a :href="withBase('/ru/r7-dashamail-footer.html')">
        <span class="home-more-projects__icon"><SolarIcon name="shield" :size="21" /></span>
        <span><strong>Виджет футера DashaMail</strong><small>Живая AJAX-форма и закрытие 4 уязвимостей</small></span>
        <SolarIcon name="arrow-right" :size="18" />
      </a>
<a :href="withBase('/ru/r7-image-alignment.html')">
        <span class="home-more-projects__icon"><SolarIcon name="gallery" :size="21" /></span>
        <span><strong>Выравнивание изображений WordPress</strong><small>Поддержка 4 вариантов разметки редактора</small></span>
        <SolarIcon name="arrow-right" :size="18" />
      </a>
<a :href="withBase('/ru/modx-case-1.html')">
        <span class="home-more-projects__icon"><SolarIcon name="settings" :size="21" /></span>
        <span><strong>Форма заказа в ModX</strong><small>Изменение типов полей с валидацией ввода</small></span>
        <SolarIcon name="arrow-right" :size="18" />
      </a>
</nav>
</section>

<section id="writing" class="home-section home-writing">
<header class="home-section__header">
<div class="home-section__icon"><SolarIcon name="notes" :size="22" /></div>
<div>
<p class="home-section__eyebrow">Работа с текстом</p>
<h2>Техническое писательство и редактура</h2>
<p>Помогаю превратить сложный технический материал в понятный текст: инструкции, статьи базы знаний и документацию для пользователей и администраторов.</p>
</div>
</header>
<article class="home-writing-card">
<div class="home-writing-card__content">
<div class="home-project-card__meta"><span>Техническая редактура</span><span>SSO / Keycloak / LDAP</span></div>
<h3>Из инженерного текста — в понятную инструкцию</h3>
<p>Редактура статьи для базы знаний Р7-Офис: исправление ошибок, единая терминология, ясные шаги и подготовка к публикации. Восемь примеров «было / стало» с объяснением каждой правки.</p>
<div class="home-project-card__facts"><span><strong>31</strong> скриншот с подписью</span><span><strong>6</strong> блоков кода сохранены</span></div>
<a class="home-card-link" :href="withBase('/ru/r7-sso-editing.html')">Смотреть разбор <SolarIcon name="arrow-right" :size="19" /></a>
</div>
<div class="home-writing-card__sample" aria-label="Примеры исправлений">
<p class="home-section__eyebrow">Точность начинается со слова</p>
<div class="home-writing-sample"><span>Было</span><del>Sing In</del><del>conntction url</del><del>Tittle</del></div>
<div class="home-writing-sample home-writing-sample--after"><span>Стало</span><strong>Sign In</strong><strong>Connection URL</strong><strong>title</strong></div>
<p class="home-writing-card__caption">Названия кнопок, полей и атрибутов — часть инструкции.</p>
</div>
</article>
<article class="home-writing-card home-writing-card--audit">
<div class="home-writing-card__content">
<div class="home-project-card__meta"><span>Documentation QA</span><span>Р7-Офис</span></div>
<h3>Тестирование справки редактора таблиц</h3>
<p>Постатейный аудит: фактические ошибки, точность действий, проверка сценариев в редакторе, иллюстрации и переходы со старой справки. Реальные примеры и полный реестр проверенных материалов.</p>
<div class="home-project-card__facts"><span><strong>89</strong> статей в отчёте</span><span><strong>14</strong> тематических блоков</span><span><strong>30</strong> редиректов</span></div>
<a class="home-card-link" :href="withBase('/ru/r7-table-editor-audit.html')">Смотреть кейс <SolarIcon name="arrow-right" :size="19" /></a>
</div>
<div class="home-writing-card__sample" aria-label="Примеры фактических ошибок">
<p class="home-section__eyebrow">Проверить смысл и действие</p>
<div class="home-writing-sample"><span>Было</span><del>4 месяца в квартале</del><del>Левый клик</del><del>Нечисловые ячейки</del></div>
<div class="home-writing-sample home-writing-sample--after"><span>Стало</span><strong>3 месяца в квартале</strong><strong>Правый клик</strong><strong>Непустые ячейки</strong></div>
<p class="home-writing-card__caption">Уточнения из статей о группировке, диаграммах и подсчёте значений в сводной таблице.</p>
</div>
</article>
<a class="home-card-link home-writing-overview" :href="withBase('/ru/technical-writing.html')">О работе с текстом <SolarIcon name="arrow-right" :size="19" /></a>
</section>

<section class="home-section home-expertise">
<header class="home-section__header">
<div class="home-section__icon"><SolarIcon name="layers" :size="22" /></div>
<div>
<p class="home-section__eyebrow">Экспертиза</p>
<h2>Единый взгляд на систему вместо точечных правок</h2>
<p>Соединяю требования продукта, код, инфраструктуру, контент и контроль качества.</p>
</div>
</header>

<div class="home-expertise-grid">
<article>
<span class="home-expertise-card__icon"><SolarIcon name="code" :size="24" /></span>
<h3>Веб-разработка</h3>
<p>PHP, JavaScript, Vue, WordPress, ModX, API и аккуратная работа с legacy-системами.</p>
</article>
<article>
<span class="home-expertise-card__icon"><SolarIcon name="magic" :size="24" /></span>
<h3>Автоматизация</h3>
<p>Python, Bash, контентные пайплайны, декларативные правила и AI-assisted процессы.</p>
</article>
<article>
<span class="home-expertise-card__icon"><SolarIcon name="shield" :size="24" /></span>
<h3>Безопасность и QA</h3>
<p>Архитектура с учётом угроз, валидация, аудит, тест-дизайн и документация релиза.</p>
</article>
<article>
<span class="home-expertise-card__icon"><SolarIcon name="graph" :size="24" /></span>
<h3>Инфраструктура и рост</h3>
<p>Администрирование VPS, DNS, SSL, Cloudflare, техническое SEO и контентные операции.</p>
</article>
</div>
</section>

<section class="home-section home-process">
<header class="home-section__header home-section__header--compact">
<div class="home-section__icon"><SolarIcon name="compass" :size="22" /></div>
<div>
<p class="home-section__eyebrow">Процесс</p>
<h2>Понятный путь от проблемы до релиза</h2>
</div>
</header>

<ol class="home-process-list">
<li><span>01</span><strong>Контекст</strong><small>Ограничения и риски</small></li>
<li><span>02</span><strong>Архитектура</strong><small>Решения и компромиссы</small></li>
<li><span>03</span><strong>Реализация</strong><small>Фокусная разработка</small></li>
<li><span>04</span><strong>QA</strong><small>Проверки и edge cases</small></li>
<li><span>05</span><strong>Передача</strong><small>Документация и результат</small></li>
</ol>
</section>

<section class="home-cta">
<div class="home-cta__icon"><SolarIcon name="rocket" :size="28" /></div>
<div>
<p class="home-section__eyebrow">Важны детали</p>
<h2>Посмотрите опыт за пределами проектов</h2>
<p>Профессиональный путь, стек, инфраструктура, Web3, e-commerce и принципы работы со сложными задачами.</p>
</div>
<div class="home-cta__actions">
<a class="home-button home-button--brand" :href="withBase('/ru/about-me.html')">Обо мне <SolarIcon name="arrow-right" :size="18" /></a>
<a class="home-button" :href="withBase('/ru/faq.html')">Q&amp;A</a>
</div>
</section>
</main>
