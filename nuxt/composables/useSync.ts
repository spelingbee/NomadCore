import { db } from '~/lib/db'
import type { Booking, MutationOp, QueuedMutation } from '~/types'

const online = ref(true)
const queue = ref<QueuedMutation[]>([])
const draining = ref(false)

/**
 * Очередь мутаций. Правила:
 * 1. Экран никогда не ждёт сеть — изменение применяется локально сразу.
 * 2. Порядок внутри одной брони строго сохраняется; сломанная мутация
 *    блокирует только свою бронь, остальные продолжают уходить.
 * 3. Конфликт (409) не решается автоматически. last-write допустим только
 *    там, где обе версии совместимы (документы, имя, заметки). Даты, статус
 *    и номер задают физическое размещение людей — там автоматика способна
 *    выселить живого гостя, поэтому выбор делает владелец.
 *
 * ВНИМАНИЕ: пункт 3 расходится с текущим контрактом бэкенда («last-write +
 * version») и требует его изменения — тело в ответе 409, журнал изменений с
 * автором, разделение 409/422. Пока API не отдаёт тело 409, экран конфликта
 * деградирует до «повторить или отменить». Подробности и обоснование:
 * nuxt/API-CONFLICTS.md
 */
export const useSync = () => {
  const refresh = async () => { queue.value = await db.queue.orderBy('createdAt').toArray() }

  const enqueue = async (booking: Booking, body: MutationOp, title: string, subtitle: string) => {
    await db.bookings.update(booking.id, { sync: 'pending' })
    await db.queue.add({
      bookingId: booking.id,
      baseVersion: booking.version,
      body,
      title,
      subtitle,
      createdAt: Date.now(),
      attempts: 0,
      state: 'pending'
    })
    await refresh()
    void drain()
  }

  const blocked = (m: QueuedMutation) =>
    queue.value.some(q => q.bookingId === m.bookingId && q.createdAt < m.createdAt && q.state !== 'pending')

  const drain = async () => {
    if (!online.value || draining.value) return
    draining.value = true
    try {
      for (const m of queue.value.filter(q => q.state === 'pending')) {
        if (blocked(m)) continue
        await send(m)
      }
    } finally {
      draining.value = false
    }
  }

  const send = async (m: QueuedMutation) => {
    await db.queue.update(m.id!, { state: 'sending', attempts: m.attempts + 1 })
    await refresh()
    try {
      const saved = await $fetch<Booking>('/api/bookings/' + m.bookingId, {
        method: 'PATCH',
        headers: { 'If-Match': String(m.baseVersion) },
        body: m.body
      })
      await db.bookings.put({ ...saved, sync: 'ok' })
      await db.queue.delete(m.id!)
    } catch (e: any) {
      if (e?.status === 409) {
        // Оптимистический лок проиграл: запоминаем оба варианта, решает владелец.
        await db.queue.update(m.id!, { state: 'conflict', server: e.data })
        await db.bookings.update(m.bookingId, { sync: 'conflict' })
      } else if (e?.status === 422 || e?.status === 423) {
        // Овербукинг: номер заняли с другого устройства, пока мы были офлайн.
        await db.queue.update(m.id!, { state: 'rejected', error: e.data?.message })
        await db.bookings.update(m.bookingId, { sync: 'rejected' })
      } else {
        // Сеть моргнула — оставляем в очереди, ретрай при следующем drain.
        await db.queue.update(m.id!, { state: 'pending' })
      }
    }
    await refresh()
  }

  /** Владелец выбрал своё значение: пересобираем мутацию на свежей версии. */
  const keepMine = async (m: QueuedMutation) => {
    await db.queue.update(m.id!, { state: 'pending', baseVersion: m.server!.booking.version, server: undefined })
    await refresh()
    void drain()
  }

  /** Владелец принял серверное: снимаем мутацию, кладём серверную бронь. */
  const takeServer = async (m: QueuedMutation) => {
    await db.bookings.put({ ...m.server!.booking, sync: 'ok' })
    await db.queue.delete(m.id!)
    await refresh()
  }

  const discard = async (m: QueuedMutation) => {
    await db.queue.delete(m.id!)
    await db.bookings.update(m.bookingId, { sync: 'ok' })
    await refresh()
  }

  onMounted(() => {
    online.value = navigator.onLine
    const up = () => { online.value = true; void drain() }
    const down = () => { online.value = false }
    window.addEventListener('online', up)
    window.addEventListener('offline', down)
    onUnmounted(() => {
      window.removeEventListener('online', up)
      window.removeEventListener('offline', down)
    })
    void refresh().then(drain)
  })

  return {
    online,
    queue,
    pending: computed(() => queue.value.length),
    broken: computed(() => queue.value.filter(q => q.state === 'conflict' || q.state === 'rejected').length),
    enqueue, drain, keepMine, takeServer, discard, refresh
  }
}
