# Working with a Multilingual VitePress Site

## Project Structure

```text
docs/
├── .vitepress/
│   └── config.mts           # Configuration with locale settings
├── index.md                 # Home page (English by default)
├── about-me.md              # English version
├── contact-create-page.md   # English version
└── ru/                      # Russian-language directory
    ├── index.md             # Russian home page
    ├── about-me.md          # Russian version
    └── contact-create-page.md # Russian version
```

## How It Works

1. **English version** (root locale):
   - Files are located in the `docs/` root directory.
   - Available at: `http://localhost:5173/`
   - Example: `http://localhost:5173/about-me`

2. **Russian version** (`/ru/` locale):
   - Files are located in the `docs/ru/` directory.
   - Available at: `http://localhost:5173/ru/`
   - Example: `http://localhost:5173/ru/about-me`

3. **Language switcher**:
   - Appears automatically in the navigation bar at the top right.
   - Allows visitors to switch between languages.

## Adding a New Page

### English Version

1. Create a file in `docs/`, for example `docs/about.md`.
2. Add a link to the `locales.root.themeConfig.nav` or `sidebar` section in `config.mts`.

### Russian Version

1. Create a file in `docs/ru/`, for example `docs/ru/about.md`.
2. Add a link to the `locales.ru.themeConfig.nav` or `sidebar` section in `config.mts`.

## Example: Adding an “About” Page

### 1. Create the Files

- `docs/about.md` — English version
- `docs/ru/about.md` — Russian version

### 2. Update `config.mts`

```typescript
locales: {
  root: {
    // ...
    themeConfig: {
      nav: [
        { text: 'Home', link: '/' },
        { text: 'About', link: '/about' }, // Add this entry
        { text: 'Q&A', link: '/faq' }
      ],
      // ...
    }
  },
  ru: {
    // ...
    themeConfig: {
      nav: [
        { text: 'Главная', link: '/ru/' },
        { text: 'О себе', link: '/ru/about' }, // Add this entry
        { text: 'Q&A', link: '/ru/faq' }
      ],
      // ...
    }
  }
}
```

## Useful Links

- [Official VitePress i18n documentation](https://vitepress.dev/guide/i18n)
- [Default theme configuration](https://vitepress.dev/reference/default-theme-config)

## Commands

- `npm run docs:dev` — start the development server
- `npm run docs:build` — build the production site
- `npm run docs:preview` — preview the production build
