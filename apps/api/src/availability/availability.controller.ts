import { Controller, Get, Query, UseGuards } from "@nestjs/common"
import { CurrentUser, JwtAuthGuard, type AuthUser } from "../auth/jwt-auth.guard"
import { AvailabilityService } from "./availability.service"

@Controller("availability")
@UseGuards(JwtAuthGuard)
export class AvailabilityController {
	constructor(private readonly availability: AvailabilityService) {}

	@Get()
	grid(
		@CurrentUser() user: AuthUser,
		@Query("from") from: string,
		@Query("to") to: string,
	) {
		return this.availability.grid(user.sub, from, to)
	}
}
