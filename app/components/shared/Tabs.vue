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
    <div class="border-b border-border">
      <div class="flex gap-4">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          @click="activeTab = tab.id"
          :class="cn(
            'px-1 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
            activeTab === tab.id
              ? 'border-foreground text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>
    <div class="pt-4">
      <slot :name="activeTab" />
      <!-- Fallback if no named slot is provided -->
      <slot v-if="!$slots[activeTab]" />
    </div>
  </div>
</template>
