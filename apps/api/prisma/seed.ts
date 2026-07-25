/**
 * Seed-данные для демо-объекта (Sprint 1 + Sprint 4).
 * Запуск: pnpm --filter @nomadcore/api prisma:seed
 */
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
	const owner = await prisma.user.upsert({
		where: { phone: "+996700000001" },
		update: {},
		create: {
			phone: "+996700000001",
			name: "Айбек (демо)",
			locale: "ru",
		},
	})

	const property = await prisma.property.upsert({
		where: { id: "demo-property" },
		update: {},
		create: {
			id: "demo-property",
			ownerId: owner.id,
			name: "Гостевой дом «Ак-Кеме»",
			region: "Иссык-Куль, Чолпон-Ата",
			timezone: "Asia/Bishkek",
		},
	})

	const standard = await prisma.roomType.upsert({
		where: { id: "demo-rt-standard" },
		update: {},
		create: {
			id: "demo-rt-standard",
			propertyId: property.id,
			name: "Стандарт 2-местный",
			capacity: 2,
			basePrice: 1500,
		},
	})

	const family = await prisma.roomType.upsert({
		where: { id: "demo-rt-family" },
		update: {},
		create: {
			id: "demo-rt-family",
			propertyId: property.id,
			name: "Семейный 4-местный",
			capacity: 4,
			basePrice: 2800,
		},
	})

	const labels: Array<{ label: string; roomTypeId: string }> = [
		{ label: "№101", roomTypeId: standard.id },
		{ label: "№102", roomTypeId: standard.id },
		{ label: "№103", roomTypeId: standard.id },
		{ label: "№201", roomTypeId: family.id },
		{ label: "№202", roomTypeId: family.id },
	]
	for (const { label, roomTypeId } of labels) {
		await prisma.room.upsert({
			where: {
				propertyId_label: { propertyId: property.id, label },
			},
			update: {},
			create: { propertyId: property.id, roomTypeId, label },
		})
	}

	// Sprint 4: демо-объекту включаем Pro на 90 дней, чтобы Telegram-бот был активен
	await prisma.subscription.upsert({
		where: { propertyId: property.id },
		update: { plan: "PRO" },
		create: {
			propertyId: property.id,
			plan: "PRO",
			validUntil: new Date(Date.now() + 90 * 86_400_000),
		},
	})

	console.log("Seed OK:", { owner: owner.phone, property: property.name })
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(() => prisma.$disconnect())
