<script setup lang="ts">
import { addDays } from "~/utils/dates"

/**
 * Создание брони. Пятая поверхность, отдельная от четырёх экранов.
 *
 * Про иерархию — здесь ОДНА расхождение с прототипом, и оно разрешено
 * в пользу правила. Прототип заливает выбранный тип номера и выбранный
 * день, то есть даёт на слое три заливки. README дизайн-системы прямо
 * говорит обратное: «переключатели режима — состояние, а не действие:
 * заливку они не берут, выбранный помечается фоном band, жирным
 * начертанием и подчёркиванием», а критерий приёмки требует ровно одну
 * заливку на слой. Поэтому селекторы здесь — состояние, а единственная
 * заливка шторки принадлежит «Создать».
 *
 * Заезд ограничен «сегодня/завтра» намеренно: владелец заводит бронь,
 * стоя у двери, а не планирует на месяц вперёд. Дальние даты — это
 * «Занятость», оттуда и открывается нужный день.
 */
const emit = defineEmits<{ close: [] }>()

const { t } = useI18n()
const { dateRange, nightsText, freeText } = useDateText()
const { property, rooms, today } = useProperty()
const { create } = useBookings()
const { freeRooms } = useAvailability()

const startDay = ref<string>("today")
const nightCount = ref(2)
const roomTypeId = ref<string>(property.value?.roomTypes?.[0]?.id ?? "")
const guestName = ref("")
const errorCode = ref<string | null>(null)
const busy = ref(false)

const checkIn = computed(() =>
  startDay.value === "today" ? today.value : addDays(today.value, 1),
)
const checkOut = computed(() => addDays(checkIn.value, nightCount.value))

const dayOptions = computed(() => [
  { value: "today", label: t("create.today") },
  { value: "tomorrow", label: t("create.tomorrow") },
])

/** Свободные номера каждого типа именно на выбранный полуинтервал. */
const typeRows = computed(() => {
  const free = freeRooms(checkIn.value, checkOut.value)
  return (property.value?.roomTypes ?? []).map((type) => ({
    type,
    free: free.filter((r) => r.roomTypeId === type.id),
  }))
})

const selectedRow = computed(() =>
  typeRows.value.find((r) => r.type.id === roomTypeId.value),
)

/**
 * Ближайшая дата, когда выбранный тип свободен на то же число ночей.
 * Показывается вместо голого «мест нет»: отказ без выхода бесполезен.
 */
const nearestFree = computed(() => {
  if (selectedRow.value?.free.length) return null
  for (let shift = 1; shift <= 14; shift++) {
    const from = addDays(checkIn.value, shift)
    const to = addDays(from, nightCount.value)
    const has = freeRooms(from, to).some((r) => r.roomTypeId === roomTypeId.value)
    if (has) return from
  }
  return null
})

/**
 * Кнопка НЕ блокируется заранее. Заблокированная главная кнопка оставляет
 * слой без единственной заливки и молчит о причине; вместо этого проверяем
 * на нажатии и называем причину словами.
 */
async function submit() {
  if (busy.value) return
  errorCode.value = null
  if (!guestName.value.trim()) {
    errorCode.value = "GUEST_REQUIRED"
    return
  }
  const room = selectedRow.value?.free[0]
  if (!room) {
    errorCode.value = "NO_FREE_ROOM"
    return
  }
  busy.value = true
  const result = await create({
    roomId: room.id,
    checkIn: checkIn.value,
    checkOut: checkOut.value,
    guestName: guestName.value.trim(),
  })
  busy.value = false
  if (result.ok) emit("close")
  else errorCode.value = result.code
}

const KNOWN_ERRORS = [
  "OVERBOOKING",
  "ROOM_NOT_FOUND",
  "GUEST_REQUIRED",
  "NO_FREE_ROOM",
]
const errorText = computed(() => {
  if (!errorCode.value) return ""
  return KNOWN_ERRORS.includes(errorCode.value)
    ? t(`create.error.${errorCode.value}`)
    : t("create.error.generic")
})
</script>

<template>
  <NcSheet
    :title="t('today.newBooking')"
    :subtitle="`${dateRange(checkIn, checkOut)} · ${nightsText(checkIn, checkOut)}`"
    @close="emit('close')"
  >
    <div class="form">
      <NcSegmented v-model="startDay" :options="dayOptions" />

      <div class="field">
        <span class="field__label">{{ t('create.nights') }}</span>
        <NcStepper v-model="nightCount" :min="1" :max="14" :label="t('create.nights')" />
      </div>

      <div class="field">
        <span class="field__label">{{ t('create.roomType') }}</span>
        <div class="types" role="radiogroup" :aria-label="t('create.roomType')">
          <button
            v-for="row in typeRows"
            :key="row.type.id"
            type="button"
            role="radio"
            :aria-checked="row.type.id === roomTypeId"
            class="type"
            :class="{ 'type--on': row.type.id === roomTypeId, 'type--none': !row.free.length }"
            @click="roomTypeId = row.type.id; errorCode = null"
          >
            <span class="type__name">{{ row.type.name }}</span>
            <span class="type__free">
              {{ row.free.length ? freeText(row.free.length) : t('occupancy.noFree') }}
            </span>
          </button>
        </div>
      </div>

      <NcField v-model="guestName" :label="t('create.guestName')" :hint="t('create.guestNameHint')" />

      <NcBanner v-if="nearestFree" tone="warning">
        {{ t('create.noFreeHint', { date: dateRange(nearestFree, addDays(nearestFree, nightCount)) }) }}
      </NcBanner>
      <NcBanner v-else-if="!selectedRow?.free.length" tone="warning">
        {{ t('create.noFreeAtAll') }}
      </NcBanner>
      <NcBanner v-if="errorCode" tone="error">{{ errorText }}</NcBanner>
    </div>

    <template #actions>
      <NcButton variant="secondary" @click="emit('close')">{{ t('common.cancel') }}</NcButton>
      <!-- Единственная заливка этого слоя -->
      <NcButton block @click="submit">{{ t('create.submit') }}</NcButton>
    </template>
  </NcSheet>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: var(--nc-space-16);
}
.field { display: flex; flex-direction: column; gap: var(--nc-space-8); }
.field__label {
  font-size: var(--nc-fs-100);
  line-height: var(--nc-lh-100);
  font-weight: var(--nc-fw-bold);
  letter-spacing: var(--nc-tracking-caps);
  text-transform: uppercase;
  color: var(--nc-text-secondary);
}

.types { display: flex; flex-direction: column; }
.type {
  display: flex;
  align-items: center;
  gap: var(--nc-space-8);
  min-height: var(--nc-touch-min);
  padding: var(--nc-space-8) var(--nc-space-12);
  border: var(--nc-stroke-control) solid var(--nc-border-strong);
  border-bottom-width: 0;
  background: var(--nc-bg-surface);
  color: var(--nc-text-primary);
  font-family: var(--nc-font-sans);
  font-size: var(--nc-fs-200);
  line-height: var(--nc-lh-200);
  font-weight: var(--nc-fw-regular);
  text-align: left;
  cursor: pointer;
}
.type:first-child { border-radius: var(--nc-radius-md) var(--nc-radius-md) 0 0; }
.type:last-child {
  border-bottom-width: var(--nc-stroke-control);
  border-radius: 0 0 var(--nc-radius-md) var(--nc-radius-md);
}
/* Состояние, а не действие: фон band, жирное начертание и левая полоса —
   три канала, все переживают обесцвечивание. Заливки здесь нет. */
.type--on {
  background: var(--nc-bg-band);
  font-weight: var(--nc-fw-bold);
  box-shadow: inset var(--nc-stroke-accent) 0 0 0 var(--nc-border-strong);
}
.type__name { flex: 1; min-width: 0; }
.type__free { flex: none; color: var(--nc-text-secondary); }
.type--none .type__free { color: var(--nc-signal-error-fg); font-weight: var(--nc-fw-bold); }
</style>
