/**
 * Тема оформления. Три состояния, а не два:
 *
 *   system — атрибута на <html> нет, решает @media (prefers-color-scheme)
 *   light  — data-nc-theme="light", системная тёмная принудительно отключена
 *   dark   — data-nc-theme="dark"
 *
 * Оба канала описаны в design-system/tokens.css и обязаны работать
 * независимо: светлая тема выставлена не только на :root, но и на
 * [data-nc-theme='light'], а медиазапрос закрыт гардом
 * :root:not([data-nc-theme='light']) — иначе явный выбор «светлая»
 * не пересилил бы системную тёмную.
 */
export type NcTheme = "system" | "light" | "dark"

const STORAGE_KEY = "nc.theme"
const ORDER: NcTheme[] = ["system", "light", "dark"]

function isTheme(value: unknown): value is NcTheme {
	return value === "system" || value === "light" || value === "dark"
}

export function useTheme() {
	const theme = useState<NcTheme>("nc-theme", () => "system")

	function apply(value: NcTheme): void {
		if (!import.meta.client) return
		const root = document.documentElement
		if (value === "system") root.removeAttribute("data-nc-theme")
		else root.setAttribute("data-nc-theme", value)
	}

	function set(value: NcTheme): void {
		theme.value = value
		if (import.meta.client) localStorage.setItem(STORAGE_KEY, value)
		apply(value)
	}

	/** Вызывается один раз из app.vue: восстанавливает выбор до первой отрисовки. */
	function init(): void {
		if (!import.meta.client) return
		const saved = localStorage.getItem(STORAGE_KEY)
		theme.value = isTheme(saved) ? saved : "system"
		apply(theme.value)
	}

	function cycle(): void {
		set(ORDER[(ORDER.indexOf(theme.value) + 1) % ORDER.length]!)
	}

	/** Что реально видит владелец сейчас — нужно для подписи переключателя. */
	const resolved = computed<"light" | "dark">(() => {
		if (theme.value !== "system") return theme.value
		if (!import.meta.client) return "light"
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light"
	})

	return { theme, resolved, set, init, cycle }
}
