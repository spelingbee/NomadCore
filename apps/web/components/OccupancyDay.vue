<script setup lang="ts">
import { addDays, toDay } from "~/utils/dates"
import { statusColorVar, statusGlyph } from "~/utils/status"

/**
 * Режим «День» — умолчание. Выигрывает вопрос «что у меня сегодня», который
 * задают двадцать раз в день, и это прямой аналог страницы бумажной тетради.
 *
 * Стык [checkIn, checkOut) подписан СЛОВАМИ: «Ким Мария → Chen Wei» плюс
 * плашка «Стык» и пояснение под ней. Геометрию здесь читать нечего, поэтому
 * единственный способ не соврать — сказать прямым текстом, что номер свободен
 * для нового гостя в тот же день.
 */
const { t } = useI18n()
const { longDay, freeText } = useDateText()
const { rooms, today, occupiedOn, leavingOn, isTurnDay, freeRooms } =
  useAvailability()

const cursor = ref(today.value)
watch(today, (v) => { if (!cursor.value) cursor.value = v })

const freeCount = computed(
  () => freeRooms(cursor.value, addDays(cursor.value, 1)).length,
)

const list = computed(() =>
  rooms.value.map((room) => {
    const booking = occupiedOn(room, cursor.value)
    const leaving = leavingOn(room, cursor.value)
    const turn = isTurnDay(room, cursor.value)
    return { room, booking, leaving, turn }
  }),
)
</script>

<template>
  <div>
    <div class="nav">
      <NcButton variant="secondary" size="sm" :aria-label="t('occupancy.prevDay')" @click="cursor = addDays(cursor, -1)">
        <NcIcon name="back" />
      </NcButton>
      <div class="nav__mid">
        <div class="nav__day">{{ longDay(cursor) }}</div>
        <div class="nav__free" :class="{ 'nav__free--none': !freeCount }">
          {{ freeCount
            ? t('occupancy.freeOf', { free: freeText(freeCount), total: rooms.length })
            : t('occupancy.fullBooked', { total: rooms.length }) }}
        </div>
      </div>
      <NcButton variant="secondary" size="sm" :aria-label="t('occupancy.nextDay')" @click="cursor = addDays(cursor, 1)">
        <NcIcon name="forward" />
      </NcButton>
    </div>

    <!-- Тап-цель — вся строка: отдельная кнопка на имени не набирает 44px -->
    <div
      v-for="item in list"
      :key="item.room.id"
      :role="item.booking ? 'button' : undefined"
      :tabindex="item.booking ? 0 : undefined"
      class="rowhit"
      @click="item.booking && navigateTo(`/booking/${item.booking.id}`)"
      @keydown.enter="item.booking && navigateTo(`/booking/${item.booking.id}`)"
      @keydown.space.prevent="item.booking && navigateTo(`/booking/${item.booking.id}`)"
    >
    <NcRow
      :marker="item.booking ? statusColorVar(item.booking.status) : undefined"
      :interactive="!!item.booking"
    >
      <template #head>
        <RoomChip :label="item.room.label" :occupied="!!item.booking" />
        <span class="who">
          <template v-if="item.turn">
            {{ item.leaving?.guest?.name }} → {{ item.booking?.guest?.name }}
          </template>
          <template v-else-if="item.booking">
            <span class="who__glyph" aria-hidden="true">{{ statusGlyph(item.booking.status) }}</span>
            {{ item.booking.guest?.name }}
          </template>
          <template v-else>{{ t('occupancy.free') }}</template>
        </span>
      </template>

      <template #meta>
        <!-- Стык объяснён словами, а не только стрелкой -->
        <span v-if="item.turn" class="turnhint">{{ t('occupancy.turnHint') }}</span>
        <span v-else-if="item.leaving && !item.booking">
          {{ t('occupancy.leftToday', { guest: item.leaving.guest?.name ?? '' }) }}
        </span>
        <span v-else-if="!item.booking">{{ item.room.roomType?.name }}</span>
        <span v-else-if="toDay(item.booking.checkIn) === cursor">{{ t('occupancy.arrival') }}</span>
        <span v-else-if="toDay(item.booking.checkOut) === cursor">{{ t('occupancy.departure') }}</span>
      </template>

      <template #tags>
        <NcPill v-if="item.turn" tone="outline">{{ t('occupancy.turn') }}</NcPill>
        <NcPill v-else-if="item.booking" :status="item.booking.status">
          {{ t(`booking.status.${item.booking.status}`) }}
        </NcPill>
        <NcPill v-else tone="outline">{{ t('occupancy.free') }}</NcPill>
      </template>
    </NcRow>
    </div>
  </div>
</template>

<style scoped>
.nav {
  display: flex;
  align-items: center;
  gap: var(--nc-space-8);
  padding: 0 var(--nc-space-12) var(--nc-space-12);
}
.nav__mid { flex: 1; min-width: 0; text-align: center; }
.nav__day {
  font-size: var(--nc-fs-300);
  line-height: var(--nc-lh-300);
  font-weight: var(--nc-fw-bold);
}
.nav__free {
  font-size: var(--nc-fs-200);
  line-height: var(--nc-lh-200);
  font-weight: var(--nc-fw-medium);
  color: var(--nc-text-primary);
}
/* Текстовый токен, а не кнопочный: action-danger-fg на canvas даёт 5,9:1 */
.nav__free--none { color: var(--nc-signal-error-fg); }

.rowhit[role='button'] { cursor: pointer; }
.who {
  min-width: 0;
  color: var(--nc-text-primary);
  font-size: var(--nc-fs-300);
  line-height: var(--nc-lh-300);
  font-weight: var(--nc-fw-medium);
}
.who__glyph { color: var(--nc-text-secondary); }
.turnhint { white-space: normal !important; }
</style>
