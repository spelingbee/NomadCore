<script setup lang="ts">
/**
 * Строка списка. Вся вторичная информация — отдельными узлами во flex-обёртке
 * с gap, а не одной строкой с разделителями: при +30% длины кыргызского текста
 * перенос происходит между узлами, а не внутри «· 1 гост.».
 */
defineProps<{ marker?: string; interactive?: boolean }>()
</script>

<template>
  <div class="nc-row" :class="{ 'nc-row--interactive': interactive }">
    <span v-if="marker" class="nc-row__marker" :style="{ background: marker }" />
    <div class="nc-row__body">
      <div class="nc-row__head"><slot name="head" /></div>
      <div class="nc-row__meta"><slot name="meta" /></div>
      <div class="nc-row__tags"><slot name="tags" /></div>
    </div>
    <div class="nc-row__action"><slot name="action" /></div>
  </div>
</template>

<style scoped>
.nc-row {
  display: flex;
  align-items: center;
  gap: var(--nc-space-12);
  padding: var(--nc-space-12);
  background: var(--nc-bg-surface);
  border-bottom: 1px solid var(--nc-border-line);
  position: relative;
}
.nc-row--interactive { cursor: pointer; }
.nc-row__marker { position: absolute; inset: 0 auto 0 0; width: 4px; }
.nc-row__body { flex: 1; min-width: 0; }
.nc-row__head { display: flex; align-items: center; gap: var(--nc-space-8); flex-wrap: wrap; }
/* Перенос между смысловыми узлами, а не внутри них */
.nc-row__meta {
  display: flex; flex-wrap: wrap; gap: var(--nc-space-4) var(--nc-space-12);
  margin-top: var(--nc-space-4);
  font-size: var(--nc-fs-200); line-height: var(--nc-lh-200);
  color: var(--nc-text-secondary);
}
.nc-row__meta > :deep(*) { white-space: nowrap; }
.nc-row__tags { display: flex; flex-wrap: wrap; gap: var(--nc-space-4); margin-top: var(--nc-space-8); }
.nc-row__tags:empty { display: none; }
.nc-row__action { flex: none; }
</style>
