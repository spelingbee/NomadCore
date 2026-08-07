import type { Booking, BookingStatus } from "~/types"
import { NEXT } from "~/types"
import { demoBookings } from "~/fixtures/demo"
import { addDays, toDay } from "~/utils/dates"

/**
 * Брони объекта. Один общий кэш на приложение: «Сегодня», «Занятость» и
 * карточка читают его же, потому что GET /api/bookings/:id на сервере НЕ
 * СУЩЕСТВУЕТ и открыть одну бронь иначе нечем.
 *
 * Про окно запроса. Условие на сервере — `checkIn < to && checkOut > from`
 * (apps/api/src/bookings/bookings.service.ts). Запрос from=сегодня даёт
 * `checkOut > сегодня` и МОЛЧА выбрасывает все сегодняшние выезды — ровно
 * те брони, ради которых экран «Сегодня» существует. Поэтому окно всегда
 * расширено на сутки назад, а нужные брони отбираются уже здесь.
 */
export function useBookings() {
	const config = useRuntimeConfig()
	const { request } = useApi()
	const { today } = useProperty()

	const all = useState<Booking[]>("nc-bookings", () => [])
	const pending = useState<boolean>("nc-bookings-pending", () => false)
	const failed = useState<boolean>("nc-bookings-failed", () => false)

	/** Сколько дней вперёд держим в кэше: 14 колонок «Занятости» плюс запас. */
	const HORIZON_DAYS = 21
	/** Компенсация серверного фильтра, см. комментарий выше. */
	const BACKFILL_DAYS = 1

	async function load(force = false): Promise<void> {
		if (pending.value) return
		if (all.value.length && !force) return
		pending.value = true
		failed.value = false
		try {
			if (config.public.demo) {
				all.value = demoBookings(today.value)
			} else {
				const from = addDays(today.value, -BACKFILL_DAYS)
				const to = addDays(today.value, HORIZON_DAYS)
				all.value = await request<Booking[]>("/bookings", {
					query: { from, to },
				})
			}
		} catch {
			failed.value = true
		} finally {
			pending.value = false
		}
	}

	/** Отменённые не занимают номер и не участвуют ни в одном списке. */
	const live = computed(() => all.value.filter((b) => b.status !== "CANCELLED"))

	const holds = computed(() => live.value.filter((b) => b.status === "HOLD"))

	const departures = computed(() =>
		live.value.filter(
			(b) => b.status === "CHECKED_IN" && toDay(b.checkOut) === today.value,
		),
	)

	const arrivals = computed(() =>
		live.value.filter(
			(b) => b.status === "CONFIRMED" && toDay(b.checkIn) === today.value,
		),
	)

	const inHouse = computed(() =>
		live.value.filter(
			(b) => b.status === "CHECKED_IN" && toDay(b.checkOut) > today.value,
		),
	)

	function byId(id: string): Booking | null {
		return all.value.find((b) => b.id === id) ?? null
	}

	function patchLocal(id: string, patch: Partial<Booking>): void {
		all.value = all.value.map((b) => (b.id === id ? { ...b, ...patch } : b))
	}

	/**
	 * Переход по статусной машине. Единственная мутация брони, которую
	 * умеет API: PATCH /api/bookings/:id/status с телом { status }.
	 * Дат, номера и гостя изменить нечем — PATCH /api/bookings не существует.
	 *
	 * Изменение применяется локально СРАЗУ: экран не ждёт сеть. Если сети
	 * нет, useApi положит мутацию в очередь и вернёт { queued: true }.
	 */
	async function changeStatus(
		booking: Booking,
		status: BookingStatus,
	): Promise<void> {
		patchLocal(booking.id, { status, sync: "pending" })
		if (config.public.demo) {
			patchLocal(booking.id, { sync: "ok", version: booking.version + 1 })
			return
		}
		try {
			const saved = await request<Booking | { queued: true }>(
				`/bookings/${booking.id}/status`,
				{ method: "PATCH", body: { status } },
			)
			if ("queued" in saved) return // ушло в офлайн-очередь, пометка остаётся
			patchLocal(booking.id, { ...saved, sync: "ok" })
		} catch {
			patchLocal(booking.id, { status: booking.status, sync: "rejected" })
			throw new Error("STATUS_CHANGE_FAILED")
		}
	}

	/** Следующий шаг машины или null, если состояние терминальное. */
	function nextStatus(booking: Booking): BookingStatus | null {
		return NEXT[booking.status]
	}

	return {
		all,
		live,
		holds,
		departures,
		arrivals,
		inHouse,
		pending,
		failed,
		load,
		byId,
		changeStatus,
		nextStatus,
		patchLocal,
	}
}
