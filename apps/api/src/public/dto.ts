import { IsISO8601, IsOptional, IsString, MaxLength } from "class-validator"

export class PublicCreateBookingDto {
	@IsString()
	roomTypeId: string

	@IsISO8601({ strict: true })
	checkIn: string // YYYY-MM-DD

	@IsISO8601({ strict: true })
	checkOut: string // YYYY-MM-DD, эксклюзивно

	@IsString()
	@MaxLength(120)
	guestName: string

	@IsOptional()
	@IsString()
	@MaxLength(32)
	guestPhone?: string

	@IsOptional()
	@IsString()
	@MaxLength(500)
	notes?: string
}
