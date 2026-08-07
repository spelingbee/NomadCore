<script setup lang="ts">
import type { BookingStatus } from '~/types'

/** Цвет статуса живёт здесь и только здесь — не на кнопках. */
defineProps<{ status?: BookingStatus; tone?: 'neutral' | 'warning' | 'error' | 'outline' }>()
</script>

<template>
  <span class="nc-pill" :class="status ? 'nc-pill--' + status.toLowerCase() : 'nc-pill--' + (tone ?? 'neutral')">
    <slot />
  </span>
</template>

<style scoped>
.nc-pill {
  display: inline-block;
  padding: var(--nc-space-2) var(--nc-space-8);
  border-radius: var(--nc-radius-sm);
  font-size: var(--nc-fs-100);
  font-weight: var(--nc-fw-bold);
  line-height: var(--nc-lh-100);
  white-space: nowrap;
}
.nc-pill--hold        { background: var(--nc-status-hold);      color: var(--nc-status-fg); }
.nc-pill--confirmed   { background: var(--nc-status-confirmed); color: var(--nc-status-fg); }
.nc-pill--checked_in  { background: var(--nc-status-inhouse);   color: var(--nc-status-fg); }
.nc-pill--checked_out { background: var(--nc-status-out);       color: var(--nc-status-out-fg); }
.nc-pill--cancelled   { background: var(--nc-status-cancelled); color: var(--nc-status-fg); }
.nc-pill--neutral     { background: var(--nc-bg-band);          color: var(--nc-text-primary); }
.nc-pill--outline     { background: transparent; color: var(--nc-text-primary); box-shadow: inset 0 0 0 2px var(--nc-border-strong); }
.nc-pill--warning     { background: var(--nc-signal-warning-bg); color: var(--nc-signal-warning-fg); }
.nc-pill--error       { background: var(--nc-signal-error-bg);   color: var(--nc-signal-error-fg); }
</style>
