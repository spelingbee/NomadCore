<script setup lang="ts">
const { t } = useI18n()
const { pending } = useSync()
const route = useRoute()

const tabs = computed(() => [
  { to: '/', label: t.value.today, badge: 0 },
  { to: '/occupancy', label: t.value.occupancy, badge: 0 },
  { to: '/queue', label: t.value.queue, badge: pending.value }
])
const active = (to: string) => to === '/' ? route.path === '/' || route.path.startsWith('/booking') : route.path.startsWith(to)
</script>

<template>
  <nav class="flex border-t border-line bg-paper">
    <NuxtLink
      v-for="tab in tabs" :key="tab.to" :to="tab.to"
      class="relative flex min-h-[62px] flex-1 items-center justify-center border-t-4 px-1 text-[14.5px]"
      :class="active(tab.to) ? 'border-ink font-bold text-ink' : 'border-transparent font-medium text-faint'"
    >
      {{ tab.label }}
      <span
        v-if="tab.badge"
        class="tnum absolute right-[14px] top-2 inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-danger px-[5px] text-[12.5px] font-bold text-white"
      >{{ tab.badge }}</span>
    </NuxtLink>
  </nav>
</template>
