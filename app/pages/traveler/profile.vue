<script setup lang="ts">
import { Bell, ChevronRight, Globe, HelpCircle, LogOut, Mail, Phone, Settings, User } from 'lucide-vue-next'
import { currentCustomer } from '~/data/mock-data'
import { Button } from '~/components/ui/button'

definePageMeta({
  layout: 'traveler',
})
</script>

<template>
  <div class="min-h-screen pt-4 lg:pt-20 px-4 pb-8 max-w-lg mx-auto">
    <!-- Profile Header -->
    <div class="text-center mb-8">
      <div class="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto">
        <User class="w-10 h-10 text-muted-foreground" />
      </div>
      <h1 class="text-xl font-bold mt-4">{{ currentCustomer.name }}</h1>
      <p class="text-sm text-muted-foreground">{{ currentCustomer.email }}</p>
    </div>

    <!-- Profile Info -->
    <div class="bg-card border border-border rounded-xl divide-y divide-border">
      <div class="p-4 flex items-center gap-3">
        <Mail class="w-5 h-5 text-muted-foreground" />
        <div class="flex-1">
          <p class="text-xs text-muted-foreground">Email</p>
          <p class="text-sm">{{ currentCustomer.email }}</p>
        </div>
      </div>
      <div class="p-4 flex items-center gap-3">
        <Phone class="w-5 h-5 text-muted-foreground" />
        <div class="flex-1">
          <p class="text-xs text-muted-foreground">Phone</p>
          <p class="text-sm">{{ currentCustomer.phone }}</p>
        </div>
      </div>
      <div class="p-4 flex items-center gap-3">
        <Globe class="w-5 h-5 text-muted-foreground" />
        <div class="flex-1">
          <p class="text-xs text-muted-foreground">Nationality</p>
          <p class="text-sm">{{ currentCustomer.nationality }}</p>
        </div>
      </div>
    </div>

    <!-- Settings -->
    <div class="mt-6 bg-card border border-border rounded-xl divide-y divide-border">
      <button type="button" class="w-full p-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors">
        <div class="flex items-center gap-3">
          <Bell class="w-5 h-5 text-muted-foreground" />
          <span class="text-sm">Notifications</span>
        </div>
        <ChevronRight class="w-5 h-5 text-muted-foreground" />
      </button>
      <button type="button" class="w-full p-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors">
        <div class="flex items-center gap-3">
          <Settings class="w-5 h-5 text-muted-foreground" />
          <span class="text-sm">Settings</span>
        </div>
        <ChevronRight class="w-5 h-5 text-muted-foreground" />
      </button>
      <button type="button" class="w-full p-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors">
        <div class="flex items-center gap-3">
          <HelpCircle class="w-5 h-5 text-muted-foreground" />
          <span class="text-sm">Help & Support</span>
        </div>
        <ChevronRight class="w-5 h-5 text-muted-foreground" />
      </button>
    </div>

    <!-- Logout -->
    <div class="mt-6">
      <Button variant="outline" class="w-full" size="lg">
        <LogOut class="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>

    <!-- Demo Notice -->
    <p class="text-xs text-muted-foreground text-center mt-8">
      This is a demo profile. No real authentication is implemented.
    </p>
  </div>
</template>
