import {
	Body,
	Controller,
	Get,
	NotFoundException,
	Post,
	UseGuards,
} from "@nestjs/common"
import { IsInt, Max, Min } from "class-validator"
import { CurrentUser, JwtAuthGuard, type AuthUser } from "../auth/jwt-auth.guard"
import { PrismaService } from "../common/prisma.service"
import { BillingService } from "./billing.service"

class ActivateProDto {
	@IsInt()
	@Min(1)
	@Max(365)
	days: number
}

@Controller("billing")
@UseGuards(JwtAuthGuard)
export class BillingController {
	constructor(
		private readonly billing: BillingService,
		private readonly prisma: PrismaService,
	) {}

	@Get("me")
	async me(@CurrentUser() user: AuthUser) {
		const property = await this.propertyOf(user.sub)
		const subscription = await this.billing.getSubscription(property.id)
		return {
			plan: subscription.plan,
			validUntil: subscription.validUntil,
			isPro: await this.billing.isPro(property.id),
		}
	}

	/**
	 * MVP-активация Pro (до интеграции Элсом/O!Деньги/MBank — вручную
	 * после оплаты переводом; платёжный провайдер — открытый вопрос ТЗ).
	 */
	@Post("activate")
	async activate(@CurrentUser() user: AuthUser, @Body() dto: ActivateProDto) {
		const property = await this.propertyOf(user.sub)
		return this.billing.activatePro(property.id, dto.days)
	}

	private async propertyOf(userId: string) {
		const property = await this.prisma.property.findFirst({
			where: { ownerId: userId },
		})
		if (!property) throw new NotFoundException("PROPERTY_NOT_FOUND")
		return property
	}
}
