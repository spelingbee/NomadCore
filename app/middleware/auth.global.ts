export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // 1. Protect Partner routes
  if (to.path.startsWith('/partner')) {
    // Allow access to partner auth pages (login/register)
    if (to.path.startsWith('/partner/auth')) {
      return
    }

    // Redirect to partner login if not authenticated
    if (!authStore.isAuthenticated) {
      return navigateTo('/partner/auth/login')
    }
  }

  // 2. Protect Admin routes (optional future proofing)
  if (to.path.startsWith('/admin') && !authStore.isAuthenticated) {
    return navigateTo('/partner/auth/login')
  }
})
