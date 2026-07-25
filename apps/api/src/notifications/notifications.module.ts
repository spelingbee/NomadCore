import { Module } from "@nestjs/common"
import { TelegramModule } from "../telegram/telegram.module"
import { NotificationsWorker } from "./notifications.worker"

@Module({
	imports: [TelegramModule],
	providers: [NotificationsWorker],
})
export class NotificationsModule {}
