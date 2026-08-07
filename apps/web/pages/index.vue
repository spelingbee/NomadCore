<script setup lang="ts">
import type { Booking } from "~/types"

/**
 * «Сегодня» отвечает на вопрос «что мне делать прямо сейчас» БЕЗ прокрутки.
 *
 * Раскладка выведена из высоты 360×780: 780 − 34 (связь) − 60 (шапка)
 * − 76 (действие) − 56 (навигация) = 554px на содержимое. Шесть строк списка
 * туда не влезают, поэтому первым идёт счётчик из трёх плиток: он и есть
 * ответ. Список ниже — уже работа, а не ориентировка. Плитки заодно
 * фильтруют список, чтобы не заводить отдельный элемент управления.
 *
 * Залитая кнопка на экране ровно одна — «Подтвердить · имя» внизу, и она
 * есть только тогда, когда есть чего подтверждать. Когда ждущих броней нет,
 * залитых кнопок ноль: экран ничего не требует, и это ответ, а не пустота.
 */
const { t, locale, setLocale } = useI18n()
const { property, rooms, failed: propertyFailed } = useProperty()
const {
  holds,
  arrivals,
  departures,
  failed: bookingsFailed,
  changeStatus,
} = useBookings()

type Tile = "in" | "out" | "hold"
const filter = ref<Tile | null>(null)

const tiles = computed(() => [
  { key: "in" as const, n: arrivals.value.length, label: t("today.arrivals") },
  { key: "out" as const, n: departures.value.length, label: t("today.departures") },
  { key: "hold" as const, n: holds.value.length, label: t("today.waiting") },
])

/** Порядок без фильтра — по срочности: решение → выезд → заезд. */
const rows = computed<Booking[]>(() => {
  if (filter.value === "hold") return holds.value
  if (filter.value === "out") return departures.value
  if (filter.value === "in") return arrivals.value
  return [...holds.value, ...departures.value, ...arrivals.value]
})

const listTitle = computed(() => {
  if (!filter.value) return t("today.priority")
  return tiles.value.find((x) => x.key === filter.value)?.label ?? ""
})

/* Выселение — единственное действие списка, которое расходится с физическим
   миром: статус меняется, а гость остаётся в номере. Промах пальцем или
   свайп мимо строки стоит дороже лишнего тапа, поэтому спрашиваем. */
const pendingCheckout = ref<Booking | null>(null)

async function advance(booking: Booking) {
  if (booking.status === "CHECKED_IN") {
    pendingCheckout.value = booking
    return
  }
  const next = booking.status === "HOLD" ? "CONFIRMED" : "CHECKED_IN"
  await changeStatus(booking, next).catch(() => {})
}

async function confirmCheckout() {
  const booking = pendingCheckout.value
  pendingCheckout.value = null
  if (booking) await changeStatus(booking, "CHECKED_OUT").catch(() => {})
}

const primaryHold = computed(() => holds.value[0] ?? null)

function toggleLocale() {
  setLocale(locale.value === "ru" ? "ky" : "ru")
}
</script>

<template>
  <header class="head">
    <div class="head__text">
      <h1 class="head__name">{{ property?.name }}</h1>
      <p class="head__meta">
        <span v-if="property?.address">{{ property.address }}</span>
        <span>{{ t('today.roomsCount', { n: rooms.length }) }}</span>
      </p>
    </div>
    <NcButton variant="quiet" size="sm" @click="toggleLocale">
      {{ locale === 'ru' ? 'КЫР' : 'РУС' }}
    </NcButton>
  </header>

  <main class="main">
    <NcBanner v-if="propertyFailed || bookingsFailed" tone="warning">
      {{ t('today.loadFailed') }}
    </NcBanner>

    <!-- Ответ на «что сейчас» — до всякой прокрутки -->
    <div class="tiles">
      <button
        v-for="tile in tiles"
        :key="tile.key"
        type="button"
        class="tile"
        :class="{ 'tile--on': filter === tile.key }"
        :aria-pressed="filter === tile.key"
        @click="filter = filter === tile.key ? null : tile.key"
      >
        <span class="tile__n nc-tnum" :class="{ 'tile__n--zero': !tile.n }">{{ tile.n }}</span>
        <span class="tile__label">{{ tile.label }}</span>
      </button>
    </div>

    <div class="listhead">
      <h2 class="listhead__title">{{ listTitle }}</h2>
      <span class="listhead__count nc-tnum">{{ rows.length }}</span>
      <NcButton v-if="filter" variant="quiet" size="sm" @click="filter = null">
        {{ t('common.all') }}
      </NcButton>
    </div>

    <BookingRow
      v-for="booking in rows"
      :key="booking.id"
      :booking="booking"
      @advance="advance"
      @open="navigateTo(`/booking/${booking.id}`)"
    />

    <p v-if="!rows.length" class="empty">{{ t('today.nothing') }}</p>
  </main>

  <!-- Главное действие экрана: ровно одно, залито, в нижней трети -->
  <footer v-if="primaryHold" class="foot">
    <NcButton size="lg" block @click="advance(primaryHold)">
      {{ t('booking.confirmWithGuest', { guest: primaryHold.guest?.name ?? '' }) }}<template
        v-if="holds.length > 1"
      >&nbsp;{{ t('booking.andMore', { n: holds.length - 1 }) }}</template>
    </NcButton>
  </footer>

  <NcSheet
    v-if="pendingCheckout"
    :title="t('booking.checkOutQuestion', { guest: pendingCheckout.guest?.name ?? '' })"
    :subtitle="t('booking.checkOutHint', { room: pendingCheckout.room?.label ?? '' })"
    @close="pendingCheckout = null"
  >
    <template #actions>
      <NcButton variant="secondary" @click="pendingCheckout = null">
        {{ t('common.cancel') }}
      </NcButton>
      <!-- Выселение не залито никогда, в том числе на своей шторке -->
      <NcButton variant="careful" block @click="confirmCheckout">
        {{ t('booking.checkOut') }}
      </NcButton>
    </template>
  </NcSheet>
</template>

<style scoped>
.head {
  display: flex;
  align-items: center;
  gap: var(--nc-space-12);
  flex: none;
  padding: var(--nc-space-12);
  background: var(--nc-bg-surface);
  border-bottom: var(--nc-stroke-hair) solid var(--nc-border-line);
}
.head__text { flex: 1; min-width: 0; }
.head__name {
  margin: 0;
  font-size: var(--nc-fs-400);
  line-height: var(--nc-lh-400);
  font-weight: var(--nc-fw-bold);
}
.head__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--nc-space-4) var(--nc-space-8);
  margin: var(--nc-space-2) 0 0;
  font-size: var(--nc-fs-100);
  line-height: var(--nc-lh-100);
  color: var(--nc-text-secondary);
}

.main { flex: 1; min-height: 0; overflow-y: auto; }

.tiles {
  display: flex;
  background: var(--nc-bg-surface);
  border-bottom: var(--nc-stroke-hair) solid var(--nc-border-line);
}
.tile {
  flex: 1;
  min-height: var(--nc-touch-min);
  padding: var(--nc-space-8) var(--nc-space-4);
  border: 0;
  border-right: var(--nc-stroke-hair) solid var(--nc-border-hair);
  border-bottom: var(--nc-stroke-accent) solid transparent;
  background: var(--nc-bg-surface);
  cursor: pointer;
}
.tile:last-child { border-right: 0; }
/* Выбранная плитка помечена фоном И полосой — не одним лишь цветом */
.tile--on {
  background: var(--nc-bg-band);
  border-bottom-color: var(--nc-border-strong);
}
.tile__n {
  display: block;
  font-size: var(--nc-fs-600);
  line-height: var(--nc-lh-600);
  font-weight: var(--nc-fw-bold);
  color: var(--nc-text-primary);
}
.tile__n--zero { color: var(--nc-text-tertiary); }
.tile__label {
  display: block;
  font-size: var(--nc-fs-100);
  line-height: var(--nc-lh-100);
  color: var(--nc-text-secondary);
}

.listhead {
  display: flex;
  align-items: center;
  gap: var(--nc-space-8);
  padding: var(--nc-space-12);
}
.listhead__title {
  margin: 0;
  font-size: var(--nc-fs-400);
  line-height: var(--nc-lh-400);
  font-weight: var(--nc-fw-bold);
}
.listhead__count {
  font-size: var(--nc-fs-200);
  line-height: var(--nc-lh-200);
  color: var(--nc-text-secondary);
}
.listhead :deep(.nc-btn) { margin-left: auto; text-decoration: underline; }

.empty {
  margin: 0;
  padding: var(--nc-space-24) var(--nc-space-16);
  text-align: center;
  font-size: var(--nc-fs-300);
  line-height: var(--nc-lh-300);
  color: var(--nc-text-secondary);
}

.foot {
  flex: none;
  padding: var(--nc-space-12);
  background: var(--nc-bg-surface);
  border-top: var(--nc-stroke-hair) solid var(--nc-border-line);
}
</style>
