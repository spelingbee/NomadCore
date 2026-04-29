<script setup lang="ts">
import { ArrowLeft, Check, Star } from 'lucide-vue-next'
import { useTourismStore } from '~/stores/useTourismStore'
import { useApiService } from '~/services/api.service'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

definePageMeta({
  layout: 'traveler',
})

const route = useRoute()
const router = useRouter()
const tourismStore = useTourismStore()
const api = useApiService()

type BookingStep = 'details' | 'booking' | 'confirmation'
const step = ref<BookingStep>('details')
const selectedDate = ref<string>(new Date().toISOString().split('T')[0])
const selectedUnit = ref<string>()
const isSubmitting = ref(false)

const propertyId = computed(() => route.params.id as string)
const property = ref<any>(null)
const destination = ref<any>(null)
const unitTypes = computed(() => tourismStore.getUnitTypesByProperty(propertyId.value))

onMounted(async () => {
  property.value = await tourismStore.getPropertyById(propertyId.value)
  if (property.value) {
    destination.value = await tourismStore.getPlaceById(property.value.touristPlaceId)
    await tourismStore.loadUnitTypes({ propertyId: propertyId.value })
  }
})

const selectedUnitData = computed(() => unitTypes.value.find(u => (u.id === selectedUnit.value || u.property_id === selectedUnit.value)))
const total = computed(() => (selectedUnitData.value?.retailRate || selectedUnitData.value?.basePrice || 0))

function onBack() {
  if (step.value === 'details') {
    router.back()
  } else {
    step.value = 'details'
  }
}

const bookingResult = ref<any>(null)

async function handleBooking() {
  if (!selectedUnit.value) return
  
  isSubmitting.value = true
  try {
    const res = await api.createBooking({
      ratePlanId: selectedUnit.value,
      checkIn: selectedDate.value,
      checkOut: new Date(new Date(selectedDate.value).getTime() + 86400000).toISOString().split('T')[0],
      qty: 1,
      guestName: 'Guest User', // Mocking guest name for demo
      guestEmail: 'guest@example.com'
    })
    bookingResult.value = (res as any).data || res
    step.value = 'confirmation'
  } catch (e) {
    console.error('Booking failed:', e)
    alert('Booking failed. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div v-if="tourismStore.isLoading && !property" class="min-h-screen flex items-center justify-center">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
  
  <div v-else-if="!property" class="p-4 text-center py-20">
    <p class="text-muted-foreground">Property not found</p>
    <Button @click="router.push('/traveler')" variant="link">Back to home</Button>
  </div>

  <div v-else-if="step === 'confirmation'" class="min-h-screen bg-background">
    <header class="sticky top-0 bg-card border-b border-border z-30 px-4 h-14 flex items-center">
      <button @click="router.push('/traveler')" class="mr-3 text-muted-foreground">
        <ArrowLeft class="w-6 h-6" />
      </button>
      <h1 class="text-lg font-semibold">Booking Confirmed</h1>
    </header>
    <div class="p-4 max-w-lg mx-auto">
      <div class="bg-card border border-border rounded-2xl p-6 text-center space-y-4">
        <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <Check class="w-8 h-8" />
        </div>
        <h2 class="text-xl font-bold">Thank you for your booking!</h2>
        <p class="text-muted-foreground">Your booking for <strong>{{ property.name }}</strong> is confirmed.</p>
        <div class="bg-muted p-4 rounded-xl text-left space-y-2">
          <p class="text-sm"><strong>Booking ID:</strong> {{ bookingResult?.id || 'N/A' }}</p>
          <p class="text-sm"><strong>Status:</strong> {{ bookingResult?.status || 'Confirmed' }}</p>
          <p class="text-sm"><strong>Check-in:</strong> {{ selectedDate }}</p>
        </div>
      </div>
      <Button @click="router.push('/traveler')" variant="outline" class="w-full mt-4">
        Back to Home
      </Button>
    </div>
  </div>

  <div v-else-if="step === 'booking'" class="min-h-screen bg-background">
    <header class="sticky top-0 bg-card border-b border-border z-30 px-4 h-14 flex items-center">
      <button @click="step = 'details'" class="mr-3 text-muted-foreground">
        <ArrowLeft class="w-6 h-6" />
      </button>
      <h1 class="text-lg font-semibold">Complete Booking</h1>
    </header>
    <div class="p-4 max-w-lg mx-auto space-y-6">
      <div class="bg-card border border-border rounded-xl p-4 space-y-3">
        <h3 class="font-bold text-lg">{{ property.name }}</h3>
        <div class="flex justify-between text-sm">
          <span class="text-muted-foreground">Check-in</span>
          <span>{{ selectedDate }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-muted-foreground">Unit Type</span>
          <span>{{ selectedUnitData?.name }}</span>
        </div>
        <hr class="border-border" />
        <div class="flex justify-between font-bold">
          <span>Total</span>
          <PriceBadge :price="total" size="lg" />
        </div>
      </div>
      <Button @click="handleBooking" class="w-full" size="lg" :disabled="isSubmitting">
        {{ isSubmitting ? 'Processing...' : 'Confirm Booking' }}
      </Button>
    </div>
  </div>

  <div v-else class="min-h-screen bg-background">
    <!-- Gallery -->
    <div class="relative h-64 lg:h-80">
      <img
        :src="property.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'"
        :alt="property.name"
        class="w-full h-full object-cover"
      />
      <button
        @click="onBack"
        class="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur flex items-center justify-center text-white hover:bg-black/40 transition-colors"
      >
        <ArrowLeft class="w-5 h-5" />
      </button>
    </div>

    <div class="px-4 pb-8 space-y-6 max-w-3xl mx-auto">
      <!-- Header -->
      <div class="pt-6">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm text-muted-foreground">{{ property.kind || property.type }} in {{ destination?.name || 'Kyrgyzstan' }}</p>
            <h1 class="text-2xl font-bold mt-1">{{ property.name }}</h1>
          </div>
          <div class="flex items-center gap-1 bg-muted px-2 py-1 rounded">
            <Star class="w-4 h-4 fill-amber-400 text-amber-400" />
            <span class="font-medium">{{ property.rating || '4.5' }}</span>
          </div>
        </div>
        <p class="text-muted-foreground mt-3 leading-relaxed">{{ property.description }}</p>
      </div>

      <!-- Amenities -->
      <section v-if="property.amenities?.length">
        <SharedSectionHeader title="Amenities" />
        <div class="mt-3 flex flex-wrap gap-2">
          <span v-for="(amenity, i) in property.amenities" :key="i" class="px-3 py-1.5 bg-muted rounded-full text-sm">
            {{ amenity }}
          </span>
        </div>
      </section>

      <!-- Unit Types / Rate Plans -->
      <section>
        <SharedSectionHeader title="Available Options" />
        <div class="mt-4 space-y-3">
          <button
            v-for="unit in unitTypes"
            :key="unit.id"
            @click="selectedUnit = unit.id"
            :class="cn(
              'w-full border rounded-xl p-4 text-left transition-colors',
              selectedUnit === unit.id
                ? 'border-foreground bg-muted/50'
                : 'border-border hover:border-foreground/50'
            )"
          >
            <div class="flex gap-4">
              <div class="w-20 h-20 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <img
                  v-if="unit.image"
                  :src="unit.image"
                  class="w-full h-full object-cover rounded-lg"
                />
                <Star v-else class="w-8 h-8 text-muted-foreground/50" />
              </div>
              <div class="flex-1">
                <h4 class="font-semibold">{{ unit.name }}</h4>
                <p class="text-sm text-muted-foreground">{{ unit.description || 'Standard rate' }}</p>
                <div class="mt-2">
                  <PriceBadge :price="unit.retailRate || unit.basePrice" size="sm" />
                  <span class="text-xs text-muted-foreground"> / unit</span>
                </div>
              </div>
              <div v-if="selectedUnit === unit.id" class="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center flex-shrink-0">
                <Check class="w-4 h-4" />
              </div>
            </div>
          </button>
          <div v-if="unitTypes.length === 0" class="text-center py-6 border border-dashed rounded-xl text-muted-foreground">
            No active rate plans found for this property.
          </div>
        </div>
      </section>

      <!-- Availability (Simple date picker) -->
      <section>
        <SharedSectionHeader title="Select Date" />
        <input 
          type="date" 
          v-model="selectedDate"
          class="w-full mt-4 p-3 rounded-xl border border-border bg-card focus:ring-2 focus:ring-primary/20 outline-none"
        />
      </section>

      <!-- Book CTA -->
      <div v-if="selectedUnit" class="sticky bottom-20 lg:bottom-4 bg-card border border-border rounded-xl p-4 shadow-lg z-20">
        <div class="flex items-center justify-between">
          <div>
            <PriceBadge :price="total" size="lg" />
            <p class="text-xs text-muted-foreground">
              Total for 1 night
            </p>
          </div>
          <Button @click="step = 'booking'" size="lg">
            Book Now
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
