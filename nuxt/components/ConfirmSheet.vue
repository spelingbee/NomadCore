<script setup lang="ts">
defineProps<{ title: string; question: string; ok: string; hint?: string }>()
const emit = defineEmits<{ ok: []; cancel: [] }>()
</script>

<template>
  <!-- Подтверждение только там, где действие нельзя отменить одним тапом.
       Появление без анимации: это сообщение о состоянии, а не эффект. -->
  <div class="absolute inset-0 z-30 flex flex-col justify-end bg-ink/50">
    <button class="flex-1" aria-label="Закрыть" @click="emit('cancel')" />
    <div class="border-t-[3px] border-ink bg-paper px-4 py-4">
      <p class="text-[12px] font-bold uppercase tracking-wide text-muted">{{ title }}</p>
      <h2 class="mt-1 text-[21px] font-bold leading-tight">{{ question }}</h2>
      <p v-if="hint" class="mt-1 text-[14.5px] leading-snug text-muted">{{ hint }}</p>
      <div class="mt-4 flex gap-[10px]">
        <button class="min-h-[60px] min-w-[104px] shrink-0 rounded-md border-2 border-ink bg-paper text-[17px] font-bold" @click="emit('cancel')">
          Отмена
        </button>
        <button class="min-h-[60px] flex-1 rounded-md bg-checkedin text-[18px] font-bold text-white" @click="emit('ok')">
          {{ ok }}
        </button>
      </div>
    </div>
  </div>
</template>
