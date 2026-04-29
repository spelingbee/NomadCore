<script setup lang="ts">
import { cn } from '~/lib/utils'

interface StatusBadgeProps {
  status: string
  variant?: 'booking' | 'payment' | 'channel'
  className?: string
}

const props = withDefaults(defineProps<StatusBadgeProps>(), {
  variant: 'booking',
})

const statusColors = {
  booking: {
    confirmed: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
  },
  payment: {
    paid: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    refunded: 'bg-gray-100 text-gray-700',
  },
  channel: {
    active: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    inactive: 'bg-gray-100 text-gray-700',
  },
}

const colorClass = computed(() => {
  const colors = statusColors[props.variant]
  return colors[props.status as keyof typeof colors] || 'bg-gray-100 text-gray-700'
})
</script>

<template>
  <span
    :class="cn(
      'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize',
      colorClass,
      className
    )"
  >
    {{ status }}
  </span>
</template>
