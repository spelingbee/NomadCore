<script setup lang="ts">
import { cn } from '~/lib/utils'

interface ChannelBadgeProps {
  name: string
  color?: string
  className?: string
}

const props = defineProps<ChannelBadgeProps>()

const style = computed(() => ({
  backgroundColor: props.color ? `${props.color}20` : undefined,
  color: props.color || undefined,
}))
</script>

<template>
  <span
    :class="cn(
      'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
      className
    )"
    :style="style"
  >
    {{ name }}
  </span>
</template>
