<script setup lang="ts">
import { MapPin } from 'lucide-vue-next'
import type { DestinationArea } from '~/data/mock-data'
import { cn } from '~/lib/utils'

interface DestinationCardProps {
  destination: DestinationArea
  variant?: 'featured' | 'compact'
  className?: string
}

withDefaults(defineProps<DestinationCardProps>(), {
  variant: 'featured',
})

defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    v-if="variant === 'compact'"
    type="button"
    @click="$emit('click')"
    :class="cn(
      'group relative rounded-xl overflow-hidden aspect-[4/3] w-full text-left',
      className
    )"
  >
    <img
      :src="destination.image"
      :alt="destination.name"
      class="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
    <div class="absolute bottom-0 left-0 right-0 p-3">
      <h3 class="text-white font-semibold">{{ destination.name }}</h3>
      <p class="text-white/80 text-xs flex items-center gap-1 mt-0.5">
        <MapPin class="w-3 h-3" />
        {{ destination.region }}
      </p>
    </div>
  </button>

  <button
    v-else
    type="button"
    @click="$emit('click')"
    :class="cn(
      'group relative rounded-2xl overflow-hidden aspect-[16/10] w-full text-left',
      className
    )"
  >
    <img
      :src="destination.image"
      :alt="destination.name"
      class="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
    <div class="absolute bottom-0 left-0 right-0 p-5">
      <div class="flex items-center gap-1.5 text-white/80 text-sm mb-1">
        <MapPin class="w-4 h-4" />
        {{ destination.region }}
      </div>
      <h3 class="text-white text-xl font-bold">{{ destination.name }}</h3>
      <p class="text-white/80 text-sm mt-1 line-clamp-2">{{ destination.description }}</p>
    </div>
  </button>
</template>
