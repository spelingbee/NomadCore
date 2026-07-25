import {
	Injectable,
	Logger,
	OnModuleDestroy,
	OnModuleInit,
} from "@nestjs/common"
import { Worker, type Job } from "bullmq"
import IORedis from "ioredis"
import { PrismaService } from "../common/prisma.service"
import { OUTBOX_QUEUE } from "../outbox/outbox.relay"
import { TelegramService } from "../telegram/telegram.service"

type OutboxJobData = {
	id: string
	type: string
	payload: {
		bookingId?: string
		source?: string
		from?: string
		to?: string
	}
}

/**
 * Воркер уведомлений поверх outbox-очереди (Sprint 4):
 * - booking.created (source=bot) → уведомить владельца о новой заявке;
 * - booking.status_changed HOLD→CONFIRMED/CANCELLED (source=bot) → уведомить гостя.
 */
@Injectable()
export class NotificationsWorker implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(NotificationsWorker.name)
	private worker?: Worker
	private connection?: IORedis

	constructor(
		private readonly prisma: PrismaService,
		private readonly telegram: TelegramService,
	) {}

	onModuleInit() {
		const redisUrl = process.env.REDIS_URL
		if (!redisUrl) {
			this.logger.warn("REDIS_URL не задан — воркер уведомлений отключён")
			return
		}
		this.connection = new IORedis(redisUrl, { maxRetriesPerRequest: null })
		this.worker = new Worker(
			OUTBOX_QUEUE,
			(job) => this.handle(job as Job<OutboxJobData>),
			{ connection: this.connection },
		)
		this.logger.log("Воркер уведомлений запущен")
	}

	async onModuleDestroy() {
		await this.worker?.close()
		this.connection?.disconnect()
	}

	private async handle(job: Job<OutboxJobData>) {
		const { type, payload } = job.data
		if (!payload.bookingId) return

		const booking = await this.prisma.booking.findUnique({
			where: { id: payload.bookingId },
			include: {
				guest: true,
				room: { include: { roomType: true } },
				property: { include: { owner: true } },
			},
		})
		if (!booking) return

		const dates = `${booking.checkIn.toISOString().slice(0, 10)} → ${booking.checkOut
			.toISOString()
			.slice(0, 10)}`

		if (type === "booking.created" && booking.source === "bot") {
			const ownerChat = booking.property.owner.telegramChatId
			if (ownerChat) {
				await this.telegram.sendMessage(
					ownerChat,
					`Новая заявка из Telegram: ${booking.guest.name}, ` +
						`${booking.room.label} (${booking.room.roomType.name}), ${dates}, ` +
						`${booking.priceTotal} сом. Подтвердите в приложении.`,
				)
			}
			return
		}

		if (type === "booking.status_changed" && booking.source === "bot") {
			const guestChat = booking.guest.telegramChatId
			if (!guestChat) return
			if (payload.to === "CONFIRMED") {
				await this.telegram.sendMessage(
					guestChat,
					`Ваша бронь подтверждена: ${booking.room.roomType.name}, ${dates}. Ждём вас!`,
				)
			} else if (payload.to === "CANCELLED") {
				await this.telegram.sendMessage(
					guestChat,
					`К сожалению, заявка на ${dates} отклонена. Попробуйте другие даты: /start`,
				)
			}
		}
	}
}
