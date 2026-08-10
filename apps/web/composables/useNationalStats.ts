import type { CategoryBase, MonthBase, RegionBase } from "~/fixtures/gov"

/**
 * Агрегаты для кабинета госагентства.
 *
 * ГЛАВНОЕ ПРАВИЛО: ни один показатель не хранится готовым, если его можно
 * получить из соседних столбцов. Загрузка, ADR, средняя продолжительность
 * и динамика — вычисляемые. Причина не в чистоте кода: показатель, который
 * нельзя пересчитать калькулятором прямо на экране, обнуляет доверие ко
 * всей остальной таблице. А на государственном экране доверие к цифре —
 * это и есть продукт.
 */

export interface RegionRow extends RegionBase {
	/** Продано ÷ предложение. */
	occupancy: number
	/** Выручка ÷ продано, сом за номеро-сутки. */
	adr: number
	/** Продано ÷ заездов. */
	avgStay: number
	/** Продано 2026 ÷ продано 2025 − 1. */
	yoy: number
	/** Предложение ÷ номера. Справочная величина. */
	avgDaysOpen: number
}

/**
 * Средняя фактическая заполняемость номера. Прямого учёта спящих нет,
 * поэтому койко-сутки — ОЦЕНКА, и она вынесена отдельно от загрузки,
 * чтобы её нельзя было принять за измеренную величину.
 */
export const PAX_PER_ROOM = 2.3

export function derive(r: RegionBase): RegionRow {
	return {
		...r,
		occupancy: (r.sold / r.supply) * 100,
		adr: (r.revenue * 1000) / r.sold,
		avgStay: r.sold / r.checkins,
		yoy: (r.sold / r.soldPrevYear - 1) * 100,
		avgDaysOpen: r.supply / r.rooms,
	}
}

export interface Reconciliation {
	/** Ключ словаря: что именно сверяется. Текст живёт в i18n, не здесь. */
	key: string
	/** Левая и правая части, как они посчитаны. */
	left: number
	right: number
	ok: boolean
}

export function useNationalStats(
	regions: RegionBase[],
	categories: CategoryBase[],
	season: MonthBase[],
) {
	const rows = computed(() => regions.map(derive))

	const totals = computed(() => {
		const sum = (f: (r: RegionBase) => number) =>
			regions.reduce((a, r) => a + f(r), 0)
		const base: RegionBase = {
			name: "Итого по республике",
			objects: sum((r) => r.objects),
			rooms: sum((r) => r.rooms),
			supply: sum((r) => r.supply),
			sold: sum((r) => r.sold),
			soldPrevYear: sum((r) => r.soldPrevYear),
			checkins: sum((r) => r.checkins),
			revenue: sum((r) => r.revenue),
		}
		return { ...derive(base), bedNights: base.sold * PAX_PER_ROOM }
	})

	const categoryTotals = computed(() => {
		const sum = (f: (c: CategoryBase) => number) =>
			categories.reduce((a, c) => a + f(c), 0)
		return {
			objects: sum((c) => c.objects),
			rooms: sum((c) => c.rooms),
			supply: sum((c) => c.supply),
			sold: sum((c) => c.sold),
		}
	})

	const seasonTotal = computed(() => season.reduce((a, m) => a + m.sold, 0))

	/**
	 * Сверки. Считаются В РАНТАЙМЕ из тех же чисел, что нарисованы выше,
	 * и выводятся на экран словами. Смысл: любой, кто смотрит, может
	 * проверить их калькулятором, а расхождение двух разрезов означает
	 * ошибку выгрузки и видно сразу, а не через квартал.
	 */
	const reconciliations = computed<Reconciliation[]>(() => {
		const t = totals.value
		const c = categoryTotals.value
		return [
			{ key: "gov.rec.objects", left: t.objects, right: c.objects, ok: t.objects === c.objects },
			{ key: "gov.rec.rooms", left: t.rooms, right: c.rooms, ok: t.rooms === c.rooms },
			{ key: "gov.rec.supply", left: t.supply, right: c.supply, ok: t.supply === c.supply },
			{ key: "gov.rec.sold", left: t.sold, right: c.sold, ok: t.sold === c.sold },
			{ key: "gov.rec.season", left: seasonTotal.value, right: t.sold, ok: seasonTotal.value === t.sold },
		]
	})

	const allReconcile = computed(() => reconciliations.value.every((r) => r.ok))

	return {
		rows,
		totals,
		categoryTotals,
		seasonTotal,
		reconciliations,
		allReconcile,
	}
}
