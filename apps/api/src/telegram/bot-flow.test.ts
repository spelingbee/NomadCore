import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
	advance,
	initialSession,
	parseDateRange,
	type RoomTypeOption,
} from "./bot-flow.ts"

const TODAY = "2026-07-23"

describe("parseDateRange", () => {
	it("парсит формат ДД.ММ-ДД.ММ с подстановкой года", () => {
		assert.deepEqual(parseDateRange("10.08-13.08", TODAY), {
			checkIn: "2026-08-10",
			checkOut: "2026-08-13",
		})
		assert.deepEqual(parseDateRange("10.08 - 13.08", TODAY), {
			checkIn: "2026-08-10",
			checkOut: "2026-08-13",
		})
	})

	it("дата без года в прошлом → следующий год", () => {
		assert.deepEqual(parseDateRange("10.03-15.03", TODAY), {
			checkIn: "2027-03-10",
			checkOut: "2027-03-15",
		})
	})

	it("переход через новый год", () => {
		assert.deepEqual(parseDateRange("30.12-02.01", TODAY), {
			checkIn: "2026-12-30",
			checkOut: "2027-01-02",
		})
	})

	it("парсит явные года и ISO-формат", () => {
		assert.deepEqual(parseDateRange("10.08.2027-13.08.2027", TODAY), {
			checkIn: "2027-08-10",
			checkOut: "2027-08-13",
		})
		assert.deepEqual(parseDateRange("2026-08-10 - 2026-08-13", TODAY), {
			checkIn: "2026-08-10",
			checkOut: "2026-08-13",
		})
		assert.deepEqual(parseDateRange("2026-08-10 2026-08-13", TODAY), {
			checkIn: "2026-08-10",
			checkOut: "2026-08-13",
		})
	})

	it("отбрасывает мусор и невалидные диапазоны", () => {
		assert.equal(parseDateRange("привет", TODAY), null)
		assert.equal(parseDateRange("13.08-10.08.2026", TODAY), null)
		assert.equal(parseDateRange("31.02-05.03", TODAY), null)
		assert.equal(parseDateRange("2026-08-13 - 2026-08-10", TODAY), null)
	})
})

describe("диалог бота", () => {
	const roomTypes: RoomTypeOption[] = [
		{ id: "rt-std", name: "Стандарт 2-местный", basePrice: 1500 },
		{ id: "rt-fam", name: "Семейный 4-местный", basePrice: 2800 },
	]
	const ctx = { roomTypes, today: TODAY, propertyName: "Ак-Кеме" }

	it("полный сценарий: /start → даты → тип → имя → заявка HOLD", () => {
		let r = advance(initialSession("chat-1"), "/start", ctx)
		assert.equal(r.session.step, "awaiting_dates")
		assert.match(r.reply, /Ак-Кеме/)

		r = advance(r.session, "10.08-13.08", ctx)
		assert.equal(r.session.step, "awaiting_room_type")
		assert.match(r.reply, /1\. Стандарт/)

		r = advance(r.session, "2", ctx)
		assert.equal(r.session.step, "awaiting_name")

		r = advance(r.session, "Айгуль", ctx)
		assert.ok(r.bookingRequest)
		assert.deepEqual(r.bookingRequest, {
			roomTypeId: "rt-fam",
			checkIn: "2026-08-10",
			checkOut: "2026-08-13",
			guestName: "Айгуль",
			guestTelegramChatId: "chat-1",
		})
		assert.match(r.reply, /3 ноч/)
		assert.match(r.reply, /8400 сом/)
		assert.equal(r.session.step, "idle") // сессия сброшена
	})

	it("невалидные даты — переспрашивает, не меняя шаг", () => {
		let r = advance(initialSession("chat-2"), "/start", ctx)
		r = advance(r.session, "завтра", ctx)
		assert.equal(r.session.step, "awaiting_dates")
		assert.match(r.reply, /Не понял даты/)
	})

	it("даты в прошлом — отклоняет", () => {
		let r = advance(initialSession("chat-3"), "/start", ctx)
		r = advance(r.session, "2026-07-01 - 2026-07-05", ctx)
		assert.equal(r.session.step, "awaiting_dates")
		assert.match(r.reply, /уже прошла/)
	})

	it("неверный номер типа — переспрашивает", () => {
		let r = advance(initialSession("chat-4"), "/start", ctx)
		r = advance(r.session, "10.08-13.08", ctx)
		r = advance(r.session, "7", ctx)
		assert.equal(r.session.step, "awaiting_room_type")
		assert.match(r.reply, /от 1 до 2/)
	})

	it("/cancel сбрасывает диалог", () => {
		let r = advance(initialSession("chat-5"), "/start", ctx)
		r = advance(r.session, "10.08-13.08", ctx)
		r = advance(r.session, "/cancel", ctx)
		assert.equal(r.session.step, "idle")
		assert.equal(r.bookingRequest, undefined)
	})
})
