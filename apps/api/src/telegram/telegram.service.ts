import { Injectable, Logger } from "@nestjs/common"

/**
 * Отправка сообщений в Telegram (Sprint 4).
 *
 * Режимы (TELEGRAM_MODE):
 * - "stub" — сообщения логируются (для разработки и тестов без сети);
 * - "real" — отправка через Bot API (нужен TELEGRAM_BOT_TOKEN).
 */
@Injectable()
export class TelegramService {
	private readonly logger = new Logger(TelegramService.name)

	get isStub(): boolean {
		return (process.env.TELEGRAM_MODE ?? "stub") === "stub"
	}

	async sendMessage(chatId: string, text: string): Promise<void> {
		if (this.isStub) {
			this.logger.log(`[TG stub] -> ${chatId}: ${text}`)
			return
		}
		const token = process.env.TELEGRAM_BOT_TOKEN
		if (!token) {
			this.logger.error("TELEGRAM_BOT_TOKEN не задан — сообщение не отправлено")
			return
		}
		const url = `https://api.telegram.org/bot${token}/sendMessage`
		const res = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ chat_id: chatId, text }),
		})
		if (!res.ok) {
			const body = await res.text().catch(() => "")
			throw new Error(`TELEGRAM_SEND_FAILED ${res.status}: ${body}`)
		}
	}
}
