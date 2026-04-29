<script setup lang="ts">
import { Calendar, Map, TrendingUp, Users } from 'lucide-vue-next'
import {
  bookings,
  channels,
  destinations,
  formatPrice,
  partners,
} from '~/data/mock-data'
import InsightCard from "../../components/shared/InsightCard.vue";
import SectionHeader from "../../components/shared/SectionHeader.vue";
import MapPlaceholder from "../../components/shared/MapPlaceholder.vue";
import StatCard from "../../components/shared/StatCard.vue";
import KPIGrid from "../../components/shared/KPIGrid.vue";
import MapLeaflet from "../../components/shared/MapLeaflet.vue";

definePageMeta({
  layout: 'admin',
})

const { t } = useI18n()

const totalRevenue = computed(() =>
  destinations.reduce((sum, d) => sum + d.stats.revenue, 0),
)

const totalBookings = computed(() =>
  destinations.reduce((sum, d) => sum + d.stats.bookings, 0),
)

const activePartners = computed(() =>
  partners.filter(p => p.verified).length,
)

const channelStats = computed(() => {
  return channels.map((channel) => {
    const bookingCount = bookings.filter(b => b.channelId === channel.id).length
    const percentage = Math.round((bookingCount / bookings.length) * 100)
    return { ...channel, bookingCount, percentage }
  })
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold">{{ t('government.title') }}</h1>
      <p class="text-muted-foreground">{{ t('government.description') }}</p>
    </div>

    <!-- KPIs -->
    <KPIGrid :columns="4">
      <StatCard
        :label="t('government.kpis.destinations')"
        :value="destinations.length"
        change="Active regions"
      >
        <template #icon><Map class="w-5 h-5" /></template>
      </StatCard>
      <StatCard
        :label="t('government.kpis.bookings')"
        :value="totalBookings.toLocaleString()"
        change="+23% from last quarter"
        change-type="positive"
      >
        <template #icon><Calendar class="w-5 h-5" /></template>
      </StatCard>
      <StatCard
        :label="t('government.kpis.revenue')"
        :value="formatPrice(totalRevenue)"
        change="+18% from last quarter"
        change-type="positive"
      >
        <template #icon><TrendingUp class="w-5 h-5" /></template>
      </StatCard>
      <StatCard
        :label="t('government.kpis.partners')"
        :value="activePartners"
        :change="`${partners.length} total registered`"
      >
        <template #icon><Users class="w-5 h-5" /></template>
      </StatCard>
    </KPIGrid>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Real Map -->
      <MapLeaflet
        :title="t('government.map_title')"
        :markers="destinations.map(d => ({ 
          name: d.name, 
          lat: d.lat, 
          lon: d.lon, 
          value: `${d.stats.bookings} ${t('bookings.title').toLowerCase()}` 
        }))"
        class="h-[450px]"
      />

      <!-- Revenue by Destination -->
      <div class="bg-card border border-border rounded-xl p-4">
        <SectionHeader :title="t('government.revenue_by_dest')" />
        <div class="mt-4 space-y-4">
          <div v-for="dest in destinations" :key="dest.id">
            <div class="flex items-center justify-between text-sm mb-1">
              <span class="font-medium">{{ dest.name }}</span>
              <span>{{ formatPrice(dest.stats.revenue) }}</span>
            </div>
            <div class="h-2 bg-muted rounded-full overflow-hidden">
              <div
                class="h-full bg-primary rounded-full transition-all duration-1000"
                :style="{ width: `${Math.round((dest.stats.revenue / totalRevenue) * 100)}%` }"
              ></div>
            </div>
            <p class="text-xs text-muted-foreground mt-1">
              {{ Math.round((dest.stats.revenue / totalRevenue) * 100) }}% of total
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Occupancy Trends -->
    <div class="bg-card border border-border rounded-xl p-4">
      <SectionHeader :title="t('government.occupancy_trends')" :description="t('government.occupancy_desc')" />
      <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="dest in destinations" :key="dest.id" class="p-4 bg-muted/50 rounded-lg">
          <h4 class="font-medium">{{ dest.name }}</h4>
          <div class="flex items-end gap-2 mt-2">
            <span class="text-3xl font-bold">{{ dest.stats.occupancy }}%</span>
            <span class="text-sm text-emerald-600 mb-1">+5%</span>
          </div>
          <p class="text-xs text-muted-foreground mt-1">
            {{ dest.stats.bookings }} bookings this quarter
          </p>
        </div>
      </div>
    </div>

    <!-- Channel Distribution -->
    <div class="bg-card border border-border rounded-xl p-4">
      <SectionHeader :title="t('government.channel_dist')" />
      <div class="mt-4 flex flex-wrap gap-4">
        <div
          v-for="stat in channelStats"
          :key="stat.id"
          class="flex-1 min-w-[150px] p-4 border border-border rounded-lg"
        >
          <div class="flex items-center gap-2 mb-2">
            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: stat.color }"></div>
            <span class="text-sm font-medium">{{ stat.name }}</span>
          </div>
          <p class="text-2xl font-bold mt-2">{{ stat.bookingCount }}</p>
          <p class="text-xs text-muted-foreground">{{ stat.percentage }}% of bookings</p>
        </div>
      </div>
    </div>

    <!-- AI Insights -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InsightCard
        title="Demand Forecast"
        insight="Based on historical data, expect 35% higher bookings in Song-Kul during July weekends. Consider infrastructure scaling."
        type="info"
      />
      <InsightCard
        title="Revenue Opportunity"
        insight="Sary-Chelek has 62% occupancy but lower revenue. Recommend premium package development for eco-tourism segment."
        type="success"
      />
    </div>
  </div>
</template>
