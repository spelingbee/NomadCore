import {
	IsIn,
	IsISO8601,
	IsNumber,
	IsOptional,
	IsString,
} from "class-validator"
import { BOOKING_STATUSES, type BookingStatus } from "./domain"

export class CreateBookingDto {
	@IsString()
	roomId: string

	@IsISO8601({ strict: true })
	checkIn: string // YYYY-MM-DD

	@IsISO8601({ strict: true })
	checkOut: string // YYYY-MM-DD, эксклюзивно

	@IsOptional()
	@IsString()
	guestId?: string

	@IsOptional()
	@IsString()
	guestName?: string

	@IsOptional()
	@IsString()
	guestPhone?: string

	@IsOptional()
	@IsNumber()
	priceTotal?: number

	@IsOptional()
	@IsIn(["manual", "bot"])
	source?: string

	@IsOptional()
	@IsString()
	notes?: string
}

export class ChangeStatusDto {
	@IsIn(BOOKING_STATUSES as unknown as string[])
	status: BookingStatus
}
