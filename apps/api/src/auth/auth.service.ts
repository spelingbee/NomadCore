import {
	BadRequestException,
	Injectable,
	Logger,
	UnauthorizedException,
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { randomInt } from "node:crypto"
import { PrismaService } from "../common/prisma.service"

/**
 * OTP-аутентификация по телефону.
 *
 * На старте — режим "stub": код не отправляется по SMS, а логируется
 * (и в dev возвращается в ответе). SMS-провайдер КР подключается позже
 * заменой sendOtp().
 */
@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name)
	// В проде — Redis с TTL; для MVP-заглушки достаточно in-memory.
	private readonly otpStore = new Map<
		string,
		{ code: string; expiresAt: number; attempts: number }
	>()

	constructor(
		private readonly prisma: PrismaService,
		private readonly jwt: JwtService,
	) {}

	async requestOtp(phone: string): Promise<{ ok: true; devCode?: string }> {
		const normalized = this.normalizePhone(phone)
		const code = String(randomInt(100000, 999999))
		this.otpStore.set(normalized, {
			code,
			expiresAt: Date.now() + 5 * 60_000,
			attempts: 0,
		})
		await this.sendOtp(normalized, code)
		const isStub = (process.env.OTP_MODE ?? "stub") === "stub"
		return isStub ? { ok: true, devCode: code } : { ok: true }
	}

	async verifyOtp(
		phone: string,
		code: string,
		name?: string,
	): Promise<{ accessToken: string; userId: string; isNew: boolean }> {
		const normalized = this.normalizePhone(phone)
		const entry = this.otpStore.get(normalized)
		if (!entry || entry.expiresAt < Date.now()) {
			throw new UnauthorizedException("OTP_EXPIRED")
		}
		if (entry.attempts >= 5) {
			this.otpStore.delete(normalized)
			throw new UnauthorizedException("OTP_TOO_MANY_ATTEMPTS")
		}
		entry.attempts += 1
		if (entry.code !== code) {
			throw new UnauthorizedException("OTP_INVALID")
		}
		this.otpStore.delete(normalized)

		let user = await this.prisma.user.findUnique({
			where: { phone: normalized },
		})
		const isNew = !user
		if (!user) {
			user = await this.prisma.user.create({
				data: { phone: normalized, name: name?.trim() || normalized },
			})
		}
		const accessToken = await this.jwt.signAsync({
			sub: user.id,
			phone: user.phone,
		})
		return { accessToken, userId: user.id, isNew }
	}

	private async sendOtp(phone: string, code: string): Promise<void> {
		// TODO(0.2): интеграция с SMS-провайдером КР (открытый вопрос §8 ТЗ)
		this.logger.log(`[OTP stub] ${phone} -> ${code}`)
	}

	private normalizePhone(phone: string): string {
		const digits = phone.replace(/[^\d+]/g, "")
		if (!/^\+?\d{9,15}$/.test(digits)) {
			throw new BadRequestException("PHONE_INVALID")
		}
		return digits.startsWith("+") ? digits : `+${digits}`
	}
}
