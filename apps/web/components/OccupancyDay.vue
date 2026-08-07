<script setup lang="ts">
import { addDays, nights, toDay } from "~/utils/dates"
import { statusColorVar, statusGlyph } from "~/utils/status"

/**
 * Режим «День» — умолчание. Отвечает на «что у меня сегодня» одним взглядом,
 * и главное требование к нему — весь дом на экране без прокрутки.
 *
 * Строка держится на ДВУХ вертикалях, а не на четырёх отступах:
 *   слева  — номер и кто в нём, под ним факты;
 *   справа — что с ним происходит сегодня одним словом.
 * Взгляд идёт двумя колонками сверху вниз, а не зигзагом по строке.
 *
 * Пояснение к стыку живёт ОДИН раз под заголовком дня. Раньше оно стояло
 * в каждой строке целым предложением, было самым длинным текстом на экране
 * и вытесняло собой данные — а строка списка обязана нести факты, а не
 * сноску. Сам стык читается из строки: «Ким → Chen», метка «Стык» справа
 * и «ночь 1 из 3» снизу.
 */
const { t } = useI18n()
const { longDay, dateRange, freeText } = useDateText()
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

    if (!booking) {
      return {
        room,
        booking: null,
        // Свободный номер — одна строка без дубля. Раньше слово «Свободно»
        // стояло и в строке, и в плашке справа: слово дублировало само себя.
        name: t("occupancy.free"),
        facts: leaving
          ? t("occupancy.leftToday", { guest: leaving.guest?.name ?? "" })
          : (room.roomType?.name ?? ""),
        mark: "",
        glyph: "",
      }
    }

    const from = toDay(booking.checkIn)
    const to = toDay(booking.checkOut)
    const total = nights(from, to)
    /* Какая это ночь по счёту. Для стыка всегда первая — и это ровно то,
       что делает стык понятным без объяснений. */
    const index = nights(from, cursor.value) + 1

    /* Статус выигрывает у события: HOLD, заезжающий сегодня, не должен
       получить метку «Заезд» — это как раз та бронь, по которой владельцу
       нужно принять решение. */
    let mark: string
    if (booking.status === "HOLD") mark = t("booking.status.HOLD")
    else if (turn) mark = t("occupancy.turn")
    else if (from === cursor.value) mark = t("occupancy.arrival")
    else mark = t(`booking.status.${booking.status}`)

    return {
      room,
      booking,
      name: turn
        ? `${leaving?.guest?.name ?? ""} → ${booking.guest?.name ?? ""}`
        : (booking.guest?.name ?? ""),
      facts: `${dateRange(booking.checkIn, booking.checkOut)} · ${t("occupancy.nightOf", { i: index, n: total })}`,
      mark,
      glyph: statusGlyph(booking.status),
    }
  }),
)

const hasTurn = computed(() => list.value.some((i) => i.booking && isTurnDay(i.room, cursor.value)))

function open(bookingId: string | undefined) {
  if (bookingId) navigateTo(`/booking/${bookingId}`)
}
</script>

<template>
  <div>
    <div class="nav">
      <!-- Тихие, а не обведённые: перелистывание день-за-днём — наименее
           важное действие экрана, и двумя тяжёлыми квадратами оно
           перетягивало на себя взгляд раньше содержимого. -->
      <NcButton variant="quiet" size="sm" :aria-label="t('occupancy.prevDay')" @click="cursor = addDays(cursor, -1)">
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
      <NcButton variant="quiet" size="sm" :aria-label="t('occupancy.nextDay')" @click="cursor = addDays(cursor, 1)">
        <NcIcon name="forward" />
      </NcButton>
    </div>

    <!-- Объяснение стыка — один раз на экран и только когда стык есть -->
    <p v-if="hasTurn" class="turnnote">{{ t('occupancy.turnNote') }}</p>

    <div
      v-for="item in list"
      :key="item.room.id"
      class="row"
      :class="{ 'row--free': !item.booking }"
      :role="item.booking ? 'button' : undefined"
      :tabindex="item.booking ? 0 : undefined"
      @click="open(item.booking?.id)"
      @keydown.enter="open(item.booking?.id)"
      @keydown.space.prevent="open(item.booking?.id)"
    >
      <span
        v-if="item.booking"
        class="row__marker"
        :style="{ background: statusColorVar(item.booking.status) }"
      />
      <RoomChip :label="item.room.label" :occupied="!!item.booking" />

      <span class="row__body">
        <span class="row__name">{{ item.name }}</span>
        <span class="row__facts">{{ item.facts }}</span>
      </span>

      <span v-if="item.mark" class="row__mark">
        <span class="row__glyph" aria-hidden="true">{{ item.glyph }}</span>
        {{ item.mark }}
      </span>
      <!-- Признак нажимаемости: раньше строка открывала карточку, но об этом
           ничто не сообщало -->
      <span v-if="item.booking" class="row__go" aria-hidden="true">›</span>
    </div>
  </div>
</template>

<style scoped>
.nav {
  display: flex;
  align-items: center;
  gap: var(--nc-space-8);
  padding: 0 var(--nc-space-12) var(--nc-space-8);
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
.nav__free--none { color: var(--nc-signal-error-fg); }

.turnnote {
  margin: 0;
  padding: 0 var(--nc-space-12) var(--nc-space-8);
  font-size: var(--nc-fs-100);
  line-height: var(--nc-lh-100);
  color: var(--nc-text-secondary);
}

.row {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--nc-space-8);
  min-height: var(--nc-touch-action);
  padding: var(--nc-space-8) var(--nc-space-12);
  background: var(--nc-bg-surface);
  border-bottom: var(--nc-stroke-hair) solid var(--nc-border-line);
}
.row[role='button'] { cursor: pointer; }
.row--free { background: var(--nc-bg-sunken); }
.row__marker { position: absolute; inset: 0 auto 0 0; width: var(--nc-stroke-accent); }

.row__body { flex: 1; min-width: 0; }
.row__name {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: var(--nc-fs-300);
  line-height: var(--nc-lh-300);
  font-weight: var(--nc-fw-medium);
  color: var(--nc-text-primary);
}
.row--free .row__name { font-weight: var(--nc-fw-regular); color: var(--nc-text-secondary); }
.row__facts {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: var(--nc-fs-100);
  line-height: var(--nc-lh-100);
  color: var(--nc-text-secondary);
}

/* Правая вертикаль: одно слово про то, что с номером сегодня */
.row__mark {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: var(--nc-space-4);
  font-size: var(--nc-fs-100);
  line-height: var(--nc-lh-100);
  font-weight: var(--nc-fw-bold);
  color: var(--nc-text-primary);
  white-space: nowrap;
}
.row__glyph { color: var(--nc-text-secondary); }
.row__go {
  flex: none;
  font-size: var(--nc-fs-300);
  line-height: var(--nc-lh-300);
  color: var(--nc-text-tertiary);
}
</style>
