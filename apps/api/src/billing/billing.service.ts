import { Injectable } from "@nestjs/common"
import { PrismaService } from "../common/prisma.service"

/**
 * Подписка и гейтинг Pro-функций (Sprint 4).
 *
 * Красная линия ТЗ: базовый учёт и анти-овербукинг всегда бесплатны.
 * Pro гейтит только автоматизацию: Telegram-бот, уведомления, приём оплаты.
 *
 * Приём платежей (Элсом / O!Деньги / MBank) — открытое исследование ТЗ §6.
 * Здесь — только активация подписки вручную (админский стаб), интерфейс
 * PaymentProvider будет добавлен после выбора провайдера.
 */
@Injectable()
export class BillingService {
	constructor(private readonly prisma: PrismaService) {}

	async getSubscription(propertyId: string) {
		const sub = await this.prisma.subscription.findUnique({
			where: { propertyId },
		})
		return (
			sub ?? {
				propertyId,
				plan: "FREE" as const,
				validUntil: null,
			}
		)
	}

	/** Pro активен: план PRO и срок не истёк (validUntil = null — бессрочно). */
	async isPro(propertyId: string): Promise<boolean> {
		const sub = await this.prisma.subscription.findUnique({
			where: { propertyId },
		})
		if (!sub || sub.plan !== "PRO") return false
		return sub.validUntil === null || sub.validUntil > new Date()
	}

	/** Активация/продление Pro (MVP: вручную, до интеграции платежей). */
	async activatePro(propertyId: string, days: number) {
		const validUntil = new Date(Date.now() + days * 86_400_000)
		return this.prisma.subscription.upsert({
			where: { propertyId },
			create: { propertyId, plan: "PRO", validUntil },
			update: { plan: "PRO", validUntil },
		})
	}
}
