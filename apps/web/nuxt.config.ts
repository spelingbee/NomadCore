// Nuxt 3 + PWA (offline-first) + i18n (ky/ru)
export default defineNuxtConfig({
	compatibilityDate: "2026-07-01",
	// Offline-first PWA: рендер только на клиенте.
	// Dexie/IndexedDB недоступны в Node, поэтому SSR приводил к ошибкам dev-сервера.
	ssr: false,
	modules: ["@nuxtjs/i18n", "@nuxtjs/tailwindcss", "@vite-pwa/nuxt"],

	// Токены подключаются ПЕРВЫМИ, утилиты Tailwind — после них, иначе базовые
	// правила tokens.css перекрывали бы утилиты, а не наоборот.
	css: ["~/design-system/tokens.css"],
	tailwindcss: { cssPath: "~/assets/css/tailwind.css" },

	// Примитивы дизайн-системы регистрируются глобально без префикса пути:
	// в шаблонах они пишутся как <NcButton>, а не <DesignSystemPrimitivesNcButton>.
	// Массив ЗАМЕНЯЕТ умолчание, поэтому ~/components перечислен явно.
	components: [
		{ path: "~/design-system/primitives", pathPrefix: false },
		{ path: "~/components", pathPrefix: false },
	],

	app: {
		head: {
			htmlAttrs: { lang: "ru" },
			meta: [
				{
					name: "viewport",
					content:
						"width=device-width, initial-scale=1, viewport-fit=cover",
				},
			],
		},
	},

	runtimeConfig: {
		public: {
			apiBase: process.env.NUXT_PUBLIC_API_BASE ?? "http://localhost:3001/api",
			// Демо-режим: слой данных берёт fixtures/demo.ts вместо живого API.
			// Включён по умолчанию, пока рядом нет поднятого бэкенда.
			// Выключение: NUXT_PUBLIC_DEMO=0
			demo: process.env.NUXT_PUBLIC_DEMO !== "0",
			// Показывать ли блоки, которые нечем реализовать против текущего
			// API: «Документы», «Продлить», «Ранний выезд», «Другой номер».
			// ВЫКЛЮЧЕНО по умолчанию: владелец гостевого дома не должен читать
			// «PATCH /api/bookings/:id не существует» — он прочтёт это как
			// поломку. Включается для разбора: NUXT_PUBLIC_SHOW_API_GAPS=1
			// Список пробелов в любом случае живёт в docs/WEB-API-GAPS.md.
			showApiGaps: process.env.NUXT_PUBLIC_SHOW_API_GAPS === "1",
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
			// Единственное место во фронте, где цвет записан литералом:
			// манифест — это статический JSON, var(--nc-*) он не читает.
			// Значения = --nc-action-primary-bg и --nc-bg-canvas светлой темы.
			theme_color: "#111310",
			background_color: "#EDEDEA",
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
