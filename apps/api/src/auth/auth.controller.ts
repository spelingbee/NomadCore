import { Body, Controller, Post } from "@nestjs/common"
import { IsOptional, IsString, Length } from "class-validator"
import { AuthService } from "./auth.service"

class RequestOtpDto {
	@IsString()
	phone: string
}

class VerifyOtpDto {
	@IsString()
	phone: string

	@IsString()
	@Length(6, 6)
	code: string

	@IsOptional()
	@IsString()
	name?: string
}

@Controller("auth")
export class AuthController {
	constructor(private readonly auth: AuthService) {}

	@Post("otp")
	requestOtp(@Body() dto: RequestOtpDto) {
		return this.auth.requestOtp(dto.phone)
	}

	@Post("verify")
	verifyOtp(@Body() dto: VerifyOtpDto) {
		return this.auth.verifyOtp(dto.phone, dto.code, dto.name)
	}
}
