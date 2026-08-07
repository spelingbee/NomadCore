import type { Config } from "tailwindcss"
import { ncPreset } from "./design-system/tailwind-preset"

/**
 * Литералов цвета и кегля здесь нет и быть не может: единственный источник —
 * design-system/tokens.css, который пресет читает через var(--nc-*).
 *
 * Шкала отступов пресетом ЗАМЕНЕНА, а не расширена: доступны только
 * 0 2 4 8 12 16 24 32 48, и имя утилиты равно числу пикселей. Поэтому p-4
 * это 4px, а не 16px как в стоковом Tailwind, а p-3 не существует вовсе.
 */
export default <Partial<Config>>{
	presets: [ncPreset],
	content: [
		"./app.vue",
		"./components/**/*.vue",
		"./design-system/primitives/**/*.vue",
		"./layouts/**/*.vue",
		"./pages/**/*.vue",
		"./composables/**/*.ts",
	],
}
