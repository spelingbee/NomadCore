<script setup lang="ts">
import { Home, Search, Calendar, User, Mountain } from 'lucide-vue-next'
import { cn } from '~/lib/utils'

const route = useRoute()
const router = useRouter()

const tabs = [
  { id: 'home', path: '/traveler', label: 'Home', icon: Home },
  { id: 'search', path: '/traveler/search', label: 'Search', icon: Search },
  { id: 'bookings', path: '/traveler/bookings', label: 'Bookings', icon: Calendar },
  { id: 'profile', path: '/traveler/profile', label: 'Profile', icon: User },
]

const activeTabId = computed(() => {
  if (route.path === '/traveler') return 'home'
  if (route.path.startsWith('/traveler/search')) return 'search'
  if (route.path.startsWith('/traveler/bookings')) return 'bookings'
  if (route.path.startsWith('/traveler/profile')) return 'profile'
  return 'home'
})

function onModeChange(mode: string) {
  router.push(`/${mode}`)
}
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col">
    <!-- Main Header with Logo and Switcher -->
    <div class="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 h-14 flex items-center">
      <div class="container mx-auto px-4 flex items-center justify-between w-full">
        <NuxtLink to="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div class="p-1.5 bg-muted rounded-lg">
            <Mountain class="h-5 w-5 text-foreground" />
          </div>
          <span class="font-bold">Nomad Core</span>
        </NuxtLink>

        <ModeSwitcher current-mode="traveler" @mode-change="onModeChange" />
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-1 pb-20 lg:pb-0">
      <slot />
    </main>

    <!-- Mobile Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-card border-t border-border lg:hidden z-40">
      <div class="flex items-center justify-around h-16">
        <NuxtLink
          v-for="tab in tabs"
          :key="tab.id"
          :to="tab.path"
          :class="cn(
            'flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-colors',
            activeTabId === tab.id ? 'text-foreground' : 'text-muted-foreground'
          )"
        >
          <component :is="tab.icon" :class="cn('w-5 h-5', activeTabId === tab.id && 'text-primary')" />
          <span class="text-[10px] font-medium">{{ tab.label }}</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>
