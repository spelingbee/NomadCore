<script setup lang="ts">
import type { BookingStatus } from "~/types"
import { dayNumber, isWeekend } from "~/utils/dates"
import { statusGlyph } from "~/utils/status"

/**
 * Режим «Сетка» — ТРЕТИЙ, не умолчание.
 *
 * На 360px требует горизонтального скролла и двух рук, поэтому проиграл
 * замер режимам «День» и «Ночи». Оставлен потому, что единственный отвечает
 * на вопрос «куда переселить гостя»: только здесь виден весь диапазон сразу.
 *
 * Полуинтервал показан ГЕОМЕТРИЕЙ: полоса идёт от середины дня заезда до
 * середины дня выезда, поэтому две брони встык соприкасаются с зазором, а не
 * перекрываются. Легенда под сеткой объясняет глифы, а не цвета.
 */
const { t } = useI18n()
const { shortWeekday } = useDateText()
const { rooms, columns, today, barsFor, cell } = useAvailability()

const LEGEND: BookingStatus[] = ["HOLD", "CONFIRMED", "CHECKED_IN"]

/**
 * Подпись полосы выводится из её ширины. Бронь на одну ночь — полоса 40px,
 * фамилия туда не влезет никогда, а молча обрезанное «Петр» читается как
 * законченная другая фамилия. Поэтому усечение всегда помечено многоточием,
 * а совсем узкая полоса остаётся пустой заливкой с одним глифом.
 */
function barLabel(fullName: string, width: number): string {
  const name = fullName.split(" ")[0] ?? ""
  // Глиф с отступом печатается всегда и в бюджет имени не входит
  const cap = Math.floor((width - 22) / 8.4)
  if (name.length <= cap) return name
  if (cap >= 3) return `${name.slice(0, cap - 1)}…`
  return ""
}

const trackWidth = computed(() => `${columns.value.length * cell}px`)
</script>

<template>
  <div>
    <div class="scroll">
      <div class="track" :style="{ width: `calc(var(--nc-grid-label-w) + ${trackWidth})` }">
        <div class="head">
          <div class="head__corner" />
          <div
            v-for="day in columns"
            :key="day"
            class="head__day"
            :class="{ 'head__day--today': day === today, 'head__day--weekend': isWeekend(day) }"
            :style="{ width: `${cell}px` }"
          >
            <div class="head__dow">{{ shortWeekday(day) }}</div>
            <div class="head__num nc-tnum">{{ dayNumber(day) }}</div>
          </div>
        </div>

        <div v-for="room in rooms" :key="room.id" class="row">
          <div class="row__label nc-tnum">{{ room.label }}</div>
          <div class="row__track">
            <div
              v-for="(day, i) in columns"
              :key="day"
              class="cellbg"
              :class="{ 'cellbg--today': day === today, 'cellbg--weekend': isWeekend(day) }"
              :style="{ left: `${i * cell}px`, width: `${cell}px` }"
            />
            <button
              v-for="bar in barsFor(room)"
              :key="bar.booking.id"
              type="button"
              class="bar"
              :class="`bar--${bar.booking.status.toLowerCase()}`"
              :style="{ left: `${bar.left}px`, width: `${bar.width}px` }"
              :title="`${bar.booking.guest?.name} · ${t(`booking.status.${bar.booking.status}`)}`"
              @click="navigateTo(`/booking/${bar.booking.id}`)"
            >
              <span class="bar__glyph" aria-hidden="true">{{ statusGlyph(bar.booking.status) }}</span>
              <span class="bar__name">{{ barLabel(bar.booking.guest?.name ?? '', bar.width) }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Легенда объясняет ГЛИФЫ: они переживают обесцвечивание, цвет — нет -->
    <div class="legend">
      <span class="legend__title">{{ t('occupancy.legend') }}</span>
      <span v-for="status in LEGEND" :key="status" class="legend__item">
        <span class="bar legend__chip" :class="`bar--${status.toLowerCase()}`">
          <span class="bar__glyph" aria-hidden="true">{{ statusGlyph(status) }}</span>
        </span>
        {{ t(`booking.status.${status}`) }}
      </span>
    </div>
    <p class="note">{{ t('occupancy.gridNote') }}</p>
  </div>
</template>

<style scoped>
.scroll {
  overflow-x: auto;
  background: var(--nc-bg-surface);
  border-top: var(--nc-stroke-hair) solid var(--nc-border-line);
  border-bottom: var(--nc-stroke-hair) solid var(--nc-border-line);
}
.head { display: flex; border-bottom: var(--nc-stroke-control) solid var(--nc-border-strong); }
.head__corner {
  position: sticky;
  left: 0;
  z-index: 2;
  flex: none;
  width: var(--nc-grid-label-w);
  background: var(--nc-bg-surface);
  border-right: var(--nc-stroke-control) solid var(--nc-border-strong);
}
.head__day {
  flex: none;
  padding: var(--nc-space-4) 0;
  text-align: center;
  background: var(--nc-bg-surface);
}
.head__day--weekend { background: var(--nc-bg-sunken); }
.head__day--today { background: var(--nc-bg-band); }
.head__dow { font-size: var(--nc-fs-100); line-height: var(--nc-lh-100); color: var(--nc-text-secondary); }
.head__num { font-size: var(--nc-fs-200); line-height: var(--nc-lh-200); font-weight: var(--nc-fw-bold); }

/* 56, а не 44: полоса внутри отбита сверху и снизу на 4px, и при высоте
   строки 44 её собственная высота падала до 36 — ниже предела тап-цели. */
.row { display: flex; min-height: var(--nc-touch-action); border-bottom: var(--nc-stroke-hair) solid var(--nc-border-hair); }
.row__label {
  position: sticky;
  left: 0;
  z-index: 2;
  flex: none;
  display: flex;
  align-items: center;
  width: var(--nc-grid-label-w);
  padding-left: var(--nc-space-8);
  background: var(--nc-bg-surface);
  border-right: var(--nc-stroke-control) solid var(--nc-border-strong);
  font-size: var(--nc-fs-200);
  line-height: var(--nc-lh-200);
  font-weight: var(--nc-fw-bold);
  /* Страховка на случай ярлыка длиннее расчётного: обрезаем многоточием,
     а не выпускаем поверх сетки */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.row__track { position: relative; flex: 1; }
.cellbg {
  position: absolute;
  top: 0;
  bottom: 0;
  border-right: var(--nc-stroke-hair) solid var(--nc-border-hair);
}
.cellbg--weekend { background: var(--nc-bg-sunken); }
.cellbg--today { background: var(--nc-bg-band); }

.bar {
  position: absolute;
  top: var(--nc-space-4);
  bottom: var(--nc-space-4);
  display: flex;
  align-items: center;
  gap: var(--nc-space-2);
  overflow: hidden;
  padding: 0 var(--nc-space-4);
  border: 0;
  border-radius: var(--nc-radius-sm);
  font-family: var(--nc-font-sans);
  font-size: var(--nc-fs-100);
  line-height: var(--nc-lh-100);
  font-weight: var(--nc-fw-bold);
  white-space: nowrap;
  cursor: pointer;
}
/* Заливка + КОНТУР + ГЛИФ: три канала, потому что тона выровнены по светлоте
   и в градациях серого CONFIRMED и CHECKED_IN дают контраст 1,01:1 */
.bar--hold {
  background: var(--nc-bg-surface);
  color: var(--nc-text-primary);
  box-shadow: inset 0 0 0 var(--nc-stroke-control) var(--nc-status-hold);
}
.bar--confirmed {
  background: var(--nc-status-confirmed);
  color: var(--nc-status-fg);
  box-shadow: inset 0 0 0 var(--nc-stroke-control) var(--nc-bg-surface);
}
.bar--checked_in { background: var(--nc-status-inhouse); color: var(--nc-status-fg); }
.bar--checked_out { background: var(--nc-status-out); color: var(--nc-status-out-fg); }
.bar--cancelled { background: var(--nc-status-cancelled); color: var(--nc-status-fg); }
.bar__glyph { flex: none; }
.bar__name { overflow: hidden; text-overflow: ellipsis; }

.legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--nc-space-4) var(--nc-space-12);
  padding: var(--nc-space-12) var(--nc-space-12) 0;
  font-size: var(--nc-fs-100);
  line-height: var(--nc-lh-100);
  color: var(--nc-text-secondary);
}
.legend__title { font-weight: var(--nc-fw-bold); color: var(--nc-text-primary); }
.legend__item { display: inline-flex; align-items: center; gap: var(--nc-space-4); }
.legend__chip {
  position: static;
  width: var(--nc-space-24);
  height: var(--nc-space-16);
  justify-content: center;
  cursor: default;
}
.note {
  margin: var(--nc-space-8) 0 0;
  padding: 0 var(--nc-space-12) var(--nc-space-12);
  font-size: var(--nc-fs-100);
  line-height: var(--nc-lh-100);
  color: var(--nc-text-secondary);
}
</style>
