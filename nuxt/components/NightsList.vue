<script setup lang="ts">
import { plural } from '~/utils/plural'
import type { NightRow } from '~/composables/useAvailability'

/**
 * Режим «Ночи» — второй по умолчанию после «Дня».
 *
 * Выбран вместо классической сетки по итогам замера на 360px: отвечает на
 * «есть ли места на выходные» за один тап и одним большим пальцем, тогда как
 * сетка требует горизонтального скролла и двух рук.
 */
defineProps<{ nights: NightRow[]; today: string; totalRooms: number }>()
const emit = defineEmits<{ open: [string] }>()

const expanded = ref<string | null>(null)
const toggle = (date: string) => { expanded.value = expanded.value === date ? null : date }

const dow = (iso: string) =>
  ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][new Date(iso + 'T00:00:00Z').getUTCDay()]
const dayNum = (iso: string) => new Date(iso + 'T00:00:00Z').getUTCDate()
</script>

<template>
  <section
    v-for="n in nights" :key="n.date"
    class="border-b border-line"
    :class="n.date === today ? 'bg-band' : (n.full ? 'bg-[var(--nc-signal-error-bg)]' : 'bg-surface')"
  >
    <button class="flex min-h-touch w-full items-center gap-4 p-4 text-left" @click="toggle(n.date)">
      <span class="w-[52px] shrink-0 text-center">
        <span class="tnum block text-400 font-bold">{{ dayNum(n.date) }}</span>
        <span class="block text-100" :class="n.weekend ? 'font-bold text-primary' : 'text-secondary'">{{ dow(n.date) }}</span>
      </span>

      <span class="min-w-0 flex-1">
        <!-- Главное число строки: сколько свободно. Ради него режим и существует -->
        <span class="block text-300 font-bold" :class="n.full ? 'text-danger' : 'text-primary'">
          {{ n.full ? `Занято всё, ${totalRooms} из ${totalRooms}` : `${n.free.length} ${plural(n.free.length, 'свободен', 'свободно', 'свободных')} / ${totalRooms}` }}
        </span>
        <span class="mt-1 flex flex-wrap gap-1">
          <template v-if="n.full">
            <span class="rounded-sm bg-[var(--nc-action-danger-fg)] px-2 py-px text-100 font-bold text-[var(--nc-status-fg)]">мест нет</span>
          </template>
          <template v-else>
            <span
              v-for="r in n.free.slice(0, 6)" :key="r.id"
              class="tnum inline-block min-w-[28px] rounded-sm px-2 py-px text-center text-100 font-bold shadow-[inset_0_0_0_2px_var(--nc-border-strong)]"
            >{{ r.label }}</span>
            <span v-if="n.free.length > 6" class="rounded-sm bg-band px-2 py-px text-100 font-bold">+{{ n.free.length - 6 }}</span>
          </template>
        </span>
      </span>

      <span class="flex h-9 w-9 shrink-0 items-center justify-center text-300 text-secondary">
        {{ expanded === n.date ? '▴' : '▾' }}
      </span>
    </button>

    <div v-if="expanded === n.date" class="border-t border-hair bg-sunken px-4 pb-3 pt-1">
      <component
        :is="cell.booking ? 'button' : 'div'"
        v-for="cell in n.occupancy" :key="cell.room.id"
        class="flex w-full items-center gap-3 border-b border-hair py-2 text-left"
        @click="cell.booking && emit('open', cell.booking.id)"
      >
        <span
          class="tnum min-w-[40px] shrink-0 rounded-sm px-2 py-px text-center text-100 font-bold"
          :class="cell.booking
            ? `text-[var(--nc-status-fg)] ${{ HOLD: 'bg-hold', CONFIRMED: 'bg-confirmed', CHECKED_IN: 'bg-inhouse', CHECKED_OUT: 'bg-[var(--nc-status-out)]' }[cell.booking.status]}`
            : 'shadow-[inset_0_0_0_2px_var(--nc-border-strong)]'"
        >{{ cell.room.label }}</span>

        <span class="min-w-0 flex-1 text-200" :class="cell.booking ? 'font-semibold text-primary' : 'text-secondary'">
          {{ cell.booking?.guest.fullName ?? 'Свободно' }}
        </span>

        <!-- Стык виден без специальной пометки: ночь принадлежит ровно одному гостю -->
        <span class="shrink-0 text-100 text-secondary">
          {{ cell.booking
            ? (cell.booking.checkIn === n.date ? 'заезд' : '')
            : (cell.leaving ? `выехал ${cell.leaving.guest.fullName.split(' ')[0]}` : '') }}
        </span>
      </component>
    </div>
  </section>
</template>
