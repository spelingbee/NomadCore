<script setup lang="ts">
import {
  Building2,
  Edit,
  Eye,
  MapPin,
  Mountain,
  Plus,
  Search,
  Trees,
  TrendingUp,
  Users,
  Waves,
} from 'lucide-vue-next'
import { mockDestinations, mockRegionalStats } from '~/data/mock-data'
import { Button } from '~/components/ui/button'
import SectionHeader from "../../components/shared/SectionHeader.vue";
import StatCard from "../../components/shared/StatCard.vue";
import MapPlaceholder from "../../components/shared/MapPlaceholder.vue";

definePageMeta({
  layout: 'admin',
})

const searchQuery = ref('')
const selectedRegion = ref<string | null>(null)

const categoryIcons = {
  Lake: Waves,
  Mountains: Mountain,
  Nature: Trees,
  City: Building2,
}

const filteredDestinations = computed(() => {
  return mockDestinations.filter(
    dest =>
      dest.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      || dest.region.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})
</script>

<template>
  <div class="space-y-6">
    <SectionHeader
      title="Destination Management"
      description="Manage tourism destinations across Kyrgyzstan"
    >
      <template #action>
        <Button class="gap-2">
          <Plus class="h-4 w-4" />
          Add Destination
        </Button>
      </template>
    </SectionHeader>

    <div class="grid gap-4 md:grid-cols-4">
      <StatCard
        label="Total Destinations"
        :value="mockDestinations.length"
      >
        <template #icon><MapPin class="h-4 w-4" /></template>
      </StatCard>
      <StatCard
        label="Active Regions"
        :value="mockRegionalStats.length"
      >
        <template #icon><MapPin class="h-4 w-4" /></template>
      </StatCard>
      <StatCard
        label="Total Visitors YTD"
        value="245K"
        change="+18%"
        change-type="positive"
      >
        <template #icon><Users class="h-4 w-4" /></template>
      </StatCard>
      <StatCard
        label="Avg Growth Rate"
        value="+15%"
      >
        <template #icon><TrendingUp class="h-4 w-4" /></template>
      </StatCard>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="bg-card border border-border rounded-xl overflow-hidden">
        <div class="p-4 border-b border-border">
          <h3 class="font-semibold">Regional Overview</h3>
        </div>
        <div class="p-4">
          <MapPlaceholder
            title="Kyrgyzstan Tourism Map"
            height="h-64"
            :markers="mockDestinations.map((d) => ({
              label: d.name,
              position: { x: Math.random() * 80 + 10, y: Math.random() * 60 + 20 },
            }))"
          />
        </div>
      </div>

      <div class="bg-card border border-border rounded-xl overflow-hidden">
        <div class="p-4 border-b border-border">
          <h3 class="font-semibold">Regional Statistics</h3>
        </div>
        <div class="p-4">
          <div class="space-y-3">
            <button
              v-for="region in mockRegionalStats"
              :key="region.region"
              type="button"
              @click="selectedRegion = region.region"
              class="w-full flex items-center justify-between p-3 rounded-lg border transition-colors text-left"
              :class="selectedRegion === region.region
                ? 'border-primary bg-primary/5'
                : 'border-border hover:bg-muted/50'"
            >
              <div>
                <p class="font-medium">{{ region.region }}</p>
                <p class="text-sm text-muted-foreground">
                  {{ region.destinations }} destinations
                </p>
              </div>
              <div class="text-right">
                <p class="font-semibold">
                  {{ (region.visitors / 1000).toFixed(0) }}K visitors
                </p>
                <p
                  class="text-sm"
                  :class="region.growth > 0 ? 'text-emerald-600' : 'text-red-600'"
                >
                  {{ region.growth > 0 ? '+' : '' }}{{ region.growth }}% growth
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-card border border-border rounded-xl overflow-hidden">
      <div class="p-4 border-b border-border flex flex-row items-center justify-between">
        <h3 class="font-semibold">All Destinations</h3>
        <div class="relative w-64">
          <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            v-model="searchQuery"
            placeholder="Search destinations..."
            class="w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-background text-sm"
          />
        </div>
      </div>
      <div class="p-4">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="destination in filteredDestinations"
            :key="destination.id"
            class="group relative overflow-hidden rounded-xl border bg-card"
          >
            <div class="aspect-[16/10] overflow-hidden bg-muted">
              <img
                :src="destination.image"
                :alt="destination.name"
                class="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div class="p-4">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <h3 class="font-semibold">{{ destination.name }}</h3>
                  <p class="text-sm text-muted-foreground">
                    {{ destination.region }}
                  </p>
                </div>
                <div class="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-0.5 rounded text-xs font-medium">
                  <component :is="categoryIcons[destination.category as keyof typeof categoryIcons]" class="h-3 w-3" />
                  {{ destination.category }}
                </div>
              </div>
              <div class="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                <span>{{ destination.properties }} properties</span>
                <span>{{ destination.experiences }} experiences</span>
              </div>
              <div class="mt-3 flex gap-2">
                <Button variant="outline" size="sm" class="flex-1 gap-1">
                  <Eye class="h-3 w-3" />
                  View
                </Button>
                <Button variant="outline" size="sm" class="flex-1 gap-1">
                  <Edit class="h-3 w-3" />
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
