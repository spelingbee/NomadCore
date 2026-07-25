import {
	BadRequestException,
	Body,
	Controller,
	Headers,
	Logger,
	Post,
	UnauthorizedException,
} from "@nestjs/common"
import { PrismaService } from "../common/prisma.service"
import { BookingsService } from "../bookings/bookings.service"
import { BillingService } from "../billing/billing.service"
import {
	advance,
	initialSession,
	type BotSession,
} from "./bot-flow"
import { TelegramService } from "./telegram.service"

type TelegramUpdate = {
	message?: {
		chat?: { id?: number | string }
		text?: string
	}
}

/**
 * Webhook Telegram-бота (Sprint 4, MVP канала).
 *
 * Упрощения MVP (зафиксированы сознательно):
 * - Бот обслуживает один объект (первый с Pro-подпиской, иначе первый в БД).
 *   Мультитенантность — через deep-link /start <propertyCode> в следующей итерации.
 * - Сессии диалогов — in-memory (при рестарте гость начинает заново). В проде — Redis.
 * - Привязка владельца: команда "/owner <телефон>" (в проде — подтверждение OTP).
 */
@Controller("telegram")
export class TelegramController {
	private readonly logger = new Logger(TelegramController.name)
	private readonly sessions = new Map<string, BotSession>()

	constructor(
		private readonly prisma: PrismaService,
		private readonly bookings: BookingsService,
		private readonly billing: BillingService,
		private readonly telegram: TelegramService,
	) {}

	@Post("webhook")
	async webhook(
		@Body() update: TelegramUpdate,
		@Headers("x-telegram-bot-api-secret-token") secret?: string,
	) {
		const expected = process.env.TELEGRAM_WEBHOOK_SECRET
		if (expected && secret !== expected) {
			throw new UnauthorizedException("BAD_WEBHOOK_SECRET")
		}

		const chatId = update.message?.chat?.id
		const text = update.message?.text
		if (chatId === undefined || !text) {
			throw new BadRequestException("UNSUPPORTED_UPDATE")
		}
		const chatKey = String(chatId)

		// Привязка чата владельца: "/owner +996700000001"
		if (text.startsWith("/owner")) {
			await this.linkOwner(chatKey, text)
			return { ok: true }
		}

		const property = await this.resolveProperty()
		if (!property) {
			await this.telegram.sendMessage(chatKey, "Бот пока не настроен.")
			return { ok: true }
		}

		// Гейтинг Pro: бот — платная автоматизация (базовый учёт всегда бесплатен)
		if (!(await this.billing.isPro(property.id))) {
			await this.telegram.sendMessage(
				chatKey,
				"Онлайн-бронирование временно недоступно. Свяжитесь с владельцем напрямую.",
			)
			return { ok: true }
		}

		const roomTypes = await this.prisma.roomType.findMany({
			where: { propertyId: property.id },
			orderBy: { name: "asc" },
		})
		const session = this.sessions.get(chatKey) ?? initialSession(chatKey)
		const result = advance(session, text, {
			roomTypes: roomTypes.map((rt) => ({
				id: rt.id,
				name: rt.name,
				basePrice: Number(rt.basePrice),
			})),
			today: new Date().toISOString().slice(0, 10),
			propertyName: property.name,
		})
		this.sessions.set(chatKey, result.session)

		if (result.bookingRequest) {
			await this.createHoldBooking(property.id, chatKey, result)
		} else {
			await this.telegram.sendMessage(chatKey, result.reply)
		}
		return { ok: true }
	}

	/** Заявка гостя → HOLD-бронь на первый свободный номер выбранного типа. */
	private async createHoldBooking(
		propertyId: string,
		chatKey: string,
		result: ReturnType<typeof advance>,
	) {
		const req = result.bookingRequest!
		const rooms = await this.prisma.room.findMany({
			where: { propertyId, roomTypeId: req.roomTypeId },
			orderBy: { label: "asc" },
		})

		for (const room of rooms) {
			try {
				await this.bookings.createForProperty(
					propertyId,
					{
						roomId: room.id,
						checkIn: req.checkIn,
						checkOut: req.checkOut,
						guestName: req.guestName,
					},
					{
						status: "HOLD",
						source: "bot",
						guestTelegramChatId: req.guestTelegramChatId,
					},
				)
				await this.telegram.sendMessage(chatKey, result.reply)
				return
			} catch (e) {
				// OVERBOOKING — пробуем следующий номер этого типа
				this.logger.debug(`Номер ${room.label} занят: ${String(e)}`)
			}
		}
		await this.telegram.sendMessage(
			chatKey,
			"К сожалению, на эти даты все номера этого типа заняты. Попробуйте другие даты: /start",
		)
	}

	private async linkOwner(chatKey: string, text: string) {
		const phone = text.replace("/owner", "").trim()
		const user = phone
			? await this.prisma.user.findUnique({ where: { phone } })
			: null
		if (!user) {
			await this.telegram.sendMessage(
				chatKey,
				"Не нашёл владельца с таким телефоном. Формат: /owner +996700000001",
			)
			return
		}
		// TODO(0.2): подтверждение через OTP, а не по номеру телефона в открытую
		await this.prisma.user.update({
			where: { id: user.id },
			data: { telegramChatId: chatKey },
		})
		await this.telegram.sendMessage(
			chatKey,
			"Чат привязан. Сюда будут приходить заявки на бронь.",
		)
	}

	private async resolveProperty() {
		return this.prisma.property.findFirst({ orderBy: { createdAt: "asc" } })
	}
}
