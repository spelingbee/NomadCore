/**
 * Типы фронта. Форма списана с РЕАЛЬНЫХ ответов apps/api, а не с прототипа:
 * поле, которого сервер не отдаёт, здесь заводить нельзя — иначе экран
 * «работает» на демо-фикстурах и падает на живом API.
 *
 * Сверено с apps/api/prisma/schema.prisma и контроллерами:
 * - даты приходят из колонок @db.Date и сериализуются как ISO-строка
 *   с UTC-полуночью («2026-08-07T00:00:00.000Z»);
 * - Decimal(10,2) сериализуется СТРОКОЙ, не числом — сравнивать как строку;
 * - source не enum, а свободная строка: manual | bot | marketplace.
 */

export type BookingStatus =
	| "HOLD"
	| "CONFIRMED"
	| "CHECKED_IN"
	| "CHECKED_OUT"
	| "CANCELLED"

/** Локальное состояние отправки. На сервер не уходит и оттуда не приходит. */
export type SyncState = "ok" | "pending" | "conflict" | "rejected"

/** Разрешённые переходы. Соответствует apps/api/src/bookings/domain.ts. */
export const NEXT: Record<BookingStatus, BookingStatus | null> = {
	HOLD: "CONFIRMED",
	CONFIRMED: "CHECKED_IN",
	CHECKED_IN: "CHECKED_OUT",
	CHECKED_OUT: null,
	CANCELLED: null,
}

/** Статусы, занимающие номер. Совпадает с BLOCKING_STATUSES на бэкенде. */
export const BLOCKING: readonly BookingStatus[] = [
	"HOLD",
	"CONFIRMED",
	"CHECKED_IN",
]

export const CANCELLABLE: readonly BookingStatus[] = [
	"HOLD",
	"CONFIRMED",
	"CHECKED_IN",
]

export type RoomType = {
	id: string
	propertyId: string
	name: string
	capacity: number
	/** Decimal(10,2) → строка. */
	basePrice: string
}

export type Room = {
	id: string
	propertyId: string
	roomTypeId: string
	/** То, что владелец пишет на ключе: «3», «Ю1». */
	label: string
	roomType?: RoomType
}

export type Guest = {
	id: string
	propertyId: string
	name: string
	phone: string | null
	notes: string | null
}

export type Property = {
	id: string
	name: string
	slug: string | null
	region: string | null
	address: string | null
	/** Все даты объекта читаются в этой зоне, а не в зоне устройства. */
	timezone: string
	roomTypes?: RoomType[]
	rooms?: Room[]
}

export type Booking = {
	id: string
	propertyId: string
	roomId: string
	guestId: string
	/** Полуинтервал [checkIn, checkOut): выезд и заезд в один день не конфликтуют. */
	checkIn: string
	checkOut: string
	status: BookingStatus
	/** Decimal(10,2) → строка. */
	priceTotal: string
	source: string
	notes: string | null
	/** Оптимистический лок. Сервер его отдаёт, но пока НЕ принимает обратно. */
	version: number
	createdAt: string
	updatedAt: string
	guest?: Guest
	room?: Room
	/** Локальное поле, дописывается очередью. На сервер не уходит. */
	sync?: SyncState
}

/** Ячейка ответа GET /availability. Ответ РАЗРЕЖЁН: свободных дней в нём нет. */
export type AvailabilityCell = {
	date: string
	bookingId: string
	status: BookingStatus
	guestName: string
}

export type AvailabilityRow = {
	roomId: string
	label: string
	roomTypeName: string
	cells: AvailabilityCell[]
}

export type AvailabilityResponse = {
	from: string
	to: string
	rooms: AvailabilityRow[]
}
