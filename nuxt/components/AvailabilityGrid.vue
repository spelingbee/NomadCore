<script setup lang="ts">
import type { Room } from '~/types'

/**
 * Режим «Сетка» — ТРЕТИЙ, не умолчание.
 *
 * На 360px требует горизонтального скролла и двух рук, поэтому проиграл замер
 * режимам «День» и «Ночи». Оставлен потому, что единственный отвечает на вопрос
 * «куда переселить гостя»: только здесь виден весь диапазон сразу.
 */
const props = defineProps<{ propertyId: string; from: string }>()
const emit = defineEmits<{ open: [string] }>()

const from = toRef(props, 'from')
const { rooms, columns, barsFor, cell } = useAvailability(props.propertyId, from)

const utc = (iso: string) => new Date(iso + 'T00:00:00Z')
const dow = (iso: string) => ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][utc(iso).getUTCDay()]
const dayNum = (iso: string) => utc(iso).getUTCDate()
const weekend = (iso: string) => [0, 6].includes(utc(iso).getUTCDay())

const barClass = (status: string) => ({
  HOLD: 'bg-surface text-primary shadow-[inset_0_0_0_2px_var(--nc-status-hold)]',
  CONFIRMED: 'bg-confirmed text-[var(--nc-status-fg)]',
  CHECKED_IN: 'bg-inhouse text-[var(--nc-status-fg)]',
  CHECKED_OUT: 'bg-[var(--nc-status-out)] text-primary'
} as Record<string, string>)[status]

const label = (room: Room) => room.label
</script>

<template>
  <div>
    <div class="overflow-x-auto border-y border-line bg-surface">
      <div :style="{ width: `${56 + columns.length * cell}px` }">
        <div class="flex border-b-2 border-strong">
          <div class="sticky left-0 z-30 w-[56px] shrink-0 border-r-2 border-strong bg-surface" />
          <div
            v-for="d in columns" :key="d"
            class="w-[44px] shrink-0 py-1 text-center"
            :class="weekend(d) ? 'bg-sunken' : 'bg-surface'"
          >
            <div class="text-100 text-secondary">{{ dow(d) }}</div>
            <div class="tnum text-300 font-bold leading-5">{{ dayNum(d) }}</div>
          </div>
        </div>

        <div v-for="room in rooms" :key="room.id" class="relative flex h-12 border-b border-hair">
          <div class="tnum sticky left-0 z-20 flex w-[56px] shrink-0 items-center border-r-2 border-strong bg-surface pl-2 text-300 font-bold">
            {{ label(room) }}
          </div>
          <div class="relative flex-1">
            <div
              v-for="(d, i) in columns" :key="d"
              class="absolute inset-y-0 w-[44px] border-r border-hair"
              :class="weekend(d) ? 'bg-sunken' : ''"
              :style="{ left: `${i * cell}px` }"
            />
            <!-- Полоса от середины дня заезда до середины дня выезда: встык = касание -->
            <button
              v-for="bar in barsFor(room)" :key="bar.booking.id"
              class="absolute top-[7px] flex h-[34px] items-center overflow-hidden whitespace-nowrap rounded-sm px-2 text-100 font-bold"
              :class="barClass(bar.booking.status)"
              :style="{ left: `${bar.left}px`, width: `${bar.width}px` }"
              @click="emit('open', bar.booking.id)"
            >{{ bar.booking.guest.fullName.split(' ')[0] }}</button>
          </div>
        </div>
      </div>
    </div>
    <p class="p-4 text-100 text-secondary">
      Полоса начинается в середине дня заезда: выезд и заезд в один день стыкуются, а не пересекаются.
    </p>
  </div>
</template>
