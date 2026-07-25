import { Module } from "@nestjs/common"
import { BookingsModule } from "../bookings/bookings.module"
import { PublicApiKeyGuard, PublicController } from "./public.controller"
import { PublicService } from "./public.service"

@Module({
	imports: [BookingsModule],
	controllers: [PublicController],
	providers: [PublicService, PublicApiKeyGuard],
})
export class PublicModule {}
