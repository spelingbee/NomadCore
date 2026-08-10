/** IndexedDB (Dexie) — локальное хранилище для offline-first (Sprint 3, §8 ТЗ: выбран Dexie). */
import Dexie, { type EntityTable } from "dexie"

export type CachedRead = {
	key: string
	payload: string
	updatedAt: number
}

/**
 * Состояние мутации в очереди.
 *
 * pending  — ждёт сети, уйдёт сама;
 * conflict — сервер вернул 409 с телом: есть обе версии, решает владелец;
 * rejected — сервер отказал по существу (овербукинг, запрещённый переход),
 *            выбирать нечего, нужно другое действие.
 *
 * conflict и rejected сами НЕ отправляются никогда и блокируют только свою
 * бронь — изменения по другим броням продолжают уходить. Обоснование:
 * nuxt/API-CONFLICTS.md, раздел «Что происходит с очередью».
 */
export type MutationState = "pending" | "conflict" | "rejected"

/** Снимок сервера при 409. Форма — из nuxt/API-CONFLICTS.md. */
export type ServerSnapshot = {
	booking?: unknown
	changedBy?: string
	changedAt?: string
	changedFields?: string[]
	code?: string
	message?: string
}

export type PendingMutation = {
	id?: number
	path: string
	method: "POST" | "PATCH" | "DELETE"
	body: unknown
	createdAt: number
	/* ── добавлено в версии 2 ───────────────────────────────────────────
	   Все поля НЕОБЯЗАТЕЛЬНЫЕ: строки, записанные схемой v1, остаются
	   валидными, и код обязан читать отсутствие state как "pending". */
	/** Бронь, к которой относится мутация. Нужна, чтобы блокировать одну
	 *  бронь, а не всю очередь. */
	bookingId?: string
	state?: MutationState
	/** Версия, на которой мутация построена. Уйдёт в If-Match, когда API
	 *  научится его принимать. Сейчас сервер её не читает. */
	baseVersion?: number
	attempts?: number
	/** Код или текст отказа сервера — то, что показывается владельцу. */
	error?: string
	/** Снимок сервера при 409. Без него колонку «На сервере» нечем заполнить. */
	server?: ServerSnapshot
}

export type SyncConflict = {
	id?: number
	mutation: string
	reason: string
	createdAt: number
}

export const db = new Dexie("nomadcore") as Dexie & {
	cachedReads: EntityTable<CachedRead, "key">
	pendingMutations: EntityTable<PendingMutation, "id">
	conflicts: EntityTable<SyncConflict, "id">
}

db.version(1).stores({
	cachedReads: "key, updatedAt",
	pendingMutations: "++id, createdAt",
	conflicts: "++id, createdAt",
})

/**
 * Версия 2 — только НОВЫЕ индексы и новые необязательные поля.
 * Ни одна таблица не удалена, ни один индекс не изменён, данные из v1
 * переносятся как есть: апгрейд лишь проставляет умолчания там, где
 * старые строки их не имели.
 */
db.version(2)
	.stores({
		cachedReads: "key, updatedAt",
		pendingMutations: "++id, createdAt, state, bookingId",
		conflicts: "++id, createdAt",
	})
	.upgrade((tx) =>
		tx
			.table<PendingMutation>("pendingMutations")
			.toCollection()
			.modify((m) => {
				m.state ??= "pending"
				m.attempts ??= 0
			}),
	)

/** Путь мутации → id брони. Единственное место, где путь разбирается. */
export function bookingIdFromPath(path: string): string | undefined {
	return /^\/bookings\/([^/?]+)/.exec(path)?.[1]
}
