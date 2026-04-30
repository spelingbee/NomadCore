<script setup lang="ts">
import { ArrowLeft, Check, Star, Calendar as CalendarIcon } from 'lucide-vue-next'
import { useTourismStore } from '~/stores/useTourismStore'
import { useAuthStore } from '~/stores/useAuthStore'
import { useApiService } from '~/services/api.service'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import { Popover, PopoverTrigger, PopoverContent } from '~/components/ui/popover'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '~/components/ui/carousel'
import { RangeCalendar } from '~/components/ui/calendar'
import { today, getLocalTimeZone } from '@internationalized/date'
import PriceBadge from "../../../components/shared/PriceBadge.vue";
import QrcodeVue from 'qrcode.vue'

definePageMeta({
  layout: 'traveler',
})

const route = useRoute()
const router = useRouter()
const tourismStore = useTourismStore()
const authStore = useAuthStore()
const api = useApiService()

type BookingStep = 'details' | 'booking' | 'confirmation'
const step = ref<BookingStep>('details')
const getLocalDateString = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const selectedDateValue = ref({
  start: today(getLocalTimeZone()),
  end: today(getLocalTimeZone()).add({ days: 1 })
})
const selectedUnit = ref<string>()
const isSubmitting = ref(false)
const inventoryData = ref<any[]>([])
const isMounted = ref(false)

// Fetch inventory for a range to show availability and prices
async function loadPrices() {
  if (!propertyId.value) return
  try {
    const res = await api.fetchInventory({
      propertyId: propertyId.value,
      dateFrom: today(getLocalTimeZone()).toString(),
      dateTo: today(getLocalTimeZone()).add({ days: 60 }).toString()
    })
    inventoryData.value = (res as any).data || (res as any).content || res || []
  } catch (e) {
    console.error('Failed to load prices from inventory:', e)
  }
}

watch(selectedDateValue, (newVal) => {
  if (newVal?.start && isMounted.value) {
    loadPrices()
  }
})

const propertyId = computed(() => route.params.id as string)
const property = ref<any>(null)
const destination = ref<any>(null)
const unitTypes = computed(() => tourismStore.getUnitTypesByProperty(propertyId.value))

// Helper to find price for a specific rate plan in inventory data
function getRatePlanPrice(ratePlanId: string) {
  const inv = inventoryData.value.find(i => 
    i.ratePlanId === ratePlanId || 
    i.rate_plan_id === ratePlanId || 
    (i.ratePlan && i.ratePlan.id === ratePlanId)
  )
  return inv ? (inv.retailRate || inv.retail_rate || inv.basePrice || inv.retailPrice || inv.base_price) : null
}

onMounted(async () => {
  isMounted.value = true
  // Load property details first
  try {
    const res = await tourismStore.getPropertyById(propertyId.value)
    property.value = res
    if (res) {
      const areaId = res.destinationArea?.id || res.destination_area_id || res.touristPlaceId
      if (areaId) {
        tourismStore.getPlaceById(areaId).then(p => destination.value = p)
      }
      // Load prices only after property is known
      loadPrices()
    }
  } catch (e) {
    console.error('Failed to load property details:', e)
  }
  
  tourismStore.loadUnitTypes({ propertyId: propertyId.value })
})

const selectedUnitData = computed(() => unitTypes.value.find(u => (u.id === selectedUnit.value || u.property_id === selectedUnit.value)))

const total = computed(() => {
  if (!selectedUnit.value || !selectedDateValue.value.start || !selectedDateValue.value.end) return 0
  
  let sum = 0
  let current = selectedDateValue.value.start
  while (!current.isAfter(selectedDateValue.value.end.subtract({ days: 1 }))) {
    const price = getRatePlanPriceForDate(selectedUnit.value, current.toString())
    if (price) sum += price
    current = current.add({ days: 1 })
  }
  return sum
})

function getRatePlanPriceForDate(ratePlanId: string, date: string) {
  const inv = inventoryData.value.find(i => 
    (i.ratePlanId === ratePlanId || i.rate_plan_id === ratePlanId || (i.ratePlan && i.ratePlan.id === ratePlanId)) &&
    i.date === date
  )
  return inv ? (inv.retailRate || inv.retail_rate || inv.basePrice || inv.retailPrice || inv.base_price) : null
}

function isDateDisabled(date: any) {
  // Disable past dates
  if (date.compare(today(getLocalTimeZone())) < 0) return true
  
  // If we have selected a unit, disable dates where it's not available
  if (selectedUnit.value) {
    const dateStr = date.toString()
    const inv = inventoryData.value.find(i => 
      (i.ratePlanId === selectedUnit.value || i.rate_plan_id === selectedUnit.value) &&
      i.date === dateStr
    )
    if (inv && (inv.availableQty <= 0 || inv.stopSell)) return true
  }
  
  return false
}

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
      checkIn: selectedDateValue.value.start.toString(),
      checkOut: selectedDateValue.value.end ? selectedDateValue.value.end.toString() : selectedDateValue.value.start.add({ days: 1 }).toString(),
      qty: 1,
      guestName: authStore.user?.fullName || 'Guest User',
      guestEmail: authStore.user?.email || 'guest@example.com'
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
        
        <div class="py-6 flex flex-col items-center">
          <div class="bg-white p-4 rounded-2xl shadow-inner border border-border">
            <QrcodeVue 
              v-if="bookingResult?.bookingCode"
              :value="bookingResult.bookingCode" 
              :size="180"
              level="H"
              render-as="svg"
            />
          </div>
          <p v-if="bookingResult?.bookingCode" class="mt-4 text-xl font-mono font-bold tracking-widest text-primary">
            {{ bookingResult.bookingCode }}
          </p>
          <p class="text-xs text-muted-foreground mt-1">Check-in Code</p>
        </div>

        <div class="bg-muted p-4 rounded-xl text-left space-y-2">
          <p class="text-sm"><strong>Status:</strong> {{ bookingResult?.status || 'Confirmed' }}</p>
          <p class="text-sm"><strong>Dates:</strong> {{ selectedDateValue.start.toString() }} - {{ selectedDateValue.end?.toString() || '...' }}</p>
          <p class="text-xs text-muted-foreground pt-2 italic">You can also find this ticket in "My Bookings" section.</p>
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
          <span class="text-muted-foreground">Dates</span>
          <span>{{ selectedDateValue.start.toString() }} to {{ selectedDateValue.end?.toString() || '...' }}</span>
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
      <div v-if="authStore.isAuthenticated" class="space-y-4">
        <Button @click="handleBooking" class="w-full" size="lg" :disabled="isSubmitting">
          {{ isSubmitting ? 'Processing...' : 'Confirm Booking' }}
        </Button>
      </div>
      <div v-else class="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center space-y-4">
        <p class="font-bold text-lg">Login to Complete Booking</p>
        <p class="text-sm text-muted-foreground">Please sign in to your traveler account to reserve this yurt.</p>
        <Button @click="router.push('/traveler/auth/login')" class="w-full">Sign In</Button>
        <Button variant="ghost" @click="router.push('/traveler/auth/register')" class="w-full">Create Account</Button>
      </div>
    </div>
  </div>

  <div v-else class="min-h-screen bg-background">
    <!-- Gallery Slider -->
    <div class="relative">
      <Carousel v-if="property.metadata?.images?.length" class="w-full">
        <CarouselContent>
          <CarouselItem v-for="(img, i) in property.metadata.images" :key="i">
            <div class="relative h-64 lg:h-80">
              <img :src="img" :alt="property.name" class="w-full h-full object-cover" />
            </div>
          </CarouselItem>
        </CarouselContent>
        <div class="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
          <CarouselPrevious class="pointer-events-auto relative left-0" />
          <CarouselNext class="pointer-events-auto relative right-0" />
        </div>
      </Carousel>
      <div v-else class="relative h-64 lg:h-80 bg-muted">
        <img
          :src="'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=800&fit=crop'"
          :alt="property.name"
          class="w-full h-full object-cover"
        />
      </div>
      
      <button
        @click="onBack"
        class="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur flex items-center justify-center text-white hover:bg-black/40 transition-colors z-10"
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
                  <PriceBadge v-if="getRatePlanPriceForDate(unit.id, selectedDateValue.start.toString())" :price="getRatePlanPriceForDate(unit.id, selectedDateValue.start.toString())" size="sm" />
                  <span v-else class="text-xs text-muted-foreground italic">Price unavailable for this date</span>
                  <span v-if="getRatePlanPriceForDate(unit.id, selectedDateValue.start.toString())" class="text-xs text-muted-foreground"> / night</span>
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

      <!-- Availability (Beautiful Calendar) -->
      <section v-if="isMounted">
        <SharedSectionHeader title="Select Date" />
        <div class="mt-4">
          <Popover>
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                class="w-full justify-start text-left font-normal py-6 rounded-xl border-border"
                :class="!selectedDateValue.start && 'text-muted-foreground'"
              >
                <CalendarIcon class="mr-2 h-4 w-4" />
                {{ selectedDateValue.start.toString() }} 
                <template v-if="selectedDateValue.end">
                  to {{ selectedDateValue.end.toString() }}
                </template>
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0" align="start">
              <RangeCalendar
                v-model="selectedDateValue"
                initial-focus
                :is-date-disabled="isDateDisabled"
                class="rounded-md border"
              />
            </PopoverContent>
          </Popover>
        </div>
      </section>

      <!-- Book CTA -->
      <div v-if="selectedUnit" class="sticky bottom-20 lg:bottom-4 bg-card border border-border rounded-xl p-4 shadow-lg z-20">
        <div class="flex items-center justify-between">
          <div>
            <PriceBadge :price="total" size="lg" />
            <p class="text-xs text-muted-foreground">
              Total for {{ selectedDateValue.end ? (selectedDateValue.end.day - selectedDateValue.start.day + (selectedDateValue.end.month - selectedDateValue.start.month) * 30) : 1 }} night(s)
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
