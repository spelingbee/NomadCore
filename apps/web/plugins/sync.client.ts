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
	// В демо-режиме настоящей очереди нет, и Dexie пуст. Без этого гарда
	// плагин затирал счётчик демо-очереди нулём, и полоса связи писала
	// «Всё отправлено» поверх двух неотправленных мутаций.
	const demo = useRuntimeConfig().public.demo

	async function init() {
		online.value = navigator.onLine
		if (demo) return
		const { db } = await import("~/offline/db")
		syncPending.value = await db.pendingMutations.count()
		await refresh()
		if (navigator.onLine) {
			await flushQueue()
			await refresh()
		}
	}

	window.addEventListener("online", () => {
		online.value = true
		if (demo) return
		flushQueue().then(refresh)
	})
	// Раньше слушателя offline не было вовсе: полоса связи не могла узнать,
	// что сеть пропала, пока не случится следующий запрос.
	window.addEventListener("offline", () => {
		online.value = false
	})
	init()
})
