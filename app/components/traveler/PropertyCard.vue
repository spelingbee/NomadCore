<script setup lang="ts">
import { Star } from 'lucide-vue-next'
import type { Property, UnitType } from '~/data/mock-data'
import { cn } from '~/lib/utils'
import PriceBadge from "../shared/PriceBadge.vue";

interface PropertyCardProps {
  property: Property
  unitTypes?: UnitType[]
  className?: string
}

const props = withDefaults(defineProps<PropertyCardProps>(), {
  unitTypes: () => [],
})

defineEmits<{
  click: []
}>()

const lowestPrice = computed(() => {
  if (props.unitTypes.length === 0) return null
  const prices = props.unitTypes.map(u => (u as any).retailRate || (u as any).basePrice).filter(p => p !== undefined)
  return prices.length > 0 ? Math.min(...prices) : null
})
</script>

<template>
  <button
    type="button"
    @click="$emit('click')"
    :class="cn(
      'group bg-card border border-border rounded-xl overflow-hidden text-left w-full transition-shadow hover:shadow-md',
      className
    )"
  >
    <div class="aspect-[4/3] relative overflow-hidden">
      <img
        :src="property.image || (property.metadata as any)?.images?.[0] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'"
        :alt="property.name"
        class="w-full h-full object-cover transition-transform group-hover:scale-105"
      />
      <div v-if="property.rating" class="absolute top-2 right-2 bg-card/90 backdrop-blur rounded-full px-2 py-1 flex items-center gap-1">
        <Star class="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        <span class="text-xs font-medium">{{ property.rating }}</span>
      </div>
    </div>
    <div class="p-3">
      <p class="text-[10px] uppercase font-bold tracking-wider text-primary/70">
        {{ property.kind || (property as any).type || 'Accommodation' }}
      </p>
      <h3 class="font-semibold mt-0.5 line-clamp-1">{{ property.name }}</h3>
      <div v-if="property.amenities && property.amenities.length > 0" class="flex flex-wrap gap-1 mt-2">
        <span v-for="(amenity, i) in property.amenities.slice(0, 3)" :key="i" class="text-xs bg-muted px-2 py-0.5 rounded">
          {{ amenity }}
        </span>
      </div>
      <div v-else class="text-[10px] text-muted-foreground mt-2 italic">
        {{ property.addressText }}
      </div>
      <div v-if="lowestPrice" class="mt-3 flex items-baseline gap-1">
        <span class="text-xs text-muted-foreground">от</span>
        <PriceBadge :price="lowestPrice" size="sm" />
        <span class="text-xs text-muted-foreground">/ ночь</span>
      </div>
    </div>
  </button>
</template>
