// Nuxt 3 + PWA (offline-first) + i18n (ky/ru)
export default defineNuxtConfig({
	compatibilityDate: "2026-07-01",
	// Offline-first PWA: рендер только на клиенте.
	// Dexie/IndexedDB недоступны в Node, поэтому SSR приводил к ошибкам dev-сервера.
	ssr: false,
	modules: ["@nuxtjs/i18n", "@vite-pwa/nuxt"],
	runtimeConfig: {
		public: {
			apiBase: process.env.NUXT_PUBLIC_API_BASE ?? "http://localhost:3001/api",
		},
	},
	i18n: {
		locales: [
			{ code: "ru", name: "Русский", file: "ru.json" },
			{ code: "ky", name: "Кыргызча", file: "ky.json" },
			{ code: "en", name: "English", file: "en.json" },
		],
		defaultLocale: "ru",
		langDir: "locales",
		strategy: "no_prefix",
		// Сохраняем выбор языка между сессиями (cookie), иначе setLocale слетает при перезагрузке
		detectBrowserLanguage: {
			useCookie: true,
			cookieKey: "nomadcore_locale",
			redirectOn: "root",
			fallbackLocale: "ru",
		},
	},
	pwa: {
		registerType: "autoUpdate",
		manifest: {
			name: "NomadCore — Тетрадка",
			short_name: "NomadCore",
			description: "Цифровая тетрадка для гостевых домов КР",
			theme_color: "#1c4532",
			background_color: "#ffffff",
			display: "standalone",
			lang: "ru",
			icons: [
				{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
				{ src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
			],
		},
		workbox: {
			// Офлайн-оболочка: кэшируем статику, API — NetworkFirst с фолбэком в кэш.
			navigateFallback: "/",
			runtimeCaching: [
				{
					urlPattern: /\/api\/.*$/,
					handler: "NetworkFirst",
					options: {
						cacheName: "api-cache",
						networkTimeoutSeconds: 5,
						expiration: { maxEntries: 200, maxAgeSeconds: 7 * 24 * 3600 },
					},
				},
			],
		},
	},
})
