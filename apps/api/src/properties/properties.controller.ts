import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common"
import { IsOptional, IsString } from "class-validator"
import { CurrentUser, JwtAuthGuard, type AuthUser } from "../auth/jwt-auth.guard"
import { PropertiesService } from "./properties.service"

class UpsertPropertyDto {
	@IsOptional()
	@IsString()
	name?: string

	@IsOptional()
	@IsString()
	region?: string

	@IsOptional()
	@IsString()
	address?: string

	@IsOptional()
	@IsString()
	timezone?: string

	/** Публичный адрес витрины (маркетплейс); пустая строка снимает адрес. */
	@IsOptional()
	@IsString()
	slug?: string
}

@Controller("properties")
@UseGuards(JwtAuthGuard)
export class PropertiesController {
	constructor(private readonly properties: PropertiesService) {}

	@Get("me")
	getMine(@CurrentUser() user: AuthUser) {
		return this.properties.getMine(user.sub)
	}

	@Patch("me")
	upsertMine(@CurrentUser() user: AuthUser, @Body() dto: UpsertPropertyDto) {
		return this.properties.upsertMine(user.sub, dto)
	}
}
