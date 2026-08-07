import { dayNumber, dayOfWeek, monthIndex, nights, toDay } from "~/utils/dates"
import { pluralForm } from "~/utils/plural"

/**
 * Печать дат словами. Все строки — из словаря i18n, ни одного названия месяца
 * в коде: кыргызские месяцы и дни недели пишутся иначе, а не транслитерацией.
 *
 * Intl.DateTimeFormat здесь НЕ используется: у него нет кыргызской локали
 * в старых Android WebView, и он молча отдаёт английские названия.
 */
export function useDateText() {
	const { t, tm, rt } = useI18n()

	function fromList(key: string, index: number): string {
		const list = tm(key) as unknown[]
		const item = list?.[index]
		return item ? rt(item as never) : ""
	}

	/** «7 авг» */
	function shortDate(value: string): string {
		const day = toDay(value)
		return `${dayNumber(day)} ${fromList("common.monthsShort", monthIndex(day))}`
	}

	/** «7 авг → 9 авг». Стрелка читается как полуинтервал: выехал — освободил. */
	function dateRange(from: string, to: string): string {
		return `${shortDate(from)} → ${shortDate(to)}`
	}

	/** «Пятница, 7 августа» */
	function longDay(value: string): string {
		const day = toDay(value)
		const weekday = fromList("common.weekdays", dayOfWeek(day))
		const month = fromList("common.monthsGenitive", monthIndex(day))
		return `${weekday}, ${dayNumber(day)} ${month}`
	}

	/** «Пт» */
	function shortWeekday(value: string): string {
		return fromList("common.weekdaysShort", dayOfWeek(toDay(value)))
	}

	/** «2 ночи» — форма выбирается по числу, строки лежат в словаре. */
	function nightsText(from: string, to: string): string {
		const n = nights(toDay(from), toDay(to))
		return `${n} ${t(`common.nights.${pluralForm(n)}`)}`
	}

	/** «3 свободно» — та же механика для номеров. */
	function freeText(n: number): string {
		return `${n} ${t(`common.free.${pluralForm(n)}`)}`
	}

	return { shortDate, dateRange, longDay, shortWeekday, nightsText, freeText }
}
