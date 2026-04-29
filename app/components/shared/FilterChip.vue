<script setup lang="ts">
import { cn } from '~/lib/utils'

interface FilterChipProps {
  label: string
  active?: boolean
  className?: string
}

defineProps<FilterChipProps>()
defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    type="button"
    @click="$emit('click')"
    :class="cn(
      'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
      active
        ? 'bg-foreground text-background'
        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      className
    )"
  >
    {{ label }}
  </button>
</template>
