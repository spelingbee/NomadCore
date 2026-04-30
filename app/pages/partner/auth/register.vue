<script setup lang="ts">
import { Mountain, Loader2 } from 'lucide-vue-next'
import { api } from '~/services/api.service'

definePageMeta({
  layout: 'traveler',
})

const router = useRouter()
const isLoading = ref(false)
const error = ref('')

const form = ref({
  legalName: '',
  displayName: '',
  email: '',
  password: '',
  fullName: '',
  type: 'hotel_owner'
})

const partnerTypes = [
  { value: 'hotel_owner', label: 'Hotel Owner' },
  { value: 'guest_house_owner', label: 'Guest House / Yurt Camp' },
  { value: 'experience_provider', label: 'Experience Provider' },
  { value: 'driver', label: 'Driver / Transportation' }
]

async function onSubmit() {
  isLoading.value = true
  error.value = ''
  
  try {
    const res = await api.registerPartner(form.value)
    if (res.success) {
      router.push('/partner/auth/login?registered=true')
    }
  } catch (e: any) {
    error.value = e.response?._data?.message || e.message || 'Registration failed'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-xl space-y-8 bg-card p-8 rounded-2xl border border-border shadow-sm">
      <div class="text-center">
        <NuxtLink to="/" class="inline-flex items-center gap-2 mb-6">
          <Mountain class="h-8 w-8 text-primary" />
          <span class="text-2xl font-black tracking-tighter">NOMAD CORE</span>
        </NuxtLink>
        <h2 class="text-2xl font-bold">Register as a Partner</h2>
        <p class="text-muted-foreground mt-2">Join our network of local hospitality providers</p>
      </div>

      <form @submit.prevent="onSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-if="error" class="md:col-span-2 p-3 text-sm bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-center">
          {{ error }}
        </div>

        <div class="space-y-2 md:col-span-2">
          <label class="text-sm font-medium">Business / Legal Name</label>
          <input
            v-model="form.legalName"
            placeholder="Nomad Traditions LLC"
            required
            class="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">Display Name (Public)</label>
          <input
            v-model="form.displayName"
            placeholder="Golden Yurt Camp"
            required
            class="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">Partner Type</label>
          <select
            v-model="form.type"
            class="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option v-for="type in partnerTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </option>
          </select>
        </div>

        <div class="space-y-2 md:col-span-2 border-t border-border pt-4 mt-2">
          <label class="text-xs font-bold uppercase text-muted-foreground">Administrator Account</label>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">Your Full Name</label>
          <input
            v-model="form.fullName"
            placeholder="Bakyt Nomad"
            required
            class="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">Work Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="bakyt@nomad.kg"
            required
            class="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <div class="space-y-2 md:col-span-2">
          <label class="text-sm font-medium">Password</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            required
            class="w-full px-4 py-3 rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        <Button type="submit" class="md:col-span-2 w-full py-6 text-lg rounded-xl mt-4" :disabled="isLoading">
          <Loader2 v-if="isLoading" class="mr-2 h-5 w-5 animate-spin" />
          Create Partner Account
        </Button>
      </form>

      <div class="text-center pt-4">
        <p class="text-sm text-muted-foreground">
          Already have an account? 
          <NuxtLink to="/partner/auth/login" class="text-primary font-bold hover:underline">Sign in</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
