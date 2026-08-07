/**
 * При появлении сети — проиграть очередь офлайн-мутаций.
 *
 * Единственный вызывающий flushQueue() во всём приложении: без этого плагина
 * очередь копится в IndexedDB и не уходит никогда.
 *
 * Правки только аддитивные: прежний порядок действий сохранён шаг в шаг,
 * добавлены отслеживание online и пересчёт счётчика «требует решения».
 */
export default defineNuxtPlugin(() => {
	const { flushQueue } = useApi()
	const { syncPending } = useSession()
	const { online, refresh } = useSyncState()

	async function init() {
		const { db } = await import("~/offline/db")
		syncPending.value = await db.pendingMutations.count()
		online.value = navigator.onLine
		await refresh()
		if (navigator.onLine) {
			await flushQueue()
			await refresh()
		}
	}

	window.addEventListener("online", () => {
		online.value = true
		flushQueue().then(refresh)
	})
	// Раньше слушателя offline не было вовсе: полоса связи не могла узнать,
	// что сеть пропала, пока не случится следующий запрос.
	window.addEventListener("offline", () => {
		online.value = false
	})
	init()
})
