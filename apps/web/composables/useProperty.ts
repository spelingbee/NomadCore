import type { Property, Room } from "~/types"
import { demoProperty } from "~/fixtures/demo"
import { todayIn } from "~/utils/dates"

/**
 * Объект владельца вместе с номерами. Один запрос на всё приложение:
 * GET /properties/me отдаёт property + roomTypes[] + rooms[]{roomType},
 * поэтому отдельные /rooms и /room-types четырём экранам не нужны.
 */
export function useProperty() {
	const config = useRuntimeConfig()
	const { request } = useApi()

	const property = useState<Property | null>("nc-property", () => null)
	const pending = useState<boolean>("nc-property-pending", () => false)
	const failed = useState<boolean>("nc-property-failed", () => false)

	async function load(): Promise<void> {
		if (property.value || pending.value) return
		pending.value = true
		failed.value = false
		try {
			property.value = config.public.demo
				? demoProperty
				: await request<Property>("/properties/me")
		} catch {
			// Офлайн без кэша или объект ещё не создан. Экран покажет пустое
			// состояние, а не белый лист — молча падать здесь нельзя.
			failed.value = true
		} finally {
			pending.value = false
		}
	}

	const rooms = computed<Room[]>(() => property.value?.rooms ?? [])

	/** «Сегодня» в таймзоне ОБЪЕКТА. До загрузки — Бишкек, как в схеме по умолчанию. */
	const today = computed(() => todayIn(property.value?.timezone ?? "Asia/Bishkek"))

	return { property, rooms, today, pending, failed, load }
}
