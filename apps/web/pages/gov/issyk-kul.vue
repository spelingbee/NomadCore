<script setup lang="ts">
import { derive } from "~/composables/useNationalStats"
import {
  DRILLDOWN_REGION,
  GOV_EXPORTED_AT,
  GOV_PERIOD,
  GOV_REGIONS,
  ISSYK_KUL_DISTRICTS,
} from "~/fixtures/gov"

/**
 * Разрез по районам Иссык-Кульской области.
 *
 * Экран отвечает не на «какая загрузка», а на «ГДЕ ДЕЛАТЬ ПИЛОТ».
 * Поэтому первым столбцом идёт охват, а не продажи, и внизу стоит блок,
 * который выбирает район сам — по числу НЕподключённых объектов, а не
 * по красоте цифр. Аргумент «мы посчитали, а не выбрали» на этом экране
 * важнее любого оформления.
 *
 * Сверки идут ПРОТИВ ОБЩЕГО ЭКРАНА: суммы семи базовых столбцов
 * сравниваются со строкой «Иссык-Кульская область» из разреза по регионам,
 * а не с копией чисел. Если разрезы разъедутся — это будет видно здесь.
 */
definePageMeta({ layout: "desk" })

const { t } = useI18n()

const nf = new Intl.NumberFormat("ru-RU")
const n0 = (v: number) => nf.format(Math.round(v))
const n1 = (v: number) => v.toFixed(1).replace(".", ",")
const pct = (v: number) => `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(0)} %`

/** Строка области из общего экрана — эталон для сверки. */
const parent = computed(() => {
  const row = GOV_REGIONS.find((r) => r.name === DRILLDOWN_REGION)!
  return derive(row)
})

const rows = computed(() =>
  ISSYK_KUL_DISTRICTS.map((d) => ({
    ...derive(d),
    fund: d.fund,
    /** Подключено ÷ оценка фонда. */
    coverage: (d.objects / d.fund) * 100,
    /** Сколько объектов района ещё не в системе. Это и есть работа. */
    gap: d.fund - d.objects,
  })),
)

const sortKey = ref<"coverage" | "gap" | "objects" | "sold" | "occupancy">("gap")
const sortDir = ref(-1)
const sorted = computed(() =>
  [...rows.value].sort((a, b) => sortDir.value * (a[sortKey.value] - b[sortKey.value])),
)
function sortBy(k: typeof sortKey.value) {
  sortDir.value = sortKey.value === k ? -sortDir.value : -1
  sortKey.value = k
}

const totals = computed(() => {
  const sum = (f: (d: (typeof rows.value)[0]) => number) =>
    rows.value.reduce((a, d) => a + f(d), 0)
  const objects = sum((d) => d.objects)
  const fund = sum((d) => d.fund)
  const supply = sum((d) => d.supply)
  const sold = sum((d) => d.sold)
  return {
    objects,
    fund,
    gap: fund - objects,
    coverage: (objects / fund) * 100,
    rooms: sum((d) => d.rooms),
    supply,
    sold,
    soldPrevYear: sum((d) => d.soldPrevYear),
    checkins: sum((d) => d.checkins),
    revenue: sum((d) => d.revenue),
    occupancy: (sold / supply) * 100,
  }
})

/** Сверки против общего экрана, а не против копии чисел. */
const checks = computed(() => {
  const p = parent.value
  const t = totals.value
  const pair = (key: string, left: number, right: number) => ({
    key,
    left,
    right,
    ok: Math.round(left) === Math.round(right),
  })
  return [
    pair("gov.d.rec.objects", t.objects, p.objects),
    pair("gov.d.rec.rooms", t.rooms, p.rooms),
    pair("gov.d.rec.supply", t.supply, p.supply),
    pair("gov.d.rec.sold", t.sold, p.sold),
    pair("gov.d.rec.soldPrev", t.soldPrevYear, p.soldPrevYear),
    pair("gov.d.rec.checkins", t.checkins, p.checkins),
    pair("gov.d.rec.revenue", t.revenue, p.revenue),
  ]
})
const allOk = computed(() => checks.value.every((c) => c.ok))

/**
 * Кандидат на пилот выбирается ПО ЧИСЛУ неподключённых объектов, а не по
 * низшему проценту: 40 % охвата при фонде в 20 домов — это восемь домов
 * работы, а не пилот. Считается, а не назначается.
 */
const pilot = computed(() =>
  [...rows.value].sort((a, b) => b.gap - a.gap)[0]!,
)
</script>

<template>
  <article class="report">
    <header class="head">
      <div class="head__main">
        <p class="head__agency">{{ t('gov.agency') }}</p>
        <h1 class="head__title">{{ t('gov.d.title') }}</h1>
        <p class="head__back">
          <NuxtLink to="/gov/occupancy">{{ t('gov.d.back') }}</NuxtLink>
        </p>
      </div>
      <dl class="head__meta">
        <div><dt>{{ t('gov.period') }}</dt> <dd>{{ GOV_PERIOD }}</dd></div>
        <div><dt>{{ t('gov.exported') }}</dt> <dd>{{ GOV_EXPORTED_AT }}</dd></div>
        <div><dt>{{ t('gov.status') }}</dt> <dd>{{ t('gov.synthetic') }}</dd></div>
      </dl>
    </header>

    <p class="synthetic">
      <span class="synthetic__tag">{{ t('gov.synthetic') }}</span>
      <span>{{ t('gov.syntheticNote') }}</span>
    </p>

    <table class="tbl">
      <caption class="tbl__cap">{{ t('gov.d.tableTitle') }}</caption>
      <thead>
        <tr>
          <th scope="col" class="tbl__h tbl__h--text">{{ t('gov.d.col.district') }}</th>
          <th scope="col" class="tbl__h tbl__h--num tbl__h--sortable" @click="sortBy('objects')">{{ t('gov.d.col.connected') }}</th>
          <th scope="col" class="tbl__h tbl__h--num">{{ t('gov.d.col.fund') }}</th>
          <th scope="col" class="tbl__h tbl__h--num tbl__h--sortable" @click="sortBy('coverage')">{{ t('gov.d.col.coverage') }}</th>
          <th scope="col" class="tbl__h tbl__h--num tbl__h--sortable" @click="sortBy('gap')">{{ t('gov.d.col.gap') }}</th>
          <th scope="col" class="tbl__h tbl__h--num">{{ t('gov.col.rooms') }}</th>
          <th scope="col" class="tbl__h tbl__h--num">{{ t('gov.d.col.supply') }}</th>
          <th scope="col" class="tbl__h tbl__h--num tbl__h--sortable" @click="sortBy('sold')">{{ t('gov.col.sold') }}</th>
          <th scope="col" class="tbl__h tbl__h--num tbl__h--sortable" @click="sortBy('occupancy')">{{ t('gov.d.col.occupancy') }}</th>
          <th scope="col" class="tbl__h tbl__h--num">{{ t('gov.d.col.adr') }}</th>
          <th scope="col" class="tbl__h tbl__h--num">{{ t('gov.d.col.yoy') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="d in sorted" :key="d.name" :class="{ 'tbl__row--pilot': d.name === pilot.name }">
          <th scope="row" class="tbl__c tbl__c--text">{{ d.name }}</th>
          <td class="tbl__c tbl__c--num nc-tnum">{{ n0(d.objects) }}</td>
          <td class="tbl__c tbl__c--num nc-tnum">{{ n0(d.fund) }}</td>
          <td class="tbl__c tbl__c--num nc-tnum">{{ n1(d.coverage) }}</td>
          <td class="tbl__c tbl__c--num nc-tnum tbl__c--gap">{{ n0(d.gap) }}</td>
          <td class="tbl__c tbl__c--num nc-tnum">{{ n0(d.rooms) }}</td>
          <td class="tbl__c tbl__c--num nc-tnum">{{ n0(d.supply) }}</td>
          <td class="tbl__c tbl__c--num nc-tnum">{{ n0(d.sold) }}</td>
          <td class="tbl__c tbl__c--num nc-tnum">{{ n1(d.occupancy) }}</td>
          <td class="tbl__c tbl__c--num nc-tnum">{{ n0(d.adr) }}</td>
          <td class="tbl__c tbl__c--num nc-tnum">{{ pct(d.yoy) }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th scope="row" class="tbl__c tbl__c--text">{{ t('gov.d.totalRow') }}</th>
          <td class="tbl__c tbl__c--num nc-tnum">{{ n0(totals.objects) }}</td>
          <td class="tbl__c tbl__c--num nc-tnum">{{ n0(totals.fund) }}</td>
          <td class="tbl__c tbl__c--num nc-tnum">{{ n1(totals.coverage) }}</td>
          <td class="tbl__c tbl__c--num nc-tnum">{{ n0(totals.gap) }}</td>
          <td class="tbl__c tbl__c--num nc-tnum">{{ n0(totals.rooms) }}</td>
          <td class="tbl__c tbl__c--num nc-tnum">{{ n0(totals.supply) }}</td>
          <td class="tbl__c tbl__c--num nc-tnum">{{ n0(totals.sold) }}</td>
          <td class="tbl__c tbl__c--num nc-tnum">{{ n1(totals.occupancy) }}</td>
          <td class="tbl__c tbl__c--num nc-tnum">{{ n0((totals.revenue * 1000) / totals.sold) }}</td>
          <td class="tbl__c tbl__c--num nc-tnum">{{ pct((totals.sold / totals.soldPrevYear - 1) * 100) }}</td>
        </tr>
      </tfoot>
    </table>

    <!-- ── Кандидат на пилот: считается, а не назначается ────────────── -->
    <section class="pilot">
      <h2 class="checks__title">{{ t('gov.d.pilotTitle') }}</h2>
      <p class="pilot__name">{{ pilot.name }}</p>
      <p class="pilot__lead">
        {{ t('gov.d.pilotLead', {
          gap: n0(pilot.gap),
          fund: n0(pilot.fund),
          coverage: n1(pilot.coverage),
        }) }}
      </p>
      <p class="pilot__why">{{ t('gov.d.pilotWhy') }}</p>
      <p class="pilot__target nc-tnum">
        {{ t('gov.d.pilotTarget', {
          from: n1(pilot.coverage),
          to: n1(((pilot.objects + Math.round(pilot.gap / 2)) / pilot.fund) * 100),
          n: n0(Math.round(pilot.gap / 2)),
        }) }}
      </p>
    </section>

    <!-- ── Сверки против общего экрана ───────────────────────────────── -->
    <section class="checks" :class="{ 'checks--bad': !allOk }">
      <h2 class="checks__title">{{ t('gov.d.checksTitle') }}</h2>
      <p class="checks__lead">{{ t('gov.d.checksLead') }}</p>
      <ul class="checks__list">
        <li v-for="c in checks" :key="c.key" class="checks__item">
          <span class="checks__mark" aria-hidden="true">{{ c.ok ? '✓' : '✗' }}</span>
          <span class="checks__label">{{ t(c.key) }}</span>
          <span class="checks__nums nc-tnum">{{ n0(c.left) }} = {{ n0(c.right) }}</span>
        </li>
      </ul>
      <p class="checks__occ nc-tnum">
        {{ t('gov.d.coverageFormula', {
          connected: n0(totals.objects),
          fund: n0(totals.fund),
          pct: n1(totals.coverage),
        }) }}
      </p>
    </section>

    <!-- Нумерация сноток на этом экране СВОЯ и сквозная. Переиспользовать
         заголовки колонок с общего экрана нельзя: их надстрочные знаки
         привязаны к тамошнему порядку сносок и здесь сталкиваются. -->
    <ol class="notes">
      <li>{{ t('gov.d.note.fund') }}</li>
      <li>{{ t('gov.d.note.coverage') }}</li>
      <li>{{ t('gov.d.note.gap') }}</li>
      <li>{{ t('gov.d.note.supply') }}</li>
      <li>{{ t('gov.d.note.occupancy') }}</li>
      <li>{{ t('gov.d.note.adr') }}</li>
      <li>{{ t('gov.d.note.yoy') }}</li>
    </ol>
  </article>
</template>

<style scoped>
.report {
  max-width: 1440px;
  margin: 0 auto;
  background: var(--nc-bg-surface);
  border: var(--nc-stroke-hair) solid var(--nc-border-line);
}

.head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--nc-space-24);
  padding: var(--nc-space-16) var(--nc-space-24);
  border-bottom: var(--nc-stroke-control) solid var(--nc-border-strong);
}
.head__main { flex: 1; min-width: 0; }
.head__agency {
  margin: 0;
  font-size: var(--nc-fs-desk-100);
  line-height: var(--nc-lh-desk-100);
  font-weight: var(--nc-fw-bold);
  letter-spacing: var(--nc-tracking-caps);
  color: var(--nc-text-secondary);
}
.head__title {
  margin: var(--nc-space-8) 0 0;
  font-family: var(--nc-font-serif);
  font-size: var(--nc-fs-desk-600);
  line-height: var(--nc-lh-desk-600);
  font-weight: var(--nc-fw-bold);
}
.head__back {
  margin: var(--nc-space-4) 0 0;
  font-size: var(--nc-fs-desk-200);
  line-height: var(--nc-lh-desk-200);
}
.head__back a { color: var(--nc-text-secondary); }
.head__meta {
  flex: none;
  margin: 0;
  padding-left: var(--nc-space-16);
  border-left: var(--nc-stroke-hair) solid var(--nc-border-line);
  font-size: var(--nc-fs-desk-100);
  line-height: var(--nc-lh-desk-200);
  color: var(--nc-text-secondary);
}
.head__meta dt { display: inline; font-weight: var(--nc-fw-bold); color: var(--nc-text-primary); }
.head__meta dd { display: inline; margin: 0; }

.synthetic {
  display: flex;
  flex-wrap: wrap;
  gap: var(--nc-space-12);
  margin: 0;
  padding: var(--nc-space-12) var(--nc-space-24);
  background: var(--nc-signal-warning-bg);
  color: var(--nc-signal-warning-fg);
  border-bottom: var(--nc-stroke-hair) solid var(--nc-border-line);
  font-size: var(--nc-fs-desk-200);
  line-height: var(--nc-lh-desk-200);
}
.synthetic__tag {
  flex: none;
  font-weight: var(--nc-fw-bold);
  text-transform: uppercase;
  letter-spacing: var(--nc-tracking-caps);
}

/* Класс НЕ .grid: у Tailwind есть одноимённая утилита display:grid,
   и она перебивает табличную раскладку (см. gov/occupancy.vue). */
.tbl {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--nc-fs-desk-200);
  line-height: var(--nc-lh-desk-200);
}
.tbl__cap {
  padding: var(--nc-space-16) var(--nc-space-24) var(--nc-space-8);
  text-align: left;
  font-size: var(--nc-fs-desk-300);
  line-height: var(--nc-lh-desk-300);
  font-weight: var(--nc-fw-bold);
}
.tbl__h {
  padding: var(--nc-space-8);
  border-bottom: var(--nc-stroke-control) solid var(--nc-border-strong);
  font-size: var(--nc-fs-desk-100);
  line-height: var(--nc-lh-desk-100);
  font-weight: var(--nc-fw-bold);
  text-transform: uppercase;
  letter-spacing: var(--nc-tracking-caps);
  color: var(--nc-text-secondary);
  vertical-align: bottom;
}
.tbl__h--text { text-align: left; padding-left: var(--nc-space-24); }
.tbl__h--num { text-align: right; }
.tbl__h--sortable { cursor: pointer; }
.tbl__c {
  padding: var(--nc-space-8);
  border-bottom: var(--nc-stroke-hair) solid var(--nc-border-hair);
}
.tbl__c--text { text-align: left; padding-left: var(--nc-space-24); font-weight: var(--nc-fw-medium); }
.tbl__c--num { text-align: right; }
/* Разрыв — это объём работы, а не показатель качества: выделен, но не красным */
.tbl__c--gap { font-weight: var(--nc-fw-bold); }
.tbl tbody tr:nth-child(even) { background: var(--nc-bg-sunken); }
.tbl__row--pilot { box-shadow: inset var(--nc-stroke-accent) 0 0 0 var(--nc-status-hold); }
.tbl tfoot tr { background: var(--nc-bg-band); font-weight: var(--nc-fw-bold); }
.tbl tfoot .tbl__c { border-top: var(--nc-stroke-control) solid var(--nc-border-strong); }

.pilot,
.checks {
  margin: var(--nc-space-16) var(--nc-space-24);
  padding: var(--nc-space-16);
  background: var(--nc-bg-sunken);
  border-left: var(--nc-stroke-accent) solid var(--nc-status-inhouse);
}
.pilot { border-left-color: var(--nc-status-hold); }
.checks--bad { border-left-color: var(--nc-action-danger-fg); }
.checks__title {
  margin: 0;
  font-size: var(--nc-fs-desk-300);
  line-height: var(--nc-lh-desk-300);
  font-weight: var(--nc-fw-bold);
}
.pilot__name {
  margin: var(--nc-space-8) 0 0;
  font-family: var(--nc-font-serif);
  font-size: var(--nc-fs-desk-500);
  line-height: var(--nc-lh-desk-500);
  font-weight: var(--nc-fw-bold);
}
.pilot__lead,
.pilot__why,
.checks__lead {
  margin: var(--nc-space-4) 0 0;
  font-size: var(--nc-fs-desk-200);
  line-height: var(--nc-lh-desk-200);
  color: var(--nc-text-secondary);
}
.pilot__target {
  margin: var(--nc-space-12) 0 0;
  padding-top: var(--nc-space-8);
  border-top: var(--nc-stroke-hair) solid var(--nc-border-line);
  font-size: var(--nc-fs-desk-200);
  line-height: var(--nc-lh-desk-200);
  font-weight: var(--nc-fw-bold);
}
.checks__lead { margin-bottom: var(--nc-space-12); }
.checks__list { margin: 0; padding: 0; list-style: none; }
.checks__item {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--nc-space-8);
  padding: var(--nc-space-2) 0;
}
.checks__mark { flex: none; font-weight: var(--nc-fw-bold); color: var(--nc-status-inhouse); }
.checks--bad .checks__mark { color: var(--nc-action-danger-fg); }
.checks__label { flex: 1; min-width: 0; }
.checks__nums { flex: none; color: var(--nc-text-secondary); }
.checks__occ {
  margin: var(--nc-space-12) 0 0;
  padding-top: var(--nc-space-8);
  border-top: var(--nc-stroke-hair) solid var(--nc-border-line);
  font-weight: var(--nc-fw-bold);
}

.notes {
  margin: 0;
  padding: var(--nc-space-16) var(--nc-space-24) var(--nc-space-24) var(--nc-space-32);
  font-size: var(--nc-fs-desk-100);
  line-height: var(--nc-lh-desk-200);
  color: var(--nc-text-secondary);
}
</style>
