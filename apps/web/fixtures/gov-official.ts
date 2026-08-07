/* ─────────────────────────────────────────────────────────────────────────
 *  ОФИЦИАЛЬНАЯ СТАТИСТИКА. Это НЕ демо-данные.
 *
 *  Файл лежит отдельно от fixtures/gov.ts намеренно: там синтетика
 *  пилотного контура, здесь — настоящие опубликованные числа. Смешивать
 *  их в одном модуле нельзя, иначе через месяц никто не вспомнит, где что.
 *
 *  У каждой величины проставлен год и источник, и они выводятся на экран
 *  рядом с числом. Человек, которому это показывают, знает эти цифры
 *  лучше нас — подпись под каждой обязательна.
 *
 *  Проверено 08.08.2026 по открытым данным Нацстаткома КР.
 * ───────────────────────────────────────────────────────────────────────── */

export type SourceKind = "nsc" | "press"

export interface OfficialFigure {
	/** Ключ i18n с названием показателя. */
	key: string
	value: string
	unitKey: string
	year: number
	source: SourceKind
}

/**
 * Ключевые официальные показатели.
 * nsc   — Нацстатком КР, раздел «Открытые данные» (машиночитаемые ряды).
 * press — публикации СМИ со ссылкой на ведомства; первоисточник не сверялся.
 */
export const OFFICIAL_FIGURES: OfficialFigure[] = [
	{ key: "gov.off.gva", value: "58 237,8", unitKey: "gov.off.unit.mln", year: 2024, source: "nsc" },
	{ key: "gov.off.gdpShare", value: "3,8", unitKey: "gov.off.unit.pct", year: 2024, source: "nsc" },
	{ key: "gov.off.investment", value: "23 313,0", unitKey: "gov.off.unit.mln", year: 2024, source: "nsc" },
	{ key: "gov.off.visitors", value: "3 658,5", unitKey: "gov.off.unit.thousand", year: 2024, source: "nsc" },
	{ key: "gov.off.horeca", value: "73 275,2", unitKey: "gov.off.unit.mln", year: 2025, source: "nsc" },
	{ key: "gov.off.lodging", value: "11 087,9", unitKey: "gov.off.unit.mln", year: 2025, source: "nsc" },
	{ key: "gov.off.sanatoria", value: "186", unitKey: "gov.off.unit.units", year: 2024, source: "nsc" },
	{ key: "gov.off.hotels", value: "388 / 98 / 17", unitKey: "gov.off.unit.units", year: 2025, source: "press" },
	{ key: "gov.off.ikObjects", value: "1 833", unitKey: "gov.off.unit.units", year: 2025, source: "press" },
	{ key: "gov.off.ikGuests", value: "2,63", unitKey: "gov.off.unit.mlnPeople", year: 2025, source: "press" },
]

/**
 * Валовая добавленная стоимость туризма — единственный ряд, который есть
 * целиком за пять лет. Показывает рост в 3,1 раза и потому стоит графиком,
 * а не строкой. Нацстатком, открытые данные, млн сом.
 */
export const GVA_SERIES = [
	{ name: "2020", value: 18506 },
	{ name: "2021", value: 24971 },
	{ name: "2022", value: 35158 },
	{ name: "2023", value: 47855 },
	{ name: "2024", value: 58238 },
]

/**
 * Чего в официальной статистике НЕТ. Проверено по всем разделам открытых
 * данных 08.08.2026.
 *
 * Это не упрёк ведомству, а описание механики: государство считает поток
 * и деньги — сколько приехало и сколько потратили. Предложение оно не
 * считает, потому что собрать его можно только снизу, с каждого объекта.
 * Отсюда следует, что загрузку в стране сегодня не может вычислить никто:
 * нет величины в знаменателе.
 */
export const MISSING_METRICS = [
	{ key: "gov.gap.rooms", whyKey: "gov.gap.roomsWhy" },
	{ key: "gov.gap.supply", whyKey: "gov.gap.supplyWhy" },
	{ key: "gov.gap.sold", whyKey: "gov.gap.soldWhy" },
	{ key: "gov.gap.occupancy", whyKey: "gov.gap.occupancyWhy" },
	{ key: "gov.gap.adr", whyKey: "gov.gap.adrWhy" },
	{ key: "gov.gap.district", whyKey: "gov.gap.districtWhy" },
]

export const OFFICIAL_CHECKED_AT = "08.08.2026"
