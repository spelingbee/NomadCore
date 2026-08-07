<script setup lang="ts">
import type { RegionRow } from "~/composables/useNationalStats"
import {
  DRILLDOWN_REGION,
  GOV_CATEGORIES,
  GOV_COVERAGE,
  GOV_EXPORTED_AT,
  GOV_PERIOD,
  GOV_REGIONS,
  GOV_SEASON,
} from "~/fixtures/gov"

/**
 * Кабинет госагентства. Ноутбук или проектор, НЕ телефон.
 *
 * Шкала desk (от 12px), высокая плотность, таблицы и сноски. Мобильных
 * карточек тут нет намеренно: это инструмент принятия решений, а не лента.
 *
 * Экран построен вокруг одного обещания: КАЖДОЕ число можно пересчитать
 * калькулятором из соседних столбцов, а два разреза одной совокупности
 * обязаны сойтись. Поэтому внизу стоит блок сверок, который считается
 * в рантайме из тех же величин, что нарисованы выше. Если выгрузка
 * когда-нибудь разъедется — это будет видно на экране сразу, а не через
 * квартал в чужом отчёте.
 */
definePageMeta({ layout: "desk" })

const { t } = useI18n()
const { rows, totals, categoryTotals, seasonTotal, reconciliations, allReconcile } =
  useNationalStats(GOV_REGIONS, GOV_CATEGORIES, GOV_SEASON)

const nf = new Intl.NumberFormat("ru-RU")
const n0 = (v: number) => nf.format(Math.round(v))
const n1 = (v: number) => v.toFixed(1).replace(".", ",")
const pct = (v: number) => `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(0)} %`

const COLS = [
  { k: "objects", label: "gov.col.objects", fmt: n0 },
  { k: "rooms", label: "gov.col.rooms", fmt: n0 },
  { k: "avgDaysOpen", label: "gov.col.daysOpen", fmt: n0 },
  { k: "supply", label: "gov.col.supply", fmt: n0 },
  { k: "sold", label: "gov.col.sold", fmt: n0 },
  { k: "soldPrevYear", label: "gov.col.soldPrev", fmt: n0 },
  { k: "occupancy", label: "gov.col.occupancy", fmt: n1 },
  { k: "checkins", label: "gov.col.checkins", fmt: n0 },
  { k: "avgStay", label: "gov.col.avgStay", fmt: n1 },
  { k: "adr", label: "gov.col.adr", fmt: n0 },
  { k: "yoy", label: "gov.col.yoy", fmt: pct },
] as const

type ColKey = (typeof COLS)[number]["k"]

const sortKey = ref<ColKey>("sold")
const sortDir = ref(-1)

const sorted = computed<RegionRow[]>(() =>
  [...rows.value].sort(
    (a, b) => sortDir.value * (Number(a[sortKey.value]) - Number(b[sortKey.value])),
  ),
)

function sortBy(k: ColKey) {
  sortDir.value = sortKey.value === k ? -sortDir.value : -1
  sortKey.value = k
}

/** Доля категории в проданных номеро-сутках — тоже производная. */
const categoryRows = computed(() =>
  GOV_CATEGORIES.map((c) => ({
    ...c,
    occupancy: (c.sold / c.supply) * 100,
    share: (c.sold / categoryTotals.value.sold) * 100,
  })),
)
</script>

<template>
  <article class="report">
    <header class="head">
      <div class="head__main">
        <p class="head__agency">{{ t('gov.agency') }}</p>
        <h1 class="head__title">{{ t('gov.title') }}</h1>
      </div>
      <dl class="head__meta">
        <div><dt>{{ t('gov.period') }}</dt> <dd>{{ GOV_PERIOD }}</dd></div>
        <div><dt>{{ t('gov.exported') }}</dt> <dd>{{ GOV_EXPORTED_AT }}</dd></div>
        <div><dt>{{ t('gov.status') }}</dt> <dd>{{ t('gov.synthetic') }}</dd></div>
      </dl>
    </header>

    <!-- Честная подпись на самом экране, а не в примечании внизу -->
    <p class="synthetic">
      <span class="synthetic__tag">{{ t('gov.synthetic') }}</span>
      <span>{{ t('gov.syntheticNote') }}</span>
    </p>

    <!-- ── Разрез 1: по регионам ─────────────────────────────────────── -->
    <table class="tbl">
      <caption class="tbl__cap">{{ t('gov.byRegion') }}</caption>
      <thead>
        <tr>
          <th scope="col" class="tbl__h tbl__h--text">{{ t('gov.col.region') }}</th>
          <th
            v-for="c in COLS"
            :key="c.k"
            scope="col"
            class="tbl__h tbl__h--num tbl__h--sortable"
            :aria-sort="sortKey === c.k ? (sortDir < 0 ? 'descending' : 'ascending') : 'none'"
            @click="sortBy(c.k)"
          >
            {{ t(c.label) }}<span v-if="sortKey === c.k" aria-hidden="true">{{ sortDir < 0 ? ' ▼' : ' ▲' }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in sorted" :key="r.name">
          <th scope="row" class="tbl__c tbl__c--text">{{ r.name }}</th>
          <td v-for="c in COLS" :key="c.k" class="tbl__c tbl__c--num nc-tnum">
            {{ c.fmt(r[c.k]) }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th scope="row" class="tbl__c tbl__c--text">{{ totals.name }}</th>
          <td v-for="c in COLS" :key="c.k" class="tbl__c tbl__c--num nc-tnum">
            {{ c.fmt(totals[c.k]) }}
          </td>
        </tr>
      </tfoot>
    </table>

    <p class="beds nc-tnum">
      {{ t('gov.bedNights', { n: n0(totals.bedNights) }) }}
    </p>

    <p class="drill">
      <NuxtLink to="/gov/issyk-kul">{{ t('gov.drilldown', { region: DRILLDOWN_REGION }) }}</NuxtLink>
    </p>

    <!-- ── Разрез 2: по категориям классификации ─────────────────────── -->
    <table class="tbl">
      <caption class="tbl__cap">{{ t('gov.byCategory') }}</caption>
      <thead>
        <tr>
          <th scope="col" class="tbl__h tbl__h--text">{{ t('gov.col.category') }}</th>
          <th scope="col" class="tbl__h tbl__h--num">{{ t('gov.col.objects') }}</th>
          <th scope="col" class="tbl__h tbl__h--num">{{ t('gov.col.rooms') }}</th>
          <th scope="col" class="tbl__h tbl__h--num">{{ t('gov.col.supply') }}</th>
          <th scope="col" class="tbl__h tbl__h--num">{{ t('gov.col.sold') }}</th>
          <th scope="col" class="tbl__h tbl__h--num">{{ t('gov.col.occupancy') }}</th>
          <th scope="col" class="tbl__h tbl__h--num">{{ t('gov.col.share') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in categoryRows" :key="c.name">
          <th scope="row" class="tbl__c tbl__c--text">{{ c.name }}</th>
          <td class="tbl__c tbl__c--num nc-tnum">{{ n0(c.objects) }}</td>
          <td class="tbl__c tbl__c--num nc-tnum">{{ n0(c.rooms) }}</td>
          <td class="tbl__c tbl__c--num nc-tnum">{{ n0(c.supply) }}</td>
          <td class="tbl__c tbl__c--num nc-tnum">{{ n0(c.sold) }}</td>
          <td class="tbl__c tbl__c--num nc-tnum">{{ n1(c.occupancy) }}</td>
          <td class="tbl__c tbl__c--num nc-tnum">{{ n1(c.share) }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th scope="row" class="tbl__c tbl__c--text">{{ t('gov.totalRow') }}</th>
          <td class="tbl__c tbl__c--num nc-tnum">{{ n0(categoryTotals.objects) }}</td>
          <td class="tbl__c tbl__c--num nc-tnum">{{ n0(categoryTotals.rooms) }}</td>
          <td class="tbl__c tbl__c--num nc-tnum">{{ n0(categoryTotals.supply) }}</td>
          <td class="tbl__c tbl__c--num nc-tnum">{{ n0(categoryTotals.sold) }}</td>
          <td class="tbl__c tbl__c--num nc-tnum">{{ n1((categoryTotals.sold / categoryTotals.supply) * 100) }}</td>
          <td class="tbl__c tbl__c--num nc-tnum">100,0</td>
        </tr>
      </tfoot>
    </table>

    <!-- ── Разрез 3: сезонность ──────────────────────────────────────── -->
    <div class="panel">
      <SeasonCurve :months="GOV_SEASON" :table-total="totals.sold" />
    </div>

    <!-- ── Сверки: считаются в рантайме и выписаны словами ───────────── -->
    <section class="checks" :class="{ 'checks--bad': !allReconcile }">
      <h2 class="checks__title">{{ t('gov.checksTitle') }}</h2>
      <p class="checks__lead">{{ t('gov.checksLead') }}</p>
      <ul class="checks__list">
        <li v-for="r in reconciliations" :key="r.key" class="checks__item">
          <span class="checks__mark" aria-hidden="true">{{ r.ok ? '✓' : '✗' }}</span>
          <span class="checks__label">{{ t(r.key) }}</span>
          <span class="checks__nums nc-tnum">{{ n0(r.left) }} = {{ n0(r.right) }}</span>
        </li>
      </ul>
      <p class="checks__occ nc-tnum">
        {{ t('gov.occupancyFormula', {
          sold: n0(totals.sold),
          supply: n0(totals.supply),
          pct: n1(totals.occupancy),
        }) }}
      </p>
    </section>

    <!-- ── Охват: цифра идёт наверх и обязана быть с оговоркой ───────── -->
    <section class="coverage">
      <h2 class="checks__title">{{ t('gov.coverageTitle') }}</h2>
      <p class="coverage__lead">{{ t('gov.coverageLead') }}</p>
      <ul class="coverage__list nc-tnum">
        <li v-for="c in GOV_COVERAGE" :key="c.region">{{ c.region }} — {{ c.share }} %</li>
      </ul>
    </section>

    <ol class="notes">
      <li>{{ t('gov.note.daysOpen') }}</li>
      <li>{{ t('gov.note.supply') }}</li>
      <li>{{ t('gov.note.occupancy') }}</li>
      <li>{{ t('gov.note.avgStay') }}</li>
      <li>{{ t('gov.note.adr') }}</li>
      <li>{{ t('gov.note.yoy') }}</li>
      <li>{{ t('gov.note.bedNights') }}</li>
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
/* Серифный стек только здесь: он отделяет отчёт от приложения и весит 0 КБ */
.head__title {
  margin: var(--nc-space-8) 0 0;
  font-family: var(--nc-font-serif);
  font-size: var(--nc-fs-desk-600);
  line-height: var(--nc-lh-desk-600);
  font-weight: var(--nc-fw-bold);
}
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

/* НЕ называть этот класс .grid: у Tailwind есть одноимённая утилита
   display:grid, и она перебивает табличную раскладку. Scoped-стили от
   этого не защищают — коллизия происходит на свойстве, которое здесь
   не объявлено, поэтому побеждает утилита, а таблица тихо перестаёт
   быть таблицей. Отловлено замером: getComputedStyle давал display:grid. */
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
  background: var(--nc-bg-surface);
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
.tbl tbody tr:nth-child(even) { background: var(--nc-bg-sunken); }
.tbl tfoot tr {
  background: var(--nc-bg-band);
  font-weight: var(--nc-fw-bold);
}
.tbl tfoot .tbl__c { border-top: var(--nc-stroke-control) solid var(--nc-border-strong); }

.beds {
  margin: 0;
  padding: var(--nc-space-8) var(--nc-space-24) 0;
  font-size: var(--nc-fs-desk-100);
  line-height: var(--nc-lh-desk-200);
  color: var(--nc-text-secondary);
}
.drill {
  margin: 0;
  padding: var(--nc-space-4) var(--nc-space-24) var(--nc-space-16);
  font-size: var(--nc-fs-desk-200);
  line-height: var(--nc-lh-desk-200);
  font-weight: var(--nc-fw-bold);
}

.panel {
  margin: var(--nc-space-16) var(--nc-space-24);
  border: var(--nc-stroke-hair) solid var(--nc-border-line);
  background: var(--nc-bg-surface);
}

.checks,
.coverage {
  margin: var(--nc-space-16) var(--nc-space-24);
  padding: var(--nc-space-16);
  background: var(--nc-bg-sunken);
  border-left: var(--nc-stroke-accent) solid var(--nc-status-inhouse);
}
.checks--bad { border-left-color: var(--nc-action-danger-fg); }
.checks__title {
  margin: 0;
  font-size: var(--nc-fs-desk-300);
  line-height: var(--nc-lh-desk-300);
  font-weight: var(--nc-fw-bold);
}
.checks__lead,
.coverage__lead {
  margin: var(--nc-space-4) 0 var(--nc-space-12);
  font-size: var(--nc-fs-desk-100);
  line-height: var(--nc-lh-desk-200);
  color: var(--nc-text-secondary);
}
.checks__list { margin: 0; padding: 0; list-style: none; }
.checks__item {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--nc-space-8);
  padding: var(--nc-space-2) 0;
  font-size: var(--nc-fs-desk-200);
  line-height: var(--nc-lh-desk-200);
}
.checks__mark { flex: none; font-weight: var(--nc-fw-bold); color: var(--nc-status-inhouse); }
.checks--bad .checks__mark { color: var(--nc-action-danger-fg); }
.checks__label { flex: 1; min-width: 0; }
.checks__nums { flex: none; color: var(--nc-text-secondary); }
.checks__occ {
  margin: var(--nc-space-12) 0 0;
  padding-top: var(--nc-space-8);
  border-top: var(--nc-stroke-hair) solid var(--nc-border-line);
  font-size: var(--nc-fs-desk-200);
  line-height: var(--nc-lh-desk-200);
  font-weight: var(--nc-fw-bold);
}

.coverage { border-left-color: var(--nc-status-hold); }
.coverage__list {
  margin: 0;
  padding-left: var(--nc-space-16);
  font-size: var(--nc-fs-desk-200);
  line-height: var(--nc-lh-desk-200);
}

.notes {
  margin: 0;
  padding: var(--nc-space-16) var(--nc-space-24) var(--nc-space-24) var(--nc-space-32);
  font-size: var(--nc-fs-desk-100);
  line-height: var(--nc-lh-desk-200);
  color: var(--nc-text-secondary);
}
</style>
