import type { BookingStatus } from "~/types"

/**
 * Статус НИКОГДА не передаётся одним цветом.
 *
 * Три статусных тона выровнены по светлоте в OKLCH (L 0,46–0,48), чтобы ни
 * один не кричал громче остальных. Плата за это — в градациях серого они
 * практически неразличимы: CONFIRMED и CHECKED_IN дают контраст ~1,01:1.
 * Поэтому у статуса всегда есть второй канал, и в узких местах — глиф:
 * он переживает и обесцвечивание, и дальтонизм, и полосу шириной 40px.
 * Глиф печатается ПЕРЕД именем и в бюджет усечения имени не входит.
 */
const GLYPHS: Record<BookingStatus, string> = {
	HOLD: "?", // решения ещё нет
	CONFIRMED: "→", // заедет, ещё не в доме
	CHECKED_IN: "●", // гость в доме
	CHECKED_OUT: "✓", // закрыто
	CANCELLED: "×",
}

const COLOR_VARS: Record<BookingStatus, string> = {
	HOLD: "var(--nc-status-hold)",
	CONFIRMED: "var(--nc-status-confirmed)",
	CHECKED_IN: "var(--nc-status-inhouse)",
	CHECKED_OUT: "var(--nc-status-out)",
	CANCELLED: "var(--nc-status-cancelled)",
}

export function statusGlyph(status: BookingStatus): string {
	return GLYPHS[status]
}

/** Токен цвета статуса. Возвращается var(), а не значение: тема решает сама. */
export function statusColorVar(status: BookingStatus): string {
	return COLOR_VARS[status]
}

/** Ключ словаря i18n для полного названия статуса. */
export function statusKey(status: BookingStatus): string {
	return `booking.status.${status}`
}
