<script setup lang="ts">
import {
  Building2,
  Landmark,
  LayoutDashboard,
  Lightbulb,
  Map,
  Menu,
  Mountain,
  Share2,
  X,
} from 'lucide-vue-next'
import { cn } from '~/lib/utils'

const route = useRoute()
const router = useRouter()

const navItems = [
  { id: 'overview', path: '/admin', label: 'Overview', icon: LayoutDashboard },
  { id: 'destinations', path: '/admin/destinations', label: 'Destination Analytics', icon: Map },
  { id: 'infrastructure', path: '/admin/infrastructure', label: 'Infrastructure Usage', icon: Building2 },
  { id: 'partners', path: '/admin/partners', label: 'Partner Analytics', icon: Landmark },
  { id: 'channels', path: '/admin/channels', label: 'Channel Analytics', icon: Share2 },
  { id: 'insights', path: '/admin/insights', label: 'AI Insights', icon: Lightbulb },
]

const sidebarOpen = ref(false)

const activeId = computed(() => {
  const item = navItems.find(i => i.path === route.path)
  return item ? item.id : 'overview'
})

function onModeChange(mode: string) {
  router.push(`/${mode}`)
}
</script>

<template>
  <div class="min-h-screen bg-muted/30">
    <!-- Header with Mode Switcher -->
    <div class="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 lg:pl-64">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-2 lg:hidden">
          <button @click="sidebarOpen = true">
            <Menu class="w-6 h-6" />
          </button>
          <NuxtLink to="/" class="flex items-center gap-2">
            <Mountain class="h-5 w-5 text-primary" />
            <span class="font-bold">Nomad Core</span>
          </NuxtLink>
        </div>
        <div class="hidden lg:block"></div>
        <ModeSwitcher current-mode="admin" @mode-change="onModeChange" />
      </div>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div v-if="sidebarOpen" class="fixed inset-0 z-50 lg:hidden">
      <div class="absolute inset-0 bg-black/50" @click="sidebarOpen = false" />
      <div class="absolute left-0 top-0 bottom-0 w-72 bg-card">
        <div class="flex items-center justify-between h-14 px-4 border-b border-border">
          <h1 class="font-semibold">Nomad Core</h1>
          <button @click="sidebarOpen = false">
            <X class="w-5 h-5" />
          </button>
        </div>
        <nav class="p-2">
          <NuxtLink
            v-for="item in navItems"
            :key="item.id"
            :to="item.path"
            @click="sidebarOpen = false"
            :class="cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
              activeId === item.id
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )"
          >
            <component :is="item.icon" class="w-5 h-5" />
            {{ item.label }}
          </NuxtLink>
        </nav>
      </div>
    </div>

    <!-- Desktop Sidebar -->
    <aside class="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border">
      <div class="h-14 flex items-center px-4 border-b border-border">
        <NuxtLink to="/" class="flex items-center">
          <Mountain class="h-5 w-5 text-primary mr-2" />
          <h1 class="font-semibold">Nomad Core</h1>
        </NuxtLink>
        <span class="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Gov</span>
      </div>

      <!-- Admin Info -->
      <div class="p-4 border-b border-border">
        <p class="text-sm font-medium">Ministry of Tourism</p>
        <p class="text-xs text-muted-foreground">Kyrgyz Republic</p>
      </div>

      <nav class="flex-1 p-2 overflow-auto">
        <NuxtLink
          v-for="item in navItems"
          :key="item.id"
          :to="item.path"
          :class="cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
            activeId === item.id
              ? 'bg-foreground text-background'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )"
        >
          <component :is="item.icon" class="w-5 h-5" />
          {{ item.label }}
        </NuxtLink>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="lg:ml-64 min-h-[calc(100-3.5rem)]">
      <div class="p-4 lg:p-6 max-w-7xl mx-auto">
        <slot />
      </div>
    </main>
  </div>
</template>
