import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common"
import { Prisma } from "@prisma/client"
import { PrismaService } from "../common/prisma.service"

export type UpsertPropertyInput = {
	name?: string
	region?: string
	address?: string
	timezone?: string
	/** Публичный адрес витрины (маркетплейс). Пустая строка снимает адрес. */
	slug?: string
}

/** slug: 2–40 символов, [a-z0-9-], без дефисов по краям. */
const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$/

function normalizeSlug(raw: string): string | null {
	const slug = raw.trim().toLowerCase()
	if (slug === "") return null
	if (!SLUG_RE.test(slug)) throw new BadRequestException("INVALID_SLUG")
	return slug
}

/** Фаза 0.1: у владельца ровно 1 объект (мультиобъект — Pro, позже). */
@Injectable()
export class PropertiesService {
	constructor(private readonly prisma: PrismaService) {}

	async getMine(ownerId: string) {
		const property = await this.prisma.property.findFirst({
			where: { ownerId },
			include: { roomTypes: true, rooms: { include: { roomType: true } } },
		})
		if (!property) throw new NotFoundException("NO_PROPERTY")
		return property
	}

	async upsertMine(ownerId: string, input: UpsertPropertyInput) {
		const { slug, ...rest } = input
		const normalizedSlug = slug !== undefined ? normalizeSlug(slug) : undefined

		const existing = await this.prisma.property.findFirst({
			where: { ownerId },
		})
		try {
			if (existing) {
				return await this.prisma.property.update({
					where: { id: existing.id },
					data: {
						...rest,
						...(slug !== undefined ? { slug: normalizedSlug } : {}),
					},
				})
			}
			return await this.prisma.property.create({
				data: {
					ownerId,
					name: rest.name ?? "Мой объект",
					region: rest.region,
					address: rest.address,
					timezone: rest.timezone ?? "Asia/Bishkek",
					...(slug !== undefined ? { slug: normalizedSlug } : {}),
				},
			})
		} catch (e) {
			// Уникальный индекс по slug: адрес витрины уже занят другим объектом
			if (
				e instanceof Prisma.PrismaClientKnownRequestError &&
				e.code === "P2002"
			) {
				throw new ConflictException({ code: "SLUG_TAKEN" })
			}
			throw e
		}
	}
}
