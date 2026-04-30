<script setup lang="ts">
import { Clock } from 'lucide-vue-next'
import type { Experience } from '~/data/mock-data'
import { cn } from '~/lib/utils'
import PriceBadge from "../shared/PriceBadge.vue";

interface ExperienceCardProps {
  experience: Experience
  className?: string
}

defineProps<ExperienceCardProps>()
defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    type="button"
    @click="$emit('click')"
    :class="cn(
      'group bg-card border border-border rounded-xl overflow-hidden text-left w-full transition-shadow hover:shadow-md min-w-[200px]',
      className
    )"
  >
    <div class="aspect-[4/3] relative overflow-hidden">
      <img
        :src="experience.image"
        :alt="experience.name"
        class="w-full h-full object-cover transition-transform group-hover:scale-105"
      />
    </div>
    <div class="p-3">
      <h3 class="font-semibold text-sm line-clamp-1">{{ experience.name }}</h3>
      <p class="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
        <Clock class="w-3 h-3" />
        {{ experience.duration }}
      </p>
      <div class="mt-2">
        <PriceBadge :price="experience.price" size="sm" />
      </div>
    </div>
  </button>
</template>
