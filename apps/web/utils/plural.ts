/**
 * Выбор формы множественного числа без библиотеки: три формы, шесть строк.
 * Сами строки живут в словарях i18n — здесь только выбор ключа.
 *
 * Кыргызский счётных форм не требует, поэтому в ky-словаре все три ключа
 * заполнены одинаково, и вызывающему коду не нужно знать язык.
 */
export type PluralForm = "one" | "few" | "many"

export function pluralForm(n: number): PluralForm {
	const mod10 = n % 10
	const mod100 = n % 100
	if (mod100 > 10 && mod100 < 20) return "many"
	if (mod10 === 1) return "one"
	if (mod10 > 1 && mod10 < 5) return "few"
	return "many"
}
