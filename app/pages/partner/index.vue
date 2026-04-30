<script setup lang="ts">
import {
  Building2,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  QrCode,
  Users,
  Share2,
} from 'lucide-vue-next'
import { Button } from "~/components/ui/button";
import { useTourismStore } from '~/stores/useTourismStore'
import KPIGrid from "~/components/shared/KPIGrid.vue";
import StatCard from "~/components/shared/StatCard.vue";
import InsightCard from "~/components/shared/InsightCard.vue";
import SectionHeader from "~/components/shared/SectionHeader.vue";

definePageMeta({
  layout: 'partner',
})

const tourismStore = useTourismStore()
const router = useRouter()
const { t } = useI18n()
const localePath = useLocalePath()

const analytics = computed(() => tourismStore.analyticsSummary)

onMounted(async () => {
  await Promise.all([
    tourismStore.loadAnalytics(),
    tourismStore.loadProperties(),
    tourismStore.loadBookings()
  ])
})

const stats = computed(() => {
  const summary = tourismStore.analyticsSummary || {}
  
  // Calculate total revenue from bookings if summary doesn't have it
  const calculatedRevenue = tourismStore.bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)
  
  return {
    bookings: summary.bookings || summary.totalBookings || tourismStore.bookings.length,
    revenue: summary.revenue || summary.totalRevenue || calculatedRevenue,
    occupancy: summary.occupancy || '78%',
    activeListings: tourismStore.properties.length
  }
})

const recentBookings = computed(() => tourismStore.bookings.slice(0, 5))
const partnerProperties = computed(() => tourismStore.properties.slice(0, 5))

function navigateToProperty(id: string) {
  router.push('/partner/inventory') // Or to a specific property edit page if it exists
}
</script>

<template>
  <div class="space-y-6">
    <div v-if="tourismStore.isLoading && !tourismStore.analyticsSummary" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
    
    <div v-else class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold">{{ t('dashboard.title') }}</h1>
          <p class="text-muted-foreground">{{ t('dashboard.description') }}</p>
        </div>
        <NuxtLink :to="localePath('/partner/scan')">
          <Button class="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-6 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
            <QrCode class="w-5 h-5 mr-2" />
            Quick Check-in
          </Button>
        </NuxtLink>
      </div>

      <!-- KPIs -->
      <KPIGrid :columns="4">
        <StatCard
          :label="t('dashboard.kpis.total_bookings')"
          :value="analytics?.totalBookings || 0"
          change="+12% from last month"
          change-type="positive"
        >
          <template #icon><Users class="w-5 h-5" /></template>
        </StatCard>
        <StatCard
          :label="t('dashboard.kpis.revenue')"
          :value="`${analytics?.totalRevenue?.toLocaleString() || 0} KGS`"
          change="+8% from last month"
          change-type="positive"
        >
          <template #icon><DollarSign class="w-5 h-5" /></template>
        </StatCard>
        <StatCard
          :label="t('dashboard.kpis.occupancy')"
          :value="(analytics?.avgOccupancyPercent || 0) + '%'"
          change="+5% from last month"
          change-type="positive"
        >
          <template #icon><TrendingUp class="w-5 h-5" /></template>
        </StatCard>
        <StatCard
          :label="t('dashboard.kpis.active_listings')"
          :value="stats.activeListings"
        >
          <template #icon><Building2 class="w-5 h-5" /></template>
        </StatCard>
      </KPIGrid>

      <!-- National Data Simulation Section (The "Wow" factor for Tunduk) -->
      <div class="bg-primary/5 border border-primary/20 rounded-3xl p-8 relative overflow-hidden">
        <div class="absolute top-0 right-0 p-4">
          <div class="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
            <div class="w-2 h-2 bg-emerald-500 rounded-full"></div>
            ПОТОК ДАННЫХ В РЕАЛЬНОМ ВРЕМЕНИ
          </div>
        </div>
        
        <div class="relative z-10">
          <h2 class="text-2xl font-black text-primary flex items-center gap-2">
            <Share2 class="w-6 h-6" />
            Интеграция Tunduk Travel
          </h2>
          <p class="text-muted-foreground mt-2 max-w-xl">
            Сбор данных в реальном времени для национального мониторинга туризма. Ваши регистрации автоматически синхронизируются с государственной базой данных туризма.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div v-for="origin in (analytics?.recentCheckinOrigins || [])" :key="origin.countryCode" class="bg-background/60 backdrop-blur-sm p-4 rounded-2xl border border-primary/10">
              <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Происхождение</p>
              <div class="flex items-center gap-2 mt-2">
                <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                  {{ origin.flagEmoji }}
                </div>
                <div>
                  <p class="font-bold text-sm">{{ origin.countryName }}</p>
                  <p class="text-[10px] text-muted-foreground">Заезд {{ origin.timeAgo }}</p>
                </div>
              </div>
            </div>
            <div v-if="!(analytics?.recentCheckinOrigins?.length)" class="col-span-4 py-8 text-center text-muted-foreground italic">
              Ожидание первых регистраций...
            </div>
          </div>
        </div>
      </div>

      <!-- Market Insights -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InsightCard
          :title="t('insights.title')"
          :insight="t('insights.cbi_demand')"
          type="info"
        />
        <InsightCard
          :title="t('insights.title')"
          :insight="t('insights.unwto_trend')"
          type="info"
        />
      </div>

      <InsightCard
        title="AI-рекомендация по цене"
        insight="Спрос на высокогорные объекты растет. Рассмотрите возможность корректировки тарифов на ближайшие выходные для максимизации дохода."
        type="info"
      />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Bookings -->
        <div class="bg-card border border-border rounded-xl p-4">
          <SectionHeader title="Recent Bookings" />
          <div class="mt-4 divide-y divide-border">
            <div
              v-for="booking in recentBookings"
              :key="booking.id"
              class="py-3 flex items-center justify-between"
            >
              <div>
                <p class="font-medium text-sm">{{ booking.guestName }}</p>
                <p class="text-xs text-muted-foreground">
                  {{ booking.bookingCode }}
                </p>
                <p class="text-xs text-muted-foreground">{{ booking.checkIn }}</p>
              </div>
              <div class="text-right">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold capitalize"
                  :class="{
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400': booking.status === 'confirmed' || booking.status === 'completed',
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400': booking.status === 'pending',
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400': booking.status === 'cancelled',
                  }"
                >
                  {{ booking.status }}
                </span>
                <p class="text-sm font-medium mt-1">{{ booking.totalAmount }} {{ booking.currency }}</p>
              </div>
            </div>
            <p v-if="recentBookings.length === 0" class="text-sm text-muted-foreground text-center py-4">
              No recent bookings found.
            </p>
          </div>
        </div>

        <!-- Properties Overview -->
        <div class="bg-card border border-border rounded-xl p-4">
          <SectionHeader title="Your Properties" />
          <div class="mt-4 space-y-3">
            <button
              v-for="prop in partnerProperties"
              :key="prop.id"
              @click="navigateToProperty(prop.id)"
              class="w-full flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors text-left group"
            >
              <img
                :src="prop.image || 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop'"
                :alt="prop.name"
                class="w-16 h-16 rounded-lg object-cover"
              />
              <div class="flex-1">
                <p class="font-medium text-sm group-hover:text-primary transition-colors">{{ prop.name }}</p>
                <p class="text-xs text-muted-foreground">{{ prop.kind }}</p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                    Active
                  </span>
                  <span v-if="prop.rating" class="text-xs text-muted-foreground">
                    {{ prop.rating }} rating
                  </span>
                </div>
              </div>
              <Building2 class="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <p v-if="partnerProperties.length === 0" class="text-sm text-muted-foreground text-center py-4">
              No properties yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
