<script setup lang="ts">
import { cn } from '~/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  className?: string
}

const props = withDefaults(defineProps<StatCardProps>(), {
  changeType: 'neutral',
})
</script>

<template>
  <div :class="cn('bg-card border border-border rounded-lg p-4', props.className)">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm text-muted-foreground">{{ label }}</p>
        <p class="text-2xl font-semibold mt-1">{{ value }}</p>
        <p
          v-if="change"
          :class="cn(
            'text-xs mt-1',
            changeType === 'positive' && 'text-emerald-600',
            changeType === 'negative' && 'text-red-600',
            changeType === 'neutral' && 'text-muted-foreground',
          )"
        >
          {{ change }}
        </p>
      </div>
      <div v-if="$slots.icon" class="text-muted-foreground">
        <slot name="icon" />
      </div>
    </div>
  </div>
</template>
