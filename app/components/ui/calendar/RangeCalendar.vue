<script lang="ts" setup>
import { 
  RangeCalendarRoot, 
  type RangeCalendarRootProps, 
  type RangeCalendarRootEmits,
  RangeCalendarHeader,
  RangeCalendarHeading,
  RangeCalendarGrid,
  RangeCalendarGridHead,
  RangeCalendarGridRow,
  RangeCalendarHeadCell,
  RangeCalendarGridBody,
  RangeCalendarCell,
  RangeCalendarCellTrigger,
  RangeCalendarPrev,
  RangeCalendarNext,
  useForwardPropsEmits
} from "reka-ui"
import { computed, type HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-vue-next"

const props = defineProps<RangeCalendarRootProps & { class?: HTMLAttributes["class"] }>()
const emits = defineEmits<RangeCalendarRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <RangeCalendarRoot
    v-slot="{ grid, weekDays }"
    :class="cn('p-3', props.class)"
    v-bind="forwarded"
  >
    <RangeCalendarHeader class="relative flex w-full items-center justify-between pt-1">
      <RangeCalendarPrev
        :class="cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        )"
      >
        <ChevronLeft class="h-4 w-4" />
      </RangeCalendarPrev>
      <RangeCalendarHeading class="text-sm font-medium" />
      <RangeCalendarNext
        :class="cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        )"
      >
        <ChevronRight class="h-4 w-4" />
      </RangeCalendarNext>
    </RangeCalendarHeader>

    <div class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
      <RangeCalendarGrid v-for="month in grid" :key="month.value.toString()">
        <RangeCalendarGridHead>
          <RangeCalendarGridRow>
            <RangeCalendarHeadCell
              v-for="day in weekDays"
              :key="day"
              class="w-8 rounded-md text-[0.8rem] font-normal text-muted-foreground"
            >
              {{ day }}
            </RangeCalendarHeadCell>
          </RangeCalendarGridRow>
        </RangeCalendarGridHead>
        <RangeCalendarGridBody>
          <RangeCalendarGridRow 
            v-for="(weekDates, index) in month.rows" 
            :key="`weekDate-${index}`" 
            class="mt-2 w-full"
          >
            <RangeCalendarCell
              v-for="weekDate in weekDates"
              :key="weekDate.toString()"
              :date="weekDate"
              class="relative p-0 text-center text-sm focus-within:relative focus-within:z-20 flex-1 reka-calendar-cell"
            >
              <RangeCalendarCellTrigger
                :day="weekDate"
                :month="month.value"
                :class="cn(
                  buttonVariants({ variant: 'ghost' }),
                  'h-8 w-8 p-0 font-normal aria-selected:opacity-100',
                  'data-[selection-start]:bg-primary data-[selection-start]:text-primary-foreground data-[selection-start]:hover:bg-primary data-[selection-start]:hover:text-primary-foreground data-[selection-start]:focus:bg-primary data-[selection-start]:focus:text-primary-foreground',
                  'data-[selection-end]:bg-primary data-[selection-end]:text-primary-foreground data-[selection-end]:hover:bg-primary data-[selection-end]:hover:text-primary-foreground data-[selection-end]:focus:bg-primary data-[selection-end]:focus:text-primary-foreground',
                  'data-[in-range]:bg-accent data-[in-range]:text-accent-foreground data-[in-range]:hover:bg-accent/80'
                )"
              />
            </RangeCalendarCell>
          </RangeCalendarGridRow>
        </RangeCalendarGridBody>
      </RangeCalendarGrid>
    </div>
  </RangeCalendarRoot>
</template>
