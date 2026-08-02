# Р7-Офис: API Документ Конструктора <Badge type="tip" text="WordPress" /> <Badge type="warning" text="PHP 8" /> <Badge type="info" text="JS ES6" />

![Главная страница справочника API Документ Конструктора](/ru/images/r7-document-api/r7-api-main.png)

::: info 📋 Карточка проекта

| | |
|---|---|
| **Стек** | WordPress, PHP 8, JavaScript ES6, HTML5/CSS3 |
| **Сроки** | Разработка шаблонов — **2 недели**, обработка контента — **1 неделя** |
| **Роль** | Full-stack Разработчик / Архитектор решений |
| **Масштаб** | 107 рубрик классов API · 1 656 статей методов |
| **Рабочий пример** | 🔗 [support.r7-office.ru/…/api-text-document/](https://support.r7-office.ru/using-api-document-builder/api-text-document/) |

:::

## 📌 Обзор проекта

В рамках задачи для базы знаний **Центра поддержки Р7-Офис** потребовалось спроектировать новый шаблон отображения категорий **API Документ Конструктора** (текстовые документы, таблицы, презентации) и привести огромный массив разрозненных материалов к единому стандарту.

Справочник включает в себя **107 рубрик классов API** и **1 656 статей методов**, которые требовали четкой структуры, быстрого поиска и единого стиля оформления.

> 👉 **[Посмотреть рабочий пример API Текстового документа на support.r7-office.ru](https://support.r7-office.ru/using-api-document-builder/api-text-document/)**

---

## ⭐ Ключевое преимущество: Массовая обработка 1 656 статей за 1 неделю

После завершения разработки архитектурного модуля категорий (которая заняла 2 недели), следующим последовательным шагом стало **облагораживание и стандартизация контента**. Всего за **одну неделю** весь массив из 1 656 статей методов был полностью структурирован и приведен к единому формату.

::: details 📝 Полный перечень контентных работ по 1 656 статьям методов

- **Добавление отрывков (`excerpt`)** — для каждой статьи сформированы краткие описания, на основе которых автоматически строятся таблицы методов в шаблонах аккордеонов.
- **Очистка «мусорного» HTML** — удалены неиспользуемые атрибуты `id`/`class` у заголовков, сломанные обертки `<div class="details">` и теги `<dd>`, разрывавшие верстку.
- **Исправление ошибок перевода** — устранены машинные переводы типов данных (например, `«левый» | «правильно»` → `"left" | "right" | "both" | "center" | undefined`, `Массив.<ApiShape>` → `Array.<ApiShape>`).
- **Терминология бренда** — наименования `Document Builder` приведены к стандарту **«Документ конструктор»**.
- **Защита синтаксиса** — заголовки методов обёрнуты в `<code>`, предотвращена автозамена `"` на `«»`.
- **Стандартизация JSDoc** — нотация `ApiFormBase#Clear` вместо точки, секция «Возвращает» → чистые `<ul>/<li>`.

:::

::: tip 🗂️ Дополнительные контентные работы
- **107 рубрик API** — перенос данных в кастомные мета-поля (`api_constructor_syntax`, `api_class_description`, `api_example_code`, `api_characteristics`).
- **107 подкатегорий** — настроены якорные перенаправления на секции основных шаблонов.
- **107 устаревших статей** — скрыты из публичного отображения.
:::

---

## ⚡ Технические решения и ключевые сложности

::: info 🗺️ Последовательные этапы проекта
**Этап 1 → Этап 2 → Этап 3**

1. 🛠️ **Проектирование и разработка модуля `category-templates`** <Badge type="tip" text="2 недели" />
   - 🎨 *Фронтенд*: Модульные `template-parts` (`header`, `breadcrumbs`, `sidebar`, `getting-started`, `api-classes`)
   - 🚀 *Бэкенд*: Оптимизация N+1 SQL-запросов (единый пакетный `WP_Query` + кэш связей)
   - 🎯 *UX*: Синхронный `pre-open hash script` против дёрганья экрана при переходах по якорям
2. ⚡ **Облагораживание и стандартизация контента** <Badge type="warning" text="1 неделя" />
   - Массовая очистка HTML, переводы, JSDoc и нарезка `excerpt` для 1 656 статей
   - Перенос описаний в кастомные метаполя для 107 рубрик категорий
3. 🛡️ **Успешный релиз** <Badge type="info" text="Завершено" />
   - Тестирование, проверка DoD и безопасный выкат на `support.r7-office.ru`
:::

### 1. Инженерная сложность: Layout Shift при якорных ссылках <Badge type="danger" text="CLS" />

::: warning Проблема
При переходе пользователя по прямой якорной ссылке (например, `.../#ApiWatermarkSettings`), нужная секция находится внутри **сложенного аккордеона**. Стандартный асинхронный `DOMContentLoaded` приводил к **скачку высоты и «дёрганью» экрана** (Cumulative Layout Shift), сбивая точку фокуса пользователя.
:::

::: tip 💡 Решение: Синхронный Pre-open Hash Script
Был спроектирован специальный **синхронный micro-script**, встраиваемый непосредственно в место генерации списка аккордеонов:

1. Скрипт отрабатывает мгновенно в процессе HTML-парсинга — **до нативного scroll и первого paint**
2. Моментально считывает `window.location.hash` и находит целевой класс
3. Устанавливает состояние `.active` / `.open` **до отрисовки**
4. Браузер совершает скролл сразу к уже раскрытому блоку — **без visual displacement**
:::

<figure>
  <img src="/ru/images/r7-document-api/r7-api-accordion.png" alt="Справочник методов класса API">
  <figcaption>Раскрытый аккордеон класса ApiWatermarkSettings с выведенными метаданными и таблицей методов</figcaption>
</figure>

### 2. Фронтенд-архитектура и UX <Badge type="tip" text="Модульная" />

Для удобного управления версткой 700-строчный исходный монолитный шаблон был разбит на независимые `template-parts`:

```text
themes/r7-child/templates/category/api-index/
├── index.php                 # Координатор шаблона (~80 строк)
├── assets/
│   ├── css/style.css        # Стили аккордеонов и таблиц методов
│   └── js/accordion.js      # JS-контроллер аккордеонов с делегированием
└── template-parts/
    ├── header.php           # Заголовок и описание рубрики
    ├── breadcrumbs.php      # Хлебные крошки
    ├── getting-started.php  # Секция "Начало работы"
    ├── api-classes.php      # Список аккордеонов классов и таблиц
    ├── sidebar.php          # Сайдбар навигации
    └── empty-state.php      # Пустое состояние
```

Вся логика пользовательских кликов и взаимодействия вынесена во внешний скрипт `accordion.js` с использованием эффективного делегирования событий.

::: tip 🛠️ Удобство для администраторов (Admin Quick Edit)
Для контент-менеджеров реализована функция **быстрого редактирования раздела прямо из фронтенда**:
- Для пользователей с правами `edit_terms` в шапку каждого аккордеона выводится кнопка прямого перехода в админ-панель WordPress (`get_edit_term_link()`)
- Позволяет мгновенно перейти к редактированию метаданных класса **в один клик**
- Событие клика изолировано через `event.stopPropagation()` — переход в админку **не сворачивает аккордеон**
:::

### 3. Оптимизация производительности <Badge type="danger" text="N+1 → 1" />

::: danger Проблема: N+1 SQL-запросов
При вызове отдельных `WP_Query` для каждого класса в цикле на страницах с 20+ классами генерировалось более **201 SQL-запроса** к базе данных.
:::

**Решение** — все методы классов выбираются за **один единый пакетный `WP_Query`** с фильтром `tax_query` по массиву категорий и затем группируются в PHP:

| Метрика | До | После | Улучшение |
|---|---|---|---|
| SQL-запросы | 201 | 2 | **×100** |
| Время генерации | 1.4 сек | 0.08 сек | **×17.5** |

---

## 💡 Примеры из практики

::: details 📋 Полное реальное Техническое Задание (ТЗ № 13 — Якорные ссылки)

Ниже приведена оригинальная спецификация задачи из репозитория проекта (`.tasks/done/13-anchor-links.md`):

### 🎯 Цель задачи

Привести якорные ссылки в секции «API Классы» к стабильному и предсказуемому поведению:
- якорь (`id`) привязан к заголовку аккордеона
- кнопка рядом с заголовком **только копирует** ссылку
- переход по `#hash` раскрывает аккордеон и отображает его шапку целиком ниже фиксированного header

---

### 🔍 Выявленные проблемы

#### 1. Якорь стоит на `<summary>`, а не на заголовке
`id` проставлен на элементе `<summary class="r7-api-class__accordion-summary">`.
По задаче якорь должен быть на `<span class="r7-api-class__accordion-heading">`.

#### 2. Кнопка — ссылка `<a>`, а не `<button>`
Элемент `.r7-api-class__anchor-btn` — `<a href="#...">`. Нужно заменить на `<button>`, чтобы исключить нативную навигацию.

#### 3. Шапка аккордеона уезжает под header
CSS-значения `scroll-margin-top` захардкожены и не учитывают WordPress admin bar.

---

### 🛠️ Декомпозиция работ

#### 13.1 — Перенести `id` на heading <Badge type="info" text="index.php" />

```php
// Было: id на <summary>
<summary id="<?= $accordion_id ?>">  // [!code --]

// Стало: id на <span> заголовка
<span class="r7-api-class__accordion-heading" id="<?= $accordion_id ?>">  // [!code ++]
```

#### 13.2 — Заменить `<a>` на `<button>` <Badge type="info" text="index.php" />

```html
<button
    class="r7-api-class__anchor-btn"
    type="button"
    data-copy-anchor
    data-target-id="<?php echo esc_attr( $accordion_id ); ?>"
    aria-label="Скопировать якорную ссылку"
    title="Скопировать ссылку"
>
    <!-- SVG иконка -->
</button>
```

#### 13.3 — CSS: `scroll-margin-top` с учётом admin bar <Badge type="info" text="style.css" />

```css
/* Desktop */
.r7-api-class__accordion-heading[id] {
    scroll-margin-top: 100px;
}
.admin-bar .r7-api-class__accordion-heading[id] {
    scroll-margin-top: 132px; /* 100 + 32 */
}

/* Mobile ≤ 782px */
@media screen and (max-width: 782px) {
    .r7-api-class__accordion-heading[id] {
        scroll-margin-top: 60px;
    }
    .admin-bar .r7-api-class__accordion-heading[id] {
        scroll-margin-top: 106px; /* 60 + 46 */
    }
}
```

#### 13.4 — JS-прокрутка <Badge type="info" text="accordion.js" />

```js
// Было: скролл к <details>, offset из <summary>
scrollToAnchorTarget(details, settings.behavior || 'auto', summary); // [!code --]

// Стало: скролл к heading, offset из heading
scrollToAnchorTarget(target, settings.behavior || 'auto', target); // [!code ++]
```

---

### ✅ Критерии завершения (DoD)
- ✅ `id` стоит на `.r7-api-class__accordion-heading`, а не на `<summary>`
- ✅ `.r7-api-class__anchor-btn` — `<button type="button">`, а не `<a>`
- ✅ Клик по кнопке копирует URL с `#hash` без навигации и toggle
- ✅ URL с `#hash` раскрывает аккордеон, шапка видна ниже fixed header
- ✅ Admin bar учтён на desktop и mobile
- ✅ Ручной toggle аккордеона работает как раньше

:::

::: details 🔍 Оптимизация SQL-запросов (N+1 → пакетный запрос)

### Проблема

```php
// ❌ СТАРАЯ РЕАЛИЗАЦИЯ: N+1 запросов к БД
foreach ($api_classes as $class_term) {
    $posts = new WP_Query([   // [!code warning]
        'cat' => $class_term->term_id,   // [!code warning]
        'posts_per_page' => 200   // [!code warning]
    ]);   // [!code warning]
    // Рендер класса...
}
```

На 20 классах по 10 методов это порождало более **201 SQL-запроса** за одну загрузку.

### Решение

```php
/**
 * ✅ ОПТИМИЗИРОВАННАЯ РЕАЛИЗАЦИЯ: 1 пакетный запрос вместо N+1
 */
function r7_api_index_get_api_class_posts_by_term(
    array $term_ids,
    int $posts_per_page = 200
) {
    if ( empty( $term_ids ) ) {
        return array();
    }

    $args = array(
        'post_type'              => 'post',
        'post_status'            => 'publish',
        'posts_per_page'         => $posts_per_page * count( $term_ids ), // [!code highlight]
        'update_post_term_cache' => true, // Прогрев кэша связей // [!code highlight]
        'tax_query'              => array(
            array(
                'taxonomy' => 'category',
                'field'    => 'term_id',
                'terms'    => $term_ids, // [!code highlight]
                'operator' => 'IN',
            ),
        ),
    );

    $query = new WP_Query( $args );
    $grouped = array();

    if ( $query->have_posts() ) {
        foreach ( $query->posts as $post ) {
            $post_terms = wp_get_post_categories( $post->ID );
            foreach ( $post_terms as $t_id ) {
                if ( in_array( $t_id, $term_ids, true ) ) {
                    $grouped[ $t_id ][ $post->ID ] = $post;
                }
            }
        }
    }

    // Гарантия лимита: 200 методов на каждый класс
    foreach ( $grouped as $t_id => $bucket ) {
        $grouped[ $t_id ] = array_slice( $bucket, 0, $posts_per_page, true );
    }

    return $grouped;
}
```

### Результат

| Метрика | До | После |
|---|---|---|
| SQL-запросы | **201** | **2** |
| Время генерации | **1.4 сек** | **0.08 сек** |

:::

---

## 📈 Итоговые результаты

::: tip 🏆 Достижения проекта
| Метрика | Результат |
|---|---|
| ⏱️ Скорость обработки | **1 656 статей** стандартизированы за **1 неделю** |
| 🎯 UX якорных переходов | **0 CLS** — абсолютно плавные переходы |
| ⚡ Производительность БД | Нагрузка снижена в **100 раз** (201 → 2 запроса) |
| 🧹 Архитектура | Монолит **700 строк** → модульные `template-parts` |
| 🛠️ Администрирование | Кнопка Quick Edit прямо из фронтенда |
| 🛡️ Деплой | Безопасный выкат **без простоя** сервиса |
:::
