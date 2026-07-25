import {
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from "@nestjs/common"
import { PrismaService } from "../common/prisma.service"

export type RoomTypeInput = {
	name: string
	capacity?: number
	basePrice: number
}

@Injectable()
export class RoomTypesService {
	constructor(private readonly prisma: PrismaService) {}

	async list(ownerId: string) {
		const property = await this.getOwnProperty(ownerId)
		return this.prisma.roomType.findMany({
			where: { propertyId: property.id },
			include: { rooms: true },
			orderBy: { name: "asc" },
		})
	}

	async create(ownerId: string, input: RoomTypeInput) {
		const property = await this.getOwnProperty(ownerId)
		return this.prisma.roomType.create({
			data: {
				propertyId: property.id,
				name: input.name,
				capacity: input.capacity ?? 2,
				basePrice: input.basePrice,
			},
		})
	}

	async update(ownerId: string, id: string, input: Partial<RoomTypeInput>) {
		await this.assertOwn(ownerId, id)
		return this.prisma.roomType.update({ where: { id }, data: input })
	}

	async remove(ownerId: string, id: string) {
		await this.assertOwn(ownerId, id)
		const roomsCount = await this.prisma.room.count({
			where: { roomTypeId: id },
		})
		if (roomsCount > 0) {
			throw new ConflictException("ROOM_TYPE_HAS_ROOMS")
		}
		return this.prisma.roomType.delete({ where: { id } })
	}

	private async assertOwn(ownerId: string, id: string) {
		const roomType = await this.prisma.roomType.findFirst({
			where: { id, property: { ownerId } },
		})
		if (!roomType) throw new NotFoundException("ROOM_TYPE_NOT_FOUND")
	}

	private async getOwnProperty(ownerId: string) {
		const property = await this.prisma.property.findFirst({
			where: { ownerId },
		})
		if (!property) throw new ForbiddenException("NO_PROPERTY")
		return property
	}
}
