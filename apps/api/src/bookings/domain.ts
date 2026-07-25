/**
 * Чистое доменное ядро бронирований — без зависимостей от Nest/Prisma.
 * Тестируется отдельно: node --experimental-strip-types --test domain.test.ts
 * (без parameter properties — они не поддерживаются strip-types)
 */

export const BOOKING_STATUSES = [
	"HOLD",
	"CONFIRMED",
	"CHECKED_IN",
	"CHECKED_OUT",
	"CANCELLED",
] as const

export type BookingStatus = (typeof BOOKING_STATUSES)[number]

/** Статусная машина (§2 ТЗ): HOLD → CONFIRMED → CHECKED_IN → CHECKED_OUT. */
const TRANSITIONS: Record<BookingStatus, ReadonlyArray<BookingStatus>> = {
	HOLD: ["CONFIRMED", "CANCELLED"],
	CONFIRMED: ["CHECKED_IN", "CANCELLED"],
	CHECKED_IN: ["CHECKED_OUT"],
	CHECKED_OUT: [],
	CANCELLED: [],
}

export function canTransition(
	from: BookingStatus,
	to: BookingStatus,
): boolean {
	return TRANSITIONS[from].includes(to)
}

export class InvalidTransitionError extends Error {
	readonly from: BookingStatus
	readonly to: BookingStatus

	constructor(from: BookingStatus, to: BookingStatus) {
		super(`INVALID_TRANSITION: ${from} -> ${to}`)
		this.from = from
		this.to = to
	}
}

export function assertTransition(from: BookingStatus, to: BookingStatus): void {
	if (!canTransition(from, to)) throw new InvalidTransitionError(from, to)
}

/** Статусы, занимающие номер (участвуют в проверке овербукинга). */
export const BLOCKING_STATUSES: ReadonlyArray<BookingStatus> = [
	"HOLD",
	"CONFIRMED",
	"CHECKED_IN",
]

export type DateRange = {
	/** ISO-дата YYYY-MM-DD (день заезда, включительно) */
	checkIn: string
	/** ISO-дата YYYY-MM-DD (день выезда, ИСКЛЮЧИТЕЛЬНО) */
	checkOut: string
}

export class InvalidRangeError extends Error {
	constructor(message: string) {
		super(`INVALID_RANGE: ${message}`)
	}
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export function assertValidRange(range: DateRange): void {
	if (!ISO_DATE.test(range.checkIn) || !ISO_DATE.test(range.checkOut)) {
		throw new InvalidRangeError("dates must be YYYY-MM-DD")
	}
	if (range.checkIn >= range.checkOut) {
		throw new InvalidRangeError("checkIn must be before checkOut")
	}
}

/**
 * Пересечение полуинтервалов [checkIn, checkOut).
 * День выезда = день заезда следующего гостя — НЕ конфликт (back-to-back).
 */
export function rangesOverlap(a: DateRange, b: DateRange): boolean {
	return a.checkIn < b.checkOut && b.checkIn < a.checkOut
}

export type ExistingBooking = DateRange & {
	id: string
	status: BookingStatus
}

/** Брони, конфликтующие с кандидатом (учитываются только блокирующие статусы). */
export function findConflicts(
	candidate: DateRange,
	existing: ReadonlyArray<ExistingBooking>,
): ExistingBooking[] {
	assertValidRange(candidate)
	return existing.filter(
		(b) =>
			BLOCKING_STATUSES.includes(b.status) && rangesOverlap(candidate, b),
	)
}

export function nightsCount(range: DateRange): number {
	assertValidRange(range)
	const MS_PER_DAY = 86_400_000
	const start = Date.parse(`${range.checkIn}T00:00:00Z`)
	const end = Date.parse(`${range.checkOut}T00:00:00Z`)
	return Math.round((end - start) / MS_PER_DAY)
}

/** Цена = базовая цена за ночь × количество ночей (Фаза 0.1: без сезонов/скидок). */
export function calcPriceTotal(
	basePricePerNight: number,
	range: DateRange,
): number {
	return Math.round(basePricePerNight * nightsCount(range) * 100) / 100
}

/** Дни проживания [checkIn, checkOut) — день выезда НЕ входит. */
export function occupiedDates(range: DateRange): string[] {
	assertValidRange(range)
	const result: string[] = []
	for (let d = range.checkIn; d < range.checkOut; d = nextDay(d)) {
		result.push(d)
	}
	return result
}

export function nextDay(isoDate: string): string {
	const t = Date.parse(`${isoDate}T00:00:00Z`)
	return new Date(t + 86_400_000).toISOString().slice(0, 10)
}
