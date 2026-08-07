import { cachedGet } from '~/lib/db'
import { addDays, coversNight, eachDay, nights, overlaps } from '~/utils/dates'
import type { Booking, Room } from '~/types'

const CELL = 44

export interface Bar {
  booking: Booking
  /** Слева/справа в пикселях. Полоса идёт от СЕРЕДИНЫ дня заезда до СЕРЕДИНЫ дня
   *  выезда, поэтому «встык» даёт касание, а не наложение: [checkIn, checkOut). */
  left: number
  width: number
}

export interface NightRow {
  date: string
  weekend: boolean
  /** Номера, свободные именно в эту НОЧЬ. */
  free: Room[]
  full: boolean
  occupancy: { room: Room; booking: Booking | null; leaving: Booking | null }[]
}

/**
 * Сетка «номер × дни» из API плюс локальные, ещё не отправленные брони.
 * Один источник данных на три режима: День, Ночи, Сетка.
 */
export const useAvailability = (propertyId: string, from: Ref<string>, days = 14) => {
  const rooms = ref<Room[]>([])
  const bookings = ref<Booking[]>([])

  const load = async () => {
    const key = `availability:${propertyId}:${from.value}:${days}`
    const url = `/api/properties/${propertyId}/availability?from=${from.value}&days=${days}`
    const data = await cachedGet<{ rooms: Room[]; bookings: Booking[] }>(key, url, fresh => {
      rooms.value = fresh.rooms
      bookings.value = fresh.bookings
    })
    if (data) { rooms.value = data.rooms; bookings.value = data.bookings }
  }
  watch(from, load, { immediate: true })

  const active = computed(() => bookings.value.filter(b => b.status !== 'CANCELLED'))
  const columns = computed(() => eachDay(from.value, days))
  const windowEnd = computed(() => addDays(from.value, days))

  /** Бронь, занимающая эту НОЧЬ. Выезд в этот день ночь не занимает. */
  const occupiedOn = (room: Room, day: string) =>
    active.value.find(b => b.roomId === room.id && coversNight(b, day)) ?? null

  /** Бронь, которая ИМЕННО СЕГОДНЯ выезжает из номера. */
  const leavingOn = (room: Room, day: string) =>
    active.value.find(b => b.roomId === room.id && b.checkOut === day) ?? null

  /** День, когда один гость выезжает, а другой заезжает в тот же номер. */
  const isTurnDay = (room: Room, day: string) =>
    !!leavingOn(room, day) && !!active.value.find(b => b.roomId === room.id && b.checkIn === day)

  const freeRooms = (checkIn: string, checkOut: string) =>
    rooms.value.filter(r => !active.value.some(
      b => b.roomId === r.id && overlaps(b, { checkIn, checkOut })
    ))

  /**
   * Режим «Ночи» — выбранный по итогам сравнения на 360px.
   * Строка = одна ночь, поэтому полуинтервал невозможно прочитать неправильно:
   * у ночи ровно один постоялец, «наложения» не существует по построению.
   */
  const nightRows = computed<NightRow[]>(() =>
    columns.value.map(date => {
      const free = freeRooms(date, addDays(date, 1))
      return {
        date,
        weekend: [0, 6].includes(new Date(date + 'T00:00:00Z').getUTCDay()),
        free,
        full: free.length === 0,
        occupancy: rooms.value.map(room => ({
          room,
          booking: occupiedOn(room, date),
          leaving: leavingOn(room, date)
        }))
      }
    })
  )

  /** Режим «Сетка» — третий, для перемещений между номерами. */
  const barsFor = (room: Room): Bar[] =>
    active.value
      .filter(b => b.roomId === room.id && overlaps(b, { checkIn: from.value, checkOut: windowEnd.value }))
      .map(b => {
        const left = Math.max(0, (nights(from.value, b.checkIn) + 0.5) * CELL)
        const right = Math.min((days - 0.5) * CELL, (nights(from.value, b.checkOut) + 0.5) * CELL)
        return { booking: b, left: left + 2, width: Math.max(20, right - left - 4) }
      })

  return {
    rooms, bookings: active, columns, nightRows,
    occupiedOn, leavingOn, isTurnDay, freeRooms, barsFor,
    cell: CELL, reload: load
  }
}
