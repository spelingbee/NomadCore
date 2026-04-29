export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore()

  // Initialize auth from localStorage first
  authStore.initAuth()

  // If not authenticated, perform autologin
  // This is specifically for dev/demo purposes as requested
  if (!authStore.isAuthenticated) {
    console.log('Performing autologin...')
    await authStore.autoLogin()
  }
})
