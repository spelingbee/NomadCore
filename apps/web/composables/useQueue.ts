import type { Booking, BookingStatus, QueueItem } from "~/types"

/**
 * Очередь мутаций для интерфейса. Читает ту же таблицу Dexie, что ведёт
 * useApi.ts, и переводит её в человеческие строки.
 *
 * Заголовок мутации выводится из тела запроса, а не хранится рядом с ним:
 * сохранённый слой пишет в очередь только { path, method, body }, и
 * заводить там ещё и подпись означало бы дублировать i18n в базе.
 */
const ACTION_KEY: Record<string, string> = {
	CONFIRMED: "booking.confirm",
	CHECKED_IN: "booking.checkIn",
	CHECKED_OUT: "booking.checkOut",
	CANCELLED: "booking.cancelBooking",
}

export function useQueue() {
	const config = useRuntimeConfig()
	const { t } = useI18n()
	const { byId } = useBookings()
	const { retryMutation, discardMutation } = useApi()
	const { refresh, pending: pendingCount, broken: brokenCount } = useSyncState()

	const items = useState<QueueItem[]>("nc-queue", () => [])

	function describe(bookingId: string | undefined, body: unknown): {
		title: string
		subtitle: string
	} {
		const booking = bookingId ? byId(bookingId) : null
		const guest = booking?.guest?.name ?? ""
		const status = (body as { status?: BookingStatus } | null)?.status
		const key = status ? ACTION_KEY[status] : undefined
		const action = key ? t(key) : t("queue.change")
		return {
			title: guest ? `${action} · ${guest}` : action,
			subtitle: booking?.room?.label
				? t("card.room") + " " + booking.room.label
				: "",
		}
	}

	async function load(): Promise<void> {
		if (config.public.demo) {
			const { demoQueue } = await import("~/fixtures/demo")
			items.value = demoQueue(t, byId)
			// Полоса связи и счётчик на вкладке читают эти же две величины.
			// Без этого демо показывало «Всё отправлено» поверх двух мутаций.
			pendingCount.value = items.value.length
			brokenCount.value = items.value.filter((i) => i.state !== "pending").length
			return
		}
		const { db } = await import("~/offline/db")
		const rows = await db.pendingMutations.orderBy("createdAt").toArray()
		items.value = rows.map((m) => {
			const text = describe(m.bookingId, m.body)
			return {
				id: m.id!,
				state: m.state ?? "pending",
				title: text.title,
				subtitle: text.subtitle,
				bookingId: m.bookingId,
				error: m.error,
				// Колонки «На телефоне» / «На сервере» заполняются, только
				// если сервер прислал снимок. Сегодня API тела 409 не отдаёт,
				// поэтому они пустые, и экран честно деградирует до
				// «повторить или отклонить». Разбор — docs/WEB-API-GAPS.md.
				theirs: undefined,
				changedBy: m.server?.changedBy,
				changedAt: m.server?.changedAt,
			} satisfies QueueItem
		})
	}

	async function retry(id: number): Promise<void> {
		if (config.public.demo) {
			items.value = items.value.filter((i) => i.id !== id)
			pendingCount.value = items.value.length
			brokenCount.value = items.value.filter((i) => i.state !== "pending").length
			return
		}
		await retryMutation(id)
		await Promise.all([load(), refresh()])
	}

	async function discard(id: number): Promise<void> {
		if (config.public.demo) {
			items.value = items.value.filter((i) => i.id !== id)
			pendingCount.value = items.value.length
			brokenCount.value = items.value.filter((i) => i.state !== "pending").length
			return
		}
		await discardMutation(id)
		await Promise.all([load(), refresh()])
	}

	const broken = computed(
		() => items.value.filter((i) => i.state !== "pending").length,
	)

	return { items, broken, load, retry, discard }
}
