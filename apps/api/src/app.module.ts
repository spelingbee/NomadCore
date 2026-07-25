import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { AuthModule } from "./auth/auth.module"
import { AvailabilityModule } from "./availability/availability.module"
import { BillingModule } from "./billing/billing.module"
import { BookingsModule } from "./bookings/bookings.module"
import { CommonModule } from "./common/common.module"
import { GuestsModule } from "./guests/guests.module"
import { HealthController } from "./common/health.controller"
import { NotificationsModule } from "./notifications/notifications.module"
import { OutboxModule } from "./outbox/outbox.module"
import { PropertiesModule } from "./properties/properties.module"
import { PublicModule } from "./public/public.module"
import { RoomTypesModule } from "./room-types/room-types.module"
import { RoomsModule } from "./rooms/rooms.module"
import { TelegramModule } from "./telegram/telegram.module"

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		CommonModule,
		AuthModule,
		PropertiesModule,
		RoomTypesModule,
		RoomsModule,
		GuestsModule,
		BookingsModule,
		AvailabilityModule,
		OutboxModule,
		NotificationsModule,
		TelegramModule,
		BillingModule,
		PublicModule,
	],
	controllers: [HealthController],
})
export class AppModule {}
