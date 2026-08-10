import { chromium } from 'playwright'

/**
 * ПРОГОН СЦЕНАРИЯ ПОКАЗА ПЕРЕД ВСТРЕЧЕЙ.
 *
 * Каждый шаг docs/DEMO-SCRIPT.md — это утверждение о том, что будет на
 * экране: «счётчики 3 / 2 / 1», «нажмите плитку Ждут», «строка номера 3
 * читается как Ким Мария → Chen Wei». Здесь они проверяются по одному.
 *
 * Смысл прогона: сценарий с неверной инструкцией обходится дороже любого
 * бага в коде — ошибку в коде видно вам, ошибку в сценарии видно собеседнику.
 *
 * ЗАПУСК (playwright намеренно НЕ добавлен в зависимости проекта —
 * это разовый инструмент, а не часть сборки):
 *
 *   1) поднять приложение:      cd apps/web && node .output/server/index.mjs
 *   2) в другом окне:           npx --yes playwright@1.62 install chromium
 *   3)                          node --experimental-strip-types \
 *                                 --import playwright apps/web/test/demo-preflight.mjs
 *
 *   Проще: npm i -D playwright в любой временной папке и запустить оттуда
 *   с переменной BASE, если приложение поднято не на 3000:
 *      BASE=http://localhost:3010 node demo-preflight.mjs
 *
 * Выход 0 — все шаги сценария сходятся, можно идти.
 * Выход 1 — список несошедшихся шагов напечатан.
 */
const BASE = process.env.BASE ?? 'http://localhost:3000'
const browser = await chromium.launch()
const results = []

const check = (step, ok, detail = '') => {
  results.push({ step, ok, detail })
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${step}${detail ? '   — ' + detail : ''}`)
}

// ── Шаги 3.1–3.3: телефон ──────────────────────────────────────────────
const phone = await browser.newContext({ viewport: { width: 360, height: 780 } })
const p = await phone.newPage()

await p.goto(BASE + '/', { waitUntil: 'networkidle' })
const tiles = await p.locator('.tile__n').allTextContents()
check('3.1 счётчики «3 / 2 / 1» на «Сегодня»', tiles.join('/') === '3/2/1', 'фактически ' + tiles.join('/'))

const primary = (await p.locator('.foot button').first().textContent())?.replace(/\s+/g, ' ').trim() ?? ''
check('3.1 нижняя кнопка «Подтвердить · Петров Игорь»', primary.includes('Подтвердить') && primary.includes('Петров Игорь'), primary)

const before = await p.locator('.swipe').count()
await p.locator('.tile', { hasText: 'Ждут' }).click()
await p.waitForTimeout(300)
const after = await p.locator('.swipe').count()
check('3.1 плитка «Ждут» фильтрует список', after < before, `${before} → ${after} строк`)
await p.locator('.tile', { hasText: 'Ждут' }).click()
await p.waitForTimeout(300)
check('3.1 повторное нажатие снимает фильтр', (await p.locator('.swipe').count()) === before)

check('3.3 кнопка «КЫР» в шапке', await p.locator('header button', { hasText: 'КЫР' }).count() > 0)

await p.goto(BASE + '/occupancy', { waitUntil: 'networkidle' })
await p.evaluate(() => localStorage.setItem('nc.occupancyMode', 'day'))
await p.reload({ waitUntil: 'networkidle' })
await p.waitForTimeout(300)
const dayText = (await p.locator('.row').allTextContents()).join(' | ').replace(/\s+/g, ' ')
check('3.2 стык «Ким Мария → Chen Wei» в режиме «День»', /Ким Мария → Chen Wei/.test(dayText))
check('3.2 метка «Стык» в той же строке', /Ким Мария → Chen Wei[^|]*Стык/.test(dayText))
check('3.2 пояснение стыка стоит ОДИН раз сверху', (await p.locator('.turnnote').count()) === 1)

await p.evaluate(() => localStorage.setItem('nc.occupancyMode', 'grid'))
await p.reload({ waitUntil: 'networkidle' })
await p.waitForTimeout(300)
check('3.2 «Сетка» рисует полосы', (await p.locator('.bar').count()) > 0, (await p.locator('.bar').count()) + ' полос')

await p.goto(BASE + '/queue', { waitUntil: 'networkidle' })
const queueText = (await p.locator('main').textContent())?.replace(/\s+/g, ' ') ?? ''
check('3.3 «Очередь» показывает отказ сервера', /Отказ сервера/.test(queueText))
check('3.3 отказ объяснён словами, а не кодом', /Номер уже занят/.test(queueText), '')
await phone.close()

// ── Шаги 1–2, 4–5: кабинет ─────────────────────────────────────────────
const desk = await browser.newContext({ viewport: { width: 1440, height: 1200 } })
const d = await desk.newPage()

await d.goto(BASE + '/gov/occupancy', { waitUntil: 'networkidle' })
const govText = (await d.locator('article').textContent())?.replace(/\s+/g, ' ') ?? ''

check('1. ВДС 58 237,8 на экране', govText.includes('58 237,8'))
check('1. доля в ВВП 3,8', govText.includes('3,8'))
check('1. услуги гостиниц 73 275,2', govText.includes('73 275,2'))
check('1. источники подписаны у каждой цифры', (await d.locator('.fig__src').count()) === (await d.locator('.fig').count()))
check('1. пресса помечена отдельно от Нацстаткома', /публикации СМИ/.test(govText) && /Нацстатком/.test(govText))
check('1. график ВДС — пять столбцов', (await d.locator('.chart').first().locator('.chart__bar').count()) === 5)

check('2. перечень пробелов на месте', (await d.locator('.gap').count()) === 6)
check('2. сказано, что загрузку вычислить невозможно', /невозможно вычислить/.test(govText))

const synAfter = await d.evaluate(() => {
  const off = document.querySelector('.sec')
  const syn = document.querySelector('.synthetic')
  return !!(off.compareDocumentPosition(syn) & Node.DOCUMENT_POSITION_FOLLOWING)
})
check('КРИТИЧНО: полоса «синтетические» НИЖЕ официальной части', synAfter)

check('4. блок сверок с галочками', (await d.locator('.checks__item').count()) === 5)
const marks = await d.locator('.checks__mark').allTextContents()
check('4. все сверки проходят', marks.every((m) => m.trim() === '✓'), marks.join(''))
check('4. формула загрузки напечатана', /378 200 ÷ 1 803 380 = 21,0/.test(govText))
check('4. блок «Охват» на месте', /Охват/.test(govText) && govText.includes('61 %'))

const link = d.locator('.drill a')
check('5. ссылка «Разрез по районам» есть', (await link.count()) === 1)
await link.click()
await d.waitForURL('**/gov/issyk-kul')
await d.waitForTimeout(400)
const distText = (await d.locator('article').textContent())?.replace(/\s+/g, ' ') ?? ''
check('5. переход открыл экран районов', d.url().includes('/gov/issyk-kul'))
check('5. кандидат — Тонский район (Боконбаево)', /Тонский район \(Боконбаево\)/.test(distText))
check('5. названы 94 объекта из 168', /94 объектов из 168/.test(distText))
check('5. «Цель сезона: подключить 47»', /Цель сезона: подключить 47/.test(distText))
check('5. охват области 61,0 %', /612 ÷ 1 003 = 61,0/.test(distText))
await desk.close()

await browser.close()

const failed = results.filter((r) => !r.ok)
console.log('\n──────────────────────────────────────────')
console.log(failed.length ? `ШАГОВ НЕ ПРОШЛО: ${failed.length} из ${results.length}` : `ВСЕ ${results.length} ШАГОВ СЦЕНАРИЯ ПРОВЕРЕНЫ`)
failed.forEach((f) => console.log('  · ' + f.step))
process.exit(failed.length ? 1 : 0)
