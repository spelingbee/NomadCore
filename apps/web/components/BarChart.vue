<script setup lang="ts">
/**
 * Столбчатая диаграмма — инлайновый SVG, без библиотеки графиков.
 *
 * Причина не в весе (кабинет грузится своим чанком и в бюджет владельца
 * не входит), а в проверяемости: библиотека рисует то, что ей передали,
 * и подписи на ней могут разойтись с таблицей незаметно. Здесь высота
 * столбца — это буквально value ÷ max, и ничего между ними нет.
 *
 * Значение печатается НАД каждым столбцом: график, с которого нельзя
 * списать число, на государственном экране бесполезен.
 */
const props = defineProps<{
  bars: { name: string; value: number }[]
  title: string
  /** Строка под заголовком: сверка суммы, единицы, источник. */
  note?: string
}>()

/* Геометрия в единицах viewBox, а не в пикселях: SVG масштабируется
   контейнером, поэтому числа здесь — пропорции, а не размеры на экране. */
const BAR = 64
const GAP = 24
const PLOT_H = 150
const TOP = 26
const BASE = TOP + PLOT_H

const max = computed(() => Math.max(...props.bars.map((b) => b.value), 1))
const width = computed(() => props.bars.length * (BAR + GAP) + GAP)
const height = BASE + 34

const shapes = computed(() =>
  props.bars.map((b, i) => {
    const h = Math.max(1, Math.round((b.value / max.value) * PLOT_H))
    return { ...b, x: GAP + i * (BAR + GAP), y: BASE - h, h }
  }),
)

const nf = new Intl.NumberFormat("ru-RU")
</script>

<template>
  <figure class="chart">
    <figcaption class="chart__cap">
      {{ title }}
      <span v-if="note" class="chart__note nc-tnum">{{ note }}</span>
    </figcaption>

    <svg
      class="chart__svg"
      :viewBox="`0 0 ${width} ${height}`"
      role="img"
      :aria-label="title"
      preserveAspectRatio="xMinYMin meet"
    >
      <g v-for="b in shapes" :key="b.name">
        <text class="chart__value nc-tnum" :x="b.x + BAR / 2" :y="b.y - 8" text-anchor="middle">
          {{ nf.format(b.value) }}
        </text>
        <rect class="chart__bar" :x="b.x" :y="b.y" :width="BAR" :height="b.h" />
        <text class="chart__label" :x="b.x + BAR / 2" :y="BASE + 20" text-anchor="middle">
          {{ b.name }}
        </text>
      </g>
      <line class="chart__axis" :x1="0" :y1="BASE" :x2="width" :y2="BASE" />
    </svg>
  </figure>
</template>

<style scoped>
.chart { margin: 0; }
.chart__cap {
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
.chart__note {
  font-size: var(--nc-fs-desk-100);
  line-height: var(--nc-lh-desk-100);
  font-weight: var(--nc-fw-regular);
  color: var(--nc-text-secondary);
}
.chart__svg { display: block; width: 100%; height: auto; padding: var(--nc-space-16); }
/* Столбцы одним тоном: это шкала величины, а не статусы — цвет здесь
   ничего не кодирует и не должен притворяться, что кодирует. */
.chart__bar { fill: var(--nc-text-primary); }
.chart__axis { stroke: var(--nc-border-strong); stroke-width: 1; }
.chart__value {
  fill: var(--nc-text-primary);
  font-family: var(--nc-font-sans);
  font-size: var(--nc-fs-desk-100);
  font-weight: var(--nc-fw-bold);
  font-variant-numeric: tabular-nums;
}
.chart__label {
  fill: var(--nc-text-secondary);
  font-family: var(--nc-font-sans);
  font-size: var(--nc-fs-desk-100);
}
</style>
