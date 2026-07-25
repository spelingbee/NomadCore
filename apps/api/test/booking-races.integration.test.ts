/**
 * Интеграционный тест на гонки (Sprint 2 DoD):
 * две конкурентные брони на один номер и пересекающиеся даты →
 * ровно одна успешна, вторая получает 409 OVERBOOKING.
 *
 * Требует живой PostgreSQL (docker compose up postgres) и DATABASE_URL.
 * Запуск: pnpm --filter @nomadcore/api test:races
 */
import assert from "node:assert/strict"
import { after, before, describe, it } from "node:test"

const hasDb = Boolean(process.env.DATABASE_URL)

describe("анти-овербукинг под конкуренцией", { skip: !hasDb }, () => {
	let prisma: any
	let service: any
	let ownerId: string
	let roomId: string

	before(async () => {
		const { PrismaClient } = await import("@prisma/client")
		const { BookingsService } = await import("../src/bookings/bookings.service")
		const { OutboxService } = await import("../src/outbox/outbox.service")

		prisma = new PrismaClient()
		service = new BookingsService(prisma, new OutboxService())

		const owner = await prisma.user.create({
			data: { phone: `+99670${Date.now() % 10_000_000}`, name: "race-test" },
		})
		ownerId = owner.id
		const property = await prisma.property.create({
			data: { ownerId, name: "Race Test", timezone: "Asia/Bishkek" },
		})
		const roomType = await prisma.roomType.create({
			data: {
				propertyId: property.id,
				name: "Стандарт",
				basePrice: 1000,
			},
		})
		const room = await prisma.room.create({
			data: {
				propertyId: property.id,
				roomTypeId: roomType.id,
				label: `race-${Date.now()}`,
			},
		})
		roomId = room.id
	})

	after(async () => {
		await prisma?.$disconnect()
	})

	it("из двух одновременных броней проходит ровно одна", async () => {
		const dto = (guestName: string) => ({
			roomId,
			checkIn: "2026-09-01",
			checkOut: "2026-09-05",
			guestName,
		})
		const results = await Promise.allSettled([
			service.create(ownerId, dto("Гость А")),
			service.create(ownerId, dto("Гость Б")),
		])
		const ok = results.filter((r) => r.status === "fulfilled")
		const failed = results.filter((r) => r.status === "rejected")
		assert.equal(ok.length, 1, "ровно одна бронь должна пройти")
		assert.equal(failed.length, 1, "вторая должна быть отклонена")

		const bookings = await prisma.booking.findMany({ where: { roomId } })
		assert.equal(bookings.length, 1)

		// Outbox-событие записано атомарно с бронью
		const events = await prisma.outboxEvent.findMany({
			where: { aggregateId: bookings[0].id, type: "booking.created" },
		})
		assert.equal(events.length, 1)
	})

	it("back-to-back брони проходят (выезд = заезд)", async () => {
		const b = await service.create(ownerId, {
			roomId,
			checkIn: "2026-09-05",
			checkOut: "2026-09-08",
			guestName: "Гость В",
		})
		assert.equal(b.status, "HOLD")
	})
})

if (!hasDb) {
	console.log("DATABASE_URL не задан — интеграционные тесты пропущены.")
}
