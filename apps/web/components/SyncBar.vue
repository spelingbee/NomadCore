<script setup lang="ts">
/**
 * Единственный индикатор сети. Не всплывает и не исчезает: место одно и то же,
 * взгляд находит его не читая. Офлайн — тёмная полоса: заметно, но не тревожно,
 * это штатный режим работы, а не авария.
 *
 * Точка слева — второй канал к слову, а не замена ему: цветом статус связи
 * нигде не передаётся в одиночку.
 */
const { t } = useI18n()
const { online, pending, broken } = useSyncState()

const rightText = computed(() => {
  if (!pending.value) return t("sync.allSent")
  return online.value
    ? t("sync.inQueue", { n: pending.value })
    : t("sync.notSentCount", { n: pending.value })
})
</script>

<template>
  <div class="bar" :class="online ? 'bar--online' : 'bar--offline'">
    <span class="dot" :class="{ 'dot--bad': broken > 0 }" />
    <span class="label">{{ online ? t('sync.online') : t('sync.offline') }}</span>
    <span class="right nc-tnum">{{ rightText }}</span>
  </div>
</template>

<style scoped>
.bar {
  display: flex;
  align-items: center;
  gap: var(--nc-space-8);
  padding: var(--nc-space-8) var(--nc-space-12);
  font-size: var(--nc-fs-100);
  line-height: var(--nc-lh-100);
  font-weight: var(--nc-fw-medium);
}
.bar--online {
  background: var(--nc-bg-band);
  color: var(--nc-text-primary);
}
.bar--offline {
  background: var(--nc-signal-offline-bg);
  color: var(--nc-signal-offline-fg);
}
.dot {
  flex: none;
  width: var(--nc-space-8);
  height: var(--nc-space-8);
  border-radius: var(--nc-radius-pill);
  background: var(--nc-status-inhouse);
}
.bar--offline .dot { background: var(--nc-signal-offline-dot); }
.dot--bad { background: var(--nc-action-danger-fg); }
.label { min-width: 0; }
.right { margin-left: auto; font-weight: var(--nc-fw-regular); }
</style>
