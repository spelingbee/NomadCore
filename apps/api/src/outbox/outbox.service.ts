import { Injectable } from "@nestjs/common"
import { Prisma } from "@prisma/client"

export type OutboxEventInput = {
	aggregateType: string
	aggregateId: string
	type: string
	payload: Prisma.InputJsonValue
}

/**
 * Transactional Outbox (задел под Фазу 0.2).
 *
 * ИНВАРИАНТ: emit() вызывается ТОЛЬКО с транзакционным клиентом (tx),
 * чтобы запись события была атомарна с изменением состояния.
 * Воркер-релей (BullMQ) появится в Sprint 4: читает неопубликованные
 * события (publishedAt IS NULL) и рассылает уведомления/боту.
 */
@Injectable()
export class OutboxService {
	async emit(
		tx: Prisma.TransactionClient,
		event: OutboxEventInput,
	): Promise<void> {
		await tx.outboxEvent.create({ data: event })
	}
}
