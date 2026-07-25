import {
	Injectable,
	Logger,
	OnModuleDestroy,
	OnModuleInit,
} from "@nestjs/common"
import { Queue } from "bullmq"
import IORedis from "ioredis"
import { PrismaService } from "../common/prisma.service"

export const OUTBOX_QUEUE = "outbox-events"

/**
 * Релей Transactional Outbox (Sprint 4):
 * каждые 5 секунд забирает неопубликованные outbox_events и кладёт их
 * в очередь BullMQ. jobId = id события — идемпотентность при повторах.
 * Без REDIS_URL релей отключается (для локальной разработки без Redis).
 */
@Injectable()
export class OutboxRelay implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(OutboxRelay.name)
	private queue?: Queue
	private connection?: IORedis
	private timer?: NodeJS.Timeout
	private running = false

	constructor(private readonly prisma: PrismaService) {}

	onModuleInit() {
		const redisUrl = process.env.REDIS_URL
		if (!redisUrl) {
			this.logger.warn("REDIS_URL не задан — outbox-релей отключён")
			return
		}
		this.connection = new IORedis(redisUrl, { maxRetriesPerRequest: null })
		this.queue = new Queue(OUTBOX_QUEUE, { connection: this.connection })
		this.timer = setInterval(() => void this.tick(), 5_000)
		this.logger.log("Outbox-релей запущен (интервал 5с)")
	}

	async onModuleDestroy() {
		if (this.timer) clearInterval(this.timer)
		await this.queue?.close()
		this.connection?.disconnect()
	}

	/** Один проход: опубликовать пачку событий. Защита от наложения тиков. */
	private async tick() {
		if (this.running || !this.queue) return
		this.running = true
		try {
			const events = await this.prisma.outboxEvent.findMany({
				where: { publishedAt: null },
				orderBy: { createdAt: "asc" },
				take: 20,
			})
			for (const event of events) {
				await this.queue.add(
					event.type,
					{
						id: event.id,
						aggregateType: event.aggregateType,
						aggregateId: event.aggregateId,
						type: event.type,
						payload: event.payload,
					},
					{
						jobId: event.id, // идемпотентность
						attempts: 5,
						backoff: { type: "exponential", delay: 2_000 },
						removeOnComplete: 1000,
					},
				)
				await this.prisma.outboxEvent.update({
					where: { id: event.id },
					data: { publishedAt: new Date() },
				})
			}
		} catch (e) {
			this.logger.error(`Ошибка релея: ${String(e)}`)
		} finally {
			this.running = false
		}
	}
}
