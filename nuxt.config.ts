// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },

  modules: [
    'shadcn-nuxt',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
  ],

  runtimeConfig: {
    public: {
      apiBaseUrl: '/api/v1',
    },
  },

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },

  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'ru', name: 'Русский', file: 'ru.json' },
      { code: 'kg', name: 'Кыргызча', file: 'kg.json' },
    ],
    defaultLocale: 'ru',
    langDir: '../locales',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
  },

  css: [
    '~/assets/css/globals.css',
  ],

  app: {
    head: {
      title: 'Nomad Core - Tourism Operating System for Kyrgyzstan',
      meta: [
        { name: 'description', content: 'A unified digital platform connecting travelers, tourism partners, and government stakeholders to showcase and manage Kyrgyzstan\'s natural beauty and cultural heritage.' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap' },
        { rel: 'icon', href: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
        { rel: 'icon', href: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
        { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-icon.png' },
      ],
    },
  },
})
