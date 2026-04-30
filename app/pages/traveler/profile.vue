<script setup lang="ts">
import { User, Mail, Settings, LogOut, ChevronRight, Shield, CreditCard, Bell } from 'lucide-vue-next'

definePageMeta({
  layout: 'traveler',
})

const authStore = useAuthStore()
const router = useRouter()

const user = computed(() => authStore.user || {
  fullName: 'Guest User',
  email: 'guest@example.com'
})

function onLogout() {
  authStore.logout()
  router.push('/traveler')
}

const menuItems = [
  { icon: User, label: 'Personal Information', description: 'Update your name and profile details' },
  { icon: Shield, label: 'Security', description: 'Manage your password and account security' },
  { icon: CreditCard, label: 'Payment Methods', description: 'Securely manage your payment options' },
  { icon: Bell, label: 'Notifications', description: 'Control how we communicate with you' },
]
</script>

<template>
  <div class="max-w-2xl mx-auto py-8 px-4">
    <div class="flex items-center gap-6 mb-10">
      <div class="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary border-4 border-background shadow-xl">
        <User class="w-12 h-12" />
      </div>
      <div>
        <h1 class="text-3xl font-black tracking-tight">{{ user.fullName }}</h1>
        <div class="flex items-center gap-2 text-muted-foreground mt-1">
          <Mail class="w-4 h-4" />
          <span>{{ user.email }}</span>
        </div>
        <span class="inline-block mt-3 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
          Traveler Account
        </span>
      </div>
    </div>

    <div class="space-y-4">
      <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
        <Settings class="w-5 h-5 text-primary" />
        Account Settings
      </h2>
      
      <button 
        v-for="item in menuItems" 
        :key="item.label"
        class="w-full flex items-center justify-between p-4 bg-card border border-border rounded-2xl hover:bg-muted/50 transition-all text-left group"
      >
        <div class="flex items-center gap-4">
          <div class="p-2.5 bg-muted rounded-xl group-hover:bg-background transition-colors">
            <component :is="item.icon" class="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div>
            <p class="font-bold text-sm">{{ item.label }}</p>
            <p class="text-xs text-muted-foreground">{{ item.description }}</p>
          </div>
        </div>
        <ChevronRight class="w-5 h-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
      </button>

      <div class="pt-6">
        <Button 
          variant="destructive" 
          class="w-full py-6 rounded-2xl shadow-lg shadow-destructive/10"
          @click="onLogout"
        >
          <LogOut class="mr-2 h-5 w-5" />
          Logout from Nomad Core
        </Button>
      </div>
    </div>
  </div>
</template>
