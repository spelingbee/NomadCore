/**
 * Чистая диалоговая машина Telegram-бота (Sprint 4, MVP канала) —
 * без зависимостей от Nest/Prisma/Telegram API, тестируется отдельно.
 *
 * Сценарий гостя: /start → даты → выбор типа номера → имя → заявка (HOLD).
 * Владелец подтверждает в приложении (HOLD → CONFIRMED) — гость получает уведомление.
 */

import { assertValidRange, InvalidRangeError, nightsCount } from "../bookings/domain.ts"

export type BotStep = "idle" | "awaiting_dates" | "awaiting_room_type" | "awaiting_name"

export type BotSession = {
	chatId: string
	step: BotStep
	checkIn?: string
	checkOut?: string
	roomTypeIndex?: number
}

export type RoomTypeOption = {
	id: string
	name: string
	basePrice: number
}

export type BookingRequest = {
	roomTypeId: string
	checkIn: string
	checkOut: string
	guestName: string
	guestTelegramChatId: string
}

export type BotResult = {
	session: BotSession
	reply: string
	/** Заполнено, когда диалог завершён и нужно создать заявку (HOLD). */
	bookingRequest?: BookingRequest
}

export function initialSession(chatId: string): BotSession {
	return { chatId, step: "idle" }
}

/**
 * Парсинг диапазона дат. Поддерживаемые форматы:
 * - "10.08-13.08" / "10.08 - 13.08" (год подставляется: текущий или следующий)
 * - "10.08.2026-13.08.2026"
 * - "2026-08-10 2026-08-13" / "2026-08-10 - 2026-08-13"
 */
export function parseDateRange(
	text: string,
	today: string, // YYYY-MM-DD, для подстановки года
): { checkIn: string; checkOut: string } | null {
	const trimmed = text.trim()

	const isoPair = trimmed.match(
		/^(\d{4}-\d{2}-\d{2})\s*(?:-|—|до|\s)\s*(\d{4}-\d{2}-\d{2})$/,
	)
	if (isoPair) {
		return validated({ checkIn: isoPair[1], checkOut: isoPair[2] })
	}

	const dotPair = trimmed.match(
		/^(\d{1,2})\.(\d{1,2})(?:\.(\d{4}))?\s*(?:-|—|до)\s*(\d{1,2})\.(\d{1,2})(?:\.(\d{4}))?$/,
	)
	if (dotPair) {
		const currentYear = Number(today.slice(0, 4))
		const d1 = Number(dotPair[1])
		const m1 = Number(dotPair[2])
		const y1 = dotPair[3] ? Number(dotPair[3]) : undefined
		const d2 = Number(dotPair[4])
		const m2 = Number(dotPair[5])
		const y2 = dotPair[6] ? Number(dotPair[6]) : undefined

		let checkInYear = y1 ?? currentYear
		let checkIn = isoDate(checkInYear, m1, d1)
		if (!y1 && checkIn < today) {
			// дата без года в прошлом → имелся в виду следующий год
			checkInYear += 1
			checkIn = isoDate(checkInYear, m1, d1)
		}
		let checkOutYear = y2 ?? checkInYear
		let checkOut = isoDate(checkOutYear, m2, d2)
		if (!y2 && checkOut <= checkIn) {
			// переход через новый год: "30.12-02.01"
			checkOutYear += 1
			checkOut = isoDate(checkOutYear, m2, d2)
		}
		return validated({ checkIn, checkOut })
	}

	return null
}

function isoDate(year: number, month: number, day: number): string {
	return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

function validated(range: {
	checkIn: string
	checkOut: string
}): { checkIn: string; checkOut: string } | null {
	try {
		assertValidRange(range)
		// отбрасываем несуществующие даты типа 31.02
		for (const d of [range.checkIn, range.checkOut]) {
			const parsed = new Date(`${d}T00:00:00Z`)
			if (Number.isNaN(parsed.getTime())) return null
			if (parsed.toISOString().slice(0, 10) !== d) return null
		}
		return range
	} catch (e) {
		if (e instanceof InvalidRangeError) return null
		throw e
	}
}

/** Один шаг диалога: текущая сессия + текст гостя → новая сессия + ответ. */
export function advance(
	session: BotSession,
	text: string,
	ctx: { roomTypes: RoomTypeOption[]; today: string; propertyName: string },
): BotResult {
	const input = text.trim()

	if (input === "/start" || session.step === "idle") {
		return {
			session: { chatId: session.chatId, step: "awaiting_dates" },
			reply:
				`Здравствуйте! Это бронирование «${ctx.propertyName}».\n` +
				`Напишите даты заезда и выезда, например: 10.08-13.08`,
		}
	}

	if (input === "/cancel") {
		return {
			session: initialSession(session.chatId),
			reply: "Заявка отменена. Напишите /start, чтобы начать заново.",
		}
	}

	switch (session.step) {
		case "awaiting_dates": {
			const range = parseDateRange(input, ctx.today)
			if (!range) {
				return {
					session,
					reply:
						"Не понял даты. Пример: 10.08-13.08 или 2026-08-10 - 2026-08-13",
				}
			}
			if (range.checkIn < ctx.today) {
				return { session, reply: "Дата заезда уже прошла. Укажите будущие даты." }
			}
			const menu = ctx.roomTypes
				.map(
					(rt, i) =>
						`${i + 1}. ${rt.name} — ${rt.basePrice} сом/ночь`,
				)
				.join("\n")
			return {
				session: { ...session, step: "awaiting_room_type", ...range },
				reply: `Выберите тип номера (отправьте номер пункта):\n${menu}`,
			}
		}

		case "awaiting_room_type": {
			const index = Number.parseInt(input, 10) - 1
			if (
				Number.isNaN(index) ||
				index < 0 ||
				index >= ctx.roomTypes.length
			) {
				return {
					session,
					reply: `Отправьте число от 1 до ${ctx.roomTypes.length}.`,
				}
			}
			return {
				session: { ...session, step: "awaiting_name", roomTypeIndex: index },
				reply: "Как вас зовут? (имя для брони)",
			}
		}

		case "awaiting_name": {
			if (input.length < 2) {
				return { session, reply: "Напишите, пожалуйста, имя (минимум 2 символа)." }
			}
			const roomType = ctx.roomTypes[session.roomTypeIndex ?? 0]
			const range = { checkIn: session.checkIn!, checkOut: session.checkOut! }
			const nights = nightsCount(range)
			const total = roomType.basePrice * nights
			return {
				session: initialSession(session.chatId),
				reply:
					`Заявка принята: ${roomType.name}, ${range.checkIn} → ${range.checkOut} ` +
					`(${nights} ноч., ~${total} сом).\n` +
					`Ждём подтверждения владельца — пришлём сообщение.`,
				bookingRequest: {
					roomTypeId: roomType.id,
					checkIn: range.checkIn,
					checkOut: range.checkOut,
					guestName: input,
					guestTelegramChatId: session.chatId,
				},
			}
		}

		default:
			return {
				session: initialSession(session.chatId),
				reply: "Напишите /start, чтобы забронировать номер.",
			}
	}
}
