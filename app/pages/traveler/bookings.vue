<script setup lang="ts">
import { Calendar, ChevronRight, QrCode, X } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/useAuthStore'
import { useTourismStore } from '~/stores/useTourismStore'
import QrcodeVue from 'qrcode.vue'
import Modal from '~/components/shared/Modal.vue'
import { Button } from '~/components/ui/button'

definePageMeta({
  layout: 'traveler',
})

const router = useRouter()

const authStore = useAuthStore()
const tourismStore = useTourismStore()

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await tourismStore.loadBookings()
  }
})

const userBookings = computed(() => tourismStore.bookings)
const upcomingBookings = computed(() => userBookings.value.filter(b => b.status === 'confirmed' || b.status === 'pending'))
const pastBookings = computed(() => userBookings.value.filter(b => b.status === 'completed' || b.status === 'cancelled'))

const selectedBooking = ref<any>(null)
const isQrModalOpen = ref(false)

function showQr(booking: any) {
  selectedBooking.value = booking
  isQrModalOpen.value = true
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString()
}
</script>

<template>
  <div class="min-h-screen pt-4 lg:pt-20 px-4 pb-8 max-w-2xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">My Bookings</h1>
      <Button v-if="!authStore.isAuthenticated" @click="router.push('/traveler/auth/login')" size="sm">Login</Button>
    </div>

    <div v-if="!authStore.isAuthenticated" class="text-center py-20 bg-muted/20 rounded-2xl border border-dashed">
      <QrCode class="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
      <h2 class="text-lg font-bold">Sign in to view your bookings</h2>
      <p class="text-muted-foreground mt-2 max-w-xs mx-auto">Your booking tickets and QR codes will appear here after you log in.</p>
      <Button @click="router.push('/traveler/auth/login')" class="mt-6 px-8">Login</Button>
    </div>

    <div v-else-if="userBookings.length === 0">
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
          <div
            v-for="booking in upcomingBookings"
            :key="booking.id"
            class="w-full bg-card border border-border rounded-xl p-4 text-left hover:shadow-md transition-shadow relative"
          >
            <div class="flex gap-4">
              <div class="w-20 h-20 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <Calendar class="w-8 h-8 text-muted-foreground/30" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <h3 class="font-semibold line-clamp-1">{{ booking.propertyName || 'Property Booking' }}</h3>
                  <SharedStatusBadge :status="booking.status" variant="booking" />
                </div>
                <p class="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                  <Calendar class="w-3.5 h-3.5" />
                  {{ formatDate(booking.checkInDate || booking.dateFrom) }} - {{ formatDate(booking.checkOutDate || booking.dateTo) }}
                </p>
                <div class="mt-2 flex items-center justify-between">
                  <p class="text-sm font-bold text-primary">{{ (booking.retailAmount || booking.totalPrice || 0).toLocaleString() }} KGS</p>
                  <Button size="sm" variant="outline" @click="showQr(booking)">
                    <QrCode class="w-4 h-4 mr-2" />
                    Show QR
                  </Button>
                </div>
              </div>
            </div>
          </div>
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

    <!-- QR Modal -->
    <Modal
      :is-open="isQrModalOpen"
      @close="isQrModalOpen = false"
      title="Booking Ticket"
      class-name="max-w-xs"
    >
      <div v-if="selectedBooking" class="p-6 flex flex-col items-center text-center">
        <p class="text-sm font-bold text-muted-foreground uppercase mb-4">{{ selectedBooking.propertyName }}</p>
        <div class="bg-white p-4 rounded-2xl shadow-inner border border-border">
          <QrcodeVue 
            :value="selectedBooking.bookingCode || selectedBooking.code" 
            :size="200"
            level="H"
            render-as="svg"
          />
        </div>
        <p class="mt-6 text-2xl font-mono font-bold tracking-widest">
          {{ selectedBooking.bookingCode || selectedBooking.code }}
        </p>
        <p class="mt-2 text-xs text-muted-foreground">Show this QR code to the property staff at check-in</p>
        <Button class="w-full mt-8" @click="isQrModalOpen = false">Done</Button>
      </div>
    </Modal>
  </div>
</template>
