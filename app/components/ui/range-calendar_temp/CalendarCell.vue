<script lang="ts" setup>
import type { CalendarCellProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { CalendarCell, useForwardProps } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<CalendarCellProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = reactiveOmit(props, "class")

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <CalendarCell
    data-slot="calendar-cell"
    :class="cn(
      'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 flex-1',
      '[&[data-selected]]:rounded-md [&[data-selected]]:bg-accent',
      '[&[data-selection-start]]:bg-primary [&[data-selection-start]]:text-primary-foreground [&[data-selection-start]]:rounded-l-md',
      '[&[data-selection-end]]:bg-primary [&[data-selection-end]]:text-primary-foreground [&[data-selection-end]]:rounded-r-md',
      '[&[data-in-range]]:bg-accent [&[data-in-range]]:text-accent-foreground',
      props.class
    )"
    v-bind="forwardedProps"
  >
    <slot />
  </CalendarCell>
</template>
