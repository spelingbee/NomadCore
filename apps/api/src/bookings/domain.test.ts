import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
	assertTransition,
	assertValidRange,
	calcPriceTotal,
	canTransition,
	findConflicts,
	InvalidRangeError,
	InvalidTransitionError,
	nightsCount,
	occupiedDates,
	rangesOverlap,
	type ExistingBooking,
} from "./domain.ts"

describe("статусная машина", () => {
	it("разрешает основной путь HOLD → CONFIRMED → CHECKED_IN → CHECKED_OUT", () => {
		assert.ok(canTransition("HOLD", "CONFIRMED"))
		assert.ok(canTransition("CONFIRMED", "CHECKED_IN"))
		assert.ok(canTransition("CHECKED_IN", "CHECKED_OUT"))
		assert.doesNotThrow(() => assertTransition("HOLD", "CONFIRMED"))
	})

	it("разрешает отмену только до заезда", () => {
		assert.ok(canTransition("HOLD", "CANCELLED"))
		assert.ok(canTransition("CONFIRMED", "CANCELLED"))
		assert.ok(!canTransition("CHECKED_IN", "CANCELLED"))
		assert.ok(!canTransition("CHECKED_OUT", "CANCELLED"))
	})

	it("запрещает переходы из терминальных статусов", () => {
		assert.ok(!canTransition("CHECKED_OUT", "CHECKED_IN"))
		assert.ok(!canTransition("CANCELLED", "CONFIRMED"))
		assert.throws(
			() => assertTransition("CANCELLED", "HOLD"),
			InvalidTransitionError,
		)
	})

	it("запрещает пропуск шагов", () => {
		assert.ok(!canTransition("HOLD", "CHECKED_IN"))
		assert.ok(!canTransition("HOLD", "CHECKED_OUT"))
		assert.ok(!canTransition("CONFIRMED", "CHECKED_OUT"))
	})
})

describe("пересечение дат [checkIn, checkOut)", () => {
	it("back-to-back НЕ конфликт: выезд 10-го = заезд 10-го", () => {
		assert.ok(
			!rangesOverlap(
				{ checkIn: "2026-08-05", checkOut: "2026-08-10" },
				{ checkIn: "2026-08-10", checkOut: "2026-08-12" },
			),
		)
	})

	it("частичное и полное перекрытие — конфликт", () => {
		assert.ok(
			rangesOverlap(
				{ checkIn: "2026-08-05", checkOut: "2026-08-10" },
				{ checkIn: "2026-08-09", checkOut: "2026-08-12" },
			),
		)
		assert.ok(
			rangesOverlap(
				{ checkIn: "2026-08-05", checkOut: "2026-08-10" },
				{ checkIn: "2026-08-06", checkOut: "2026-08-08" },
			),
		)
	})

	it("валидация диапазона", () => {
		assert.throws(
			() => assertValidRange({ checkIn: "2026-08-10", checkOut: "2026-08-10" }),
			InvalidRangeError,
		)
		assert.throws(
			() => assertValidRange({ checkIn: "10.08.2026", checkOut: "2026-08-12" }),
			InvalidRangeError,
		)
		assert.doesNotThrow(() =>
			assertValidRange({ checkIn: "2026-08-10", checkOut: "2026-08-11" }),
		)
	})
})

describe("findConflicts", () => {
	const existing: ExistingBooking[] = [
		{ id: "b1", status: "CONFIRMED", checkIn: "2026-08-05", checkOut: "2026-08-10" },
		{ id: "b2", status: "CANCELLED", checkIn: "2026-08-10", checkOut: "2026-08-15" },
		{ id: "b3", status: "HOLD", checkIn: "2026-08-20", checkOut: "2026-08-25" },
	]

	it("находит только блокирующие пересечения", () => {
		const conflicts = findConflicts(
			{ checkIn: "2026-08-08", checkOut: "2026-08-22" },
			existing,
		)
		assert.deepEqual(
			conflicts.map((c) => c.id),
			["b1", "b3"],
		)
	})

	it("CANCELLED не блокирует", () => {
		const conflicts = findConflicts(
			{ checkIn: "2026-08-11", checkOut: "2026-08-14" },
			existing,
		)
		assert.equal(conflicts.length, 0)
	})

	it("back-to-back к существующей брони проходит", () => {
		const conflicts = findConflicts(
			{ checkIn: "2026-08-10", checkOut: "2026-08-12" },
			existing,
		)
		assert.equal(conflicts.length, 0)
	})
})

describe("цены и ночи", () => {
	it("считает ночи", () => {
		assert.equal(nightsCount({ checkIn: "2026-08-10", checkOut: "2026-08-13" }), 3)
		assert.equal(nightsCount({ checkIn: "2026-12-30", checkOut: "2027-01-02" }), 3)
	})

	it("корректно работает через границу месяца и DST-нейтрален (UTC-даты)", () => {
		assert.equal(nightsCount({ checkIn: "2026-08-30", checkOut: "2026-09-02" }), 3)
		assert.equal(nightsCount({ checkIn: "2026-03-28", checkOut: "2026-03-30" }), 2)
	})

	it("считает сумму: цена за ночь × ночи", () => {
		assert.equal(
			calcPriceTotal(1500, { checkIn: "2026-08-10", checkOut: "2026-08-13" }),
			4500,
		)
		assert.equal(
			calcPriceTotal(2800.5, { checkIn: "2026-08-10", checkOut: "2026-08-12" }),
			5601,
		)
	})

	it("occupiedDates возвращает дни без дня выезда", () => {
		assert.deepEqual(
			occupiedDates({ checkIn: "2026-08-10", checkOut: "2026-08-13" }),
			["2026-08-10", "2026-08-11", "2026-08-12"],
		)
	})
})
