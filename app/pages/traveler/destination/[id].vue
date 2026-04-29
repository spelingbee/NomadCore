<script setup lang="ts">
import { ArrowLeft, Info } from 'lucide-vue-next'
import { useTourismStore } from '~/stores/useTourismStore'

definePageMeta({
  layout: 'traveler',
})

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const tourismStore = useTourismStore()

const destinationId = computed(() => route.params.id as string)
const destination = ref<any>(null)

onMounted(async () => {
  destination.value = await tourismStore.getPlaceById(destinationId.value)
  await tourismStore.loadProperties({ 
    touristPlaceId: destinationId.value,
    destinationId: destinationId.value
  })
  
  // Load rate plans (prices)
  if (properties.value.length > 0) {
    await Promise.all(
      properties.value.map(p => tourismStore.loadUnitTypes({ propertyId: p.id }))
    )
  } else {
    // Fallback if no properties found yet or to try global fetch if backend supports it
    await tourismStore.loadUnitTypes()
  }
})

const matchId = (field: any, id: string) => {
  if (!field) return false
  if (typeof field === 'string') return field === id
  if (typeof field === 'object' && field.id) return field.id === id
  return false
}

const properties = computed(() => tourismStore.properties)

const packages = computed(() => 
  tourismStore.properties.filter(p => 
    p.kind === 'tour_operator' || (p as any).type === 'tour_operator'
  )
)

function onBack() {
  router.back()
}

function onPackageClick(id: string) {
  router.push(`/traveler/property/${id}`)
}

function onPropertyClick(id: string) {
  router.push(`/traveler/property/${id}`)
}
</script>

<template>
  <div v-if="tourismStore.isLoading && !destination" class="min-h-screen flex items-center justify-center">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
  <div v-else-if="!destination" class="p-4 text-center py-20">
    <p class="text-muted-foreground">{{ t('destination.not_found') }}</p>
    <Button @click="router.push(localePath('/traveler'))" variant="link">{{ t('destination.back_to_home') }}</Button>
  </div>
  <div v-else class="min-h-screen">
    <!-- Hero -->
    <div class="relative h-64 lg:h-80">
      <img
        :src="destination.image || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop'"
        :alt="destination.name"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      <!-- Back Button -->
      <button
        type="button"
        @click="onBack"
        class="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur flex items-center justify-center text-white hover:bg-black/40 transition-colors"
      >
        <ArrowLeft class="w-5 h-5" />
      </button>

      <!-- Title -->
      <div class="absolute bottom-0 left-0 right-0 p-6">
        <p class="text-white/80 text-sm">{{ destination.region }}</p>
        <h1 class="text-white text-3xl font-bold">{{ destination.name }}</h1>
      </div>
    </div>

    <div class="px-4 pb-8 space-y-8 max-w-6xl mx-auto">
      <!-- Description -->
      <div class="pt-6">
        <p class="text-muted-foreground leading-relaxed">{{ destination.description }}</p>
      </div>

      <!-- Facts -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div v-if="destination.altitude" class="bg-muted rounded-lg p-3">
          <p class="text-xs text-muted-foreground">{{ t('destination.altitude') }}</p>
          <p class="font-semibold mt-0.5">{{ destination.altitude }}m</p>
        </div>
        <div v-if="destination.bestTimeToVisit" class="bg-muted rounded-lg p-3">
          <p class="text-xs text-muted-foreground">{{ t('destination.best_time') }}</p>
          <p class="font-semibold mt-0.5">{{ destination.bestTimeToVisit }}</p>
        </div>
        <div v-if="destination.type" class="bg-muted rounded-lg p-3">
          <p class="text-xs text-muted-foreground">{{ t('destination.type') }}</p>
          <p class="font-semibold mt-0.5 capitalize">{{ destination.type }}</p>
        </div>
        <div v-if="destination.rating" class="bg-muted rounded-lg p-3">
          <p class="text-xs text-muted-foreground">{{ t('destination.rating') }}</p>
          <p class="font-semibold mt-0.5">{{ destination.rating }} / 5.0</p>
        </div>
      </div>

      <!-- Packages -->
      <section v-if="packages.length > 0">
        <SharedSectionHeader :title="t('destination.packages_title')" :description="t('destination.packages_desc')" />
        <div class="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TravelerPackageCard
            v-for="pkg in packages"
            :key="pkg.id"
            :pkg="pkg"
            @click="onPackageClick(pkg.id)"
          />
        </div>
      </section>

      <!-- Properties -->
      <section v-if="properties.length > 0">
        <SharedSectionHeader :title="t('destination.properties_title')" :description="t('destination.properties_desc', { name: destination.name })" />
        <div class="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <TravelerPropertyCard
            v-for="prop in properties"
            :key="prop.id"
            :property="prop"
            :unit-types="tourismStore.getUnitTypesByProperty(prop.id)"
            @click="onPropertyClick(prop.id)"
          />
        </div>
      </section>

      <!-- Travel Tips -->
      <section class="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4">
        <div class="flex gap-3">
          <Info class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 class="font-medium text-blue-900 dark:text-blue-400">{{ t('destination.travel_tips') }}</h3>
            <ul class="text-sm text-blue-800 dark:text-blue-300 mt-2 space-y-1">
              <li>- Лучшее время для посещения: {{ destination.bestTimeToVisit || 'летние месяцы' }}</li>
              <li>- Возьмите теплые вещи: в горах температура сильно падает ночью</li>
              <li>- Рекомендуется наличные: доступ к банкоматам в отдаленных районах ограничен</li>
              <li>- Бронируйте жилье заранее в пик сезона</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
