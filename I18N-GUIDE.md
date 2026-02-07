# Инструкция по работе с многоязычным сайтом VitePress

## Структура проекта

```
docs/
├── .vitepress/
│   └── config.mts          # Конфигурация с настройками locales
├── index.md                # Главная страница (английская, по умолчанию)
├── markdown-examples.md    # Английская версия
├── api-examples.md         # Английская версия
└── ru/                     # Папка для русского языка
    ├── index.md            # Главная страница (русская)
    ├── markdown-examples.md # Русская версия
    └── api-examples.md     # Русская версия
```

## Как это работает

1. **Английская версия** (root locale):
   - Файлы находятся в корне папки `docs/`
   - Доступны по адресу: `http://localhost:5173/`
   - Пример: `http://localhost:5173/markdown-examples`

2. **Русская версия** (/ru/ locale):
   - Файлы находятся в папке `docs/ru/`
   - Доступны по адресу: `http://localhost:5173/ru/`
   - Пример: `http://localhost:5173/ru/markdown-examples`

3. **Переключатель языков**:
   - Появляется автоматически в навигационной панели (справа вверху)
   - Позволяет переключаться между языками

## Добавление новой страницы

### Для английской версии:
1. Создайте файл в `docs/`, например `docs/about.md`
2. Добавьте ссылку в `config.mts` в секцию `locales.root.themeConfig.nav` или `sidebar`

### Для русской версии:
1. Создайте файл в `docs/ru/`, например `docs/ru/about.md`
2. Добавьте ссылку в `config.mts` в секцию `locales.ru.themeConfig.nav` или `sidebar`

## Пример добавления страницы "О себе"

### 1. Создать файлы:
- `docs/about.md` (английская версия)
- `docs/ru/about.md` (русская версия)

### 2. Обновить config.mts:

```typescript
locales: {
  root: {
    // ...
    themeConfig: {
      nav: [
        { text: 'Home', link: '/' },
        { text: 'About', link: '/about' },  // <- добавить
        { text: 'Examples', link: '/markdown-examples' }
      ],
      // ...
    }
  },
  ru: {
    // ...
    themeConfig: {
      nav: [
        { text: 'Главная', link: '/ru/' },
        { text: 'О себе', link: '/ru/about' },  // <- добавить
        { text: 'Примеры', link: '/ru/markdown-examples' }
      ],
      // ...
    }
  }
}
```

## Полезные ссылки

- [Официальная документация VitePress i18n](https://vitepress.dev/ru/guide/i18n)
- [Конфигурация темы по умолчанию](https://vitepress.dev/reference/default-theme-config)

## Команды

- `npm run docs:dev` - запустить dev-сервер
- `npm run docs:build` - собрать сайт для продакшена
- `npm run docs:preview` - предпросмотр собранного сайта
