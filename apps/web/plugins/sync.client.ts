/** При появлении сети — проиграть очередь офлайн-мутаций. */
export default defineNuxtPlugin(() => {
	const { flushQueue } = useApi()
	const { syncPending } = useSession()

	async function init() {
		const { db } = await import("~/offline/db")
		syncPending.value = await db.pendingMutations.count()
		if (navigator.onLine) await flushQueue()
	}

	window.addEventListener("online", () => {
		flushQueue()
	})
	init()
})
