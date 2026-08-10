/**
 * API-клиент с офлайн-очередью (Sprint 3).
 *
 * Чтения: NetworkFirst (через service worker) + локальный кэш Dexie.
 * Записи: при офлайне кладутся в очередь outbox (IndexedDB) и проигрываются
 * при появлении сети (last-write-wins + проверка version на сервере).
 */
import type { PendingMutation } from "~/offline/db"

/**
 * Dexie грузится ЛЕНИВО и один раз.
 *
 * Раньше `~/offline/db` импортировался статически, и Dexie (~29 КБ gzip)
 * попадал во входной чанк, то есть в первую загрузку владельца на дешёвом
 * Android — при том что до первого чтения кэша или первой мутации он не
 * нужен. Это же предписывает nuxt/README.md.
 *
 * Поведение не меняется: все обращения к базе и так живут внутри async-
 * функций, добавляется только ожидание уже начатого импорта. Модуль
 * запоминается в промисе, поэтому чанк запрашивается ровно один раз.
 *
 * Офлайн это не ломает: service worker прекэширует всю статику
 * (globPatterns в nuxt.config), и после первой успешной загрузки чанк
 * доступен без сети.
 */
let offlineModule: Promise<typeof import("~/offline/db")> | null = null
function offline(): Promise<typeof import("~/offline/db")> {
	offlineModule ??= import("~/offline/db")
	return offlineModule
}

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
				const { db } = await offline()
				await db.cachedReads.put({
					key: cacheKey(path, opts.query),
					payload: JSON.stringify(result),
					updatedAt: Date.now(),
				})
			}
			return result
		} catch (error) {
			if (isOffline(error)) {
				const { db } = await offline()
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
		const { db } = await offline()
		const pending = await db.pendingMutations.orderBy("createdAt").toArray()
		/* Брони с нерешённой мутацией. Блокируется только СВОЯ бронь —
		   иначе один спорный гость останавливает весь дом. */
		const blocked = new Set<string>()

		for (const mutation of pending) {
			// Решения владельца ждут молча: сами не отправляются никогда.
			if (mutation.state === "conflict" || mutation.state === "rejected") {
				if (mutation.bookingId) blocked.add(mutation.bookingId)
				continue
			}
			if (mutation.bookingId && blocked.has(mutation.bookingId)) continue

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

				/* Раскладка по РЕАЛЬНОМУ контракту, а не по ожидаемому.
				   Сегодня 409 у этого API означает бизнес-отказ
				   ({code:"OVERBOOKING"}, {code:"INVALID_TRANSITION"}),
				   а конфликт версий приходит пятисоткой и здесь неотличим.
				   Ветка с телом booking — задел: она оживёт без правок
				   клиента, когда API начнёт отдавать тело 409.
				   Обоснование и постановка: nuxt/API-CONFLICTS.md */
				const status = httpStatus(error)
				const data = httpData(error)

				if (status === 409 && data?.booking) {
					await db.pendingMutations.update(mutation.id!, {
						state: "conflict",
						server: data,
					})
					if (mutation.bookingId) blocked.add(mutation.bookingId)
					continue
				}
				if (status === 409 || status === 422 || status === 423) {
					await db.pendingMutations.update(mutation.id!, {
						state: "rejected",
						error: data?.code ?? data?.message ?? String(status),
					})
					if (mutation.bookingId) blocked.add(mutation.bookingId)
					continue
				}

				// Всё остальное — прежнее поведение, байт в байт:
				// отбрасываем мутацию, помечаем для ручного разбора владельцем.
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

	/** Владелец выбрал «Оставить моё»: отправляем заново на свежей версии. */
	async function retryMutation(id: number): Promise<void> {
		const { db } = await offline()
		const m = await db.pendingMutations.get(id)
		if (!m) return
		await db.pendingMutations.update(id, {
			state: "pending",
			error: undefined,
			server: undefined,
			baseVersion: versionOf(m.server) ?? m.baseVersion,
		})
		syncPending.value = await db.pendingMutations.count()
		await flushQueue()
	}

	/** Владелец выбрал «Отклонить»: мутация удаляется, пометка снимается. */
	async function discardMutation(id: number): Promise<void> {
		const { db } = await offline()
		await db.pendingMutations.delete(id)
		syncPending.value = await db.pendingMutations.count()
	}

	async function enqueueMutation(
		mutation: Omit<PendingMutation, "id" | "createdAt">,
	) {
		const { db, bookingIdFromPath } = await offline()
		await db.pendingMutations.add({
			...mutation,
			createdAt: Date.now(),
			// Добавлено в версии 2: без bookingId очередь не умеет блокировать
			// одну бронь и блокировала бы либо всё, либо ничего.
			bookingId: mutation.bookingId ?? bookingIdFromPath(mutation.path),
			state: "pending",
			attempts: 0,
		})
	}

	return { request, flushQueue, retryMutation, discardMutation }
}

/** ofetch кладёт код в status или statusCode — читаем оба. */
function httpStatus(error: unknown): number | undefined {
	const e = error as { status?: number; statusCode?: number } | null
	return e?.status ?? e?.statusCode
}

function httpData(
	error: unknown,
): { booking?: unknown; code?: string; message?: string } | undefined {
	return (error as { data?: { booking?: unknown; code?: string; message?: string } } | null)
		?.data
}

function versionOf(server: unknown): number | undefined {
	const v = (server as { booking?: { version?: number } } | undefined)?.booking
		?.version
	return typeof v === "number" ? v : undefined
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
