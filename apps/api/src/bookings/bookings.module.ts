import { Module } from "@nestjs/common"
import { OutboxModule } from "../outbox/outbox.module"
import { BookingsController } from "./bookings.controller"
import { BookingsService } from "./bookings.service"

@Module({
	imports: [OutboxModule],
	controllers: [BookingsController],
	providers: [BookingsService],
	exports: [BookingsService],
})
export class BookingsModule {}
