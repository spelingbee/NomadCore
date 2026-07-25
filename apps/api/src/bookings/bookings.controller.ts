import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from "@nestjs/common"
import { CurrentUser, JwtAuthGuard, type AuthUser } from "../auth/jwt-auth.guard"
import { BookingsService } from "./bookings.service"
import { ChangeStatusDto, CreateBookingDto } from "./dto"

@Controller("bookings")
@UseGuards(JwtAuthGuard)
export class BookingsController {
	constructor(private readonly bookings: BookingsService) {}

	@Get()
	list(
		@CurrentUser() user: AuthUser,
		@Query("from") from?: string,
		@Query("to") to?: string,
	) {
		return this.bookings.list(user.sub, from, to)
	}

	@Post()
	create(@CurrentUser() user: AuthUser, @Body() dto: CreateBookingDto) {
		return this.bookings.create(user.sub, dto)
	}

	@Patch(":id/status")
	changeStatus(
		@CurrentUser() user: AuthUser,
		@Param("id") id: string,
		@Body() dto: ChangeStatusDto,
	) {
		return this.bookings.changeStatus(user.sub, id, dto)
	}
}
