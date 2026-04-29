<script setup lang="ts">
import {
  ArrowRight,
  Building2,
  Compass,
  Globe,
  Mountain,
  Shield,
  Users,
} from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import {cn} from "../lib/utils";

definePageMeta({
  layout: 'default',
})

const router = useRouter()
const localePath = useLocalePath()

function onSelectMode(mode: 'traveler' | 'partner' | 'admin') {
  router.push(localePath(`/${mode}`))
}

const stats = [
  { value: '7', label: 'UNESCO Sites', icon: Globe },
  { value: '50+', label: 'Destinations', icon: Compass },
  { value: '200+', label: 'Tourism Partners', icon: Building2 },
  { value: '500K+', label: 'Annual Visitors', icon: Users },
]

const userTypes = [
  {
    mode: 'traveler' as const,
    icon: Compass,
    title: 'For Travelers',
    description: 'Discover destinations, book unique experiences, and plan your perfect Kyrgyzstan adventure.',
    features: ['Browse 50+ destinations', 'Book stays & experiences', 'Create travel packages', 'Leave reviews'],
    color: 'teal',
  },
  {
    mode: 'partner' as const,
    icon: Building2,
    title: 'For Partners',
    description: 'Manage your tourism business with powerful tools for properties, bookings, and analytics.',
    features: ['Property management', 'Real-time bookings', 'Revenue analytics', 'Channel distribution'],
    color: 'blue',
  },
  {
    mode: 'admin' as const,
    icon: Shield,
    title: 'For Government',
    description: 'Oversee national tourism development with comprehensive data and partner management.',
    features: ['Tourism analytics', 'Partner oversight', 'Infrastructure tracking', 'Policy insights'],
    color: 'amber',
  },
]
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Hero Section -->
    <header class="border-b bg-card">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="p-2 bg-primary/10 rounded-lg">
            <Mountain class="h-6 w-6 text-primary" />
          </div>
          <span class="text-xl font-bold">Nomad Core</span>
        </div>
        <nav class="hidden md:flex items-center gap-6">
          <a href="#about" class="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a>
          <a href="#features" class="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#partners" class="text-sm text-muted-foreground hover:text-foreground transition-colors">Partners</a>
        </nav>
        <Button @click="onSelectMode('traveler')">
          Explore Kyrgyzstan
        </Button>
      </div>
    </header>

    <main>
      <!-- Hero -->
      <section class="relative overflow-hidden py-20 lg:py-32">
        <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div class="container mx-auto px-4 relative">
          <div class="max-w-3xl mx-auto text-center">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Globe class="h-4 w-4" />
              Tourism Operating System
            </div>
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-6">
              Discover the Heart of Central Asia
            </h1>
            <p class="text-lg text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">
              Nomad Core connects travelers, tourism partners, and government stakeholders
              to showcase Kyrgyzstan's breathtaking landscapes, rich culture, and unforgettable experiences.
            </p>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" @click="onSelectMode('traveler')" class="gap-2">
                Start Exploring
                <ArrowRight class="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" @click="onSelectMode('partner')">
                Partner with Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats -->
      <section class="py-16 border-y bg-card">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div v-for="(stat, i) in stats" :key="i" class="text-center">
              <div class="inline-flex items-center justify-center p-3 rounded-xl bg-primary/10 mb-3">
                <component :is="stat.icon" class="h-6 w-6 text-primary" />
              </div>
              <div class="text-3xl font-bold mb-1">
                {{ stat.value }}
              </div>
              <div class="text-sm text-muted-foreground">
                {{ stat.label }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- User Types -->
      <section id="features" class="py-20">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold mb-4">
              One Platform, Three Perspectives
            </h2>
            <p class="text-muted-foreground max-w-2xl mx-auto">
              Nomad Core serves everyone in the tourism ecosystem with tailored experiences and tools.
            </p>
          </div>
          <div class="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <button
              v-for="item in userTypes"
              :key="item.mode"
              @click="onSelectMode(item.mode)"
              class="group text-left p-6 rounded-2xl border bg-card hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div
                :class="cn(
                  'inline-flex items-center justify-center p-3 rounded-xl mb-4',
                  item.color === 'teal' ? 'bg-teal-100 dark:bg-teal-900/30' :
                  item.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                  'bg-amber-100 dark:bg-amber-900/30'
                )"
              >
                <component
                  :is="item.icon"
                  :class="cn(
                    'h-6 w-6',
                    item.color === 'teal' ? 'text-teal-600 dark:text-teal-400' :
                    item.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                    'text-amber-600 dark:text-amber-400'
                  )"
                />
              </div>
              <h3 class="text-xl font-semibold mb-2">
                {{ item.title }}
              </h3>
              <p class="text-muted-foreground text-sm mb-4">
                {{ item.description }}
              </p>
              <ul class="space-y-2">
                <li v-for="(feature, i) in item.features" :key="i" class="text-sm flex items-center gap-2">
                  <div class="h-1.5 w-1.5 rounded-full bg-primary" />
                  {{ feature }}
                </li>
              </ul>
              <div class="mt-4 flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                Enter {{ item.title.split(' ')[1] }} View
                <ArrowRight class="h-4 w-4" />
              </div>
            </button>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="py-20 bg-primary text-primary-foreground">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-3xl font-bold mb-4">
            Ready to Experience Kyrgyzstan?
          </h2>
          <p class="text-primary-foreground/80 max-w-xl mx-auto mb-8">
            Whether you're planning a trip, managing a tourism business, or overseeing national tourism development,
            Nomad Core has the tools you need.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              @click="onSelectMode('traveler')"
              class="gap-2"
            >
              <Compass class="h-4 w-4" />
              Explore as Traveler
            </Button>
            <Button
              size="lg"
              variant="outline"
              @click="onSelectMode('partner')"
              class="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 gap-2"
            >
              <Building2 class="h-4 w-4" />
              Partner Dashboard
            </Button>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="border-t py-12 bg-card">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2">
            <Mountain class="h-5 w-5 text-primary" />
            <span class="font-semibold">Nomad Core</span>
            <span class="text-muted-foreground text-sm">- Tourism Operating System</span>
          </div>
          <p class="text-sm text-muted-foreground">
            A unified platform for Kyrgyzstan tourism development
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
