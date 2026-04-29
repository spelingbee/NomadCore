<script setup lang="ts">
import { cn } from '~/lib/utils'

interface PriceBadgeProps {
  price: number | string
  currency?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const props = withDefaults(defineProps<PriceBadgeProps>(), {
  currency: 'KGS',
  size: 'md',
})

const formattedPrice = computed(() => {
  return typeof props.price === 'number' ? props.price.toLocaleString() : props.price
})
</script>

<template>
  <span
    :class="cn(
      'font-semibold',
      size === 'sm' && 'text-sm',
      size === 'md' && 'text-base',
      size === 'lg' && 'text-xl',
      className
    )"
  >
    {{ formattedPrice }} {{ currency }}
  </span>
</template>
