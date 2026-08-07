<script setup lang="ts">
const { online, pending, broken } = useSync()
const { t } = useI18n()
</script>

<template>
  <!-- Единственный индикатор сети в приложении. Офлайн — тёмная полоса: заметно,
       но не тревожно; это штатный режим, а не авария. -->
  <div
    class="flex min-h-[34px] items-center gap-2 px-4 py-2 text-[13px] font-semibold"
    :class="online ? 'bg-[#E7E7E1] text-ink' : 'bg-ink text-white'"
  >
    <span
      class="h-[9px] w-[9px] shrink-0 rounded-full"
      :class="online ? (broken ? 'bg-danger' : 'bg-checkedin') : 'bg-[#F0B429]'"
    />
    <span>{{ online ? t.online : t.offline }}</span>
    <span class="ml-auto font-medium">
      <template v-if="pending">{{ pending }} {{ online ? t.inQueue : t.notSent.toLowerCase() }}</template>
      <template v-else>{{ t.allSynced }}</template>
    </span>
  </div>
</template>
