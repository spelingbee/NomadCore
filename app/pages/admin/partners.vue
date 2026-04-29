<script setup lang="ts">
import { Building2, CheckCircle, TrendingUp, Users } from 'lucide-vue-next'
import {
  formatDate,
  formatPrice,
  partners,
} from '~/data/mock-data'
import StatCard from "../../components/shared/StatCard.vue";
import KPIGrid from "../../components/shared/KPIGrid.vue";
import SectionHeader from "../../components/shared/SectionHeader.vue";
import DataTable from "../../components/shared/DataTable.vue";

definePageMeta({
  layout: 'admin',
})

const verifiedPartners = computed(() => partners.filter(p => p.verified))
const totalRevenue = computed(() => partners.reduce((sum, p) => sum + p.stats.revenue, 0))
const totalBookings = computed(() => partners.reduce((sum, p) => sum + p.stats.bookings, 0))

const partnerTypeLabels: Record<string, string> = {
  yurt_camp: 'Yurt Camp',
  guest_house: 'Guest House',
  tour_operator: 'Tour Operator',
  park_admin: 'Park Admin',
  rest_point: 'Rest Point',
}

const partnersByType = computed(() => {
  return Object.entries(partnerTypeLabels).map(([type, label]) => ({
    type,
    label,
    count: partners.filter(p => p.type === type).length,
  }))
})

const topPartners = computed(() => {
  return [...partners]
    .sort((a, b) => b.stats.revenue - a.stats.revenue)
    .slice(0, 5)
})

const columns = [
  { key: 'name', header: 'Partner' },
  { key: 'status', header: 'Status' },
  { key: 'joined', header: 'Joined' },
  { key: 'properties', header: 'Properties' },
  { key: 'bookings', header: 'Bookings' },
  { key: 'revenue', header: 'Revenue' },
]

const growthData = [
  { month: 'Jan', height: 20 },
  { month: 'Feb', height: 35 },
  { month: 'Mar', height: 45 },
  { month: 'Apr', height: 60 },
  { month: 'May', height: 75 },
  { month: 'Jun', height: 90 },
]
</script>

<template>
  <div class="space-y-6">
    <SectionHeader
      title="Partner Analytics"
      description="Overview of tourism partners and their performance"
    />

    <!-- KPIs -->
    <KPIGrid :columns="4">
      <StatCard
        label="Total Partners"
        :value="partners.length"
        :change="`${verifiedPartners.length} verified`"
      >
        <template #icon><Users class="w-5 h-5" /></template>
      </StatCard>
      <StatCard
        label="Verified Partners"
        :value="verifiedPartners.length"
        :change="`${Math.round((verifiedPartners.length / partners.length) * 100)}% verification rate`"
        change-type="positive"
      >
        <template #icon><CheckCircle class="w-5 h-5" /></template>
      </StatCard>
      <StatCard
        label="Total Bookings"
        :value="totalBookings.toLocaleString()"
        change="+28% from last quarter"
        change-type="positive"
      >
        <template #icon><TrendingUp class="w-5 h-5" /></template>
      </StatCard>
      <StatCard
        label="Total Revenue"
        :value="formatPrice(totalRevenue)"
      >
        <template #icon><Building2 class="w-5 h-5" /></template>
      </StatCard>
    </KPIGrid>

    <!-- Partner Type Distribution -->
    <div class="bg-card border border-border rounded-xl p-4">
      <SectionHeader title="Partner Distribution" description="By business type" />
      <div class="mt-4 grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div
          v-for="stat in partnersByType"
          :key="stat.type"
          class="p-4 bg-muted/50 rounded-lg text-center"
        >
          <p class="text-2xl font-bold">{{ stat.count }}</p>
          <p class="text-xs text-muted-foreground mt-1">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <!-- Top Partners -->
    <div class="bg-card border border-border rounded-xl p-4">
      <SectionHeader title="Top Partners by Revenue" />
      <div class="mt-4 space-y-3">
        <div
          v-for="(partner, i) in topPartners"
          :key="partner.id"
          class="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
        >
          <span class="text-lg font-bold text-muted-foreground w-6">#{{ i + 1 }}</span>
          <div class="flex-1">
            <p class="font-medium">{{ partner.name }}</p>
            <p class="text-xs text-muted-foreground">{{ partnerTypeLabels[partner.type] }}</p>
          </div>
          <div class="text-right">
            <p class="font-medium">{{ formatPrice(partner.stats.revenue) }}</p>
            <p class="text-xs text-muted-foreground">{{ partner.stats.bookings }} bookings</p>
          </div>
        </div>
      </div>
    </div>

    <!-- All Partners Table -->
    <div class="bg-card border border-border rounded-xl p-4">
      <SectionHeader title="All Partners" />
      <div class="mt-4">
        <DataTable
          :columns="columns"
          :data="partners"
         key-extractor="">
          <template #cell-name="{ item }">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <span class="font-medium text-muted-foreground">{{ item.name.charAt(0) }}</span>
              </div>
              <div>
                <p class="font-medium">{{ item.name }}</p>
                <p class="text-xs text-muted-foreground">{{ partnerTypeLabels[item.type] }}</p>
              </div>
            </div>
          </template>

          <template #cell-status="{ item }">
            <span
              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
              :class="item.verified
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'"
            >
              {{ item.verified ? 'Verified' : 'Pending' }}
            </span>
          </template>

          <template #cell-joined="{ item }">
            <span class="text-sm text-muted-foreground">{{ formatDate(item.joinedDate) }}</span>
          </template>

          <template #cell-properties="{ item }">
            <span class="text-sm">{{ item.stats.properties }}</span>
          </template>

          <template #cell-bookings="{ item }">
            <span class="text-sm font-medium">{{ item.stats.bookings }}</span>
          </template>

          <template #cell-revenue="{ item }">
            <span class="font-medium">{{ formatPrice(item.stats.revenue) }}</span>
          </template>
        </DataTable>
      </div>
    </div>

    <!-- Growth Metrics -->
    <div class="bg-card border border-border rounded-xl p-4">
      <SectionHeader title="Partner Growth" description="New registrations over time" />
      <div class="mt-4 grid grid-cols-6 gap-4">
        <div v-for="stat in growthData" :key="stat.month" class="flex flex-col items-center">
          <div class="w-full h-24 bg-muted/30 rounded-lg relative overflow-hidden">
            <div
              class="absolute bottom-0 left-0 right-0 bg-primary/40 rounded-t-sm transition-all duration-1000"
              :style="{ height: `${stat.height}%` }"
            ></div>
          </div>
          <p class="text-xs text-muted-foreground mt-2">{{ stat.month }}</p>
        </div>
      </div>
      <p class="text-sm text-muted-foreground mt-4 text-center">
        +{{ Math.round((partners.length / 3) * 100) }}% partner growth in 2024
      </p>
    </div>
  </div>
</template>
