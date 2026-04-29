<script setup lang="ts">
import { Calendar, ChevronRight } from 'lucide-vue-next'
import { bookings, formatDate, getPackageById, getPropertyById } from '~/data/mock-data'

definePageMeta({
  layout: 'traveler',
})

const router = useRouter()

const userBookings = computed(() => bookings.slice(0, 4))
const upcomingBookings = computed(() => userBookings.value.filter(b => b.status === 'confirmed' || b.status === 'pending'))
const pastBookings = computed(() => userBookings.value.filter(b => b.status === 'completed' || b.status === 'cancelled'))

function onClick(booking: any) {
  if (booking.packageId) router.push(`/traveler/package/${booking.packageId}`)
  else if (booking.propertyId) router.push(`/traveler/property/${booking.propertyId}`)
}

function getBookingDetails(booking: any) {
  const pkg = booking.packageId ? getPackageById(booking.packageId) : null
  const property = booking.propertyId ? getPropertyById(booking.propertyId) : null
  return {
    name: pkg?.name || property?.name || 'Booking',
    image: pkg?.image || property?.image,
  }
}
</script>

<template>
  <div class="min-h-screen pt-4 lg:pt-20 px-4 pb-8 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">My Bookings</h1>

    <div v-if="userBookings.length === 0">
      <SharedEmptyState
        title="No bookings yet"
        description="Start exploring destinations and book your first adventure!"
      >
        <template #icon>
          <Calendar class="w-12 h-12" />
        </template>
      </SharedEmptyState>
    </div>

    <div v-else class="space-y-8">
      <!-- Upcoming -->
      <section v-if="upcomingBookings.length > 0">
        <SharedSectionHeader title="Upcoming" />
        <div class="mt-4 space-y-3">
          <button
            v-for="booking in upcomingBookings"
            :key="booking.id"
            @click="onClick(booking)"
            class="w-full bg-card border border-border rounded-xl p-4 text-left hover:shadow-md transition-shadow"
          >
            <div class="flex gap-4">
              <img
                v-if="getBookingDetails(booking).image"
                :src="getBookingDetails(booking).image"
                :alt="getBookingDetails(booking).name"
                class="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <h3 class="font-semibold line-clamp-1">{{ getBookingDetails(booking).name }}</h3>
                  <SharedStatusBadge :status="booking.status" variant="booking" />
                </div>
                <p class="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                  <Calendar class="w-3.5 h-3.5" />
                  {{ formatDate(booking.checkIn) }} - {{ formatDate(booking.checkOut) }}
                </p>
                <div class="mt-2 flex items-center justify-between">
                  <p class="text-sm font-medium">{{ booking.totalPrice.toLocaleString() }} KGS</p>
                  <span class="text-xs text-muted-foreground">{{ booking.code }}</span>
                </div>
              </div>
              <ChevronRight class="w-5 h-5 text-muted-foreground flex-shrink-0" />
            </div>
          </button>
        </div>
      </section>

      <!-- Past -->
      <section v-if="pastBookings.length > 0">
        <SharedSectionHeader title="Past" />
        <div class="mt-4 space-y-3">
          <div
            v-for="booking in pastBookings"
            :key="booking.id"
            class="bg-card border border-border rounded-xl p-4 opacity-75"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-medium">{{ getBookingDetails(booking).name }}</h3>
                <p class="text-sm text-muted-foreground mt-0.5">
                  {{ formatDate(booking.checkIn) }}
                </p>
              </div>
              <SharedStatusBadge :status="booking.status" variant="booking" />
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
