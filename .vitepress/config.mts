import { defineConfig } from 'vitepress'
import { solarIconsMarkdownPlugin } from './solar-icons'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/cv/',
  markdown: {
    config(md) {
      solarIconsMarkdownPlugin(md)
    }
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      title: "Max Shvedov",
      description: "Life Path in the World of Technology",
      themeConfig: {
        outlineTitle: 'On this page',
        darkModeSwitchLabel: 'Appearance',
        sidebarMenuLabel: 'Menu',
        returnToTopLabel: 'Back to top',
        langMenuLabel: 'Change language',

        docFooter: {
          prev: 'Previous page',
          next: 'Next page'
        },

        nav: [
          { text: 'Home', link: '/' },
          { text: 'Projects', link: '/#projects' },
          { text: 'Writing & editing', link: '/technical-writing' },
          { text: 'About', link: '/about-me' },
          { text: 'Q&A', link: '/faq' }
        ],

        sidebar: [
          {
            text: 'About Me',
            items: [
              { text: 'About Me', link: '/about-me' },
              { text: 'Questions and Answers (Q&A)', link: '/faq' }
            ]
          },
          {
            text: 'Technical Writing & Editing',
            items: [
              { text: 'Editorial approach', link: '/technical-writing' },
              { text: 'R7 Disk SSO guide: before & after', link: '/r7-sso-editing' }
            ]
          },
          {
            text: 'Automation',
            items: [
              { text: 'Content Processing', link: '/content-processing' },
              { text: 'PDF to Audiobook: Interactive CLI', link: '/pdf-to-audiobook' }
            ]
          },
          {
            text: 'Website Development',
            items: [
              {
                text: 'WordPress',
                collapsed: true,
                items: [
                  {
                    text: 'Introduction',
                    collapsed: true,
                    items: [
                      { text: 'Hosting', link: '/wordpress/hosting' }
                    ]
                  }
                ]
              }
            ]
          },
          {
            text: 'Web Applications',
            items: [
              {
                text: 'Telegram Mini Apps',
                collapsed: false,
                items: [
                  { text: 'Priya Sleep: Baby Sleep Tracker', link: '/priya-sleep' }
                ]
              },
              {
                text: 'Telegram Bots',
                collapsed: false,
                items: [
                  { text: 'BiblioBot: Book subscriptions', link: '/bibliobot' }
                ]
              }
            ]
          },
          {
            text: 'Website Enhancements',
            items: [
              {
                text: 'WordPress',
                collapsed: false,
                items: [
                  { text: 'R7 Office Document Builder API', link: '/r7-document-api' },
                  { text: 'Download Preview Landing & Early Access', link: '/r7-download-preview' },
                  { text: 'Category Template “FAQ: Questions and Answers”', link: '/r7-category-faq' },
                  { text: 'Image Alignment (.aligncenter)', link: '/r7-image-alignment' },
                  { text: 'Photo Caption Styling and Numbering', link: '/r7-image-captions' },
                  { text: 'DashaMail Footer Reskin and Security', link: '/r7-dashamail-footer' }
                ]
              },
              {
                text: 'PHP / Legacy',
                collapsed: false,
                items: [
                  { text: 'Protecting the Company Creation Form', link: '/contact-create-page' }
                ]
              },
              {
                text: 'ModX',
                collapsed: true,
                items: [
                  { text: 'ModX Case #1', link: '/modx-case-1' },
                  { text: 'ModX Case #2', link: '/modx-case-2' }
                ]
              }
            ]
          }
        ],

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
          { text: 'Проекты', link: '/ru/#projects' },
          { text: 'Работа с текстом', link: '/ru/technical-writing' },
          { text: 'Обо мне', link: '/ru/about-me' },
          { text: 'Q&A', link: '/ru/faq' }
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
            text: 'Техническое писательство и редактура',
            items: [
              { text: 'Работа с текстом', link: '/ru/technical-writing' },
              { text: 'Инструкция по SSO: было / стало', link: '/ru/r7-sso-editing' }
            ]
          },
          {
            text: 'Автоматизация',
            items: [
              { text: 'Обработка контента', link: '/ru/content-processing' },
              { text: 'PDF в MP3-аудиокнигу: интерактивная CLI', link: '/ru/pdf-to-audiobook' }
            ]
          },
          {
            text: 'Веб-приложения',
            items: [
              {
                text: 'Telegram Mini Apps',
                collapsed: false,
                items: [
                  { text: 'Прия Спит: Трекер сна в Telegram', link: '/ru/priya-sleep' }
                ]
              },
              {
                text: 'Telegram Bots',
                collapsed: false,
                items: [
                  { text: 'BiblioBot: Подписки на книги', link: '/ru/bibliobot' }
                ]
              }
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
                  { text: 'Лендинг скачивания превью-версий', link: '/ru/r7-download-preview' },
                  { text: 'Категорийный шаблон «FAQ: Вопросы-ответы»', link: '/ru/r7-category-faq' },
                  { text: 'Выравнивание изображений (.aligncenter)', link: '/ru/r7-image-alignment' },
                  { text: 'Оформление и нумерация подписей к фото', link: '/ru/r7-image-captions' },
                  { text: 'Рескин и безопасность футера DashaMail', link: '/ru/r7-dashamail-footer' }
                ]
              },
              {
                text: 'PHP / Legacy',
                collapsed: false,
                items: [
                  { text: 'Защита формы создания компаний', link: '/ru/contact-create-page' }
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
          }
        ],

      }
    }
  }
})
