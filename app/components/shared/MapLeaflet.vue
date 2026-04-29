<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { cn } from '~/lib/utils'

interface MapMarker {
  id?: string
  lat: number
  lon: number
  name: string
  value?: string | number
}

interface MapLeafletProps {
  markers?: MapMarker[]
  center?: [number, number]
  zoom?: number
  className?: string
  title?: string
}

const props = withDefaults(defineProps<MapLeafletProps>(), {
  markers: () => [],
  center: () => [41.2044, 74.7661],
  zoom: 6,
  title: 'Map View'
})

const mapContainer = ref<HTMLElement | null>(null)
let map: any = null
let markerLayer: any = null

const initMap = async () => {
  if (!import.meta.client || !mapContainer.value) return

  const L = await import('leaflet')
  import('leaflet/dist/leaflet.css')

  // Fix Leaflet marker icon issue in Nuxt/Vite
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })

  map = L.map(mapContainer.value).setView(props.center, props.zoom)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  markerLayer = L.layerGroup().addTo(map)
  updateMarkers(L)
}

const updateMarkers = (L: any) => {
  if (!markerLayer || !L) return
  markerLayer.clearLayers()

  props.markers.forEach(marker => {
    const popupContent = `
      <div class="p-1">
        <strong class="text-sm">${marker.name}</strong>
        ${marker.value ? `<div class="text-xs text-muted-foreground mt-0.5">${marker.value}</div>` : ''}
      </div>
    `
    L.marker([marker.lat, marker.lon])
      .bindPopup(popupContent)
      .addTo(markerLayer)
  })
}

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})

// Watch for marker changes
watch(() => props.markers, async () => {
  if (map) {
    const L = await import('leaflet')
    updateMarkers(L)
  }
}, { deep: true })
</script>

<template>
  <div :class="cn('border border-border rounded-xl bg-card overflow-hidden flex flex-col', className)">
    <div v-if="title" class="p-3 border-b border-border flex items-center justify-between">
      <h3 class="text-sm font-semibold">{{ title }}</h3>
      <div class="flex gap-2">
        <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        <span class="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Live View</span>
      </div>
    </div>
    <div ref="mapContainer" class="flex-1 w-full h-[400px] z-0"></div>
  </div>
</template>

<style>
.leaflet-popup-content-wrapper {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border: 1px solid #e2e8f0;
}
.leaflet-popup-content {
  margin: 8px 12px;
}
.leaflet-container {
  font-family: inherit;
}
</style>
