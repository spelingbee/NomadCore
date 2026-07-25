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
import { IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator"
import { CurrentUser, JwtAuthGuard, type AuthUser } from "../auth/jwt-auth.guard"
import { RoomTypesService } from "./room-types.service"

class CreateRoomTypeDto {
	@IsString()
	name: string

	@IsOptional()
	@IsInt()
	@Min(1)
	capacity?: number

	@IsNumber()
	@Min(0)
	basePrice: number
}

class UpdateRoomTypeDto {
	@IsOptional()
	@IsString()
	name?: string

	@IsOptional()
	@IsInt()
	@Min(1)
	capacity?: number

	@IsOptional()
	@IsNumber()
	@Min(0)
	basePrice?: number
}

@Controller("room-types")
@UseGuards(JwtAuthGuard)
export class RoomTypesController {
	constructor(private readonly roomTypes: RoomTypesService) {}

	@Get()
	list(@CurrentUser() user: AuthUser) {
		return this.roomTypes.list(user.sub)
	}

	@Post()
	create(@CurrentUser() user: AuthUser, @Body() dto: CreateRoomTypeDto) {
		return this.roomTypes.create(user.sub, dto)
	}

	@Patch(":id")
	update(
		@CurrentUser() user: AuthUser,
		@Param("id") id: string,
		@Body() dto: UpdateRoomTypeDto,
	) {
		return this.roomTypes.update(user.sub, id, dto)
	}

	@Delete(":id")
	remove(@CurrentUser() user: AuthUser, @Param("id") id: string) {
		return this.roomTypes.remove(user.sub, id)
	}
}
