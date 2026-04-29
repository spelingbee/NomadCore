<script setup lang="ts">
import { cn } from '~/lib/utils'

interface AvailabilityCalendarProps {
  selectedDate?: string
  className?: string
}
defineProps<AvailabilityCalendarProps>()
const emit = defineEmits<{
  dateSelect: [date: string]
}>()

const dates = [
  { date: '2024-07-15', available: true, price: 6000 },
  { date: '2024-07-16', available: true, price: 6000 },
  { date: '2024-07-17', available: false, price: 6000 },
  { date: '2024-07-18', available: true, price: 6000 },
  { date: '2024-07-19', available: true, price: 7500 },
  { date: '2024-07-20', available: true, price: 7500 },
  { date: '2024-07-21', available: true, price: 6000 },
]

function getDay(date: string) {
  const d = new Date(date)
  return {
    weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
    day: d.toLocaleDateString('en-US', { day: 'numeric' }),
  }
}
</script>

<template>
  <div :class="cn('space-y-3', className)">
    <h3 class="font-semibold">Select Date</h3>
    <div class="flex gap-2 overflow-x-auto pb-2">
      <button
        v-for="d in dates"
        :key="d.date"
        type="button"
        :disabled="!d.available"
        @click="d.available && $emit('dateSelect', d.date)"
        :class="cn(
          'flex-shrink-0 w-16 p-2 rounded-lg border text-center transition-colors',
          d.available
            ? selectedDate === d.date
              ? 'border-foreground bg-foreground text-background'
              : 'border-border hover:border-foreground'
            : 'border-border bg-muted text-muted-foreground cursor-not-allowed'
        )"
      >
        <p class="text-xs font-medium">{{ getDay(d.date).weekday }}</p>
        <p class="text-lg font-semibold">{{ getDay(d.date).day }}</p>
        <p v-if="d.available" class="text-[10px] text-muted-foreground">{{ (d.price / 1000).toFixed(1) }}k</p>
      </button>
    </div>
  </div>
</template>
