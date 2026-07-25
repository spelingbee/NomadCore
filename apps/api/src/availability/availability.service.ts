import { ForbiddenException, Injectable } from "@nestjs/common"
import type { BookingStatus } from "@prisma/client"
import { BLOCKING_STATUSES, occupiedDates } from "../bookings/domain"
import { PrismaService } from "../common/prisma.service"

export type AvailabilityCell = {
	date: string
	bookingId: string
	status: string
	guestName: string
}

export type AvailabilityRow = {
	roomId: string
	label: string
	roomTypeName: string
	cells: AvailabilityCell[]
}

/** Сетка номера × дни для экрана календаря. */
@Injectable()
export class AvailabilityService {
	constructor(private readonly prisma: PrismaService) {}

	async grid(
		ownerId: string,
		from: string,
		to: string,
	): Promise<{ from: string; to: string; rooms: AvailabilityRow[] }> {
		const property = await this.prisma.property.findFirst({
			where: { ownerId },
		})
		if (!property) throw new ForbiddenException("NO_PROPERTY")

		const rooms = await this.prisma.room.findMany({
			where: { propertyId: property.id },
			include: {
				roomType: true,
				bookings: {
					where: {
						status: { in: BLOCKING_STATUSES as BookingStatus[] },
						checkIn: { lt: new Date(to) },
						checkOut: { gt: new Date(from) },
					},
					include: { guest: true },
				},
			},
			orderBy: { label: "asc" },
		})

		return {
			from,
			to,
			rooms: rooms.map((room) => ({
				roomId: room.id,
				label: room.label,
				roomTypeName: room.roomType.name,
				cells: room.bookings.flatMap((b) =>
					occupiedDates({
						checkIn: b.checkIn.toISOString().slice(0, 10),
						checkOut: b.checkOut.toISOString().slice(0, 10),
					})
						.filter((d) => d >= from && d < to)
						.map((date) => ({
							date,
							bookingId: b.id,
							status: b.status,
							guestName: b.guest.name,
						})),
				),
			})),
		}
	}
}
