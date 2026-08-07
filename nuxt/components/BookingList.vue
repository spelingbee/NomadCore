<script setup lang="ts">
import { db } from '~/lib/db'
import { dateRange, nights } from '~/utils/dates'
import type { Booking } from '~/types'

const props = defineProps<{ from: string }>()
const { t } = useI18n()

const rows = ref<Booking[]>([])
onMounted(async () => {
  rows.value = (await db.bookings.toArray())
    .filter(b => b.status !== 'CANCELLED' && b.checkOut >= props.from)
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn))
})

/** Группировка по дате заезда; текущие проживания попадают в «сегодня». */
const groups = computed(() => {
  const map = new Map<string, Booking[]>()
  for (const b of rows.value) {
    const key = b.checkIn < props.from ? props.from : b.checkIn
    map.set(key, [...(map.get(key) ?? []), b])
  }
  return [...map.entries()].slice(0, 7)
})
</script>

<template>
  <section v-for="[day, items] in groups" :key="day">
    <h3 class="flex items-baseline gap-2 border-y border-line bg-band px-4 py-[9px] text-[14px] font-bold">
      {{ day === props.from ? t.today : day }}
    </h3>
    <NuxtLink
      v-for="b in items" :key="b.id" :to="'/booking/' + b.id"
      class="flex items-center gap-[11px] border-b border-line bg-paper px-4 py-[11px]"
    >
      <span class="inline-flex h-[32px] min-w-[40px] shrink-0 items-center justify-center rounded bg-ink px-[6px] text-[15px] font-bold text-white">
        {{ b.roomLabel ?? '—' }}
      </span>
      <span class="min-w-0 flex-1">
        <span class="block text-[17px] font-semibold">{{ b.guest.fullName }}</span>
        <span class="mt-[2px] block text-[13.5px] text-muted">
          {{ dateRange(b.checkIn, b.checkOut) }} · {{ nights(b.checkIn, b.checkOut) }} {{ t.night }} · {{ b.code }}
        </span>
      </span>
      <StatusPill :status="b.status" />
    </NuxtLink>
  </section>
</template>
