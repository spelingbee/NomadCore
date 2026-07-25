/**
 * API-клиент с офлайн-очередью (Sprint 3).
 *
 * Чтения: NetworkFirst (через service worker) + локальный кэш Dexie.
 * Записи: при офлайне кладутся в очередь outbox (IndexedDB) и проигрываются
 * при появлении сети (last-write-wins + проверка version на сервере).
 */
import { db, type PendingMutation } from "~/offline/db"

export function useApi() {
	const config = useRuntimeConfig()
	const { token, syncPending } = useSession()

	async function request<T>(
		path: string,
		opts: {
			method?: "GET" | "POST" | "PATCH" | "DELETE"
			body?: unknown
			query?: Record<string, string | undefined>
		} = {},
	): Promise<T> {
		const method = opts.method ?? "GET"
		try {
			const result = await $fetch<T>(`${config.public.apiBase}${path}`, {
				method,
				body: opts.body as Record<string, unknown> | undefined,
				query: opts.query,
				headers: token.value
					? { Authorization: `Bearer ${token.value}` }
					: {},
			})
			if (method === "GET") {
				await db.cachedReads.put({
					key: cacheKey(path, opts.query),
					payload: JSON.stringify(result),
					updatedAt: Date.now(),
				})
			}
			return result
		} catch (error) {
			if (isOffline(error)) {
				if (method === "GET") {
					const cached = await db.cachedReads.get(cacheKey(path, opts.query))
					if (cached) return JSON.parse(cached.payload) as T
				} else {
					// Мутация без сети → в очередь на синхронизацию.
					await enqueueMutation({ path, method, body: opts.body })
					syncPending.value = await db.pendingMutations.count()
					return { queued: true } as T
				}
			}
			throw error
		}
	}

	async function flushQueue(): Promise<void> {
		const pending = await db.pendingMutations.orderBy("createdAt").toArray()
		for (const mutation of pending) {
			try {
				await $fetch(`${config.public.apiBase}${mutation.path}`, {
					method: mutation.method,
					body: mutation.body as Record<string, unknown> | undefined,
					headers: token.value
						? { Authorization: `Bearer ${token.value}` }
						: {},
				})
				await db.pendingMutations.delete(mutation.id!)
			} catch (error) {
				if (isOffline(error)) break // сеть снова пропала — повторим позже
				// Конфликт (409 OVERBOOKING и т.п.): отбрасываем мутацию,
				// помечаем для ручного разбора владельцем.
				await db.conflicts.add({
					mutation: JSON.stringify(mutation),
					reason: String((error as Error).message ?? error),
					createdAt: Date.now(),
				})
				await db.pendingMutations.delete(mutation.id!)
			}
		}
		syncPending.value = await db.pendingMutations.count()
	}

	async function enqueueMutation(
		mutation: Omit<PendingMutation, "id" | "createdAt">,
	) {
		await db.pendingMutations.add({ ...mutation, createdAt: Date.now() })
	}

	return { request, flushQueue }
}

function cacheKey(
	path: string,
	query?: Record<string, string | undefined>,
): string {
	return query ? `${path}?${new URLSearchParams(query as Record<string, string>)}` : path
}

function isOffline(error: unknown): boolean {
	if (typeof navigator !== "undefined" && navigator.onLine === false) return true
	const message = String((error as Error)?.message ?? "")
	return /fetch failed|NetworkError|Failed to fetch/i.test(message)
}
