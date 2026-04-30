<script setup lang="ts">
import { useApiService } from '~/services/api.service'
import { Button } from '~/components/ui/button'
import { ArrowLeft, LogIn } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/useAuthStore'

definePageMeta({
  layout: 'traveler',
})

const router = useRouter()
const api = useApiService()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

const isLoading = ref(false)
const error = ref('')

async function handleLogin() {
  isLoading.value = true
  error.value = ''
  try {
    const res = await api.loginCustomer(form.value)
    const data = res.data || res
    authStore.token = data.accessToken || data.token
    authStore.user = {
      id: data.userId || data.customerId,
      email: data.email,
      role: data.role,
      fullName: data.fullName || data.email.split('@')[0]
    }
    
    if (process.client) {
      localStorage.setItem('auth_token', authStore.token!)
    }
    
    router.push('/traveler')
  } catch (e: any) {
    error.value = 'Invalid email or password'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4">
    <div class="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl p-8">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <LogIn class="w-8 h-8" />
        </div>
        <h1 class="text-2xl font-bold">Welcome Back</h1>
        <p class="text-muted-foreground mt-1 text-sm">Log in to your Nomad Core traveler account</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="text-xs font-bold uppercase text-muted-foreground ml-1">Email Address</label>
          <input 
            v-model="form.email" 
            type="email" 
            required
            class="w-full mt-1 px-4 py-3 border border-border rounded-xl bg-background outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label class="text-xs font-bold uppercase text-muted-foreground ml-1">Password</label>
          <input 
            v-model="form.password" 
            type="password" 
            required
            class="w-full mt-1 px-4 py-3 border border-border rounded-xl bg-background outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="••••••••"
          />
        </div>

        <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium">
          {{ error }}
        </div>

        <Button class="w-full h-12 text-base font-bold shadow-lg shadow-primary/20" :disabled="isLoading">
          {{ isLoading ? 'Logging in...' : 'Sign In' }}
        </Button>
      </form>

      <div class="mt-8 pt-6 border-t border-border text-center">
        <p class="text-sm text-muted-foreground">
          Don't have an account? 
          <NuxtLink to="/traveler/auth/register" class="text-primary font-bold hover:underline">Create One</NuxtLink>
        </p>
      </div>
    </div>
    
    <button @click="router.push('/traveler')" class="mt-8 text-muted-foreground flex items-center gap-2 hover:text-foreground font-medium">
      <ArrowLeft class="w-4 h-4" />
      Back to Home
    </button>
  </div>
</template>
