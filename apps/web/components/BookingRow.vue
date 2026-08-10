<script setup lang="ts">
import type { Booking } from "~/types"
import { statusColorVar, statusGlyph } from "~/utils/status"

/**
 * Строка списка броней.
 *
 * Заливки здесь нет ни у одной кнопки, и это не упущение: строк на экране
 * шесть, «главной из шести» не бывает, а заливка зарезервирована за
 * единственным действием экрана внизу. Вес назначен по цене ошибки:
 *   Подтвердить / Заселить — обычный контур, откатывается одним тапом;
 *   Выселить — приглушённый (careful): статус разойдётся с физическим миром,
 *              гость останется в номере. Тише выглядит — реже промах.
 *
 * Свайп влево — ускоритель для опытных, а не единственный путь: то же
 * действие продублировано кнопкой. Порог 88px, чтобы не срабатывать на скролле.
 */
const props = defineProps<{ booking: Booking }>()
const emit = defineEmits<{ advance: [Booking]; open: [Booking] }>()

const { t } = useI18n()
const { dateRange, nightsText } = useDateText()
const { nextStatus } = useBookings()

const next = computed(() => nextStatus(props.booking))

/** Подпись действия — глагол, а не иконка. */
const actionLabel = computed(() => {
  switch (props.booking.status) {
    case "HOLD":
      return t("booking.confirm")
    case "CONFIRMED":
      return t("booking.checkIn")
    case "CHECKED_IN":
      return t("booking.checkOut")
    default:
      return ""
  }
})

const actionVariant = computed(() =>
  props.booking.status === "CHECKED_IN" ? "careful" : "secondary",
)

const SWIPE_THRESHOLD = -88
const dx = ref(0)
const dragging = ref(false)
let startX = 0

function onDown(e: PointerEvent) {
  if (!next.value) return
  startX = e.clientX
  dragging.value = true
}
function onMove(e: PointerEvent) {
  if (!dragging.value) return
  dx.value = Math.min(0, Math.max(-140, e.clientX - startX))
}
function onUp() {
  if (!dragging.value) return
  const fire = dx.value <= SWIPE_THRESHOLD
  dragging.value = false
  dx.value = 0
  if (fire && next.value) emit("advance", props.booking)
}
</script>

<template>
  <div class="swipe">
    <div class="swipe__behind">{{ actionLabel }}</div>
    <div
      class="swipe__front"
      :class="{ 'swipe__front--dragging': dragging }"
      :style="{ transform: `translateX(${dx}px)` }"
      @pointerdown="onDown"
      @pointermove="onMove"
      @pointerup="onUp"
      @pointercancel="onUp"
    >
      <!-- Тап-цель — вся строка целиком, а не имя внутри неё: отдельная
           кнопка на тексте давала 25px по высоте при пределе в 44. -->
      <div
        class="open"
        role="button"
        tabindex="0"
        @click="emit('open', booking)"
        @keydown.enter="emit('open', booking)"
        @keydown.space.prevent="emit('open', booking)"
      >
      <NcRow :marker="statusColorVar(booking.status)" interactive>
        <template #head>
          <RoomChip :label="booking.room?.label ?? '—'" />
          <span class="name">
            <span class="name__glyph" aria-hidden="true">{{ statusGlyph(booking.status) }}</span>
            {{ booking.guest?.name }}
          </span>
        </template>

        <template #meta>
          <span>{{ dateRange(booking.checkIn, booking.checkOut) }}</span>
          <span>{{ nightsText(booking.checkIn, booking.checkOut) }}</span>
          <span v-if="booking.room?.roomType">{{ booking.room.roomType.name }}</span>
        </template>

        <template #tags>
          <!-- Статус словом. Одним цветом он не передаётся нигде. -->
          <NcPill :status="booking.status">{{ t(`booking.status.${booking.status}`) }}</NcPill>
          <NcPill v-if="booking.source === 'bot'" tone="outline">{{ t('booking.fromTelegram') }}</NcPill>
          <NcPill v-if="booking.sync === 'pending'" tone="warning">{{ t('sync.notSent') }}</NcPill>
          <NcPill v-if="booking.sync === 'rejected'" tone="error">{{ t('sync.rejected') }}</NcPill>
          <NcPill v-if="booking.sync === 'conflict'" tone="error">{{ t('sync.conflict') }}</NcPill>
        </template>

        <template #action>
          <NcButton
            v-if="next"
            :variant="actionVariant"
            size="md"
            @click.stop="emit('advance', booking)"
          >
            {{ actionLabel }}
          </NcButton>
        </template>
      </NcRow>
      </div>
    </div>
  </div>
</template>

<style scoped>
.swipe {
  position: relative;
  overflow: hidden;
  background: var(--nc-action-danger-fg);
}
.swipe__behind {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: var(--nc-space-24);
  color: var(--nc-status-fg);
  font-size: var(--nc-fs-200);
  line-height: var(--nc-lh-200);
  font-weight: var(--nc-fw-bold);
}
.swipe__front {
  position: relative;
  touch-action: pan-y;
  transition: transform var(--nc-motion-swipe) var(--nc-ease);
}
.swipe__front--dragging { transition: none; }

.open { cursor: pointer; }
.name {
  min-width: 0;
  color: var(--nc-text-primary);
  font-size: var(--nc-fs-400);
  line-height: var(--nc-lh-400);
  font-weight: var(--nc-fw-medium);
}
/* Глиф печатается всегда и в бюджет усечения имени не входит */
.name__glyph { color: var(--nc-text-secondary); }
</style>
