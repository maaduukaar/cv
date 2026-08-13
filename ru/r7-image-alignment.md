# Р7-Офис: Выравнивание изображений по центру (.aligncenter) <Badge type="tip" text="WordPress" /> <Badge type="warning" text="CSS3" /> <Badge type="info" text="WYSIWYG / FAQ" />

![Пример центрирования изображения — Р7 центр поддержки](/images/r7-image-alignment-preview.png)

::: info <SolarIcon name="clipboard" /> Карточка проекта

| | |
|---|---|
| **Стек** | WordPress, CSS3, BEM, Classic Editor & Gutenberg |
| **Роль** | Frontend / WordPress Developer |
| **Целевые блоки** | `.wysiwyg-result` (статьи), `.faq-item__answer` (FAQ-аккордеоны) |
| **Сайт** | <SolarIcon name="link" /> [Р7 центр поддержки](https://support.r7-office.ru/) |
| **Результат** | 100% корректное выравнивание центрированных фото без регрессии на иконках |

:::

---

## <SolarIcon name="pin" /> Обзор проекта и ТЗ

### Описание проблемы

В административной панели WordPress при редактировании статей и вопросов-ответов на сайте [Р7 центр поддержки](https://support.r7-office.ru/) контент-менеджеры регулярно выбирали выравнивание **«По центру»** для загружаемых иллюстраций и скриншотов. Однако на фронтенде все изображения выводились без центрирования — прижатыми к левому краю.

### Технический анализ причин

1. В файле стилей `themes/r7/assets/stylesheets/common.css` для изображений внутри статей были заданы автоматические боковые отступы, но закомментировано свойство `display: block`:
   ```css
   .faq-item__answer img,
   .wysiwyg-result img {
       /* display: block; */ /* [!code warning] */
       max-width: 100%;
       height: auto;
       margin-right: auto;
       margin-left: auto;
   }
   ```
   Поскольку тег `<img>` по умолчанию является строчным (`inline`), свойства `margin-left: auto` и `margin-right: auto` не работают без изменения типа отображения на `block` или `inline-block`.
2. Если просто раскомментировать `display: block;` для селектора `.wysiwyg-result img`, все изображения внутри статьи (включая мелкие иконки в тексте, эмодзи и стрелочки) становились блочными элементами, переносились на новые строки и полностью ломали верстку.
3. В теме полностью отсутствовали правильные CSS-правила для стандартного класса выравнивания WordPress — `.aligncenter`.

### Границы задачи (ТЗ)

* **В рамках задачи:** Настройка корректного центрирования только тех изображений (и их родительских контейнеров), для которых в админке явно задано выравнивание по центру (класс `.aligncenter`).
* **Безопасность:** Изоляция правил внутри `.wysiwyg-result` и `.faq-item__answer`, исключающая влияние на иконки, шапку, футер, сайдбары и списки статей.
* **Вне рамок задачи:** Выравнивание влево (`.alignleft`) и вправо (`.alignright`) — эти классы оставались без изменений во избежание визуальных регрессий.

---

## <SolarIcon name="clipboard" /> Полный список задач

| № | Задача | Описание |
|:---:|---|---|
| 01 | **Анализ разметки WordPress** | Исследованы все 4 варианта генерации `.aligncenter` в Classic Editor и Gutenberg |
| 02 | **Разработка CSS-правил выравнивания** | Созданы селекторы с поддержкой обёрток `<figure>`, `<div>`, `<p>` и тегов `<img>` |
| 02.1 | **Обработка изображений с модальными окнами** | Центрирование для обёрток `.js-popup-open-link.aligncenter` из `_convert_image_links_fast` |
| 02.2 | **Стилизация подписей к изображениям** | Правила для `figcaption` и `.wp-caption-text` внутри центрированных блоков |
| 02.3 | **Тестирование на dev-окружении** | 4 сценария проверены на внутреннем dev-стенде, сформирован итоговый отчёт |

---

## <SolarIcon name="lightbulb" /> Пример наиболее сложной задачи: Task 01 — Техническое задание и анализ разметки

::: details <SolarIcon name="clipboard" /> Посмотреть полностью ТЗ № 01 (Анализ разметки WordPress)

### Исследованная разметка WordPress (варианты вывода `.aligncenter`)

В зависимости от редактора (Classic Editor / Gutenberg) и наличия ссылок или подписей, WordPress генерирует класс `.aligncenter` в разметке четырьмя разборными способами:

#### 1. Изображение без ссылки и подписи (Classic Editor)
```html
<img class="aligncenter size-medium wp-image-1234" src="/image.png" alt="Пример" />
```

#### 2. Изображение со ссылкой (включая обработку модального окна в `functions.php`)
Функция `_convert_image_links_fast` преобразует ссылки с изображениями в тег `<figure>`:
```html
<figure class="js-popup-open-link aligncenter size-medium" data-popup="certificate-popup">
    <img class="aligncenter size-medium wp-image-1234" src="/image.png" alt="Пример" />
</figure>
```

#### 3. Изображение с подписью (Gutenberg / Block Editor)
```html
<figure class="wp-block-image aligncenter size-large">
    <img src="/image.png" alt="Пример" />
    <figcaption>Подпись к иллюстрации</figcaption>
</figure>
```

#### 4. Изображение с подписью (Classic Editor)
```html
<div class="wp-caption aligncenter">
    <img class="aligncenter size-medium" src="/image.png" alt="Пример" />
    <p class="wp-caption-text">Подпись к иллюстрации</p>
</div>
```

**Вывод анализа:** Класс `.aligncenter` может присутствовать либо на самом `<img>`, либо на контейнере (`figure`, `div`), либо на обоих сразу. CSS-решение должно единовременно перекрывать все 4 сценария.

:::

---

## <SolarIcon name="bolt" /> Технические решения и ключевые сложности

### Сложность: Сохранение работоспособности строчных иконок

::: warning Проблема
Если задать `img { display: block; margin: auto; }`, мелкие иконки и эмодзи внутри текста статей переносят строки на новую строку, создавая визуальный разрыв.
:::

::: tip <SolarIcon name="lightbulb" /> Решение: Изолированная каскадность
CSS-правила были привязаны строго к наличию `.aligncenter` у элемента или его непосредственного контейнера:

```css
/* ===== Выравнивание изображений по центру ===== */

/* 1. Центрирование контейнеров (figure, div, p) с классом aligncenter */
.wysiwyg-result .aligncenter,
.faq-item__answer .aligncenter {
    display: block;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
}

/* 2. Центрирование изображений внутри таких контейнеров, либо если класс на самом img */
.wysiwyg-result img.aligncenter,
.wysiwyg-result .aligncenter img,
.faq-item__answer img.aligncenter,
.faq-item__answer .aligncenter img {
    display: block;
    margin-left: auto;
    margin-right: auto;
}

/* 3. Центрирование подписей к изображениям */
.wysiwyg-result .aligncenter figcaption,
.wysiwyg-result .aligncenter .wp-caption-text,
.faq-item__answer .aligncenter figcaption,
.faq-item__answer .aligncenter .wp-caption-text {
    text-align: center;
    margin-top: calc(12 / 16 * 1rem);
    font-size: calc(14 / 16 * 1rem);
    color: var(--ne-lght-600, #8b929b);
}

/* Доступность: убираем резкие скачки при включенном режиме уменьшения движения */
@media (prefers-reduced-motion: reduce) {
    .wysiwyg-result img.aligncenter,
    .faq-item__answer img.aligncenter {
        transition: none !important;
    }
}
```
:::

---

## <SolarIcon name="chart" /> Итоговые результаты

::: tip <SolarIcon name="trophy" /> Результаты тестирования и приемки
| Сценарий | До патча | После патча | Статус |
|---|---|---|---|
| **По центру без модалки** | Слева | **По центру** | ✅ Успешно |
| **По центру с модалкой** | Слева | **По центру** | ✅ Успешно |
| **По центру с модалкой и подписью** | Слева | **По центру (картинка и подпись)** | ✅ Успешно |
| **По центру без модалки с подписью** | Слева | **По центру (картинка и подпись)** | ✅ Успешно |
| **Инлайновые иконки в тексте** | Не затронуты | **В строке текста без сбоев** | ✅ Успешно |
:::
