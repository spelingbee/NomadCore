<script setup lang="ts">
import { cn } from '~/lib/utils'

interface KPIGridProps {
  columns?: 2 | 3 | 4
  className?: string
}

const props = withDefaults(defineProps<KPIGridProps>(), {
  columns: 4,
})
</script>

<template>
  <div
    :class="cn(
      'grid gap-4',
      columns === 2 && 'grid-cols-1 sm:grid-cols-2',
      columns === 3 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      columns === 4 && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
      className
    )"
  >
    <slot />
  </div>
</template>
