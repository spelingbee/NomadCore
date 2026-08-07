<script setup lang="ts">
/**
 * «Занятость» — три режима. Порядок и умолчание выбраны замером на 360px,
 * а не привычкой (сравнение живьём: design-system/STAGE-2.md, п. 1):
 *
 *   День  — умолчание. Выигрывает вопрос «что у меня сегодня», который задают
 *           двадцать раз в день. Прямой аналог страницы бумажной тетради.
 *   Ночи  — второй. Забрал у сетки её работу «есть ли места на выходные»:
 *           один тап, вертикальный скролл, одна рука.
 *   Сетка — третий. Единственный ответ на «куда переселить», но на 360px
 *           требует горизонтального скролла и двух рук.
 *
 * Залитых кнопок на экране НОЛЬ, и это не недоделка: экран отвечает на
 * вопрос, а не требует действия. Переключатель режима — состояние, а не
 * действие, поэтому заливку он тоже не берёт.
 */
type Mode = "day" | "nights" | "grid"

const { t } = useI18n()

const STORAGE_KEY = "nc.occupancyMode"
const mode = ref<Mode>("day")

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === "day" || saved === "nights" || saved === "grid") mode.value = saved
})
watch(mode, (v) => {
  if (import.meta.client) localStorage.setItem(STORAGE_KEY, v)
})

const options = computed(() => [
  { value: "day", label: t("occupancy.day") },
  { value: "nights", label: t("occupancy.nights") },
  { value: "grid", label: t("occupancy.grid") },
])

/** NcSegmented работает со строкой; сужение обратно к Mode держим здесь. */
const modeProxy = computed<string>({
  get: () => mode.value,
  set: (v) => {
    if (v === "day" || v === "nights" || v === "grid") mode.value = v
  },
})
</script>

<template>
  <main class="main">
    <div class="modes">
      <NcSegmented v-model="modeProxy" :options="options" />
    </div>

    <OccupancyDay v-if="mode === 'day'" />
    <OccupancyNights v-else-if="mode === 'nights'" />
    <OccupancyGrid v-else />
  </main>
</template>

<style scoped>
.main { flex: 1; min-height: 0; overflow-y: auto; }
.modes { padding: var(--nc-space-12); }
</style>
