<script setup lang="ts">
import { shortDate } from '~/utils/dates'
import type { QueuedMutation } from '~/types'

const props = defineProps<{ mutation: QueuedMutation }>()
const { t } = useI18n()
const { keepMine, takeServer } = useSync()

const mine = computed(() => props.mutation.body.op === 'dates' ? shortDate((props.mutation.body as any).checkOut) : '—')
const theirs = computed(() => shortDate(props.mutation.server!.booking.checkOut))
</script>

<template>
  <!-- Конфликт не решается сам: показываем оба значения, кто и когда изменил,
       и два равнозначных выхода. Никаких «попробуйте ещё раз». -->
  <div class="border-y border-line bg-paper">
    <div class="flex gap-3 px-4 pb-[10px] pt-3">
      <div class="min-w-0 flex-1">
        <div class="text-[17px] font-bold leading-tight">{{ mutation.title }}</div>
        <div class="mt-[3px] text-[14px] text-muted">{{ mutation.subtitle }}</div>
      </div>
      <span class="h-fit shrink-0 rounded bg-danger px-2 py-1 text-[12.5px] font-bold text-white">
        {{ t.versionConflict }}
      </span>
    </div>

    <dl class="mx-4 mb-3 border-l-4 border-danger bg-[#F4F4F1] px-3 py-[11px] text-[14px]">
      <div class="flex gap-2"><dt class="w-[100px] shrink-0 font-bold text-muted">На устройстве</dt><dd class="font-semibold">выезд {{ mine }}</dd></div>
      <div class="mt-2 flex gap-2"><dt class="w-[100px] shrink-0 font-bold text-muted">На сервере</dt><dd class="font-semibold">выезд {{ theirs }}</dd></div>
      <div class="mt-2 flex gap-2"><dt class="w-[100px] shrink-0 font-bold text-muted">Изменил</dt><dd class="font-semibold">{{ mutation.server!.changedBy }} · {{ mutation.server!.changedAt }}</dd></div>
    </dl>

    <div class="flex gap-[10px] px-4 pb-3">
      <button class="min-h-[52px] flex-1 rounded-md border-2 border-ink bg-paper text-[15.5px] font-bold" @click="takeServer(mutation)">
        {{ t.takeServer }}
      </button>
      <button class="min-h-[52px] flex-1 rounded-md border-2 border-ink bg-ink text-[15.5px] font-bold text-white" @click="keepMine(mutation)">
        {{ t.keepMine }}
      </button>
    </div>
  </div>
</template>
