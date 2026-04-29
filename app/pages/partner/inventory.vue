<script setup lang="ts">
import { ChevronLeft, ChevronRight, Settings } from 'lucide-vue-next'
import { useTourismStore } from '~/stores/useTourismStore'
import { useApiService } from '~/services/api.service'
import { cn } from '~/lib/utils'
import SectionHeader from "~/components/shared/SectionHeader.vue";
import Drawer from "~/components/shared/Drawer.vue";

definePageMeta({
  layout: 'partner',
})

const { t } = useI18n()
const localePath = useLocalePath()
const tourismStore = useTourismStore()
const api = useApiService()

const selectedPropertyId = ref<string | null>(null)
const partnerProperties = computed(() => tourismStore.properties)

onMounted(async () => {
  await tourismStore.loadMyProperties()
  if (partnerProperties.value.length > 0) {
    selectedPropertyId.value = partnerProperties.value[0].id
  }
})

// Load rate plans when property changes
watch(selectedPropertyId, async (newId) => {
  if (newId) {
    await tourismStore.loadUnitTypes({ propertyId: newId })
  }
}, { immediate: true })


const relevantUnitTypes = computed(() => {
  if (selectedPropertyId.value) {
    return tourismStore.unitTypes.filter(u => u.propertyId === selectedPropertyId.value || u.property_id === selectedPropertyId.value)
  }
  return tourismStore.unitTypes
})

// Generate 7 days starting from today
const dates = computed(() => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return date.toISOString().split('T')[0]
  })
})

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return {
    weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
    day: d.getDate(),
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <SectionHeader
        :title="t('inventory.title')"
        :description="t('inventory.description')"
      />
      <NuxtLink :to="localePath('/partner/properties/my')">
        <Button variant="outline" size="sm">
          <Settings class="w-4 h-4 mr-2" />
          {{ t('inventory.manage_properties') }}
        </Button>
      </NuxtLink>
    </div>

    <!-- Property Filter -->
    <div class="flex gap-2 flex-wrap" v-if="partnerProperties.length > 0">
      <Button
        v-for="prop in partnerProperties"
        :key="prop.id"
        :variant="selectedPropertyId === prop.id ? 'default' : 'outline'"
        size="sm"
        @click="selectedPropertyId = prop.id"
      >
        {{ prop.name }}
      </Button>
    </div>

    <div v-if="tourismStore.isLoading" class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <template v-else>
      <!-- Date Navigation -->
      <div class="flex items-center justify-between bg-card p-4 rounded-xl border border-border">
        <Button variant="outline" size="sm">
          <ChevronLeft class="w-4 h-4" />
        </Button>
        <span class="font-bold text-sm">Upcoming 7 Days</span>
        <Button variant="outline" size="sm">
          <ChevronRight class="w-4 h-4" />
        </Button>
      </div>

      <!-- Inventory Table -->
      <div class="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[800px]">
            <thead>
              <tr class="bg-muted/50 border-b border-border">
                <th class="px-6 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-64">
                  Rate Plan
                </th>
                <th
                  v-for="date in dates"
                  :key="date"
                  class="px-2 py-4 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest w-28"
                >
                  <div>{{ formatDate(date).weekday }}</div>
                  <div class="text-lg font-black text-foreground mt-0.5">
                    {{ formatDate(date).day }}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr v-for="unit in relevantUnitTypes" :key="unit.id" class="group hover:bg-muted/30 transition-colors">
                <td class="px-6 py-4">
                  <p class="font-bold text-sm">{{ unit.name }}</p>
                  <p class="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                    {{ tourismStore.properties.find(p => p.id === (unit.propertyId || unit.property_id))?.name }}
                  </p>
                </td>
                <td
                  v-for="date in dates"
                  :key="date"
                  class="px-2 py-4 text-center transition-colors"
                >
                  <div class="text-base font-black mb-1 text-emerald-600">
                    {{ unit.availableQty || unit.totalQty || 5 }}
                  </div>
                  <div class="text-[11px] font-bold text-muted-foreground leading-none">
                    {{ unit.retailRate || unit.basePrice || 0 }} {{ unit.currency || 'KGS' }}
                  </div>
                </td>
              </tr>
              <tr v-if="relevantUnitTypes.length === 0">
                <td colspan="8" class="px-6 py-10 text-center text-muted-foreground italic">
                  No rate plans found for this property.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <!-- Bulk Actions -->
    <div class="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h3 class="font-bold text-sm mb-6 uppercase tracking-widest text-muted-foreground">Bulk Update</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="space-y-2">
          <label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Date Range</label>
          <input
            type="text"
            placeholder="Select range"
            class="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-sm font-medium outline-none"
          />
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">New Rate</label>
          <input
            type="number"
            placeholder="KGS"
            class="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-sm font-medium outline-none"
          />
        </div>
        <div class="space-y-2">
          <label class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Availability</label>
          <input
            type="number"
            placeholder="Units"
            class="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-sm font-medium outline-none"
          />
        </div>
        <div class="flex items-end">
          <Button class="w-full h-[42px] font-bold uppercase tracking-widest text-xs">Update All</Button>
        </div>
      </div>
    </div>
  </div>
</template>
