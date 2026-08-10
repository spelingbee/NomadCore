<script setup lang="ts">
/**
 * Ярлык номера — то, что владелец пишет на ключе: «3», «Ю1».
 * Занятый номер залит, свободный — контур: различие переживает обесцвечивание.
 */
withDefaults(defineProps<{ label: string; occupied?: boolean }>(), {
  occupied: true,
})
</script>

<template>
  <span class="chip nc-tnum" :class="occupied ? 'chip--on' : 'chip--off'">{{ label }}</span>
</template>

<style scoped>
.chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  min-width: var(--nc-space-32);
  padding: var(--nc-space-2) var(--nc-space-8);
  border-radius: var(--nc-radius-sm);
  font-size: var(--nc-fs-200);
  line-height: var(--nc-lh-200);
  font-weight: var(--nc-fw-bold);
}
.chip--on {
  background: var(--nc-text-primary);
  color: var(--nc-text-inverse);
}
.chip--off {
  background: transparent;
  color: var(--nc-text-primary);
  box-shadow: inset 0 0 0 var(--nc-stroke-control) var(--nc-border-strong);
}
</style>
