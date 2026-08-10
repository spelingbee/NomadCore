import Dexie, { type Table } from 'dexie'
import type { Booking, QueuedMutation } from '~/types'

/** Ответ GET, положенный в кэш целиком: экран рисуется из него без сети. */
export interface CachedResponse {
  key: string
  body: unknown
  fetchedAt: number
}

class NomadDB extends Dexie {
  bookings!: Table<Booking, string>
  cache!: Table<CachedResponse, string>
  queue!: Table<QueuedMutation, number>

  constructor() {
    super('nomadcore')
    this.version(1).stores({
      bookings: 'id, propertyId, roomId, checkIn, checkOut, status, sync',
      cache: 'key, fetchedAt',
      queue: '++id, bookingId, state, createdAt'
    })
  }
}

export const db = new NomadDB()

export const putCache = (key: string, body: unknown) => db.cache.put({ key, body, fetchedAt: Date.now() })
export const readCache = <T>(key: string) => db.cache.get(key).then(r => (r ? (r.body as T) : null))

/**
 * GET с кэшем: сначала отдаём кэш (мгновенно), потом, если сеть есть, обновляем.
 * Офлайн — это штатный режим, а не ошибка, поэтому отсутствие сети не бросает.
 */
export async function cachedGet<T>(key: string, url: string, onFresh?: (v: T) => void): Promise<T | null> {
  const cached = await readCache<T>(key)
  if (navigator.onLine) {
    $fetch<T>(url)
      .then(fresh => { putCache(key, fresh); onFresh?.(fresh) })
      .catch(() => { /* сеть пропала между проверкой и запросом — молча живём на кэше */ })
  }
  return cached
}
