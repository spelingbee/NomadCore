<script setup lang="ts">
import { Clock, Package as PackageIcon } from 'lucide-vue-next'
import { cn } from '~/lib/utils'
import { useTourismStore } from '~/stores/useTourismStore'
import PriceBadge from "../shared/PriceBadge.vue";

interface PackageCardProps {
  pkg: any
  variant?: 'full' | 'compact'
  className?: string
}

const props = withDefaults(defineProps<PackageCardProps>(), {
  variant: 'full',
})

const tourismStore = useTourismStore()

const price = computed(() => {
  if (props.pkg.retailPrice) return props.pkg.retailPrice
  return tourismStore.getPropertyPrice(props.pkg.id)
})

const duration = computed(() => {
  return props.pkg.duration || props.pkg.metadata?.duration || '7 дней'
})

const description = computed(() => {
  return props.pkg.description || props.pkg.shortDescription || ''
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
      'group bg-card border border-border rounded-xl overflow-hidden text-left w-full transition-shadow hover:shadow-md',
      className
    )"
  >
    <div class="flex">
      <div class="w-24 h-24 flex-shrink-0">
        <img
          :src="pkg.image || 'https://images.unsplash.com/photo-1596392927852-2a18c336bd54?w=400&h=300&fit=crop'"
          :alt="pkg.name"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="p-3 flex-1 min-w-0">
        <h3 class="font-semibold text-sm line-clamp-1">{{ pkg.name }}</h3>
        <p class="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
          <Clock class="w-3 h-3" />
          {{ duration }}
        </p>
        <div class="mt-2" v-if="price">
          <PriceBadge :price="price" size="sm" />
        </div>
      </div>
    </div>
  </button>

  <button
    v-else
    type="button"
    @click="$emit('click')"
    :class="cn(
      'group bg-card border border-border rounded-xl overflow-hidden text-left w-full transition-shadow hover:shadow-md',
      className
    )"
  >
    <div class="aspect-[16/9] relative overflow-hidden">
      <img
        :src="pkg.image || 'https://images.unsplash.com/photo-1596392927852-2a18c336bd54?w=800&h=600&fit=crop'"
        :alt="pkg.name"
        class="w-full h-full object-cover transition-transform group-hover:scale-105"
      />
      <div class="absolute top-2 left-2 bg-foreground text-background rounded-full px-2.5 py-1 flex items-center gap-1.5 text-xs font-medium">
        <PackageIcon class="w-3.5 h-3.5" />
        Package
      </div>
    </div>
    <div class="p-4">
      <h3 class="font-semibold text-lg">{{ pkg.name }}</h3>
      <p class="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
        <Clock class="w-4 h-4" />
        {{ duration }}
      </p>
      <p class="text-sm text-muted-foreground mt-2 line-clamp-2">{{ description }}</p>
      <div class="mt-3 flex items-center gap-2 flex-wrap" v-if="pkg.items || pkg.amenities">
        <span v-for="(item, i) in (pkg.items || pkg.amenities).slice(0, 3)" :key="i" class="text-xs bg-muted px-2 py-1 rounded">
          {{ typeof item === 'string' ? item : item.name }}
        </span>
      </div>
      <div class="mt-4 flex items-baseline gap-1" v-if="price">
        <PriceBadge :price="price" size="lg" />
        <span class="text-sm text-muted-foreground">/ person</span>
      </div>
    </div>
  </button>
</template>
