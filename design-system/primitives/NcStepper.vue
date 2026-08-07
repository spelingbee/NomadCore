<script setup lang="ts">
withDefaults(defineProps<{ min?: number; max?: number; label?: string }>(), { min: 1, max: 30 })
const model = defineModel<number>({ required: true })
</script>

<template>
  <div class="nc-stepper" role="group" :aria-label="label">
    <button class="nc-stepper__btn" type="button" :disabled="model <= min" @click="model--">−</button>
    <output class="nc-stepper__value nc-tnum">{{ model }}</output>
    <button class="nc-stepper__btn" type="button" :disabled="model >= max" @click="model++">+</button>
  </div>
</template>

<style scoped>
.nc-stepper {
  display: flex; align-items: center;
  height: var(--nc-touch-action);
  border: 2px solid var(--nc-border-strong);
  border-radius: var(--nc-radius-md);
  background: var(--nc-bg-surface);
  overflow: hidden;
}
.nc-stepper__btn {
  width: var(--nc-touch-min); height: 100%;
  border: 0; background: transparent;
  color: var(--nc-text-primary);
  font-size: var(--nc-fs-500); font-weight: var(--nc-fw-bold);
  cursor: pointer;
}
.nc-stepper__btn:disabled { color: var(--nc-action-disabled-fg); cursor: default; }
.nc-stepper__value {
  flex: 1; text-align: center;
  font-size: var(--nc-fs-400); font-weight: var(--nc-fw-bold);
  font-variant-numeric: tabular-nums;
}
</style>
