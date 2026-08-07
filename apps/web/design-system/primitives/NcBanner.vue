<script setup lang="ts">
/** Плашка состояния: офлайн, ошибка сервера, предупреждение о документах. */
defineProps<{ tone: 'warning' | 'error' | 'offline' | 'neutral' }>()
</script>

<template>
  <div class="nc-banner" :class="'nc-banner--' + tone">
    <div class="nc-banner__body"><slot /></div>
    <div class="nc-banner__actions"><slot name="actions" /></div>
  </div>
</template>

<style scoped>
.nc-banner {
  display: flex; align-items: flex-start; gap: var(--nc-space-12);
  padding: var(--nc-space-12);
  font-size: var(--nc-fs-200); line-height: var(--nc-lh-200);
  border-left: var(--nc-stroke-accent) solid transparent;
}
.nc-banner__body { flex: 1; min-width: 0; }
.nc-banner__actions { flex: none; display: flex; gap: var(--nc-space-8); }
.nc-banner--warning { background: var(--nc-signal-warning-bg); color: var(--nc-signal-warning-fg); border-left-color: var(--nc-status-hold); }
.nc-banner--error   { background: var(--nc-signal-error-bg);   color: var(--nc-signal-error-fg);   border-left-color: var(--nc-action-danger-fg); }
.nc-banner--offline { background: var(--nc-signal-offline-bg); color: var(--nc-signal-offline-fg); border-left-color: var(--nc-signal-offline-dot); }
.nc-banner--neutral { background: var(--nc-bg-sunken); color: var(--nc-text-primary); border-left-color: var(--nc-border-line); }
</style>
