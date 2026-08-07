/* ─────────────────────────────────────────────────────────────────────────
 *  ДЕМО-ДАННЫЕ. ЭТО ЕДИНСТВЕННОЕ МЕСТО В ПРОЕКТЕ, ГДЕ ОНИ ЖИВУТ.
 *
 *  Ни один компонент и ни один composable не имеет права заводить свои
 *  фикстуры: экран, который «работает» на локальном массиве, перестаёт
 *  показывать, что API чего-то не отдаёт.
 *
 *  Включаются флагом runtimeConfig.public.demo (NUXT_PUBLIC_DEMO).
 *  Сейчас он включён по умолчанию, потому что живого бэкенда рядом нет.
 *  Выключить: NUXT_PUBLIC_DEMO=0 — тогда слой данных пойдёт в реальный API.
 *
 *  ВАЖНО: набор содержит РОВНО те поля, которые есть в apps/api/prisma/
 *  schema.prisma. Прототип показывает на карточке ещё четыре — код брони,
 *  гражданство, число гостей и отметку «паспорт предъявлен», — которых в
 *  схеме НЕТ. Они сюда намеренно не добавлены: фикстура с несуществующим
 *  полем делает экран «рабочим» ровно до первого запроса к живому API.
 *  Список пробелов — в docs/WEB-API-GAPS.md.
 *
 *  Набор повторяет сценарий прототипа «NomadCore Владелец 360»:
 *    · 10 номеров, 13 броней;
 *    · сегодня 1 ожидает решения, 2 выезда, 3 заезда;
 *    · в номере 3 сегодня СТЫК — Ким Мария выезжает, Chen Wei заезжает,
 *      и это не конфликт: [checkIn, checkOut);
 *    · ночь «завтра» занята полностью, 0 свободных из 10.
 *  Даты заданы смещением от сегодняшнего дня, а не константами, иначе
 *  демонстрация протухает на следующие сутки.
 * ───────────────────────────────────────────────────────────────────────── */
import type {
	Booking,
	BookingStatus,
	Guest,
	Property,
	QueueItem,
	Room,
	RoomType,
} from "~/types"
import { addDays, nights } from "~/utils/dates"

const PROPERTY_ID = "demo-property"

/** Названия типов номеров приходят из БД одной строкой и НЕ локализуются. */
const ROOM_TYPES: RoomType[] = [
	{
		id: "rt-std",
		propertyId: PROPERTY_ID,
		name: "Стандарт, 2 места",
		capacity: 2,
		basePrice: "1900.00",
	},
	{
		id: "rt-fam",
		propertyId: PROPERTY_ID,
		name: "Семейный, 4 места",
		capacity: 4,
		basePrice: "2600.00",
	},
	{
		id: "rt-yurt",
		propertyId: PROPERTY_ID,
		name: "Юрта, 4 места",
		capacity: 4,
		basePrice: "2600.00",
	},
]

const ROOM_LABELS: ReadonlyArray<[label: string, roomTypeId: string]> = [
	["1", "rt-std"],
	["2", "rt-std"],
	["3", "rt-std"],
	["4", "rt-std"],
	["5", "rt-std"],
	["6", "rt-std"],
	["7", "rt-fam"],
	["8", "rt-fam"],
	["Ю1", "rt-yurt"],
	["Ю2", "rt-yurt"],
]

const ROOMS: Room[] = ROOM_LABELS.map(([label, roomTypeId]) => ({
	id: `room-${label}`,
	propertyId: PROPERTY_ID,
	roomTypeId,
	label,
	roomType: ROOM_TYPES.find((t) => t.id === roomTypeId)!,
}))

export const demoProperty: Property = {
	id: PROPERTY_ID,
	name: "Ак-Марал",
	slug: "ak-maral",
	region: "Иссык-Куль",
	address: "Боконбаево",
	timezone: "Asia/Bishkek",
	roomTypes: ROOM_TYPES,
	rooms: ROOMS,
}

export const demoRooms: Room[] = ROOMS
export const demoRoomTypes: RoomType[] = ROOM_TYPES

/**
 * [имя гостя, ярлык номера, смещение заезда, смещение выезда, статус, источник]
 * Смещения — в днях от сегодняшнего дня объекта.
 * Источник — свободная строка, как в схеме: manual | bot | marketplace.
 */
type Seed = [string, string, number, number, BookingStatus, string]

const SEED: Seed[] = [
	["Сыдыков Айбек", "1", -2, 2, "CHECKED_IN", "manual"],
	// Единственная бронь, ждущая решения. Пришла из Telegram-бота.
	["Петров Игорь", "2", 0, 1, "HOLD", "bot"],
	["Осмонов Бакыт", "2", 1, 4, "CONFIRMED", "manual"],
	// Ким выезжает сегодня, Chen заезжает сегодня в ТОТ ЖЕ номер 3 — стык.
	["Ким Мария", "3", -3, 0, "CHECKED_IN", "manual"],
	["Chen Wei", "3", 0, 3, "CONFIRMED", "manual"],
	["Ибраимова Айгүл", "4", -2, 0, "CHECKED_IN", "manual"],
	["Мамбетова Асель", "4", 1, 5, "CONFIRMED", "manual"],
	["Жумабаев Асан", "5", -1, 3, "CHECKED_IN", "manual"],
	["Ли Наталья", "6", 0, 4, "CONFIRMED", "manual"],
	["Familie Weber", "7", -1, 5, "CHECKED_IN", "manual"],
	["Wang Jing", "8", -3, 2, "CHECKED_IN", "manual"],
	["Асанова Гүлнара", "Ю1", 0, 2, "CONFIRMED", "manual"],
	["Токтогулов Эрлан", "Ю2", 1, 4, "CONFIRMED", "manual"],
]

/** Сервер отдаёт @db.Date как ISO-строку с UTC-полуночью — повторяем ровно это. */
function asServerDate(day: string): string {
	return `${day}T00:00:00.000Z`
}

export function demoBookings(today: string): Booking[] {
	return SEED.map(([name, roomLabel, fromOffset, toOffset, status, source], i) => {
		const room = ROOMS.find((r) => r.label === roomLabel)!
		const checkIn = addDays(today, fromOffset)
		const checkOut = addDays(today, toOffset)
		const rate = Number(room.roomType!.basePrice)
		const guest: Guest = {
			id: `guest-${i}`,
			propertyId: PROPERTY_ID,
			name,
			phone: `+9967000000${String(i).padStart(2, "0")}`,
			notes: null,
		}
		return {
			id: `booking-${i}`,
			propertyId: PROPERTY_ID,
			roomId: room.id,
			guestId: guest.id,
			checkIn: asServerDate(checkIn),
			checkOut: asServerDate(checkOut),
			status,
			priceTotal: (rate * nights(checkIn, checkOut)).toFixed(2),
			source,
			notes: null,
			version: 1,
			createdAt: asServerDate(addDays(today, fromOffset - 7)),
			updatedAt: asServerDate(addDays(today, fromOffset - 7)),
			guest,
			room,
			sync: "ok",
		} satisfies Booking
	})
}

/**
 * Демо-очередь: две строки, чтобы экран «Очередь» было на чём смотреть.
 *
 * Третьего состояния — `conflict` — здесь НЕТ намеренно. Конфликт версий
 * требует, чтобы сервер вернул 409 с телом (обе версии, автор и время);
 * сегодняшний API отдаёт на этот случай 500, отличить его не от чего.
 * Показать конфликт в демо означало бы пообещать сценарий, которого в
 * продукте нет. Разбор — docs/WEB-API-GAPS.md и nuxt/API-CONFLICTS.md.
 */
export function demoQueue(
	t: (key: string, named?: Record<string, unknown>) => string,
	byId: (id: string) => Booking | null,
): QueueItem[] {
	const label = (bookingId: string) => byId(bookingId)?.room?.label ?? ""
	const guest = (bookingId: string) => byId(bookingId)?.guest?.name ?? ""

	return [
		{
			id: 1,
			state: "pending",
			title: `${t("booking.confirm")} · ${guest("booking-1")}`,
			subtitle: `${t("card.room")} ${label("booking-1")}`,
			bookingId: "booking-1",
		},
		{
			id: 2,
			state: "rejected",
			title: `${t("booking.checkIn")} · ${guest("booking-4")}`,
			subtitle: `${t("card.room")} ${label("booking-4")}`,
			bookingId: "booking-4",
			// Ровно то, что кладёт сервер: {code:"OVERBOOKING"}
			error: "OVERBOOKING",
		},
	]
}
