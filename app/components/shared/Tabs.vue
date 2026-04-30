<script setup lang="ts">
import { cn } from '~/lib/utils'

interface Tab {
  id: string
  label: string
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  className?: string
}

const props = defineProps<TabsProps>()

const activeTab = ref(props.defaultTab || props.tabs[0]?.id)
</script>

<template>
  <div :class="className">
    <div class="border-b border-border px-4 lg:px-6">
      <div class="flex gap-6">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          @click="activeTab = tab.id"
          :class="cn(
            'px-1 py-3 text-sm font-semibold border-b-2 -mb-px transition-all duration-200',
            activeTab === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>
    <div class="p-4 lg:p-6">
      <slot :name="activeTab" />
      <slot v-if="!$slots[activeTab]" />
    </div>
  </div>
</template>
