/**
 * Состояние офлайн-слоя для интерфейса. Читает ту же очередь Dexie, которую
 * ведёт сохранённый useApi.ts, и ничего в ней не меняет.
 *
 * Офлайн — штатный режим, а не авария, поэтому присутствие у него постоянное:
 * полоса связи сверху, счётчик на вкладке «Очередь», пометка на конкретной
 * броне. Всплывающих уведомлений нет.
 */
export function useSyncState() {
	const { syncPending } = useSession()

	const online = useState<boolean>("nc-online", () => true)
	/** Мутации, которые сами не уедут: сервер их отверг. */
	const broken = useState<number>("nc-broken", () => 0)

	async function refresh(): Promise<void> {
		if (!import.meta.client) return
		const { db } = await import("~/offline/db")
		syncPending.value = await db.pendingMutations.count()
		broken.value = await db.conflicts.count()
	}

	return { online, pending: syncPending, broken, refresh }
}
