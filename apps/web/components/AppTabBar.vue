<script setup lang="ts">
/**
 * Три вкладки — ровно те три экрана, между которыми владелец ходит весь день.
 * Активная помечена тремя каналами сразу: полосой сверху, жирным начертанием
 * и цветом текста, — чтобы пережить обесцвечивание.
 *
 * Счётчик на «Очереди» красный, если что-то требует решения, и обычный, если
 * мутации просто ждут сети: владельцу не нужно заходить внутрь, чтобы понять,
 * есть ли проблема.
 */
const { t } = useI18n()
const route = useRoute()
const { pending, broken } = useSyncState()
const { holds } = useBookings()

const tabs = computed(() => [
  { to: "/", label: t("nav.today"), badge: holds.value.length, bad: false },
  { to: "/occupancy", label: t("nav.occupancy"), badge: 0, bad: false },
  { to: "/queue", label: t("nav.queue"), badge: pending.value, bad: broken.value > 0 },
])

/** Карточка брони живёт внутри «Сегодня»: вкладка не должна гаснуть при переходе. */
function isActive(to: string): boolean {
  if (to === "/") return route.path === "/" || route.path.startsWith("/booking")
  return route.path.startsWith(to)
}
</script>

<template>
  <nav class="tabs">
    <NuxtLink
      v-for="tab in tabs"
      :key="tab.to"
      :to="tab.to"
      class="tab"
      :class="{ 'tab--on': isActive(tab.to) }"
    >
      <span class="tab__label">{{ tab.label }}</span>
      <span
        v-if="tab.badge"
        class="tab__badge nc-tnum"
        :class="{ 'tab__badge--bad': tab.bad }"
      >{{ tab.badge }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.tabs {
  display: flex;
  flex: none;
  background: var(--nc-bg-surface);
  border-top: var(--nc-stroke-hair) solid var(--nc-border-line);
}
.tab {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--nc-space-4);
  min-height: var(--nc-touch-action);
  padding: var(--nc-space-8) var(--nc-space-4);
  border-top: var(--nc-stroke-accent) solid transparent;
  color: var(--nc-text-secondary);
  font-size: var(--nc-fs-200);
  line-height: var(--nc-lh-200);
  font-weight: var(--nc-fw-regular);
  text-decoration: none;
  text-align: center;
}
.tab--on {
  border-top-color: var(--nc-border-strong);
  color: var(--nc-text-primary);
  font-weight: var(--nc-fw-bold);
}
.tab__label { min-width: 0; }
.tab__badge {
  flex: none;
  min-width: var(--nc-space-24);
  padding: 0 var(--nc-space-4);
  border-radius: var(--nc-radius-pill);
  background: var(--nc-text-primary);
  color: var(--nc-text-inverse);
  font-size: var(--nc-fs-100);
  line-height: var(--nc-lh-100);
  font-weight: var(--nc-fw-bold);
}
.tab__badge--bad { background: var(--nc-action-danger-fg); color: var(--nc-status-fg); }
</style>
