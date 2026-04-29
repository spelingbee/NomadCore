<script setup lang="ts">
import { Star } from 'lucide-vue-next'
import { cn } from '~/lib/utils'

interface ReviewCardProps {
  author: string
  rating: number
  comment: string
  date: string
  className?: string
}

defineProps<ReviewCardProps>()
</script>

<template>
  <div :class="cn('border border-border rounded-lg p-4 bg-card', className)">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
          {{ author.charAt(0) }}
        </div>
        <span class="font-medium text-sm">{{ author }}</span>
      </div>
      <div class="flex items-center gap-1">
        <Star
          v-for="(_, i) in 5"
          :key="i"
          :class="cn(
            'w-3.5 h-3.5',
            i < rating ? 'fill-amber-400 text-amber-400' : 'text-muted'
          )"
        />
      </div>
    </div>
    <p class="text-sm mt-3 text-muted-foreground">{{ comment }}</p>
    <p class="text-xs text-muted-foreground mt-2">{{ date }}</p>
  </div>
</template>
