import {
	BadRequestException,
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from "@nestjs/common"
import { Prisma } from "@prisma/client"
import { PrismaService } from "../common/prisma.service"
import { OutboxService } from "../outbox/outbox.service"
import {
	assertTransition,
	assertValidRange,
	BLOCKING_STATUSES,
	calcPriceTotal,
	InvalidRangeError,
	InvalidTransitionError,
	rangesOverlap,
	type BookingStatus,
} from "./domain"
import type { ChangeStatusDto, CreateBookingDto } from "./dto"

export type CreateBookingOptions = {
	/** Статус новой брони: владелец создаёт CONFIRMED, бот — HOLD (до подтверждения). */
	status?: Extract<BookingStatus, "HOLD" | "CONFIRMED">
	source?: "manual" | "bot" | "marketplace"
	/** Telegram-чат гостя (бронь через бота, 0.2). */
	guestTelegramChatId?: string
}

/**
 * Анти-овербукинг (ключевое решение §2 ТЗ):
 * интерактивная транзакция Serializable + SELECT ... FOR UPDATE по строке
 * номера сериализует конкурентные брони одного номера. Проверка пересечений
 * и запись outbox-события происходят в той же транзакции.
 *
 * Один и тот же путь используют UI владельца (source=manual, CONFIRMED)
 * и Telegram-бот (source=bot, HOLD) — инвариант один на все каналы.
 */
@Injectable()
export class BookingsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly outbox: OutboxService,
	) {}

	async list(userId: string, from?: string, to?: string) {
		const property = await this.propertyOf(userId)
		return this.prisma.booking.findMany({
			where: {
				propertyId: property.id,
				...(from && to
					? {
							checkIn: { lt: new Date(to) },
							checkOut: { gt: new Date(from) },
						}
					: {}),
			},
			include: { guest: true, room: { include: { roomType: true } } },
			orderBy: { checkIn: "asc" },
		})
	}

	/** Создание брони владельцем (через UI). */
	async create(userId: string, dto: CreateBookingDto) {
		const property = await this.propertyOf(userId)
		return this.createForProperty(property.id, dto, {
			status: "CONFIRMED",
			source: "manual",
		})
	}

	/** Общий путь создания брони (UI владельца и Telegram-бот). */
	async createForProperty(
		propertyId: string,
		dto: CreateBookingDto,
		opts: CreateBookingOptions = {},
	) {
		const status = opts.status ?? "CONFIRMED"
		const source = opts.source ?? "manual"
		const range = {
			checkIn: dto.checkIn.slice(0, 10),
			checkOut: dto.checkOut.slice(0, 10),
		}
		try {
			assertValidRange(range)
		} catch (e) {
			if (e instanceof InvalidRangeError) throw new BadRequestException(e.message)
			throw e
		}

		const room = await this.prisma.room.findFirst({
			where: { id: dto.roomId, propertyId },
			include: { roomType: true },
		})
		if (!room) throw new NotFoundException("ROOM_NOT_FOUND")

		if (!dto.guestId && !dto.guestName) {
			throw new BadRequestException("GUEST_REQUIRED")
		}

		return this.withSerializationRetry(() =>
			this.prisma.$transaction(
				async (tx) => {
					// Сериализуем конкурентные брони этого номера
					await tx.$queryRaw`SELECT id FROM rooms WHERE id = ${room.id} FOR UPDATE`

					const existing = await tx.booking.findMany({
						where: {
							roomId: room.id,
							status: { in: [...BLOCKING_STATUSES] },
							checkIn: { lt: new Date(range.checkOut) },
							checkOut: { gt: new Date(range.checkIn) },
						},
						select: { id: true, checkIn: true, checkOut: true, status: true },
					})
					const conflicts = existing.filter((b) =>
						rangesOverlap(range, {
							checkIn: b.checkIn.toISOString().slice(0, 10),
							checkOut: b.checkOut.toISOString().slice(0, 10),
						}),
					)
					if (conflicts.length > 0) {
						throw new ConflictException({
							code: "OVERBOOKING",
							conflictIds: conflicts.map((c) => c.id),
						})
					}

					const guest = dto.guestId
						? await tx.guest.findFirstOrThrow({
								where: { id: dto.guestId, propertyId },
							})
						: await tx.guest.create({
								data: {
									propertyId,
									name: dto.guestName!,
									phone: dto.guestPhone,
									telegramChatId: opts.guestTelegramChatId,
								},
							})

					const booking = await tx.booking.create({
						data: {
							propertyId,
							roomId: room.id,
							guestId: guest.id,
							checkIn: new Date(range.checkIn),
							checkOut: new Date(range.checkOut),
							status,
							source,
							priceTotal: calcPriceTotal(Number(room.roomType.basePrice), range),
							notes: dto.notes,
						},
						include: { guest: true, room: { include: { roomType: true } } },
					})

					await this.outbox.emit(tx, {
						aggregateType: "booking",
						aggregateId: booking.id,
						type: "booking.created",
						payload: {
							bookingId: booking.id,
							propertyId,
							roomId: room.id,
							source,
							status,
							checkIn: range.checkIn,
							checkOut: range.checkOut,
						},
					})

					return booking
				},
				{ isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
			),
		)
	}

	async changeStatus(userId: string, bookingId: string, dto: ChangeStatusDto) {
		const property = await this.propertyOf(userId)
		return this.changeStatusForProperty(property.id, bookingId, dto.status)
	}

	async changeStatusForProperty(
		propertyId: string,
		bookingId: string,
		nextStatus: BookingStatus,
	) {
		const booking = await this.prisma.booking.findUnique({
			where: { id: bookingId },
		})
		if (!booking) throw new NotFoundException("BOOKING_NOT_FOUND")
		if (booking.propertyId !== propertyId) throw new ForbiddenException()

		try {
			assertTransition(booking.status as BookingStatus, nextStatus)
		} catch (e) {
			if (e instanceof InvalidTransitionError) {
				throw new ConflictException({
					code: "INVALID_TRANSITION",
					message: e.message,
				})
			}
			throw e
		}

		return this.prisma.$transaction(async (tx) => {
			const updated = await tx.booking.update({
				where: { id: bookingId, version: booking.version },
				data: { status: nextStatus, version: { increment: 1 } },
				include: { guest: true, room: true },
			})
			await this.outbox.emit(tx, {
				aggregateType: "booking",
				aggregateId: bookingId,
				type: "booking.status_changed",
				payload: {
					bookingId,
					propertyId,
					source: booking.source,
					from: booking.status,
					to: nextStatus,
				},
			})
			return updated
		})
	}

	/** Ретраи при serialization failure (Postgres 40001 / Prisma P2034). */
	private async withSerializationRetry<T>(
		fn: () => Promise<T>,
		retries = 3,
	): Promise<T> {
		for (let attempt = 0; ; attempt++) {
			try {
				return await fn()
			} catch (e) {
				const code =
					e instanceof Prisma.PrismaClientKnownRequestError ? e.code : undefined
				const pgCode = (e as { code?: string })?.code
				const retriable = code === "P2034" || pgCode === "40001"
				if (!retriable || attempt >= retries) throw e
				await new Promise((r) => setTimeout(r, 20 * (attempt + 1)))
			}
		}
	}

	private async propertyOf(userId: string) {
		const property = await this.prisma.property.findFirst({
			where: { ownerId: userId },
		})
		if (!property) throw new NotFoundException("PROPERTY_NOT_FOUND")
		return property
	}
}
