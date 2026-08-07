/* ─────────────────────────────────────────────────────────────────────────
 *  ДЕМО-ДАННЫЕ КАБИНЕТА ГОСАГЕНТСТВА. Синтетические, и это подписано
 *  на самом экране полосой под шапкой, а не сноской внизу.
 *
 *  Структура показателей и порядок величин соответствуют реальной
 *  отчётности; сами значения — нет.
 *
 *  ГЛАВНОЕ СВОЙСТВО НАБОРА: три разреза одной совокупности сходятся
 *  ПОСТРОЧНО. Регионы, категории классификации и сезонная кривая дают
 *  одни и те же итоги. Это не украшение: показатель, который нельзя
 *  пересчитать из соседних столбцов, обнуляет доверие к экрану целиком,
 *  а расхождение двух разрезов означает ошибку выгрузки.
 *
 *      объектов    1 284
 *      номеров     11 590
 *      предложение 1 803 380 номеро-суток
 *      продано     378 200 номеро-суток
 *      загрузка    378 200 ÷ 1 803 380 = 21,0 %
 *
 *  Проверки выписаны словами внизу экрана и считаются в рантайме,
 *  а не зашиты — см. useNationalStats().
 * ───────────────────────────────────────────────────────────────────────── */

/** Базовые величины региона. Всё, что не здесь, — производное. */
export interface RegionBase {
	name: string
	objects: number
	rooms: number
	/**
	 * Номеро-сутки, ФАКТИЧЕСКИ выставленные к продаже. Гостевые дома
	 * сезонны: объект вне сезона закрыт и в знаменатель не входит.
	 * Календарный период знаменателем НЕ является — иначе загрузка
	 * Иссык-Куля выглядела бы вдвое ниже реальной.
	 */
	supply: number
	sold: number
	soldPrevYear: number
	checkins: number
	/** Тыс. сом. */
	revenue: number
}

export const GOV_REGIONS: RegionBase[] = [
	{ name: "Иссык-Кульская область", objects: 612, rooms: 5940, supply: 724680, sold: 214300, soldPrevYear: 158900, checkins: 46800, revenue: 610755 },
	{ name: "Чуйская область", objects: 148, rooms: 1210, supply: 256520, sold: 38400, soldPrevYear: 31600, checkins: 11900, revenue: 84096 },
	{ name: "г. Бишкек", objects: 121, rooms: 1480, supply: 313760, sold: 44200, soldPrevYear: 38100, checkins: 15300, revenue: 137904 },
	{ name: "Нарынская область", objects: 96, rooms: 640, supply: 78080, sold: 15800, soldPrevYear: 10500, checkins: 5400, revenue: 28124 },
	{ name: "Ошская область", objects: 104, rooms: 720, supply: 131040, sold: 19600, soldPrevYear: 13800, checkins: 6300, revenue: 33124 },
	{ name: "г. Ош", objects: 63, rooms: 690, supply: 146280, sold: 21400, soldPrevYear: 17000, checkins: 7100, revenue: 47936 },
	{ name: "Джалал-Абадская область", objects: 78, rooms: 520, supply: 94640, sold: 14900, soldPrevYear: 11400, checkins: 4800, revenue: 23989 },
	{ name: "Таласская область", objects: 34, rooms: 210, supply: 25620, sold: 5200, soldPrevYear: 4300, checkins: 1900, revenue: 8008 },
	{ name: "Баткенская область", objects: 28, rooms: 180, supply: 32760, sold: 4400, soldPrevYear: 2500, checkins: 1630, revenue: 6512 },
]

/** Второй разрез той же совокупности — по категориям классификации. */
export interface CategoryBase {
	name: string
	objects: number
	rooms: number
	supply: number
	sold: number
}

export const GOV_CATEGORIES: CategoryBase[] = [
	{ name: "Гостиницы 3–5★", objects: 86, rooms: 3240, supply: 686880, sold: 118900 },
	{ name: "Гостиницы 1–2★ и без категории", objects: 178, rooms: 2130, supply: 361620, sold: 61400 },
	{ name: "Гостевые дома", objects: 742, rooms: 3980, supply: 466480, sold: 121300 },
	{ name: "Пансионаты и базы отдыха", objects: 194, rooms: 1810, supply: 235300, sold: 63200 },
	{ name: "Юртовые лагеря", objects: 84, rooms: 430, supply: 53100, sold: 13400 },
]

/** Третий разрез — помесячно. Сумма обязана равняться «Продано». */
export interface MonthBase {
	name: string
	sold: number
}

export const GOV_SEASON: MonthBase[] = [
	{ name: "Январь", sold: 14200 },
	{ name: "Февраль", sold: 15800 },
	{ name: "Март", sold: 19400 },
	{ name: "Апрель", sold: 26700 },
	{ name: "Май", sold: 44900 },
	{ name: "Июнь", sold: 108300 },
	{ name: "Июль", sold: 148900 },
]

/**
 * Охват. Показатели по стране ЗАНИЖЕНЫ на величину неохваченного фонда,
 * и это должно быть сказано на экране, а не подразумеваться: чиновник
 * понесёт цифру наверх, и она обязана быть с оговоркой.
 */
export const GOV_COVERAGE = [
	{ region: "Иссык-Кульская область", share: 61 },
	{ region: "г. Бишкек", share: 48 },
	{ region: "Баткенская область", share: 12 },
]

export const GOV_PERIOD = "январь — июль 2026"
export const GOV_EXPORTED_AT = "07.08.2026, 06:00 (UTC+6)"
