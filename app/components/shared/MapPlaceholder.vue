<script setup lang="ts">
import { MapPin } from 'lucide-vue-next'
import { cn } from '~/lib/utils'

interface MapPlaceholderProps {
  title?: string
  markers?: { name: string; value?: number }[]
  className?: string
}

withDefaults(defineProps<MapPlaceholderProps>(), {
  title: 'Map View',
  markers: () => [],
})
</script>

<template>
  <div :class="cn('border border-border rounded-lg bg-muted/30 overflow-hidden', className)">
    <div class="p-3 border-b border-border bg-card">
      <h3 class="text-sm font-medium">{{ title }}</h3>
    </div>
    <div class="relative h-96 bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 flex items-center justify-center p-8">
      <!-- Kyrgyzstan Map SVG -->
      <div class="absolute inset-0 flex items-center justify-center p-8">
        <svg viewBox="0 0 800 400" class="w-full h-full drop-shadow-xl overflow-visible">
          <path 
            d="M50,180 L120,150 L180,140 L250,130 L350,120 L450,130 L550,120 L650,130 L750,150 L780,200 L750,250 L650,280 L550,300 L450,310 L350,300 L250,280 L150,260 L80,240 L40,220 Z" 
            fill="currentColor" 
            class="text-emerald-500/20 stroke-emerald-500/40 stroke-2"
          />
          <!-- Issyk-Kul Lake -->
          <ellipse cx="600" cy="180" rx="60" ry="30" fill="currentColor" class="text-blue-400/40 stroke-blue-400/60 stroke-2" />
        </svg>
      </div>

      <!-- Realistic Markers -->
      <div class="absolute inset-0">
        <div v-for="(marker, i) in markers" :key="i" 
          class="absolute group cursor-pointer transition-all hover:scale-110"
          :style="{ 
            left: `${20 + (i * 15)}%`, 
            top: `${30 + (i % 2 * 30)}%` 
          }"
        >
          <div class="flex flex-col items-center">
            <div class="bg-card px-2 py-1 rounded shadow-lg border border-border text-[10px] font-bold whitespace-nowrap mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {{ marker.name }}
              <span v-if="marker.value" class="text-primary ml-1">{{ marker.value }}</span>
            </div>
            <div class="relative">
              <div class="absolute inset-0 animate-ping rounded-full bg-primary/40"></div>
              <MapPin class="w-6 h-6 text-primary relative fill-white stroke-[2px]" />
            </div>
          </div>
        </div>
      </div>
      <div class="text-muted-foreground text-sm flex items-center gap-2">
        <MapPin class="w-5 h-5" />
        <span>Map visualization</span>
      </div>
    </div>
  </div>
</template>
