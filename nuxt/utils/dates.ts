/**
 * Даты броней — календарные, без времени: 'YYYY-MM-DD'.
 * Интервал полуоткрытый: [checkIn, checkOut). Ночь принадлежит дню заезда.
 * Поэтому выезд 12-го и заезд 12-го в тот же номер — НЕ пересечение.
 */
const DAY = 86400000

export const toUTC = (iso: string): number => {
  const [y, m, d] = iso.split('-').map(Number)
  return Date.UTC(y, m - 1, d)
}

export const addDays = (iso: string, n: number): string =>
  new Date(toUTC(iso) + n * DAY).toISOString().slice(0, 10)

export const nights = (from: string, to: string): number => Math.round((toUTC(to) - toUTC(from)) / DAY)

export const eachDay = (from: string, count: number): string[] =>
  Array.from({ length: count }, (_, i) => addDays(from, i))

/** Ночь day занята бронью b. */
export const coversNight = (b: { checkIn: string; checkOut: string }, day: string): boolean =>
  b.checkIn <= day && day < b.checkOut

/** Классическая проверка пересечения полуинтервалов. Стык даёт false. */
export const overlaps = (
  a: { checkIn: string; checkOut: string },
  b: { checkIn: string; checkOut: string }
): boolean => a.checkIn < b.checkOut && b.checkIn < a.checkOut

/** «Сегодня» в таймзоне ОБЪЕКТА, а не устройства: владелец может быть в роуминге. */
export const todayIn = (timezone: string): string =>
  new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' })
    .format(new Date())

const MONTHS = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']

export const shortDate = (iso: string): string => {
  const d = new Date(toUTC(iso))
  return d.getUTCDate() + ' ' + MONTHS[d.getUTCMonth()]
}

export const dateRange = (from: string, to: string): string => shortDate(from) + ' → ' + shortDate(to)
