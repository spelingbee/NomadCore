export default defineNuxtConfig({
  ssr: false,
  modules: ['@nuxtjs/tailwindcss', '@vite-pwa/nuxt'],
  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#111310' }
      ]
    }
  },
  // Оболочка предрендерится и кладётся в кэш: первый экран не ждёт сеть.
  nitro: { prerender: { routes: ['/'] } },
  pwa: {
    registerType: 'autoUpdate',
    workbox: { globPatterns: ['**/*.{js,css,html}'], navigateFallback: '/' },
    manifest: { name: 'NomadCore', short_name: 'NomadCore', display: 'standalone', background_color: '#EDEDEA' }
  },
  experimental: { payloadExtraction: false }
})
