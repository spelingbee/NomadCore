<script setup lang="ts">
import { Building2, ChevronDown, Compass, Shield } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

export type AppMode = 'traveler' | 'partner' | 'admin'

interface ModeSwitcherProps {
  currentMode: AppMode
}

const props = defineProps<ModeSwitcherProps>()

const router = useRouter()

const modes = [
  {
    id: 'traveler' as const,
    label: 'Traveler',
    description: 'Browse & book experiences',
    icon: Compass,
    color: 'text-teal-600 dark:text-teal-400',
    bg: 'bg-teal-50 dark:bg-teal-900/30',
    path: '/traveler',
  },
  {
    id: 'partner' as const,
    label: 'Partner',
    description: 'Manage your tourism business',
    icon: Building2,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    path: '/partner',
  },
  {
    id: 'admin' as const,
    label: 'Government',
    description: 'National tourism oversight',
    icon: Shield,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/30',
    path: '/admin',
  },
]

const current = computed(() => modes.find(m => m.id === props.currentMode)!)

function onModeChange(modeId: AppMode) {
  const mode = modes.find(m => m.id === modeId)
  if (mode) {
    router.push(mode.path)
  }
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="outline"
        :class="['gap-2', current.bg, 'border-current/20 hover:', current.bg]"
      >
        <component :is="current.icon" :class="['h-4 w-4', current.color]" />
        <span class="font-medium">{{ current.label }}</span>
        <ChevronDown class="h-3 w-3 opacity-50" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="center" class="w-64">
      <DropdownMenuItem
        v-for="mode in modes"
        :key="mode.id"
        @click="onModeChange(mode.id)"
        :class="['flex items-start gap-3 p-3 cursor-pointer', currentMode === mode.id ? mode.bg : '']"
      >
        <div :class="['p-2 rounded-lg', mode.bg]">
          <component :is="mode.icon" :class="['h-4 w-4', mode.color]" />
        </div>
        <div>
          <p class="font-medium">{{ mode.label }}</p>
          <p class="text-xs text-muted-foreground">
            {{ mode.description }}
          </p>
        </div>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
