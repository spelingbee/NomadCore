<script setup lang="ts">
import { Lightbulb } from 'lucide-vue-next'
import { cn } from '~/lib/utils'

interface InsightCardProps {
  title?: string
  insight: string
  type?: 'info' | 'success' | 'warning'
}

withDefaults(defineProps<InsightCardProps>(), {
  title: 'AI Insight',
  type: 'info',
})
</script>

<template>
  <div
    :class="cn(
      'border rounded-lg p-4 transition-colors duration-300',
      type === 'info' && 'border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-900/20',
      type === 'success' && 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-900/20',
      type === 'warning' && 'border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20',
    )"
  >
    <div class="flex gap-3">
      <div
        :class="cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          type === 'info' && 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
          type === 'success' && 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
          type === 'warning' && 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
        )"
      >
        <Lightbulb class="w-4 h-4" />
      </div>
      <div>
        <p
          :class="cn(
            'text-xs font-medium',
            type === 'info' && 'text-blue-600 dark:text-blue-400',
            type === 'success' && 'text-emerald-600 dark:text-emerald-400',
            type === 'warning' && 'text-amber-600 dark:text-amber-400',
          )"
        >
          {{ title }}
        </p>
        <p
          :class="cn(
            'text-sm mt-0.5',
            type === 'info' && 'text-blue-900 dark:text-blue-100',
            type === 'success' && 'text-emerald-900 dark:text-emerald-100',
            type === 'warning' && 'text-amber-900 dark:text-amber-100',
          )"
        >
          {{ insight }}
        </p>
      </div>
    </div>
  </div>
</template>
