<script setup lang="ts">
/**
 * Все иконки продукта — 12 путей в одном файле, инлайновый SVG.
 * Иконочного шрифта нет и не будет: это 40–80 КБ ради 12 глифов.
 */
const PATHS: Record<string, string> = {
  check:    'M4 11l5 5 11-11',
  close:    'M5 5l14 14M19 5L5 19',
  back:     'M14 5l-7 7 7 7',
  forward:  'M10 5l7 7-7 7',
  plus:     'M12 5v14M5 12h14',
  minus:    'M5 12h14',
  offline:  'M2 5l20 14M5 12a10 10 0 0114-2M9 16a5 5 0 015-1',
  sync:     'M20 12a8 8 0 11-2.3-5.7M20 4v4h-4',
  warning:  'M12 4l9 16H3zM12 10v4M12 17.5v.5',
  calendar: 'M4 7h16v13H4zM4 11h16M9 4v5M15 4v5',
  key:      'M14 9a4 4 0 10-4 4l1 1 2 2 2-2-1-1 2-2z',
  person:   'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0'
}
withDefaults(defineProps<{ name: keyof typeof PATHS; size?: number }>(), { size: 24 })
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" aria-hidden="true" class="nc-icon">
    <path :d="PATHS[name]" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>

<style scoped>
.nc-icon { display: block; flex: none; }
</style>
