import {
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from "@nestjs/common"
import { PrismaService } from "../common/prisma.service"

@Injectable()
export class RoomsService {
	constructor(private readonly prisma: PrismaService) {}

	async list(ownerId: string) {
		const property = await this.getOwnProperty(ownerId)
		return this.prisma.room.findMany({
			where: { propertyId: property.id },
			include: { roomType: true },
			orderBy: { label: "asc" },
		})
	}

	async create(ownerId: string, input: { roomTypeId: string; label: string }) {
		const property = await this.getOwnProperty(ownerId)
		const roomType = await this.prisma.roomType.findFirst({
			where: { id: input.roomTypeId, propertyId: property.id },
		})
		if (!roomType) throw new NotFoundException("ROOM_TYPE_NOT_FOUND")
		try {
			return await this.prisma.room.create({
				data: {
					propertyId: property.id,
					roomTypeId: input.roomTypeId,
					label: input.label,
				},
			})
		} catch (e) {
			if ((e as { code?: string }).code === "P2002") {
				// @@unique([propertyId, label])
				throw new ConflictException("ROOM_LABEL_TAKEN")
			}
			throw e
		}
	}

	async update(
		ownerId: string,
		id: string,
		input: { roomTypeId?: string; label?: string },
	) {
		await this.assertOwn(ownerId, id)
		try {
			return await this.prisma.room.update({ where: { id }, data: input })
		} catch (e) {
			if ((e as { code?: string }).code === "P2002") {
				throw new ConflictException("ROOM_LABEL_TAKEN")
			}
			throw e
		}
	}

	async remove(ownerId: string, id: string) {
		await this.assertOwn(ownerId, id)
		const activeBookings = await this.prisma.booking.count({
			where: { roomId: id, status: { in: ["HOLD", "CONFIRMED", "CHECKED_IN"] } },
		})
		if (activeBookings > 0) {
			throw new ConflictException("ROOM_HAS_ACTIVE_BOOKINGS")
		}
		return this.prisma.room.delete({ where: { id } })
	}

	private async assertOwn(ownerId: string, id: string) {
		const room = await this.prisma.room.findFirst({
			where: { id, property: { ownerId } },
		})
		if (!room) throw new NotFoundException("ROOM_NOT_FOUND")
	}

	private async getOwnProperty(ownerId: string) {
		const property = await this.prisma.property.findFirst({
			where: { ownerId },
		})
		if (!property) throw new ForbiddenException("NO_PROPERTY")
		return property
	}
}
