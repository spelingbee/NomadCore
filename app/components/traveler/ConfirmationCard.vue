<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import QrcodeVue from 'qrcode.vue'
import { cn } from '~/lib/utils'
import type { Booking } from '~/data/mock-data'

interface ConfirmationCardProps {
  booking: Booking
  packageName?: string
  propertyName?: string
  className?: string
}
defineProps<ConfirmationCardProps>()
</script>

<template>
  <div :class="cn('bg-card border border-border rounded-xl p-6 text-center', className)">
    <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
      <Check class="w-8 h-8" />
    </div>

    <h2 class="text-xl font-bold mt-4">Booking Confirmed!</h2>
    <p class="text-muted-foreground mt-1">{{ packageName || propertyName }}</p>

    <div class="mt-6 p-4 bg-muted rounded-lg">
      <p class="text-sm text-muted-foreground">Booking Code</p>
      <p class="text-2xl font-mono font-bold mt-1">{{ booking.code }}</p>
    </div>

    <div class="mt-4 p-4 border border-dashed border-border rounded-lg bg-white inline-block">
      <qrcode-vue
        :value="booking.code"
        :size="160"
        level="H"
        render-as="svg"
        class="mx-auto"
      />
      <p class="text-xs text-muted-foreground mt-2 font-medium">Show this QR code at check-in</p>
    </div>

    <div class="mt-6 text-left space-y-2 text-sm">
      <div class="flex justify-between">
        <span class="text-muted-foreground">Check-in</span>
        <span class="font-medium">{{ booking.checkIn }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-muted-foreground">Check-out</span>
        <span class="font-medium">{{ booking.checkOut }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-muted-foreground">Guests</span>
        <span class="font-medium">{{ booking.guests }}</span>
      </div>
      <div class="flex justify-between pt-2 border-t border-border">
        <span class="text-muted-foreground">Total Paid</span>
        <span class="font-semibold">{{ booking.totalPrice.toLocaleString() }} KGS</span>
      </div>
    </div>

    <div class="mt-6 p-3 bg-blue-50 rounded-lg text-left">
      <p class="text-sm font-medium text-blue-900">Next Steps</p>
      <ul class="text-sm text-blue-800 mt-1 space-y-1">
        <li>1. Check your email for confirmation</li>
        <li>2. Save your booking code</li>
        <li>3. Arrive at the location on your check-in date</li>
      </ul>
    </div>
  </div>
</template>
