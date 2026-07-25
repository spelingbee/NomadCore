import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from "@nestjs/common"
import { IsOptional, IsString } from "class-validator"
import { CurrentUser, JwtAuthGuard, type AuthUser } from "../auth/jwt-auth.guard"
import { GuestsService } from "./guests.service"

class CreateGuestDto {
	@IsString()
	name: string

	@IsOptional()
	@IsString()
	phone?: string

	@IsOptional()
	@IsString()
	notes?: string
}

class UpdateGuestDto {
	@IsOptional()
	@IsString()
	name?: string

	@IsOptional()
	@IsString()
	phone?: string

	@IsOptional()
	@IsString()
	notes?: string
}

@Controller("guests")
@UseGuards(JwtAuthGuard)
export class GuestsController {
	constructor(private readonly guests: GuestsService) {}

	@Get()
	list(@CurrentUser() user: AuthUser, @Query("q") q?: string) {
		return this.guests.list(user.sub, q)
	}

	@Post()
	create(@CurrentUser() user: AuthUser, @Body() dto: CreateGuestDto) {
		return this.guests.create(user.sub, dto)
	}

	@Patch(":id")
	update(
		@CurrentUser() user: AuthUser,
		@Param("id") id: string,
		@Body() dto: UpdateGuestDto,
	) {
		return this.guests.update(user.sub, id, dto)
	}

	@Delete(":id")
	remove(@CurrentUser() user: AuthUser, @Param("id") id: string) {
		return this.guests.remove(user.sub, id)
	}
}
