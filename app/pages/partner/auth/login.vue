<script setup lang="ts">
import { Mountain, Loader2 } from 'lucide-vue-next'

definePageMeta({
  layout: 'traveler',
})

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')

async function onSubmit() {
  if (!email.value || !password.value) return
  
  isLoading.value = true
  error.value = ''
  
  try {
    const success = await authStore.login({ email: email.value, password: password.value })
    if (success) {
      router.push('/partner')
    } else {
      error.value = 'Invalid email or password'
    }
  } catch (e: any) {
    error.value = e.message || 'Login failed'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4">
    <div class="w-full max-w-md space-y-8 bg-card p-8 rounded-2xl border border-border shadow-sm">
      <div class="text-center">
        <NuxtLink to="/" class="inline-flex items-center gap-2 mb-6">
          <Mountain class="h-8 w-8 text-primary" />
          <span class="text-2xl font-black tracking-tighter">NOMAD CORE</span>
        </NuxtLink>
        <h2 class="text-2xl font-bold">Partner Login</h2>
        <p class="text-muted-foreground mt-2">Manage your properties and bookings</p>
      </div>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div v-if="error" class="p-3 text-sm bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-center">
          {{ error }}
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">Email Address</label>
          <input
            v-model="email"
            type="email"
            placeholder="partner@example.com"
            required
            class="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
            class="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <Button type="submit" class="w-full py-6 text-lg rounded-xl" :disabled="isLoading">
          <Loader2 v-if="isLoading" class="mr-2 h-5 w-5 animate-spin" />
          Sign In
        </Button>
      </form>

      <div class="text-center pt-4">
        <p class="text-sm text-muted-foreground">
          Don't have a partner account? 
          <NuxtLink to="/partner/auth/register" class="text-primary font-bold hover:underline">Register your business</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
