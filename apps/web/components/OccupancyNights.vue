<script setup lang="ts">
import { statusGlyph } from "~/utils/status"

/**
 * Режим «Ночи» — второй, и он же забрал у «Сетки» её главную работу.
 *
 * Замер на 360px: «есть ли места на выходные» решается здесь одним тапом,
 * вертикальным скроллом и одной рукой, тогда как сетке нужен горизонтальный
 * скролл и две руки. «Когда 2 свободные ночи подряд» — тоже один тап против
 * сканирования 140 клеток.
 *
 * Полуинтервал [checkIn, checkOut) здесь невозможно прочитать неправильно
 * ПО ПОСТРОЕНИЮ: строка и есть ночь, у ночи ровно один постоялец, никакого
 * «наложения» не существует и объяснять нечего.
 */
const { t } = useI18n()
const { shortWeekday, freeText } = useDateText()
const { nightRows, rooms, today } = useAvailability()

const openNight = ref<string | null>(null)

/** Раскрыта по умолчанию первая полностью занятая ночь — это и есть новость. */
watchEffect(() => {
  if (openNight.value === null) {
    openNight.value = nightRows.value.find((n) => n.full)?.date ?? null
  }
})

const MAX_CHIPS = 6
</script>

<template>
  <section
    v-for="night in nightRows"
    :key="night.date"
    class="night"
    :class="{
      'night--today': night.date === today,
      'night--full': night.full && night.date !== today,
    }"
  >
    <button class="night__head" type="button" @click="openNight = openNight === night.date ? null : night.date">
      <span class="night__date">
        <span class="night__num nc-tnum">{{ dayNumber(night.date) }}</span>
        <span class="night__dow" :class="{ 'night__dow--weekend': night.weekend }">
          {{ shortWeekday(night.date) }}
        </span>
      </span>

      <span class="night__body">
        <!-- Главное число строки: сколько свободно. Ради него режим существует -->
        <span class="night__free" :class="{ 'night__free--none': night.full }">
          {{ night.full
            ? t('occupancy.fullBooked', { total: rooms.length })
            : t('occupancy.freeOf', { free: freeText(night.free.length), total: rooms.length }) }}
        </span>
        <span class="night__chips">
          <NcPill v-if="night.full" tone="error">{{ t('occupancy.noFree') }}</NcPill>
          <template v-else>
            <NcPill v-for="room in night.free.slice(0, MAX_CHIPS)" :key="room.id" tone="outline">
              {{ room.label }}
            </NcPill>
            <NcPill v-if="night.free.length > MAX_CHIPS" tone="neutral">
              {{ t('booking.andMore', { n: night.free.length - MAX_CHIPS }) }}
            </NcPill>
          </template>
        </span>
      </span>

      <span class="night__caret" aria-hidden="true">{{ openNight === night.date ? '▴' : '▾' }}</span>
    </button>

    <div v-if="openNight === night.date" class="detail">
      <div
        v-for="cell in night.cells"
        :key="cell.room.id"
        class="detail__row"
        :role="cell.booking ? 'button' : undefined"
        :tabindex="cell.booking ? 0 : undefined"
        @click="cell.booking && navigateTo(`/booking/${cell.booking.id}`)"
        @keydown.enter="cell.booking && navigateTo(`/booking/${cell.booking.id}`)"
        @keydown.space.prevent="cell.booking && navigateTo(`/booking/${cell.booking.id}`)"
      >
        <RoomChip :label="cell.room.label" :occupied="!!cell.booking" />
        <span class="detail__who" :class="{ 'detail__who--free': !cell.booking }">
          <span v-if="cell.booking" class="detail__glyph" aria-hidden="true">
            {{ statusGlyph(cell.booking.status) }}
          </span>
          {{ cell.booking ? cell.booking.guest?.name : t('occupancy.free') }}
        </span>
        <!-- Статус подписан словом ВСЕГДА: тон один на всю колонку не работает -->
        <span class="detail__note">
          <template v-if="cell.booking">{{ t(`booking.status.${cell.booking.status}`) }}</template>
          <template v-else-if="cell.leaving">
            {{ t('occupancy.leftToday', { guest: cell.leaving.guest?.name ?? '' }) }}
          </template>
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.night {
  background: var(--nc-bg-surface);
  border-bottom: var(--nc-stroke-hair) solid var(--nc-border-line);
}
.night--today { background: var(--nc-bg-band); }
.night--full { background: var(--nc-signal-error-bg); }

.night__head {
  display: flex;
  align-items: center;
  gap: var(--nc-space-12);
  width: 100%;
  min-height: var(--nc-touch-min);
  padding: var(--nc-space-12);
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
  font-family: var(--nc-font-sans);
}
.night__date { flex: none; width: var(--nc-space-48); text-align: center; }
.night__num {
  display: block;
  font-size: var(--nc-fs-400);
  line-height: var(--nc-lh-400);
  font-weight: var(--nc-fw-bold);
  color: var(--nc-text-primary);
}
.night__dow {
  display: block;
  font-size: var(--nc-fs-100);
  line-height: var(--nc-lh-100);
  color: var(--nc-text-secondary);
}
.night__dow--weekend { color: var(--nc-text-primary); font-weight: var(--nc-fw-bold); }

.night__body { flex: 1; min-width: 0; }
.night__free {
  display: block;
  font-size: var(--nc-fs-300);
  line-height: var(--nc-lh-300);
  font-weight: var(--nc-fw-bold);
  color: var(--nc-text-primary);
}
/* Именно signal-error-fg, а не action-danger-fg: последний рассчитан на
   контур кнопки поверх surface и на фоне signal-error-bg даёт 5,45:1 —
   ниже порога 7:1 для основного текста. Здесь нужен текстовый токен. */
.night__free--none { color: var(--nc-signal-error-fg); }
.night__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--nc-space-4);
  margin-top: var(--nc-space-4);
}
.night__caret {
  flex: none;
  color: var(--nc-text-secondary);
  font-size: var(--nc-fs-300);
}

.detail {
  padding: 0 var(--nc-space-12) var(--nc-space-12);
  background: var(--nc-bg-sunken);
  border-top: var(--nc-stroke-hair) solid var(--nc-border-hair);
}
.detail__row {
  display: flex;
  align-items: center;
  gap: var(--nc-space-8);
  min-height: var(--nc-touch-min);
  border-bottom: var(--nc-stroke-hair) solid var(--nc-border-hair);
}
.detail__row:last-child { border-bottom: 0; }
.detail__row[role='button'] { cursor: pointer; }
.detail__who {
  flex: 1;
  min-width: 0;
  font-size: var(--nc-fs-200);
  line-height: var(--nc-lh-200);
  font-weight: var(--nc-fw-medium);
  color: var(--nc-text-primary);
}
.detail__who--free { font-weight: var(--nc-fw-regular); color: var(--nc-text-secondary); }
.detail__glyph { color: var(--nc-text-secondary); }
.detail__note {
  flex: none;
  font-size: var(--nc-fs-100);
  line-height: var(--nc-lh-100);
  color: var(--nc-text-secondary);
}
</style>
