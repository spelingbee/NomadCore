import { createHash, timingSafeEqual } from "node:crypto"
import {
	Body,
	CanActivate,
	Controller,
	ExecutionContext,
	Get,
	HttpException,
	Injectable,
	Param,
	Post,
	Query,
	Type,
	UnauthorizedException,
	UseGuards,
} from "@nestjs/common"
import { PublicCreateBookingDto } from "./dto"
import { PublicService } from "./public.service"

type RequestLike = {
	ip?: string
	headers: Record<string, string | string[] | undefined>
	socket?: { remoteAddress?: string }
}

function sha256(value: string): Buffer {
	return createHash("sha256").update(value).digest()
}

/** Сравнение без утечки по времени (хэширование выравнивает длины). */
function safeEqual(a: string, b: string): boolean {
	return timingSafeEqual(sha256(a), sha256(b))
}

/**
 * Если задан env PUBLIC_API_KEY, создание брони требует заголовок x-api-key
 * (им пользуются бэкенды маркетплейсов, например Kataloga).
 * Чтение витрины всегда открыто. В проде ключ обязателен.
 */
@Injectable()
export class PublicApiKeyGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const expected = process.env.PUBLIC_API_KEY
		if (!expected) return true
		const request = context.switchToHttp().getRequest<RequestLike>()
		const provided = request.headers["x-api-key"]
		if (typeof provided === "string" && safeEqual(provided, expected)) {
			return true
		}
		throw new UnauthorizedException("INVALID_API_KEY")
	}
}

type Bucket = { count: number; resetAt: number }

/**
 * Простой in-memory rate limit по IP — без внешних зависимостей.
 * Для одного инстанса достаточно; при масштабировании — вынести в Redis.
 */
/* Возвращаемый тип указан ЯВНО. Без него TypeScript выводит тип
   безымянного класса с приватным полем `buckets`, не может назвать его в
   объявлении экспортируемых констант ниже и падает с TS4094 — из-за чего
   не проходили ни `pnpm typecheck`, ни `nest build`. */
function makeRateLimitGuard(
	limit: number,
	windowMs: number,
): Type<CanActivate> {
	@Injectable()
	class RateLimitGuard implements CanActivate {
		private readonly buckets = new Map<string, Bucket>()

		canActivate(context: ExecutionContext): boolean {
			const request = context.switchToHttp().getRequest<RequestLike>()
			const ip = request.ip ?? request.socket?.remoteAddress ?? "unknown"
			const now = Date.now()
			if (this.buckets.size > 10_000) {
				for (const [key, bucket] of this.buckets) {
					if (bucket.resetAt <= now) this.buckets.delete(key)
				}
			}
			const bucket = this.buckets.get(ip)
			if (!bucket || bucket.resetAt <= now) {
				this.buckets.set(ip, { count: 1, resetAt: now + windowMs })
				return true
			}
			if (bucket.count >= limit) {
				throw new HttpException("RATE_LIMITED", 429)
			}
			bucket.count += 1
			return true
		}
	}
	return RateLimitGuard
}

export const PublicReadRateLimitGuard = makeRateLimitGuard(120, 60_000)
export const PublicWriteRateLimitGuard = makeRateLimitGuard(10, 60_000)

@Controller("public/:slug")
export class PublicController {
	constructor(private readonly service: PublicService) {}

	@Get()
	@UseGuards(PublicReadRateLimitGuard)
	property(@Param("slug") slug: string) {
		return this.service.propertyCard(slug)
	}

	@Get("availability")
	@UseGuards(PublicReadRateLimitGuard)
	availability(
		@Param("slug") slug: string,
		@Query("from") from?: string,
		@Query("to") to?: string,
	) {
		return this.service.availability(slug, from, to)
	}

	@Post("bookings")
	@UseGuards(PublicWriteRateLimitGuard, PublicApiKeyGuard)
	createBooking(
		@Param("slug") slug: string,
		@Body() dto: PublicCreateBookingDto,
	) {
		return this.service.createBooking(slug, dto)
	}
}
