import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/cv/',
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
          { text: 'Q&A', link: '/ru/faq' },
          { text: 'Примеры', link: '/ru/markdown-examples' }
        ],

        sidebar: [
          {
            text: 'Обо мне',
            items: [
              { text: 'Обо мне', link: '/ru/about-me' },
              { text: 'Вопросы и ответы (Q&A)', link: '/ru/faq' }
            ]
          },
          {
            text: 'Автоматизация',
            items: [
              { text: 'Обработка контента', link: '/ru/content-processing' }
            ]
          },
          {
            text: 'Разработка сайтов',
            items: [
              {
                text: 'WordPress',
                collapsed: true,
                items: [
                  {
                    text: 'Введение',
                    collapsed: true,
                    items: [
                      { text: 'Хостинг', link: '/ru/wordpress/hosting' }
                    ]
                  }
                ]
              }
            ]
          },            
          {
            text: 'Доработка сайтов',
            items: [
              {
                text: 'WordPress',
                collapsed: false,
                items: [
                  { text: 'Р7-Офис API Документ Конструктора', link: '/ru/r7-document-api' },
                  { text: 'Категорийный шаблон «FAQ: Вопросы-ответы»', link: '/ru/r7-category-faq' },
                  { text: 'Выравнивание изображений (.aligncenter)', link: '/ru/r7-image-alignment' },
                  { text: 'Оформление и нумерация подписей к фото', link: '/ru/r7-image-captions' },
                  { text: 'Рескин и безопасность футера DashaMail', link: '/ru/r7-dashamail-footer' }
                ]
              },
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
