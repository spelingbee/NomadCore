<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import { cn } from '~/lib/utils'
import type { TourPackage } from '~/data/mock-data'

interface PackageBreakdownProps {
  pkg: TourPackage
  className?: string
}
defineProps<PackageBreakdownProps>()
</script>

<template>
  <div :class="cn('space-y-3', className)">
    <h3 class="font-semibold">What's Included</h3>
    <div class="space-y-2">
      <div v-for="(item, i) in pkg.items" :key="i" class="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
        <div class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Check class="w-3.5 h-3.5" />
        </div>
        <div>
          <p class="text-sm font-medium">{{ item.name }}</p>
          <p class="text-xs text-muted-foreground">{{ item.details }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
