/**
 * Даты броней — КАЛЕНДАРНЫЕ, без времени: 'YYYY-MM-DD'.
 * Интервал полуоткрытый: [checkIn, checkOut). Ночь принадлежит дню заезда,
 * поэтому выезд 12-го и заезд 12-го в тот же номер — НЕ пересечение.
 *
 * Сервер отдаёт колонки @db.Date, и Prisma сериализует их как ISO-строку
 * с UTC-полуночью («2026-08-07T00:00:00.000Z»). Прогонять их через
 * локальный форматтер нельзя: западнее UTC сутки сдвинутся на день назад.
 * Поэтому весь модуль работает в UTC и на строках, а не на Date.
 */

const DAY_MS = 86_400_000

/** Любое серверное представление даты → 'YYYY-MM-DD'. */
export function toDay(value: string): string {
	return value.slice(0, 10)
}

function utc(day: string): number {
	const [y, m, d] = day.split("-").map(Number)
	return Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1)
}

export function addDays(day: string, n: number): string {
	return new Date(utc(day) + n * DAY_MS).toISOString().slice(0, 10)
}

/** Число ночей в полуинтервале. */
export function nights(from: string, to: string): number {
	return Math.round((utc(to) - utc(from)) / DAY_MS)
}

export function eachDay(from: string, count: number): string[] {
	return Array.from({ length: count }, (_, i) => addDays(from, i))
}

/** Ночь `day` занята бронью. Выезд в этот день ночь НЕ занимает. */
export function coversNight(
	b: { checkIn: string; checkOut: string },
	day: string,
): boolean {
	const from = toDay(b.checkIn)
	const to = toDay(b.checkOut)
	return from <= day && day < to
}

/** Пересечение полуинтервалов. Стык (выезд = заезд) даёт false. */
export function overlaps(
	a: { checkIn: string; checkOut: string },
	b: { checkIn: string; checkOut: string },
): boolean {
	return toDay(a.checkIn) < toDay(b.checkOut) && toDay(b.checkIn) < toDay(a.checkOut)
}

/** «Сегодня» в таймзоне ОБЪЕКТА, а не устройства: владелец бывает в роуминге. */
export function todayIn(timezone: string): string {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: timezone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}).format(new Date())
}

export function dayOfWeek(day: string): number {
	return new Date(utc(day)).getUTCDay()
}

export function isWeekend(day: string): boolean {
	const d = dayOfWeek(day)
	return d === 0 || d === 6
}

export function dayNumber(day: string): number {
	return new Date(utc(day)).getUTCDate()
}

export function monthIndex(day: string): number {
	return new Date(utc(day)).getUTCMonth()
}
