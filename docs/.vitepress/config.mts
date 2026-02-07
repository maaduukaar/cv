import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      title: "Max Shvedov",
      description: "Life Path in the World of Technology",
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Examples', link: '/markdown-examples' }
        ],

        sidebar: [
          {
            text: 'Examples',
            items: [
              { text: 'Markdown Examples', link: '/markdown-examples' },
              { text: 'Runtime API Examples', link: '/api-examples' }
            ]
          }
        ],

        socialLinks: [
          { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
        ]
      }
    },
    ru: {
      label: 'Русский',
      lang: 'ru',
      link: '/ru/',
      title: "Макс Шведов",
      description: "Жизненный путь в мире технологий",
      themeConfig: {
        outlineTitle: 'Содержание страницы',
        darkModeSwitchLabel: 'Оформление',
        sidebarMenuLabel: 'Меню',
        returnToTopLabel: 'Вернуться к началу',
        langMenuLabel: 'Изменить язык',
        
        docFooter: {
          prev: 'Предыдущая страница',
          next: 'Следующая страница'
        },
        
        nav: [
          { text: 'Главная', link: '/ru/' },
          { text: 'Примеры', link: '/ru/markdown-examples' }
        ],

        sidebar: [
          {
            text: 'Обо мне',
            link: '/ru/about-me'
          },
          {
            text: 'Автоматизация',
            items: [
              { text: 'Обработка контента', link: '/ru/content-processing' }
            ]
          },
          {
            text: 'Доработка сайтов',
            items: [
              {
                text: 'ModX',
                collapsed: true,
                items: [
                  { text: 'Кейс ModX №1', link: '/ru/modx-case-1' },
                  { text: 'Кейс ModX №2', link: '/ru/modx-case-2' }
                ]
              }
            ]
          },          
          {
            text: 'Примеры',
            items: [
              { text: 'Примеры Markdown', link: '/ru/markdown-examples' },
              { text: 'Примеры Runtime API', link: '/ru/api-examples' }
            ]
          }
        ],

        socialLinks: [
          { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
        ]
      }
    }
  }
})
