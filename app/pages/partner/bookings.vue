<script setup lang="ts">
import { useTourismStore } from '~/stores/useTourismStore'
import SectionHeader from "../../components/shared/SectionHeader.vue";
import FilterChip from "../../components/shared/FilterChip.vue";
import DataTable from "../../components/shared/DataTable.vue";
import StatusBadge from "../../components/shared/StatusBadge.vue";

definePageMeta({
  layout: 'partner',
})

const tourismStore = useTourismStore()
const { t } = useI18n()

onMounted(async () => {
  await tourismStore.loadBookings()
})

const statusFilters = ['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled']
const activeFilter = ref('All')

const filteredBookings = computed(() => {
  if (activeFilter.value === 'All') return tourismStore.bookings
  return tourismStore.bookings.filter(b => b.status === activeFilter.value.toLowerCase())
})

const columns = computed(() => [
  { key: 'code', header: t('bookings.columns.booking') },
  { key: 'item', header: t('bookings.columns.details') },
  { key: 'dates', header: t('bookings.columns.dates') },
  { key: 'status', header: t('bookings.columns.status') },
  { key: 'total', header: t('bookings.columns.total') },
])

const stats = computed(() => [
  { label: t('bookings.stats.total'), value: tourismStore.bookings.length, color: 'text-foreground' },
  { label: t('bookings.stats.confirmed'), value: tourismStore.bookings.filter(b => b.status === 'confirmed').length, color: 'text-emerald-600' },
  { label: t('bookings.stats.pending'), value: tourismStore.bookings.filter(b => b.status === 'pending').length, color: 'text-amber-600' },
  { label: t('bookings.stats.revenue'), value: `${tourismStore.bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)} KGS`, color: 'text-foreground' },
])
</script>

<template>
  <div class="space-y-6">
    <SectionHeader
      :title="t('bookings.title')"
      :description="t('bookings.description')"
    />

    <!-- Filters -->
    <div class="flex gap-2 flex-wrap">
      <FilterChip
        v-for="filter in statusFilters"
        :key="filter"
        :label="filter"
        :active="activeFilter === filter"
        @click="activeFilter = filter"
      />
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-card border border-border rounded-xl p-4 shadow-sm"
      >
        <p class="text-xs font-bold text-muted-foreground uppercase tracking-widest">{{ stat.label }}</p>
        <p class="text-2xl font-black mt-2" :class="stat.color">{{ stat.value }}</p>
      </div>
    </div>

    <div v-if="tourismStore.isLoading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <!-- Bookings Table -->
    <div v-else class="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      <DataTable
        :columns="columns"
        :data="filteredBookings"
        empty-message="No bookings found"
        :key-extractor="(item: any) => item.id">
        <template #cell-code="{ item }">
          <div>
            <p class="font-bold text-sm">{{ item.bookingCode }}</p>
            <p class="text-[10px] text-muted-foreground font-medium uppercase">{{ item.guestName }}</p>
          </div>
        </template>

        <template #cell-item="{ item }">
          <div>
            <p class="text-sm font-medium">
              Rate Plan ID: {{ item.ratePlanId }}
            </p>
            <p class="text-[10px] text-muted-foreground uppercase tracking-tight font-bold">
              {{ item.guestEmail }}
            </p>
          </div>
        </template>

        <template #cell-dates="{ item }">
          <div class="text-xs">
            <p class="font-bold text-foreground">{{ item.checkIn }}</p>
            <p class="text-muted-foreground">to {{ item.checkOut }}</p>
          </div>
        </template>

        <template #cell-status="{ item }">
          <StatusBadge :status="item.status" variant="booking" />
        </template>

        <template #cell-total="{ item }">
          <span class="font-black text-sm">{{ item.totalAmount }} {{ item.currency }}</span>
        </template>
      </DataTable>
    </div>
  </div>
</template>
