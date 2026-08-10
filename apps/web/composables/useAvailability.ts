import type { Booking, Room } from "~/types"
import { addDays, coversNight, eachDay, overlaps, toDay } from "~/utils/dates"

/**
 * Занятость считается ИЗ БРОНЕЙ, а не из GET /api/availability, и это
 * осознанно:
 *
 * 1. Ответ /availability РАЗРЕЖЁН — свободных дней в нём нет вовсе, только
 *    занятые ячейки. Ось дней всё равно пришлось бы достраивать здесь.
 * 2. В ячейке нет checkIn/checkOut, поэтому многодневную полосу «Сетки»
 *    пришлось бы собирать группировкой по bookingId.
 * 3. Главное: /availability не знает про локальные, ещё не отправленные
 *    изменения. Владелец офлайн продлил гостя — сетка обязана это показать
 *    сразу, иначе он переселит в занятый номер.
 *
 * Список броней уже загружен «Сегодня» и покрывает горизонт в 21 день.
 */

/**
 * Ширина колонки дня в «Сетке» — значение --nc-space-48.
 *
 * Не 44: полоса брони идёт от середины дня заезда до середины дня выезда,
 * то есть её ширина равна CELL × число ночей минус 4px зазора. При CELL 44
 * бронь на одну ночь давала полосу 40px — тап-цель ниже предела в 44.
 * При 48 однодневная полоса ровно 44px, то есть --nc-touch-min.
 */
const CELL_PX = 48
/** Окно всех трёх режимов. 14 колонок — две недели, дальше владелец не планирует. */
export const WINDOW_DAYS = 14

export interface NightRow {
	date: string
	weekend: boolean
	free: Room[]
	full: boolean
	cells: { room: Room; booking: Booking | null; leaving: Booking | null }[]
}

export interface Bar {
	booking: Booking
	left: number
	width: number
}

export function useAvailability() {
	const { rooms, today } = useProperty()
	const { live } = useBookings()

	/** Начало окна — вчера: вчерашние выезды объясняют сегодняшние стыки. */
	const windowStart = computed(() => addDays(today.value, -1))
	const windowEnd = computed(() => addDays(windowStart.value, WINDOW_DAYS))
	const columns = computed(() => eachDay(windowStart.value, WINDOW_DAYS))

	/** Бронь, занимающая эту НОЧЬ. Выезд в этот день ночь не занимает. */
	function occupiedOn(room: Room, day: string): Booking | null {
		return (
			live.value.find((b) => b.roomId === room.id && coversNight(b, day)) ?? null
		)
	}

	/** Бронь, которая ИМЕННО В ЭТОТ ДЕНЬ выезжает из номера. */
	function leavingOn(room: Room, day: string): Booking | null {
		return (
			live.value.find((b) => b.roomId === room.id && toDay(b.checkOut) === day) ??
			null
		)
	}

	/**
	 * День, когда один гость выезжает, а другой заезжает в тот же номер.
	 * Это НЕ конфликт: [checkIn, checkOut) — ночь принадлежит дню заезда.
	 */
	function isTurnDay(room: Room, day: string): boolean {
		const out = leavingOn(room, day)
		if (!out) return false
		return live.value.some(
			(b) => b.roomId === room.id && toDay(b.checkIn) === day && b.id !== out.id,
		)
	}

	function freeRooms(checkIn: string, checkOut: string): Room[] {
		return rooms.value.filter(
			(r) =>
				!live.value.some(
					(b) => b.roomId === r.id && overlaps(b, { checkIn, checkOut }),
				),
		)
	}

	/**
	 * Режим «Ночи». Строка = одна ночь, поэтому полуинтервал невозможно
	 * прочитать неправильно: у ночи ровно один постоялец, «наложения»
	 * не существует по построению.
	 */
	const nightRows = computed<NightRow[]>(() =>
		columns.value.map((date) => {
			const free = freeRooms(date, addDays(date, 1))
			return {
				date,
				weekend: [0, 6].includes(new Date(`${date}T00:00:00Z`).getUTCDay()),
				free,
				full: free.length === 0,
				cells: rooms.value.map((room) => ({
					room,
					booking: occupiedOn(room, date),
					leaving: leavingOn(room, date),
				})),
			}
		}),
	)

	/**
	 * Режим «Сетка». Полоса идёт от СЕРЕДИНЫ дня заезда до СЕРЕДИНЫ дня
	 * выезда — поэтому «встык» даёт касание, а не наложение, и это видно
	 * геометрически, без легенды.
	 */
	function barsFor(room: Room): Bar[] {
		const start = windowStart.value
		return live.value
			.filter(
				(b) =>
					b.roomId === room.id &&
					overlaps(b, { checkIn: start, checkOut: windowEnd.value }),
			)
			.map((b) => {
				const dayIndex = (d: string) =>
					Math.round(
						(Date.parse(`${d}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) /
							86_400_000,
					)
				const left = Math.max(0, (dayIndex(toDay(b.checkIn)) + 0.5) * CELL_PX)
				const right = Math.min(
					(WINDOW_DAYS - 0.5) * CELL_PX,
					(dayIndex(toDay(b.checkOut)) + 0.5) * CELL_PX,
				)
				return {
					booking: b,
					left: left + 2,
					width: Math.max(20, right - left - 4),
				}
			})
	}

	return {
		rooms,
		today,
		columns,
		windowStart,
		nightRows,
		occupiedOn,
		leavingOn,
		isTurnDay,
		freeRooms,
		barsFor,
		cell: CELL_PX,
	}
}
