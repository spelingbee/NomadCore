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
		// Расширение .ts обязательно: файл запускается напрямую через
		// node --experimental-strip-types, а ESM-резолвер Node не достраивает
		// расширения. Без него тест падал с ERR_MODULE_NOT_FOUND ещё до
		// подключения к базе — то есть инвариант ADR-1 не проверялся ни разу.
		const { BookingsService } = await import(
			"../src/bookings/bookings.service.ts"
		)
		const { OutboxService } = await import("../src/outbox/outbox.service.ts")

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
		// Предыдущий тест занял этот же номер на 01–05.09. Здесь заезд ровно
		// в день выезда: интервал полуоткрытый, [checkIn, checkOut), поэтому
		// пересечения нет и создание обязано пройти. Сам факт отсутствия
		// исключения и есть проверка.
		const b = await service.create(ownerId, {
			roomId,
			checkIn: "2026-09-05",
			checkOut: "2026-09-08",
			guestName: "Гость В",
		})
		// CONFIRMED, а не HOLD: владелец заводит бронь уже подтверждённой
		// (bookings.service.ts, create → status: "CONFIRMED").
		// HOLD приходит только из Telegram-бота и с публичной витрины —
		// его владелец подтверждает вручную. Прежнее ожидание HOLD было
		// списано со значения по умолчанию в схеме и устарело.
		assert.equal(b.status, "CONFIRMED")
		assert.equal(b.checkIn.toISOString().slice(0, 10), "2026-09-05")
	})
})

if (!hasDb) {
	console.log("DATABASE_URL не задан — интеграционные тесты пропущены.")
}
