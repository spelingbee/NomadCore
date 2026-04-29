<script setup lang="ts">
import { Search, X } from 'lucide-vue-next'
import { tourPackages } from '~/data/mock-data'
import { useTourismStore } from '~/stores/useTourismStore'

definePageMeta({
  layout: 'traveler',
})

const router = useRouter()

const tourismStore = useTourismStore()

const query = ref('')
const activeFilter = ref('All')
const filters = ['All', 'Destinations', 'Properties', 'Packages']

onMounted(async () => {
  await Promise.all([
    tourismStore.loadPlaces(),
    tourismStore.loadProperties()
  ])
})

const filteredDestinations = computed(() => {
  return tourismStore.places.filter(d =>
    d.name.toLowerCase().includes(query.value.toLowerCase()) ||
    d.region.toLowerCase().includes(query.value.toLowerCase())
  )
})

const filteredProperties = computed(() => {
  return tourismStore.properties.filter(p =>
    p.name.toLowerCase().includes(query.value.toLowerCase())
  )
})

const filteredPackages = computed(() => {
  return tourismStore.packages.filter(p =>
    p.name.toLowerCase().includes(query.value.toLowerCase())
  )
})

const showDestinations = computed(() => activeFilter.value === 'All' || activeFilter.value === 'Destinations')
const showProperties = computed(() => activeFilter.value === 'All' || activeFilter.value === 'Properties')
const showPackages = computed(() => activeFilter.value === 'All' || activeFilter.value === 'Packages')

function onDestinationClick(id: string) {
  router.push(`/traveler/destination/${id}`)
}

function onPackageClick(id: string) {
  router.push(`/traveler/package/${id}`)
}

function onPropertyClick(id: string) {
  router.push(`/traveler/property/${id}`)
}
</script>

<template>
  <div class="min-h-screen pt-4 lg:pt-20 px-4 pb-8 max-w-6xl mx-auto">
    <!-- Search Input -->
    <div class="relative mb-4">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
      <input
        v-model="query"
        type="text"
        placeholder="Search destinations, stays, packages..."
        class="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      <button
        v-if="query"
        type="button"
        @click="query = ''"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Filters -->
    <div class="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4">
      <SharedFilterChip
        v-for="filter in filters"
        :key="filter"
        :label="filter"
        :active="activeFilter === filter"
        @click="activeFilter = filter"
      />
    </div>

    <!-- Results -->
    <div class="space-y-8">
      <section v-if="showDestinations && filteredDestinations.length > 0">
        <SharedSectionHeader title="Destinations" />
        <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <TravelerDestinationCard
            v-for="dest in filteredDestinations"
            :key="dest.id"
            :destination="dest"
            variant="compact"
            @click="onDestinationClick(dest.id)"
          />
        </div>
      </section>

      <section v-if="showPackages && filteredPackages.length > 0">
        <SharedSectionHeader title="Packages" />
        <div class="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TravelerPackageCard
            v-for="pkg in filteredPackages"
            :key="pkg.id"
            :pkg="pkg"
            @click="onPackageClick(pkg.id)"
          />
        </div>
      </section>

      <section v-if="showProperties && filteredProperties.length > 0">
        <SharedSectionHeader title="Properties" />
        <div class="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <TravelerPropertyCard
            v-for="prop in filteredProperties"
            :key="prop.id"
            :property="prop"
            :unit-types="tourismStore.getUnitTypesByProperty(prop.id)"
            @click="onPropertyClick(prop.id)"
          />
        </div>
      </section>

      <div v-if="query && filteredDestinations.length === 0 && filteredProperties.length === 0 && filteredPackages.length === 0" class="text-center py-12">
        <p class="text-muted-foreground">No results found for "{{ query }}"</p>
      </div>
    </div>
  </div>
</template>
