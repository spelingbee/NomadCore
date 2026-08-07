<script setup lang="ts">
import { dateRange, nights } from '~/utils/dates'
import { NEXT, type Booking } from '~/types'

const props = defineProps<{ booking: Booking }>()
const emit = defineEmits<{ advance: [Booking]; open: [Booking] }>()
const { t } = useI18n()

const next = computed(() => NEXT[props.booking.status])
const label = computed(() => ({
  HOLD: t.value.confirm, CONFIRMED: t.value.checkin, CHECKED_IN: t.value.checkout
} as Record<string, string>)[props.booking.status] ?? '')

const btn = computed(() => ({
  HOLD: 'bg-hold', CONFIRMED: 'bg-checkedin', CHECKED_IN: 'bg-ink'
} as Record<string, string>)[props.booking.status] ?? 'bg-hair')

/* Свайп — ускоритель для опытных, не единственный путь: то же действие
   продублировано кнопкой. Порог 92px, чтобы не срабатывать при скролле. */
const dx = ref(0)
const dragging = ref(false)
let startX = 0

const down = (e: PointerEvent) => { startX = e.clientX; dragging.value = true }
const move = (e: PointerEvent) => {
  if (!dragging.value) return
  dx.value = Math.min(0, Math.max(-150, e.clientX - startX))
}
const up = () => {
  const fire = dx.value <= -92
  dragging.value = false
  dx.value = 0
  if (fire && next.value) emit('advance', props.booking)
}
</script>

<template>
  <div class="relative overflow-hidden border-b border-line bg-danger">
    <div class="absolute inset-0 flex items-center justify-end pr-5 text-[15px] font-bold text-white">
      {{ label }}
    </div>

    <div
      class="relative touch-pan-y bg-paper"
      :style="{ transform: 'translateX(' + dx + 'px)', transition: dragging ? 'none' : 'transform 130ms ease-out' }"
      @pointerdown="down" @pointermove="move" @pointerup="up" @pointercancel="up"
    >
      <div class="flex items-stretch gap-3 px-4 py-3">
        <button class="min-w-0 flex-1 text-left" @click="emit('open', booking)">
          <div class="flex flex-wrap items-center gap-2">
            <span class="tnum inline-flex h-[26px] min-w-[38px] items-center justify-center rounded bg-ink px-[7px] text-[15px] font-bold text-white">
              {{ booking.roomLabel ?? '—' }}
            </span>
            <span class="text-[19px] font-semibold leading-tight">{{ booking.guest.fullName }}</span>
          </div>
          <div class="mt-[5px] text-[15px] text-muted">
            {{ dateRange(booking.checkIn, booking.checkOut) }} · {{ nights(booking.checkIn, booking.checkOut) }} {{ t.night }}
          </div>
          <div class="mt-[7px] flex flex-wrap gap-[6px]">
            <span v-if="booking.source === 'telegram'" class="rounded border-2 border-ink px-[7px] py-[3px] text-[12.5px] font-bold">
              {{ t.fromTelegram }}
            </span>
            <span v-if="!booking.guest.documentNo" class="rounded bg-warn px-[7px] py-[3px] text-[12.5px] font-bold text-[#4A3A12]">
              {{ t.documents }}: {{ t.noDocuments }}
            </span>
            <span v-if="booking.sync === 'pending'" class="rounded bg-danger px-[7px] py-[3px] text-[12.5px] font-bold text-white">
              {{ t.notSent }}
            </span>
          </div>
        </button>

        <!-- Основное действие всегда одно и подписано глаголом, а не иконкой -->
        <button
          v-if="next"
          class="min-h-[66px] min-w-[114px] shrink-0 self-center rounded-md px-3 text-[16px] font-bold leading-tight text-white"
          :class="btn"
          @click="emit('advance', booking)"
        >
          {{ label }}
        </button>
      </div>
    </div>
  </div>
</template>
