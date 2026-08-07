<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <div class="nc-sheet">
    <button class="nc-sheet__scrim" aria-label="Закрыть" type="button" @click="emit('close')" />
    <section class="nc-sheet__panel">
      <h2 class="nc-sheet__title">{{ title }}</h2>
      <p v-if="subtitle" class="nc-sheet__subtitle">{{ subtitle }}</p>
      <div class="nc-sheet__body"><slot /></div>
      <div class="nc-sheet__actions"><slot name="actions" /></div>
    </section>
  </div>
</template>

<style scoped>
.nc-sheet { position: absolute; inset: 0; z-index: 30; display: flex; flex-direction: column; justify-content: flex-end; }
.nc-sheet__scrim { flex: 1; border: 0; background: rgba(17, 19, 16, .5); cursor: pointer; }
.nc-sheet__panel {
  background: var(--nc-bg-surface);
  border-top: 3px solid var(--nc-border-strong);
  box-shadow: var(--nc-shadow-sheet);
  padding: var(--nc-space-16) var(--nc-space-12);
}
.nc-sheet__title { margin: 0; font-size: var(--nc-fs-500); line-height: var(--nc-lh-500); font-weight: var(--nc-fw-bold); }
.nc-sheet__subtitle { margin: var(--nc-space-4) 0 0; font-size: var(--nc-fs-200); line-height: var(--nc-lh-200); color: var(--nc-text-secondary); }
.nc-sheet__body { margin-top: var(--nc-space-16); }
.nc-sheet__actions { display: flex; gap: var(--nc-space-8); margin-top: var(--nc-space-16); }
</style>
