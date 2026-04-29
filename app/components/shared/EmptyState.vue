<script setup lang="ts">
import { cn } from '~/lib/utils'

interface EmptyStateProps {
  title: string
  description?: string
  className?: string
}

defineProps<EmptyStateProps>()
</script>

<template>
  <div :class="cn('flex flex-col items-center justify-center py-12 text-center', className)">
    <div v-if="$slots.icon" class="text-muted-foreground mb-4">
      <slot name="icon" />
    </div>
    <h3 class="text-lg font-medium">{{ title }}</h3>
    <p v-if="description" class="text-sm text-muted-foreground mt-1 max-w-sm">{{ description }}</p>
    <div v-if="$slots.action" class="mt-4">
      <slot name="action" />
    </div>
  </div>
</template>
