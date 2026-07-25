import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common"
import type { BookingStatus } from "@prisma/client"
import { BookingsService } from "../bookings/bookings.service"
import { BLOCKING_STATUSES, occupiedDates } from "../bookings/domain"
import { PrismaService } from "../common/prisma.service"
import type { PublicCreateBookingDto } from "./dto"

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const MAX_RANGE_DAYS = 92

function enumerateDays(from: string, to: string): string[] {
	const days: string[] = []
	const cursor = new Date(`${from}T00:00:00Z`)
	while (cursor.toISOString().slice(0, 10) < to && days.length <= MAX_RANGE_DAYS) {
		days.push(cursor.toISOString().slice(0, 10))
		cursor.setUTCDate(cursor.getUTCDate() + 1)
	}
	return days
}

function isOverbooking(e: unknown): boolean {
	if (!(e instanceof ConflictException)) return false
	const res = e.getResponse()
	return (
		typeof res === "object" &&
		res !== null &&
		(res as { code?: string }).code === "OVERBOOKING"
	)
}

/**
 * Публичная витрина (Kataloga и другие маркетплейсы).
 *
 * Источник истины по занятости — NomadCore: бронь создаётся общим путём
 * BookingsService.createForProperty (анти-овербукинг FOR UPDATE), статус HOLD
 * до подтверждения владельцем. Наружу не отдаём имена гостей и детали броней —
 * только количество свободных номеров по типам.
 */
@Injectable()
export class PublicService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly bookings: BookingsService,
	) {}

	/** Карточка объекта для витрины. */
	async propertyCard(slug: string) {
		const property = await this.bySlug(slug)
		const roomTypes = await this.prisma.roomType.findMany({
			where: { propertyId: property.id },
			include: { _count: { select: { rooms: true } } },
			orderBy: { name: "asc" },
		})
		return {
			slug: property.slug,
			name: property.name,
			region: property.region,
			address: property.address,
			timezone: property.timezone,
			roomTypes: roomTypes.map((rt) => ({
				id: rt.id,
				name: rt.name,
				capacity: rt.capacity,
				basePrice: Number(rt.basePrice),
				totalRooms: rt._count.rooms,
			})),
		}
	}

	/** Свободные номера по типам на каждый день диапазона (без данных гостей). */
	async availability(slug: string, from?: string, to?: string) {
		if (!from || !to || !DATE_RE.test(from) || !DATE_RE.test(to) || from >= to) {
			throw new BadRequestException("INVALID_RANGE")
		}
		const days = enumerateDays(from, to)
		if (days.length > MAX_RANGE_DAYS) {
			throw new BadRequestException("RANGE_TOO_LARGE")
		}

		const property = await this.bySlug(slug)
		const [rooms, roomTypes] = await Promise.all([
			this.prisma.room.findMany({
				where: { propertyId: property.id },
				include: {
					bookings: {
						where: {
							status: { in: BLOCKING_STATUSES as BookingStatus[] },
							checkIn: { lt: new Date(to) },
							checkOut: { gt: new Date(from) },
						},
						select: { checkIn: true, checkOut: true },
					},
				},
			}),
			this.prisma.roomType.findMany({
				where: { propertyId: property.id },
				orderBy: { name: "asc" },
			}),
		])

		// roomTypeId -> дата -> число занятых номеров
		const occupied = new Map<string, Map<string, number>>()
		const totals = new Map<string, number>()
		for (const room of rooms) {
			totals.set(room.roomTypeId, (totals.get(room.roomTypeId) ?? 0) + 1)
			for (const booking of room.bookings) {
				for (const date of occupiedDates({
					checkIn: booking.checkIn.toISOString().slice(0, 10),
					checkOut: booking.checkOut.toISOString().slice(0, 10),
				})) {
					if (date < from || date >= to) continue
					const byDate =
						occupied.get(room.roomTypeId) ?? new Map<string, number>()
					byDate.set(date, (byDate.get(date) ?? 0) + 1)
					occupied.set(room.roomTypeId, byDate)
				}
			}
		}

		return {
			from,
			to,
			roomTypes: roomTypes.map((rt) => {
				const total = totals.get(rt.id) ?? 0
				const byDate = occupied.get(rt.id)
				return {
					id: rt.id,
					name: rt.name,
					capacity: rt.capacity,
					basePrice: Number(rt.basePrice),
					totalRooms: total,
					days: days.map((date) => ({
						date,
						freeRooms: Math.max(0, total - (byDate?.get(date) ?? 0)),
					})),
				}
			}),
		}
	}

	/** Бронь с витрины: подбираем свободный номер типа, создаём HOLD. */
	async createBooking(slug: string, dto: PublicCreateBookingDto) {
		const checkIn = dto.checkIn.slice(0, 10)
		const checkOut = dto.checkOut.slice(0, 10)
		if (
			!DATE_RE.test(checkIn) ||
			!DATE_RE.test(checkOut) ||
			checkIn >= checkOut
		) {
			throw new BadRequestException("INVALID_RANGE")
		}
		// Анти-абьюз: витрина не может бронировать задним числом, дальше года
		// или длиннее 30 ночей (владелец через своё приложение — может).
		const today = new Date().toISOString().slice(0, 10)
		const horizon = new Date(Date.now() + 365 * 86_400_000)
			.toISOString()
			.slice(0, 10)
		if (checkIn < today) throw new BadRequestException("CHECKIN_IN_PAST")
		if (checkIn > horizon) throw new BadRequestException("CHECKIN_TOO_FAR")
		if (enumerateDays(checkIn, checkOut).length > 30) {
			throw new BadRequestException("STAY_TOO_LONG")
		}
		const property = await this.bySlug(slug)
		const candidates = await this.prisma.room.findMany({
			where: { propertyId: property.id, roomTypeId: dto.roomTypeId },
			orderBy: { label: "asc" },
		})
		if (candidates.length === 0) {
			throw new NotFoundException("ROOM_TYPE_NOT_FOUND")
		}

		for (const room of candidates) {
			try {
				const booking = await this.bookings.createForProperty(
					property.id,
					{
						roomId: room.id,
						checkIn: dto.checkIn,
						checkOut: dto.checkOut,
						guestName: dto.guestName,
						guestPhone: dto.guestPhone,
						notes: dto.notes,
					},
					{ status: "HOLD", source: "marketplace" },
				)
				return {
					id: booking.id,
					status: booking.status,
					checkIn: dto.checkIn.slice(0, 10),
					checkOut: dto.checkOut.slice(0, 10),
					roomLabel: booking.room.label,
					roomTypeName: booking.room.roomType.name,
					priceTotal: Number(booking.priceTotal),
				}
			} catch (e) {
				if (isOverbooking(e)) continue // номер занят — пробуем следующий
				throw e
			}
		}
		throw new ConflictException({ code: "NO_ROOMS_AVAILABLE" })
	}

	private async bySlug(slug: string) {
		const property = await this.prisma.property.findFirst({
			where: { slug: slug.toLowerCase() },
		})
		if (!property) throw new NotFoundException("PROPERTY_NOT_FOUND")
		return property
	}
}
