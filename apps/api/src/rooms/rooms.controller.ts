import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards,
} from "@nestjs/common"
import { IsOptional, IsString } from "class-validator"
import { CurrentUser, JwtAuthGuard, type AuthUser } from "../auth/jwt-auth.guard"
import { RoomsService } from "./rooms.service"

class CreateRoomDto {
	@IsString()
	roomTypeId: string

	@IsString()
	label: string
}

class UpdateRoomDto {
	@IsOptional()
	@IsString()
	roomTypeId?: string

	@IsOptional()
	@IsString()
	label?: string
}

@Controller("rooms")
@UseGuards(JwtAuthGuard)
export class RoomsController {
	constructor(private readonly rooms: RoomsService) {}

	@Get()
	list(@CurrentUser() user: AuthUser) {
		return this.rooms.list(user.sub)
	}

	@Post()
	create(@CurrentUser() user: AuthUser, @Body() dto: CreateRoomDto) {
		return this.rooms.create(user.sub, dto)
	}

	@Patch(":id")
	update(
		@CurrentUser() user: AuthUser,
		@Param("id") id: string,
		@Body() dto: UpdateRoomDto,
	) {
		return this.rooms.update(user.sub, id, dto)
	}

	@Delete(":id")
	remove(@CurrentUser() user: AuthUser, @Param("id") id: string) {
		return this.rooms.remove(user.sub, id)
	}
}
