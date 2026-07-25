import {
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from "@nestjs/common"
import { PrismaService } from "../common/prisma.service"

export type GuestInput = {
	name: string
	phone?: string
	notes?: string
}

@Injectable()
export class GuestsService {
	constructor(private readonly prisma: PrismaService) {}

	async list(ownerId: string, query?: string) {
		const property = await this.getOwnProperty(ownerId)
		return this.prisma.guest.findMany({
			where: {
				propertyId: property.id,
				...(query
					? {
							OR: [
								{ name: { contains: query, mode: "insensitive" } },
								{ phone: { contains: query } },
							],
						}
					: {}),
			},
			include: {
				bookings: {
					orderBy: { checkIn: "desc" },
					take: 5,
					include: { room: true },
				},
			},
			orderBy: { name: "asc" },
		})
	}

	async create(ownerId: string, input: GuestInput) {
		const property = await this.getOwnProperty(ownerId)
		return this.prisma.guest.create({
			data: { propertyId: property.id, ...input },
		})
	}

	async update(ownerId: string, id: string, input: Partial<GuestInput>) {
		await this.assertOwn(ownerId, id)
		return this.prisma.guest.update({ where: { id }, data: input })
	}

	async remove(ownerId: string, id: string) {
		await this.assertOwn(ownerId, id)
		const bookings = await this.prisma.booking.count({
			where: { guestId: id },
		})
		if (bookings > 0) throw new ConflictException("GUEST_HAS_BOOKINGS")
		return this.prisma.guest.delete({ where: { id } })
	}

	private async assertOwn(ownerId: string, id: string) {
		const guest = await this.prisma.guest.findFirst({
			where: { id, property: { ownerId } },
		})
		if (!guest) throw new NotFoundException("GUEST_NOT_FOUND")
	}

	private async getOwnProperty(ownerId: string) {
		const property = await this.prisma.property.findFirst({
			where: { ownerId },
		})
		if (!property) throw new ForbiddenException("NO_PROPERTY")
		return property
	}
}
