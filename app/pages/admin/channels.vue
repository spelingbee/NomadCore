<script setup lang="ts">
import {
  Building2,
  DollarSign,
  Share2,
  TrendingUp,
} from 'lucide-vue-next'
import {
  bookings,
  channelMappings,
  channels,
  formatPrice,
  properties,
} from '~/data/mock-data'
import SectionHeader from "../../components/shared/SectionHeader.vue";
import KPIGrid from "../../components/shared/KPIGrid.vue";
import StatCard from "../../components/shared/StatCard.vue";
import ChannelBadge from "../../components/shared/ChannelBadge.vue";

definePageMeta({
  layout: 'admin',
})

const totalBookings = computed(() => bookings.length)
const totalRevenue = computed(() => bookings.reduce((sum, b) => sum + b.totalPrice, 0))

const channelStats = computed(() => {
  return channels.map((channel) => {
    const channelBookings = bookings.filter(b => b.channelId === channel.id)
    const revenue = channelBookings.reduce((sum, b) => sum + b.totalPrice, 0)
    const mappings = channelMappings.filter(m => m.channelId === channel.id && m.status === 'active')

    return {
      ...channel,
      bookings: channelBookings.length,
      revenue,
      percentage: Math.round((channelBookings.length / totalBookings.value) * 100),
      revenuePercentage: Math.round((revenue / totalRevenue.value) * 100),
      activeProperties: mappings.length,
    }
  })
})

const sortedChannelStats = computed(() =>
  [...channelStats.value].sort((a, b) => b.revenue - a.revenue),
)

const conicGradient = computed(() => {
  let accumulated = 0
  const stops = channelStats.value.map((channel) => {
    const start = accumulated
    accumulated += channel.percentage
    return `${channel.color} ${start}% ${accumulated}%`
  })
  return `conic-gradient(${stops.join(', ')})`
})
</script>

<template>
  <div class="space-y-6">
    <SectionHeader
      title="Channel Analytics"
      description="Distribution channel performance and inventory allocation"
    />

    <!-- KPIs -->
    <KPIGrid :columns="4">
      <StatCard
        label="Active Channels"
        :value="channels.length"
        change="All connected"
      >
        <template #icon><Share2 class="w-5 h-5" /></template>
      </StatCard>
      <StatCard
        label="Total Distributed Bookings"
        :value="totalBookings"
        change="+22% from last month"
        change-type="positive"
      >
        <template #icon><TrendingUp class="w-5 h-5" /></template>
      </StatCard>
      <StatCard
        label="Channel Revenue"
        :value="formatPrice(totalRevenue)"
        change="+18% from last month"
        change-type="positive"
      >
        <template #icon><DollarSign class="w-5 h-5" /></template>
      </StatCard>
      <StatCard
        label="Properties Distributed"
        :value="properties.length"
        change="Across all channels"
      >
        <template #icon><Building2 class="w-5 h-5" /></template>
      </StatCard>
    </KPIGrid>

    <!-- Channel Performance Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="channel in channelStats"
        :key="channel.id"
        class="bg-card border border-border rounded-xl p-4 flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center justify-between">
            <ChannelBadge :name="channel.name" :color="channel.color" />
            <span class="text-[10px] text-muted-foreground uppercase font-semibold">
              {{ channel.commission }}% comm.
            </span>
          </div>

          <div class="mt-4 space-y-4">
            <div>
              <p class="text-xs text-muted-foreground">Bookings</p>
              <div class="flex items-baseline gap-2">
                <span class="text-2xl font-bold">{{ channel.bookings }}</span>
                <span class="text-xs text-muted-foreground">({{ channel.percentage }}%)</span>
              </div>
            </div>

            <div>
              <p class="text-xs text-muted-foreground">Revenue</p>
              <p class="font-semibold">{{ formatPrice(channel.revenue) }}</p>
            </div>

            <div>
              <p class="text-xs text-muted-foreground">Active Listings</p>
              <p class="text-sm font-medium">{{ channel.activeProperties }} properties</p>
            </div>
          </div>
        </div>

        <!-- Visual bar -->
        <div class="mt-4 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-1000"
            :style="{
              width: `${channel.percentage}%`,
              backgroundColor: channel.color
            }"
          ></div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Channel Distribution Chart -->
      <div class="bg-card border border-border rounded-xl p-6">
        <SectionHeader title="Booking Distribution" description="Share of bookings by channel" />
        <div class="mt-8 flex flex-col sm:flex-row items-center gap-8">
          <!-- Donut chart placeholder -->
          <div
            class="w-48 h-48 rounded-full relative flex items-center justify-center shadow-inner"
            :style="{ background: conicGradient }"
          >
            <div class="w-32 h-32 bg-card rounded-full shadow-sm flex items-center justify-center">
              <div class="text-center">
                <p class="text-2xl font-bold">{{ totalBookings }}</p>
                <p class="text-[10px] text-muted-foreground uppercase">Total</p>
              </div>
            </div>
          </div>

          <!-- Legend -->
          <div class="flex-1 w-full space-y-3">
            <div v-for="channel in channelStats" :key="channel.id" class="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <div
                class="w-3 h-3 rounded-full shadow-sm"
                :style="{ backgroundColor: channel.color }"
              ></div>
              <span class="flex-1 text-sm font-medium">{{ channel.name }}</span>
              <span class="text-sm text-muted-foreground">{{ channel.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Revenue by Channel -->
      <div class="bg-card border border-border rounded-xl p-6">
        <SectionHeader title="Revenue by Channel" />
        <div class="mt-6 space-y-5">
          <div v-for="channel in sortedChannelStats" :key="channel.id">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <ChannelBadge :name="channel.name" :color="channel.color" />
              </div>
              <span class="font-bold text-sm">{{ formatPrice(channel.revenue) }}</span>
            </div>
            <div class="h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-1000"
                :style="{
                  width: `${channel.revenuePercentage}%`,
                  backgroundColor: channel.color
                }"
              ></div>
            </div>
            <p class="text-[10px] text-muted-foreground mt-1.5 font-medium uppercase tracking-wider">
              {{ channel.revenuePercentage }}% of total revenue
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Channel Strategy -->
    <div class="bg-primary/5 border border-primary/20 rounded-xl p-6">
      <h3 class="font-bold text-primary mb-3 flex items-center gap-2">
        <TrendingUp class="w-4 h-4" />
        Distribution Strategy Recommendations
      </h3>
      <ul class="space-y-3 text-sm text-muted-foreground">
        <li class="flex items-start gap-2">
          <div class="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
          <span>Direct channel shows highest margin. Consider <strong>loyalty programs</strong> to increase direct bookings and reduce commission costs.</span>
        </li>
        <li class="flex items-start gap-2">
          <div class="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
          <span>MTravel drives significant volume. Negotiate <strong>commission rates</strong> for high-performing partners to maintain competitive pricing.</span>
        </li>
        <li class="flex items-start gap-2">
          <div class="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
          <span>Kettik has strong local reach. Expand <strong>domestic tourism campaigns</strong> through this channel to capture the growing local market.</span>
        </li>
        <li class="flex items-start gap-2">
          <div class="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
          <span>Tunduk Travel targeting international visitors. Increase <strong>premium inventory allocation</strong> to attract high-value international travelers.</span>
        </li>
      </ul>
    </div>
  </div>
</template>
