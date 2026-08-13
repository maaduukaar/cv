# Р7-Офис: Рескин футера и безопасность формы подписки DashaMail <Badge type="tip" text="WordPress" /> <Badge type="warning" text="PHP 8 / AJAX" /> <Badge type="danger" text="Security Audit" />

![Рескин футера и форма подписки DashaMail — Р7 центр поддержки](/images/r7-dashamail-footer-preview.png)

::: info <SolarIcon name="clipboard" /> Карточка проекта

| | |
|---|---|
| **Стек** | WordPress, PHP 8, JavaScript (AJAX), DashaMail API, CSS3 |
| **Роль** | Full-stack Developer / Security Auditor |
| **Ключевые файлы** | `footer.php`, `dashamail/init.php`, `dashamail/dm.js`, `dashamail/forms/footer.php` |
| **Сайт** | <SolarIcon name="link" /> [Р7 центр поддержки](https://support.r7-office.ru/) |
| **Результат** | Модернизация подвала, интеграция живой AJAX-формы и закрытие 4 уязвимостей безопасности |

:::

---

## <SolarIcon name="pin" /> Обзор проекта и ТЗ

### Исходное состояние и проблема

В проекте сайта [Р7 центр поддержки](https://support.r7-office.ru/) существовали два параллельных варианта формы подписки в подвале:

1. **Статичный HTML в `footer.php`:** Красивая верстка из нового бренд-макета (актуальные инпуты, дизайн кнопок и инлайн-блок подтверждения подписки). Однако кнопка «Подписаться» являлась муляжом — при клике реальная отправка данных не происходила.
2. **Изолированный модуль `dashamail/`:** Содержал рабочую бэкенд-логику на PHP и cURL, отправлявшую данные в API сервис рассылок DashaMail. Но при этом использовал устаревшую верстку Tilda и вызывал всплывающие Tilda-попапы, ломавшие новый дизайн. Подключение модуля в `functions.php` было закомментировано.

Кроме того, модуль унаследовал ряд критических проблем безопасности: захардкоженные API-ключи, отсутствие CSRF-nonce, бесконечные cURL-таймауты и отсутствие лимитирования частоты запросов (Rate Limiting).

### Техническое задание (ТЗ)

1. **Скрещивание верстки и логики:** Заменить устаревший Tilda-шаблон внутри модуля `dashamail/` на актуальный PHP-шаблон из макета.
2. **Отказ от Tilda-попапов:** Скорректировать JS-логику так, чтобы сообщение об успешной подписке показывалось встроено (инлайн-оверлей поверх формы с анимацией).
3. **Безопасность и аудит:** Провести полный секьюрити-ревью модуля, скрыть API-ключи, добавить CSRF-защиту, таймауты и ограничение по IP.

---

## <SolarIcon name="clipboard" /> Полный список задач

| № | Задача | Описание |
|:---:|---|---|
| 05 | **Архитектура объединения футера с DashaMail** | Подготовка технического плана перехода |
| 05-1 | **Буферизируемый PHP-шаблон формы** | Перенос вёрстки в `dashamail/forms/footer.php` через `ob_start()` / `ob_get_clean()` |
| 05-2 | **Подключение модуля в `functions.php`** | Замена устаревшей константы `OCEANWP_THEME_DIR` на `get_template_directory()` |
| 05-3 | **Рефакторинг JS-обработчика** | Удаление Tilda-попапов; при успехе — класс `.is-active` и нативный оверлей |
| 05-4 | **Полный секьюрити-аудит** | Составление подробного отчёта по безопасности |
| 05-5 | **Устранение уязвимостей** | API-ключи → `wp-config.php`, `wp_verify_nonce`, `CURLOPT_TIMEOUT`, IP Rate Limiting |

---

## <SolarIcon name="bolt" /> Технические решения и ключевые сложности

### Сложность: Защита от спам-ботов через IP Rate-Limiting

::: warning Проблема
Даже при наличии `nonce`, боты могут генерировать массовые запросы на подписку, выжигая лимиты API-аккаунта DashaMail и перегружая сервер cURL-запросами.
:::

::: tip <SolarIcon name="lightbulb" /> Решение: Transient IP Rate-Limiter
Перед отправкой cURL-запроса в API DashaMail бэкенд проверяет количество вызовов с текущего IP-адреса пользователя через быстрый кэш WordPress (`transient`):

```php
function dm_check_rate_limit() {
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    $transient_key = 'dm_rate_' . md5( $ip );
    $request_count = get_transient( $transient_key );

    if ( false === $request_count ) {
        set_transient( $transient_key, 1, 60 ); // 1 запрос, сброс через 60 сек
    } elseif ( $request_count >= 3 ) {
        // [!code danger] Если более 3 запросов в минуту — мгновенная блокировка (429)
        wp_send_json( [ 
            'status' => 'error', 
            'message' => 'Слишком много попыток. Пожалуйста, подождите минуту.' 
        ] );
        exit;
    } else {
        set_transient( $transient_key, $request_count + 1, 60 );
    }
}
```
:::

---

## <SolarIcon name="shield" /> Секьюрити-аудит модуля DashaMail (`dashamail-security-review.md`)

::: details <SolarIcon name="clipboard" /> Посмотреть полный отчёт по аудиту безопасности исходного кода

### <SolarIcon name="check" /> Что было в порядке в исходном коде
* **Защита от прямого доступа к PHP-файлам:** Проверка `ABSPATH` в `init.php` и `forms/footer.php`.
* **Экранирование URL в шаблоне:** Наличие `esc_url()` на путях к ассетам.
* **Валидация email на сервере:** Использование `filter_var(..., FILTER_VALIDATE_EMAIL)` до передачи в API.
* **Безопасный вывод AJAX-ответов:** `wp_send_json()` + `send_nosniff_header()`.

---

### <SolarIcon name="danger" /> Критичные уязвимости

#### 1. API-ключ захардкожен в файле темы <Badge type="danger" text="Critical" />
* **Файл:** `themes/r7/dashamail/init.php`
* **Проблема:** API-ключ DashaMail прописан прямо в исходном коде темы. Компрометация репозитория приводит к компрометации ключа рассылок.
* **Решение:** Ключ и ID списка вынесены в `wp-config.php`:
```php
// wp-config.php
define( 'DM_API_KEY', '...' );
define( 'DM_LIST_ID', 12345 );
```

---

### <SolarIcon name="danger" /> Средние уязвимости

#### 1. Отсутствие CSRF-защиты (nonce) на AJAX-эндпоинте <Badge type="warning" text="Medium" />
* **Файлы:** `init.php`, `dm.js`
* **Проблема:** Обработчик принимал POST-запросы без проверки источника. Сторонний сайт мог спамить базу мусорными адресами.
* **Решение:** Внедрена проверка `wp_verify_nonce`:
```php
// В dm_enqueue_assets():
'nonce' => wp_create_nonce( 'dm_subscribe' )

// В dmAjaxAction():
if ( ! wp_verify_nonce( $_POST['nonce'] ?? '', 'dm_subscribe' ) ) {
    wp_send_json( [ 'status' => 'error', 'code' => 'forbidden' ] );
}
```

#### 2. Отсутствие Rate-Limiting по IP <Badge type="warning" text="Medium" />
* **Проблема:** Бот мог делать тысячи запросов в секунду, перегружая сервер cURL-запросами к внешнему API.
* **Решение:** Внедрен Transient-based rate limit по IP адресам с приманкой (Honeypot).

#### 3. Бесконечный таймаут cURL <Badge type="warning" text="Medium" />
* **Проблема:** `CURLOPT_TIMEOUT => 0`. При зависании сервиса DashaMail воркеры PHP блокировались бессрочно.
* **Решение:** Установлен разумный таймаут в 5 секунд:
```php
curl_setopt( $ch, CURLOPT_TIMEOUT, 5 );
curl_setopt( $ch, CURLOPT_CONNECTTIMEOUT, 3 );
```

---

### <SolarIcon name="check" /> Незначительные замечания

#### 1. `$_POST['email']` без проверки наличия ключа
* **Проблема:** Запрос без параметра `email` вызывал `Warning` в логах сервера.
* **Решение:** Безопасное чтение через `$_POST['email'] ?? ''`.

#### 2. Устаревший jQuery API `.success()`
* **Проблема:** Метод `.success()` удалён в jQuery 3.0+. Форма работала только благодаря `jQuery Migrate`.
* **Решение:** Переведено на нативный метод `.done()`.

---

### <SolarIcon name="chart" /> Итоговая сводка ревью безопасности

| Проблема | Уровень рисков | Статус исправления |
|---|---|:---:|
| API-ключ в исходном коде темы | 🔴 Критичное | ✅ Устранено (`wp-config.php`) |
| Отсутствие CSRF nonce | 🟡 Среднее | ✅ Устранено (`wp_verify_nonce`) |
| Отсутствие Rate-Limiting | 🟡 Среднее | ✅ Устранено (`Transient IP Limit`) |
| Бесконечный таймаут cURL | 🟡 Среднее | ✅ Устранено (`CURLOPT_TIMEOUT = 5`) |
| `$_POST['email']` без isset | 🟢 Незначительное | ✅ Устранено |
| `.success()` вместо `.done()` | 🟢 Незначительное | ✅ Устранено |

:::

---

## <SolarIcon name="clipboard" /> Отчёт по результатам интеграции (`dashamail-footer-report.txt`)

::: details <SolarIcon name="clipboard" /> Посмотреть полностью отчёт по файлам и результатам тестирования

### Список затронутых файлов темы
* `themes/r7/functions.php` — активировано подключение модуля `dashamail` через `get_template_directory()`.
* `themes/r7/footer.php` — статичная заглушка формы заменена вызовом `dm_footer_shortcode()`.
* `themes/r7/dashamail/init.php` — обновлена инициализация, исправлен двойной тег `<?php`, переписана функция `dm_footer_shortcode()` под PHP-шаблон с буферизацией.
* `themes/r7/dashamail/dm.js` — обновлён AJAX-обработчик: добавлена активация класса `.is-active` на успех, заменён устаревший `.success()` на `.done()` (для jQuery 3.7.1), убран Tilda-попап.
* `themes/r7/dashamail/dm.css` — удалены устаревшие стили Tilda-форм.
* `themes/r7/dashamail/forms/footer.php` — создан новый PHP-шаблон формы на базе актуальной вёрстки.

### Результаты тестирования на dev-среде
* Проведена полная проверка интерактивных состояний формы:
  * При первой успешной подписке показывается красивый инлайн-блок «Спасибо за вашу подписку».
  * При повторной попытке ввода того же email выводится сообщение «Вы уже подписаны на рассылку!».
* Подтверждена передача данных: новые подписчики успешно добавляются по API в список DashaMail.
:::

---

## <SolarIcon name="chart" /> Итоговые результаты

::: tip <SolarIcon name="trophy" /> Достижения проекта
| Показатель | До доработки | После доработки |
|---|---|---|
| **Работоспособность футера** | Визуальный муляж без отправки | **100% живая подписка DashaMail по AJAX** |
| **UX подтверждения** | Устаревший Tilda-попап | **Инлайн-оверлей с плавной CSS-анимацией** |
| **Безопасность API-ключей** | Ключи в открытом коде репозитория | **Изолированы в `wp-config.php`** |
| **Устойчивость к спаму** | Отсутствовала | **CSRF-Nonce + Rate Limit (макс 3 запроса/мин)** |
:::
