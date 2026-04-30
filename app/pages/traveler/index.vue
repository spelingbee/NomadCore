<script setup lang="ts">
import { ChevronRight, Search } from 'lucide-vue-next'
import { tourPackages } from '~/data/mock-data'
import { useTourismStore } from '~/stores/useTourismStore'

definePageMeta({
  layout: 'traveler',
})

const router = useRouter()
const authStore = useAuthStore()
const tourismStore = useTourismStore()

const categories = ['All', 'Yurts', 'Guest Houses', 'Rest Points', 'National Parks', 'Experiences']

onMounted(async () => {
  await Promise.all([
    tourismStore.loadPlaces(),
    tourismStore.loadProperties()
  ])
})

function onLogout() {
  authStore.logout()
  router.push('/traveler')
}

function onDestinationClick(id: string) {
  router.push(`/traveler/destination/${id}`)
}

function onPackageClick(id: string) {
  router.push(`/traveler/package/${id}`)
}

function onPropertyClick(id: string) {
  router.push(`/traveler/property/${id}`)
}

function onSearchClick() {
  router.push('/traveler/search')
}
</script>

<template>
  <div class="min-h-screen">

    <!-- Hero Section -->
    <div class="relative bg-gradient-to-b from-muted/50 to-background px-4 pt-10 pb-6 lg:pt-16">
      <div class="max-w-2xl mx-auto text-center">
        <h1 class="text-3xl lg:text-4xl font-extrabold tracking-tight text-balance">
          Discover Kyrgyzstan
        </h1>
        <p class="text-muted-foreground mt-2 text-balance lg:text-lg">
          Alpine lakes, nomadic culture, and mountain adventures await
        </p>
 
        <!-- Search Bar -->
        <div class="mt-8 relative max-w-md mx-auto" @click="onSearchClick">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            readonly
            placeholder="Where do you want to go?"
            class="w-full pl-12 pr-4 py-3.5 rounded-full border border-border bg-card shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
          />
        </div>
 
        <!-- Categories -->
        <div class="mt-8 flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          <SharedFilterChip
            v-for="(cat, i) in categories"
            :key="cat"
            :label="cat"
            :active="i === 0"
            class="flex-shrink-0"
          />
        </div>
      </div>
    </div>

    <div class="px-4 pb-8 space-y-12 max-w-6xl mx-auto">
      <!-- Featured Destinations -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Featured Destinations</h2>
          <button class="text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground">
            See all <ChevronRight class="w-4 h-4" />
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TravelerDestinationCard
            v-for="dest in tourismStore.places"
            :key="dest.id"
            :destination="dest"
            variant="compact"
            @click="onDestinationClick(dest.id)"
          />
        </div>
      </section>


      <!-- How It Works -->
      <section class="bg-muted rounded-2xl p-6">
        <h2 class="text-lg font-semibold mb-4">How Nomad Core Works</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center mx-auto text-lg font-bold">
              1
            </div>
            <h3 class="font-medium mt-3">Discover</h3>
            <p class="text-sm text-muted-foreground mt-1">Browse destinations, yurts, and curated packages</p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center mx-auto text-lg font-bold">
              2
            </div>
            <h3 class="font-medium mt-3">Book</h3>
            <p class="text-sm text-muted-foreground mt-1">Reserve with verified local partners instantly</p>
          </div>
          <div class="text-center">
            <div class="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center mx-auto text-lg font-bold">
              3
            </div>
            <h3 class="font-medium mt-3">Experience</h3>
            <p class="text-sm text-muted-foreground mt-1">Enjoy authentic Kyrgyz hospitality</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
