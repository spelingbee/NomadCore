<script setup lang="ts">
import { ArrowLeft, Clock, Star } from 'lucide-vue-next'
import {
  formatDate,
  getCustomerById,
  getDestinationById,
  getPackageById,
  getPartnerById,
  reviews,
} from '~/data/mock-data'
import { Button } from '~/components/ui/button'

definePageMeta({
  layout: 'traveler',
})

const route = useRoute()
const router = useRouter()

type BookingStep = 'details' | 'booking' | 'confirmation'
const step = ref<BookingStep>('details')
const selectedDate = ref<string>()
const guests = ref(2)

const packageId = computed(() => route.params.id as string)
const pkg = computed(() => getPackageById(packageId.value))
const partner = computed(() => pkg.value ? getPartnerById(pkg.value.partnerId) : null)
const destination = computed(() => pkg.value ? getDestinationById(pkg.value.destinationId) : null)
const packageReviews = computed(() => reviews.slice(0, 2))

function onBack() {
  if (step.value === 'details') {
    router.back()
  }
  else {
    step.value = 'details'
  }
}

const mockBooking = computed(() => {
  if (!pkg.value) return null
  return {
    id: 'new-booking',
    code: 'NC-2024-NEW',
    customerId: 'cust-1',
    packageId: pkg.value.id,
    channelId: 'ch-1',
    checkIn: selectedDate.value || '2024-07-15',
    checkOut: selectedDate.value
      ? new Date(new Date(selectedDate.value).getTime() + 86400000 * (pkg.value.itinerary.length)).toISOString().split('T')[0]
      : '2024-07-17',
    guests: guests.value,
    status: 'confirmed' as const,
    totalPrice: pkg.value.retailPrice * guests.value,
    createdAt: new Date().toISOString().split('T')[0],
  }
})
</script>

<template>
  <div v-if="!pkg" class="p-4">
    Package not found
  </div>

  <div v-else-if="step === 'confirmation'" class="min-h-screen bg-background">
    <header class="sticky top-0 bg-card border-b border-border z-30 px-4 h-14 flex items-center">
      <button @click="router.push('/traveler')" class="mr-3 text-muted-foreground">
        <ArrowLeft class="w-6 h-6" />
      </button>
      <h1 class="text-lg font-semibold">Booking Confirmed</h1>
    </header>
    <div class="p-4 max-w-lg mx-auto">
      <ConfirmationCard v-if="mockBooking" :booking="mockBooking" :package-name="pkg.name" />
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
      <BookingSummaryCard
        v-if="mockBooking"
        :title="pkg.name"
        :check-in="mockBooking.checkIn"
        :check-out="mockBooking.checkOut"
        :guests="guests"
        :items="[
          { label: `${pkg.name} x ${guests}`, price: pkg.retailPrice * guests },
        ]"
        :total="pkg.retailPrice * guests"
      />
      <BookingForm @submit="step = 'confirmation'" />
    </div>
  </div>

  <div v-else class="min-h-screen bg-background">
    <!-- Hero -->
    <div class="relative h-64 lg:h-80">
      <img
        :src="pkg.image"
        :alt="pkg.name"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      <button
        @click="onBack"
        class="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/30 backdrop-blur flex items-center justify-center text-white"
      >
        <ArrowLeft class="w-5 h-5" />
      </button>

      <div class="absolute bottom-0 left-0 right-0 p-6">
        <p class="text-white/80 text-sm">{{ destination?.name }}</p>
        <h1 class="text-white text-2xl font-bold">{{ pkg.name }}</h1>
        <div class="flex items-center gap-4 mt-2 text-white/80 text-sm">
          <span class="flex items-center gap-1">
            <Clock class="w-4 h-4" />
            {{ pkg.duration }}
          </span>
        </div>
      </div>
    </div>

    <div class="px-4 pb-8 space-y-6 max-w-3xl mx-auto">
      <!-- Price + Book -->
      <div class="pt-6 flex items-center justify-between">
        <div>
          <PriceBadge :price="pkg.retailPrice" size="lg" />
          <span class="text-sm text-muted-foreground ml-1">/ person</span>
        </div>
        <Button @click="step = 'booking'" size="lg">
          Book Now
        </Button>
      </div>

      <!-- Description -->
      <div>
        <p class="text-muted-foreground">{{ pkg.description }}</p>
      </div>

      <!-- What's Included -->
      <PackageBreakdown :pkg="pkg" />

      <!-- Itinerary -->
      <section>
        <SectionHeader title="Itinerary" />
        <div class="mt-4 space-y-4">
          <div v-for="day in pkg.itinerary" :key="day.day" class="flex gap-4">
            <div class="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center font-bold flex-shrink-0">
              D{{ day.day }}
            </div>
            <div>
              <h4 class="font-semibold">{{ day.title }}</h4>
              <p class="text-sm text-muted-foreground mt-1">{{ day.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Availability -->
      <AvailabilityCalendar
        :selected-date="selectedDate"
        @date-select="d => selectedDate = d"
      />

      <!-- Guests -->
      <div>
        <h3 class="font-semibold mb-3">Number of Guests</h3>
        <div class="flex items-center gap-4">
          <button
            @click="guests = Math.max(1, guests - 1)"
            class="w-10 h-10 rounded-full border border-border flex items-center justify-center text-lg"
          >
            -
          </button>
          <span class="text-lg font-semibold w-8 text-center">{{ guests }}</span>
          <button
            @click="guests = guests + 1"
            class="w-10 h-10 rounded-full border border-border flex items-center justify-center text-lg"
          >
            +
          </button>
        </div>
      </div>

      <!-- Partner Info -->
      <div v-if="partner" class="border border-border rounded-xl p-4">
        <p class="text-xs text-muted-foreground">Operated by</p>
        <p class="font-semibold mt-0.5">{{ partner.name }}</p>
        <div class="flex items-center gap-2 mt-2">
          <span v-if="partner.verified" class="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
            Verified Partner
          </span>
          <span class="text-xs text-muted-foreground">
            {{ partner.stats.bookings }} bookings
          </span>
        </div>
      </div>

      <!-- Reviews -->
      <section>
        <SectionHeader title="Reviews">
          <template #action>
            <div class="flex items-center gap-1 text-sm">
              <Star class="w-4 h-4 fill-amber-400 text-amber-400" />
              <span class="font-medium">4.8</span>
              <span class="text-muted-foreground">(24 reviews)</span>
            </div>
          </template>
        </SectionHeader>
        <div class="mt-4 space-y-3">
          <ReviewCard
            v-for="review in packageReviews"
            :key="review.id"
            :author="getCustomerById(review.customerId)?.name || 'Anonymous'"
            :rating="review.rating"
            :comment="review.comment"
            :date="formatDate(review.createdAt)"
          />
        </div>
      </section>

      <!-- Book CTA -->
      <div class="sticky bottom-20 lg:bottom-4 bg-card border border-border rounded-xl p-4 shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <PriceBadge :price="pkg.retailPrice * guests" size="lg" />
            <p class="text-xs text-muted-foreground">Total for {{ guests }} {{ guests === 1 ? 'guest' : 'guests' }}</p>
          </div>
          <Button @click="step = 'booking'" size="lg">
            Book Now
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
