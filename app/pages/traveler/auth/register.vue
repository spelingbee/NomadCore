<script setup lang="ts">
import { useApiService } from '~/services/api.service'
import { Button } from '~/components/ui/button'
import { ArrowLeft, UserPlus } from 'lucide-vue-next'

definePageMeta({
  layout: 'traveler',
})

const router = useRouter()
const api = useApiService()

const form = ref({
  fullName: '',
  email: '',
  password: '',
  phone: ''
})

const isLoading = ref(false)
const error = ref('')

async function handleRegister() {
  isLoading.value = true
  error.value = ''
  try {
    await api.registerCustomer({
      ...form.value
    })
    // Redirect to login
    router.push('/traveler/auth/login')
  } catch (e: any) {
    error.value = e.message || 'Registration failed'
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
          <UserPlus class="w-8 h-8" />
        </div>
        <h1 class="text-2xl font-bold">Create Traveler Account</h1>
        <p class="text-muted-foreground mt-1 text-sm">Join Nomad Core to start your adventure</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="text-xs font-bold uppercase text-muted-foreground ml-1">Full Name</label>
          <input 
            v-model="form.fullName" 
            type="text" 
            required
            class="w-full mt-1 px-4 py-3 border border-border rounded-xl bg-background outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="John Doe"
          />
        </div>
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
          <label class="text-xs font-bold uppercase text-muted-foreground ml-1">Phone Number</label>
          <input 
            v-model="form.phone" 
            type="tel" 
            class="w-full mt-1 px-4 py-3 border border-border rounded-xl bg-background outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="+996 555 123 456"
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
          {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
        </Button>
      </form>

      <div class="mt-8 pt-6 border-t border-border text-center">
        <p class="text-sm text-muted-foreground">
          Already have an account? 
          <NuxtLink to="/traveler/auth/login" class="text-primary font-bold hover:underline">Log In</NuxtLink>
        </p>
      </div>
    </div>
    
    <button @click="router.push('/traveler')" class="mt-8 text-muted-foreground flex items-center gap-2 hover:text-foreground font-medium">
      <ArrowLeft class="w-4 h-4" />
      Back to Home
    </button>
  </div>
</template>
