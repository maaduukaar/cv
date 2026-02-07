---
outline: deep
---

# Примеры Runtime API

Эта страница демонстрирует использование некоторых runtime API, предоставляемых VitePress.

Основной API `useData()` может использоваться для доступа к данным сайта, темы и страницы для текущей страницы. Он работает как в файлах `.md`, так и в `.vue`:

```md
<script setup>
import { useData } from 'vitepress'

const { theme, page, frontmatter } = useData()
</script>

## Результаты

### Данные темы
<pre>{{ theme }}</pre>

### Данные страницы
<pre>{{ page }}</pre>

### Frontmatter страницы
<pre>{{ frontmatter }}</pre>
```

<script setup>
import { useData } from 'vitepress'

const { site, theme, page, frontmatter } = useData()
</script>

## Результаты

### Данные темы
<pre>{{ theme }}</pre>

### Данные страницы
<pre>{{ page }}</pre>

### Frontmatter страницы
<pre>{{ frontmatter }}</pre>

## Дополнительно

Ознакомьтесь с документацией для получения [полного списка runtime API](https://vitepress.dev/reference/runtime-api#usedata).
