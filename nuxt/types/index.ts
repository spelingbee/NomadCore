export type BookingStatus = 'HOLD' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED'
export type SyncState = 'ok' | 'pending' | 'conflict' | 'rejected'
export type Lang = 'ru' | 'kg'

/** Разрешённые переходы. Отмена возможна из любого состояния, кроме терминальных. */
export const NEXT: Record<BookingStatus, BookingStatus | null> = {
  HOLD: 'CONFIRMED',
  CONFIRMED: 'CHECKED_IN',
  CHECKED_IN: 'CHECKED_OUT',
  CHECKED_OUT: null,
  CANCELLED: null
}

export const CANCELLABLE: BookingStatus[] = ['HOLD', 'CONFIRMED', 'CHECKED_IN']

export interface Property {
  id: string
  name: string
  settlement: string
  /** Все даты интерпретируются в этой зоне, а не в зоне устройства. */
  timezone: string
}

export interface RoomType {
  id: string
  propertyId: string
  name: Record<Lang, string>
  capacity: number
  baseRate: number
}

export interface Room {
  id: string
  propertyId: string
  roomTypeId: string
  /** То, что владелец пишет на ключе: «3», «Ю1». */
  label: string
}

export interface Guest {
  id: string
  fullName: string
  citizenship: string
  /** Документы могут появиться позже заселения — это штатная ситуация. */
  documentNo: string | null
}

export interface Booking {
  id: string
  code: string
  propertyId: string
  roomId: string | null
  /** Денормализовано из /availability: строка на ключе, её печатают в списках. */
  roomLabel?: string
  roomTypeId: string
  guest: Guest
  /** Полуинтервал [checkIn, checkOut): выезд и заезд в один день не конфликтуют. */
  checkIn: string
  checkOut: string
  pax: number
  rate: number
  status: BookingStatus
  source: 'app' | 'telegram'
  /** Оптимистический лок. Сервер отвечает 409, если version устарела. */
  version: number
  /** Локальное поле, на сервер не уходит. */
  sync: SyncState
}

export type MutationOp =
  | { op: 'create'; booking: Booking }
  | { op: 'status'; status: BookingStatus }
  | { op: 'dates'; checkOut: string }
  | { op: 'room'; roomId: string }
  | { op: 'documents'; documentNo: string }

export interface QueuedMutation {
  id?: number
  bookingId: string
  /** Версия, на которой мутация была построена. Уходит в If-Match. */
  baseVersion: number
  body: MutationOp
  title: string
  subtitle: string
  createdAt: number
  attempts: number
  state: 'pending' | 'sending' | 'conflict' | 'rejected'
  error?: string
  /** Снимок сервера при 409 — показываем владельцу оба варианта. */
  server?: { booking: Booking; changedBy: string; changedAt: string }
}
