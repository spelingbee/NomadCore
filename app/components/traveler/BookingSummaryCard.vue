<script setup lang="ts">
import { Calendar, Check, QrCode, Users } from 'lucide-vue-next'
import { cn } from '~/lib/utils'
import type { Booking, TourPackage } from '~/data/mock-data'
import PriceBadge from "../shared/PriceBadge.vue";

// BookingSummaryCard
interface BookingSummaryCardProps {
  title: string
  checkIn: string
  checkOut: string
  guests: number
  items: { label: string; price: number }[]
  total: number
  className?: string
}
defineProps<BookingSummaryCardProps>()

// Exporting components as separate SFCs is better, but for speed I'll use named exports if possible or separate files.
// I'll create separate files to follow Vue best practices.
</script>

<template>
  <div :class="cn('bg-card border border-border rounded-xl p-4', className)">
    <h3 class="font-semibold">{{ title }}</h3>

    <div class="mt-3 space-y-2 text-sm">
      <div class="flex items-center gap-2 text-muted-foreground">
        <Calendar class="w-4 h-4" />
        <span>{{ checkIn }} - {{ checkOut }}</span>
      </div>
      <div class="flex items-center gap-2 text-muted-foreground">
        <Users class="w-4 h-4" />
        <span>{{ guests }} {{ guests === 1 ? 'guest' : 'guests' }}</span>
      </div>
    </div>

    <div class="mt-4 pt-4 border-t border-border space-y-2">
      <div v-for="(item, i) in items" :key="i" class="flex justify-between text-sm">
        <span class="text-muted-foreground">{{ item.label }}</span>
        <span>{{ item.price.toLocaleString() }} KGS</span>
      </div>
    </div>

    <div class="mt-4 pt-4 border-t border-border flex justify-between items-center">
      <span class="font-semibold">Total</span>
      <PriceBadge :price="total" size="lg" />
    </div>
  </div>
</template>
