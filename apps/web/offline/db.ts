/** IndexedDB (Dexie) — локальное хранилище для offline-first (Sprint 3, §8 ТЗ: выбран Dexie). */
import Dexie, { type EntityTable } from "dexie"

export type CachedRead = {
	key: string
	payload: string
	updatedAt: number
}

export type PendingMutation = {
	id?: number
	path: string
	method: "POST" | "PATCH" | "DELETE"
	body: unknown
	createdAt: number
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
