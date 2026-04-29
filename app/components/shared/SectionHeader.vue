<script setup lang="ts">
import { cn } from '~/lib/utils'

interface SectionHeaderProps {
  title: string
  description?: string
  className?: string
}

defineProps<SectionHeaderProps>()
</script>

<template>
  <div :class="cn('flex items-center justify-between', className)">
    <div>
      <h2 class="text-xl font-semibold">{{ title }}</h2>
      <p v-if="description" class="text-sm text-muted-foreground mt-0.5">{{ description }}</p>
    </div>
    <div v-if="$slots.action">
      <slot name="action" />
    </div>
  </div>
</template>
