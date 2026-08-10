<script setup lang="ts">
import type { BookingStatus } from '~/types'

const props = defineProps<{ status: BookingStatus; solid?: boolean }>()
const { t } = useI18n()

const bg: Record<BookingStatus, string> = {
  HOLD: 'bg-hold text-white',
  CONFIRMED: 'bg-confirmed text-white',
  CHECKED_IN: 'bg-checkedin text-white',
  CHECKED_OUT: 'bg-hair text-ink',
  CANCELLED: 'bg-danger text-white'
}
</script>

<template>
  <span class="inline-block rounded px-2 py-1 text-[13px] font-bold leading-none" :class="bg[props.status]">
    {{ t.status[props.status] }}
  </span>
</template>
