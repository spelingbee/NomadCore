import { Module } from "@nestjs/common"
import { BillingModule } from "../billing/billing.module"
import { BookingsModule } from "../bookings/bookings.module"
import { TelegramController } from "./telegram.controller"
import { TelegramService } from "./telegram.service"

@Module({
	imports: [BookingsModule, BillingModule],
	controllers: [TelegramController],
	providers: [TelegramService],
	exports: [TelegramService],
})
export class TelegramModule {}
