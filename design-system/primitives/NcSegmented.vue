<script setup lang="ts">
/**
 * Переключатель режима — СОСТОЯНИЕ, а не действие. Заливку он не берёт:
 * иначе на экране появляется вторая «главная кнопка» и иерархия ломается.
 * Выбранный помечается фоном band, жирным начертанием и подчёркиванием —
 * все три канала переживают обесцвечивание.
 */
defineProps<{ options: { value: string; label: string }[] }>()
const model = defineModel<string>({ required: true })
</script>

<template>
  <div class="nc-seg" role="tablist">
    <button
      v-for="o in options" :key="o.value"
      class="nc-seg__item" :class="{ 'nc-seg__item--on': model === o.value }"
      role="tab" :aria-selected="model === o.value" type="button"
      @click="model = o.value"
    >{{ o.label }}</button>
  </div>
</template>

<style scoped>
.nc-seg { display: flex; }
.nc-seg__item {
  flex: 1;
  min-height: var(--nc-touch-min);
  padding: 0 var(--nc-space-8);
  border: 2px solid var(--nc-border-strong);
  border-left-width: 0;
  background: var(--nc-bg-surface);
  color: var(--nc-text-primary);
  font-family: var(--nc-font-sans);
  font-size: var(--nc-fs-200);
  font-weight: var(--nc-fw-regular);
  cursor: pointer;
}
.nc-seg__item:first-child { border-left-width: 2px; border-radius: var(--nc-radius-md) 0 0 var(--nc-radius-md); }
.nc-seg__item:last-child { border-radius: 0 var(--nc-radius-md) var(--nc-radius-md) 0; }
.nc-seg__item--on {
  background: var(--nc-bg-band);
  color: var(--nc-text-primary);
  font-weight: var(--nc-fw-bold);
  border-bottom-width: 4px;
}
</style>
