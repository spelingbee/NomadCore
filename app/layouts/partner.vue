<script setup lang="ts">
import {
  Bell,
  BookOpen,
  Building2,
  Calendar,
  LayoutDashboard,
  Menu,
  Mountain,
  Package,
  QrCode,
  Share2,
  Star,
  X,
} from 'lucide-vue-next'
import { currentPartner } from '~/data/mock-data'
import { cn } from '~/lib/utils'

const route = useRoute()
const router = useRouter()

const { t, locales, locale: currentLocale, setLocale } = useI18n()
const localePath = useLocalePath()

const navItems = computed(() => [
  { id: 'overview', path: '/partner', label: t('nav.overview'), icon: LayoutDashboard },
  { id: 'scan', path: '/partner/scan', label: t('nav.scan'), icon: QrCode },
  { id: 'properties', path: '/partner/properties/my', label: t('nav.properties'), icon: Building2 },
  // { id: 'inventory', path: '/partner/inventory', label: t('nav.inventory'), icon: Calendar },
  // { id: 'packages', path: '/partner/packages', label: t('nav.packages'), icon: Package },
  { id: 'bookings', path: '/partner/bookings', label: t('nav.bookings'), icon: BookOpen },
  // { id: 'channels', path: '/partner/channels', label: t('nav.channels'), icon: Share2 },
  { id: 'reviews', path: '/partner/reviews', label: t('nav.reviews'), icon: Star },
  { id: 'notifications', path: '/partner/notifications', label: t('nav.notifications'), icon: Bell },
])

const sidebarOpen = ref(false)

const activeId = computed(() => {
  const item = navItems.value.find(i => localePath(i.path) === route.path)
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
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border">
            <Button
              v-for="locale in locales"
              :key="locale.code"
              variant="ghost"
              size="sm"
              class="h-7 px-2 text-[10px] font-bold uppercase tracking-widest"
              :class="currentLocale === locale.code ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'"
              @click="setLocale(locale.code)"
            >
              {{ locale.code }}
            </Button>
          </div>
          <ModeSwitcher current-mode="partner" @mode-change="onModeChange" />
        </div>
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
            :to="localePath(item.path)"
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
        <span class="ml-2 text-xs bg-muted px-2 py-0.5 rounded">Partner</span>
      </div>

      <!-- Partner Info -->
      <div class="p-4 border-b border-border">
        <p class="text-sm font-medium">{{ currentPartner.name }}</p>
        <p class="text-xs text-muted-foreground capitalize">{{ currentPartner.type.replace('_', ' ') }}</p>
        <span v-if="currentPartner.verified" class="inline-block mt-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
          Verified
        </span>
      </div>

      <nav class="flex-1 p-2 overflow-auto">
        <NuxtLink
          v-for="item in navItems"
          :key="item.id"
          :to="localePath(item.path)"
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
