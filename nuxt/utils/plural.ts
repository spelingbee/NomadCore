/**
 * Русская плюрализация без библиотеки: три формы, шесть строк.
 * Кыргызский форм множественного числа для счётных конструкций не требует,
 * поэтому в kg-словаре стоит одна форма.
 */
export const plural = (n: number, one: string, few: string, many: string): string => {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod100 > 10 && mod100 < 20) return many
  if (mod10 === 1) return one
  if (mod10 > 1 && mod10 < 5) return few
  return many
}
