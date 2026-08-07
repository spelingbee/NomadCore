<script setup lang="ts">
import type { BookingStatus } from "~/types"
import { CANCELLABLE, NEXT } from "~/types"
import { nights, toDay } from "~/utils/dates"
import { formatMoney } from "~/utils/money"

/**
 * Карточка брони — статусная машина плюс всё, что владелец правит на стойке.
 *
 * ВАЖНО про неактивные блоки. Прототип показывает здесь ещё «Документы»,
 * «Продлить на 1 ночь» и «Ранний выезд». Ни одного из них нельзя сделать
 * рабочим против текущего API:
 *   · признака предъявленного документа нет ни у Booking, ни у Guest;
 *   · PATCH /api/bookings/:id не существует вовсе — даты, номер и гость
 *     неизменяемы после создания, есть только смена статуса.
 * По решению владельца они оставлены на своих местах НЕАКТИВНЫМИ и с
 * подписью причины: так видно задуманную композицию и видно, что именно
 * блокирует бэкенд. Заглушек, которые «как будто работают», здесь нет.
 * Полный список — docs/WEB-API-GAPS.md.
 *
 * Заливка: одна кнопка внизу и только при HOLD или CONFIRMED. У гостя
 * в доме залитых кнопок ноль — экран ничего не требует. Выселение живёт
 * во второстепенных действиях приглушённым контуром: статус разойдётся
 * с физическим миром, и оно не должно выглядеть приглашением.
 */
const route = useRoute()
const { t } = useI18n()
const { dateRange } = useDateText()
const { byId, changeStatus } = useBookings()

const STEPS: BookingStatus[] = ["HOLD", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT"]

const booking = computed(() => byId(String(route.params.id)))
const stepIndex = computed(() =>
  booking.value ? STEPS.indexOf(booking.value.status) : -1,
)

const facts = computed(() => {
  const b = booking.value
  if (!b) return []
  return [
    { key: t("card.room"), value: b.room?.label ?? "—" },
    { key: t("card.dates"), value: dateRange(b.checkIn, b.checkOut) },
    { key: t("card.nights"), value: String(nights(toDay(b.checkIn), toDay(b.checkOut))) },
    { key: t("card.total"), value: formatMoney(b.priceTotal) },
  ]
})

const nextStatus = computed(() => (booking.value ? NEXT[booking.value.status] : null))
const primaryLabel = computed(() => {
  if (!booking.value) return ""
  if (booking.value.status === "HOLD") return t("booking.confirm")
  if (booking.value.status === "CONFIRMED") return t("booking.checkIn")
  return ""
})
/** Заливку получают только подтверждение и заселение — дёшево откатить. */
const showPrimary = computed(
  () =>
    booking.value?.status === "HOLD" || booking.value?.status === "CONFIRMED",
)

const askCheckout = ref(false)
const askCancel = ref(false)

async function advance() {
  const b = booking.value
  if (!b || !nextStatus.value) return
  await changeStatus(b, nextStatus.value).catch(() => {})
}

async function doCheckout() {
  const b = booking.value
  askCheckout.value = false
  if (b) await changeStatus(b, "CHECKED_OUT").catch(() => {})
}

async function doCancel() {
  const b = booking.value
  askCancel.value = false
  if (!b) return
  await changeStatus(b, "CANCELLED").catch(() => {})
  await navigateTo("/")
}
</script>

<template>
  <template v-if="booking">
    <header class="head">
      <NcButton variant="quiet" size="sm" :aria-label="t('common.back')" @click="navigateTo('/')">
        <NcIcon name="back" />
      </NcButton>
      <div class="head__text">
        <h1 class="head__name">{{ booking.guest?.name }}</h1>
        <p class="head__sub">{{ booking.room?.roomType?.name }}</p>
      </div>
      <NcPill :status="booking.status">{{ t(`booking.status.${booking.status}`) }}</NcPill>
    </header>

    <main class="main">
      <NcBanner v-if="booking.sync === 'pending'" tone="offline">
        {{ t('card.notSentHint') }}
      </NcBanner>
      <NcBanner v-else-if="booking.sync === 'conflict'" tone="error">
        {{ t('sync.conflict') }}
      </NcBanner>

      <dl class="facts">
        <div v-for="fact in facts" :key="fact.key" class="facts__item">
          <dt class="facts__key">{{ fact.key }}</dt>
          <dd class="facts__val nc-tnum">{{ fact.value }}</dd>
        </div>
      </dl>

      <ol class="steps">
        <li
          v-for="(step, i) in STEPS"
          :key="step"
          class="steps__item"
          :class="{ 'steps__item--done': i <= stepIndex, 'steps__item--now': i === stepIndex }"
        >
          <span class="steps__dot" aria-hidden="true" />
          <span class="steps__label">{{ t(`booking.status.${step}`) }}</span>
        </li>
      </ol>

      <!-- Блок на месте, но нерабочий: признака документа в схеме нет -->
      <div class="docs">
        <div class="docs__text">
          <p class="docs__label">{{ t('card.documents') }}</p>
          <p class="docs__value">{{ t('card.documentsUnknown') }}</p>
        </div>
        <NcButton variant="secondary" size="sm" disabled>{{ t('card.mark') }}</NcButton>
      </div>
      <p class="blocked">{{ t('card.blockedDocuments') }}</p>

      <div class="actions">
        <NcButton variant="secondary" size="md" align="start" block disabled>
          {{ t('card.extend') }}
        </NcButton>
        <NcButton variant="secondary" size="md" align="start" block disabled>
          {{ t('card.earlyCheckout') }}
        </NcButton>
        <p class="blocked">{{ t('card.blockedDates') }}</p>

        <NcButton
          v-if="booking.status === 'CHECKED_IN'"
          variant="careful"
          size="md"
          align="start"
          block
          @click="askCheckout = true"
        >
          {{ t('booking.checkOut') }}
        </NcButton>
        <NcButton
          v-if="CANCELLABLE.includes(booking.status)"
          variant="danger"
          size="md"
          align="start"
          block
          @click="askCancel = true"
        >
          {{ t('booking.cancelBooking') }}
        </NcButton>
      </div>
    </main>

    <footer v-if="showPrimary" class="foot">
      <NcButton size="lg" block @click="advance">{{ primaryLabel }}</NcButton>
    </footer>

    <NcSheet
      v-if="askCheckout"
      :title="t('booking.checkOutQuestion', { guest: booking.guest?.name ?? '' })"
      :subtitle="t('booking.checkOutHint', { room: booking.room?.label ?? '' })"
      @close="askCheckout = false"
    >
      <template #actions>
        <NcButton variant="secondary" @click="askCheckout = false">{{ t('common.cancel') }}</NcButton>
        <NcButton variant="careful" block @click="doCheckout">{{ t('booking.checkOut') }}</NcButton>
      </template>
    </NcSheet>

    <NcSheet
      v-if="askCancel"
      :title="t('card.cancelQuestion', { guest: booking.guest?.name ?? '' })"
      :subtitle="t('card.cancelHint')"
      @close="askCancel = false"
    >
      <template #actions>
        <NcButton variant="secondary" @click="askCancel = false">{{ t('common.cancel') }}</NcButton>
        <NcButton variant="danger" block @click="doCancel">{{ t('booking.cancelBooking') }}</NcButton>
      </template>
    </NcSheet>
  </template>

  <main v-else class="main">
    <p class="notfound">{{ t('card.notFound') }}</p>
  </main>
</template>

<style scoped>
.head {
  display: flex;
  align-items: flex-start;
  gap: var(--nc-space-8);
  flex: none;
  padding: var(--nc-space-12);
  background: var(--nc-bg-surface);
  border-bottom: var(--nc-stroke-hair) solid var(--nc-border-line);
}
.head__text { flex: 1; min-width: 0; }
.head__name {
  margin: 0;
  font-size: var(--nc-fs-500);
  line-height: var(--nc-lh-500);
  font-weight: var(--nc-fw-bold);
}
.head__sub {
  margin: var(--nc-space-2) 0 0;
  font-size: var(--nc-fs-200);
  line-height: var(--nc-lh-200);
  color: var(--nc-text-secondary);
}

.main { flex: 1; min-height: 0; overflow-y: auto; }

.facts {
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  background: var(--nc-bg-surface);
  border-bottom: var(--nc-stroke-hair) solid var(--nc-border-line);
}
.facts__item {
  flex: 1 1 50%;
  min-width: 0;
  padding: var(--nc-space-8) var(--nc-space-12);
  border-right: var(--nc-stroke-hair) solid var(--nc-border-hair);
  border-bottom: var(--nc-stroke-hair) solid var(--nc-border-hair);
}
.facts__key {
  font-size: var(--nc-fs-100);
  line-height: var(--nc-lh-100);
  font-weight: var(--nc-fw-bold);
  letter-spacing: var(--nc-tracking-caps);
  text-transform: uppercase;
  color: var(--nc-text-secondary);
}
.facts__val {
  margin: var(--nc-space-2) 0 0;
  font-size: var(--nc-fs-300);
  line-height: var(--nc-lh-300);
  font-weight: var(--nc-fw-bold);
}

.steps {
  margin: 0;
  padding: var(--nc-space-12);
  list-style: none;
  background: var(--nc-bg-surface);
  border-bottom: var(--nc-stroke-hair) solid var(--nc-border-line);
}
.steps__item {
  display: flex;
  align-items: center;
  gap: var(--nc-space-8);
  padding: var(--nc-space-2) 0;
  font-size: var(--nc-fs-200);
  line-height: var(--nc-lh-200);
  color: var(--nc-text-tertiary);
}
.steps__dot {
  flex: none;
  width: var(--nc-space-12);
  height: var(--nc-space-12);
  border-radius: var(--nc-radius-pill);
  border: var(--nc-stroke-control) solid var(--nc-text-tertiary);
  background: var(--nc-bg-surface);
}
.steps__item--done { color: var(--nc-text-primary); }
.steps__item--done .steps__dot {
  border-color: var(--nc-text-primary);
  background: var(--nc-text-primary);
}
.steps__item--now { font-weight: var(--nc-fw-bold); }

.docs {
  display: flex;
  align-items: center;
  gap: var(--nc-space-12);
  padding: var(--nc-space-12);
  background: var(--nc-signal-warning-bg);
  border-left: var(--nc-stroke-accent) solid var(--nc-status-hold);
}
.docs__text { flex: 1; min-width: 0; }
.docs__label {
  margin: 0;
  font-size: var(--nc-fs-100);
  line-height: var(--nc-lh-100);
  font-weight: var(--nc-fw-bold);
  letter-spacing: var(--nc-tracking-caps);
  text-transform: uppercase;
  color: var(--nc-signal-warning-fg);
}
.docs__value {
  margin: var(--nc-space-2) 0 0;
  font-size: var(--nc-fs-300);
  line-height: var(--nc-lh-300);
  font-weight: var(--nc-fw-medium);
  color: var(--nc-signal-warning-fg);
}

/* Подпись причины, а не молчаливая серая кнопка */
.blocked {
  margin: var(--nc-space-4) 0 0;
  padding: 0 var(--nc-space-12) var(--nc-space-8);
  font-size: var(--nc-fs-100);
  line-height: var(--nc-lh-100);
  color: var(--nc-text-secondary);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: var(--nc-space-8);
  padding: var(--nc-space-12);
}

.foot {
  flex: none;
  padding: var(--nc-space-12);
  background: var(--nc-bg-surface);
  border-top: var(--nc-stroke-hair) solid var(--nc-border-line);
}

.notfound {
  margin: 0;
  padding: var(--nc-space-24) var(--nc-space-16);
  text-align: center;
  font-size: var(--nc-fs-300);
  line-height: var(--nc-lh-300);
  color: var(--nc-text-secondary);
}
</style>
