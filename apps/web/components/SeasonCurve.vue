<script setup lang="ts">
/**
 * Сезонная кривая — инлайновый SVG, без библиотеки графиков.
 *
 * Причина не в весе (кабинет грузится своим чанком и в бюджет владельца
 * не входит), а в проверяемости: библиотека рисует то, что ей передали,
 * и подписи на ней могут разойтись с таблицей незаметно. Здесь высота
 * столбца — это буквально sold ÷ max, а сумма всех значений выведена
 * рядом и сверяется с итогом таблицы в блоке сверок.
 *
 * Значение печатается НАД каждым столбцом: график, с которого нельзя
 * списать число, на государственном экране бесполезен.
 */
const props = defineProps<{
  months: { name: string; sold: number }[]
  /** Итог «Продано» из таблицы — для подписи «сумма равна». */
  tableTotal: number
}>()

const { t } = useI18n()

/* Геометрия в единицах viewBox, а не в пикселях: SVG масштабируется
   контейнером, поэтому числа здесь — пропорции, а не размеры на экране. */
const BAR = 64
const GAP = 24
const PLOT_H = 150
const TOP = 26
const BASE = TOP + PLOT_H

const max = computed(() => Math.max(...props.months.map((m) => m.sold), 1))
const width = computed(() => props.months.length * (BAR + GAP) + GAP)
const height = BASE + 34

const bars = computed(() =>
  props.months.map((m, i) => {
    const h = Math.max(1, Math.round((m.sold / max.value) * PLOT_H))
    return {
      name: m.name,
      sold: m.sold,
      x: GAP + i * (BAR + GAP),
      y: BASE - h,
      h,
    }
  }),
)

const sum = computed(() => props.months.reduce((a, m) => a + m.sold, 0))
const nf = new Intl.NumberFormat("ru-RU")
</script>

<template>
  <figure class="curve">
    <figcaption class="curve__cap">
      {{ t('gov.seasonTitle') }}
      <span class="curve__sum nc-tnum">
        {{ t('gov.seasonSum', { sum: nf.format(sum), total: nf.format(tableTotal) }) }}
      </span>
    </figcaption>

    <svg
      class="curve__svg"
      :viewBox="`0 0 ${width} ${height}`"
      role="img"
      :aria-label="t('gov.seasonTitle')"
      preserveAspectRatio="xMinYMin meet"
    >
      <g v-for="b in bars" :key="b.name">
        <text class="curve__value nc-tnum" :x="b.x + BAR / 2" :y="b.y - 8" text-anchor="middle">
          {{ nf.format(b.sold) }}
        </text>
        <rect class="curve__bar" :x="b.x" :y="b.y" :width="BAR" :height="b.h" />
        <text class="curve__month" :x="b.x + BAR / 2" :y="BASE + 20" text-anchor="middle">
          {{ b.name }}
        </text>
      </g>
      <line class="curve__axis" :x1="0" :y1="BASE" :x2="width" :y2="BASE" />
    </svg>
  </figure>
</template>

<style scoped>
.curve { margin: 0; }
.curve__cap {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--nc-space-12);
  padding: var(--nc-space-12) var(--nc-space-16);
  font-size: var(--nc-fs-desk-300);
  line-height: var(--nc-lh-desk-300);
  font-weight: var(--nc-fw-bold);
  border-bottom: var(--nc-stroke-hair) solid var(--nc-border-line);
}
.curve__sum {
  font-size: var(--nc-fs-desk-100);
  line-height: var(--nc-lh-desk-100);
  font-weight: var(--nc-fw-regular);
  color: var(--nc-text-secondary);
}
.curve__svg { display: block; width: 100%; height: auto; padding: var(--nc-space-16); }
/* Столбцы одним тоном: это шкала величины, а не статусы — цвет здесь
   ничего не кодирует и не должен притворяться, что кодирует. */
.curve__bar { fill: var(--nc-text-primary); }
.curve__axis { stroke: var(--nc-border-strong); stroke-width: 1; }
.curve__value {
  fill: var(--nc-text-primary);
  font-family: var(--nc-font-sans);
  font-size: var(--nc-fs-desk-100);
  font-weight: var(--nc-fw-bold);
  font-variant-numeric: tabular-nums;
}
.curve__month {
  fill: var(--nc-text-secondary);
  font-family: var(--nc-font-sans);
  font-size: var(--nc-fs-desk-100);
}
</style>
