<script setup lang="ts">
import { Building2, ChevronDown, Compass, Shield } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

interface ModeSwitcherProps {
  currentMode: 'traveler' | 'partner' | 'admin'
}

const props = defineProps<ModeSwitcherProps>()
const emit = defineEmits(['modeChange'])

const modes = [
  {
    id: 'traveler' as const,
    label: 'Traveler',
    description: 'Browse & book experiences',
    icon: Compass,
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-900/30',
  },
  {
    id: 'partner' as const,
    label: 'Partner',
    description: 'Manage your tourism business',
    icon: Building2,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/30',
  },
  {
    id: 'admin' as const,
    label: 'Government',
    description: 'National tourism oversight',
    icon: Shield,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/30',
  },
]

const current = computed(() => modes.find(m => m.id === props.currentMode)!)

function onModeSelect(mode: string) {
  emit('modeChange', mode)
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="outline"
        :class="[
          'gap-2 border-current/20 transition-all',
          current.bg,
          'hover:' + current.bg
        ]"
      >
        <component :is="current.icon" :class="['h-4 w-4', current.color]" />
        <span class="font-medium">{{ current.label }}</span>
        <ChevronDown class="h-3 w-3 opacity-50" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-64 p-2">
      <DropdownMenuItem
        v-for="mode in modes"
        :key="mode.id"
        class="flex items-start gap-3 p-3 cursor-pointer rounded-lg transition-colors"
        :class="currentMode === mode.id ? mode.bg : ''"
        @click="onModeSelect(mode.id)"
      >
        <div :class="['p-2 rounded-lg', mode.bg]">
          <component :is="mode.icon" :class="['h-4 w-4', mode.color]" />
        </div>
        <div>
          <p class="font-bold text-sm">{{ mode.label }}</p>
          <p class="text-[10px] text-muted-foreground font-medium uppercase tracking-tight mt-0.5">
            {{ mode.description }}
          </p>
        </div>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
