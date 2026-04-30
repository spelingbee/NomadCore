import { defineStore } from 'pinia'
import { useApiService } from '~/services/api.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const token = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (credentials: any) => {
    const api = useApiService()
    isLoading.value = true
    error.value = null
    try {
      const res = await api.login(credentials)
      const data = (res as any).data || res
      token.value = data.accessToken || data.token
      refreshToken.value = data.refreshToken
      user.value = data.user
      
      // Save to localStorage
      if (process.client) {
        localStorage.setItem('auth_token', token.value!)
        localStorage.setItem('auth_refresh', refreshToken.value!)
      }
      return true
    } catch (e: any) {
      error.value = e.message || 'Login failed'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData: any) => {
    const api = useApiService()
    isLoading.value = true
    error.value = null
    try {
      await api.register(userData)
      return true
    } catch (e: any) {
      error.value = e.message || 'Registration failed'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    refreshToken.value = null
    if (process.client) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_refresh')
    }
  }

  const autoLogin = async () => {
    return await login({
      email: 'partner@nomad.kg',
      password: 'password'
    })
  }

  const initAuth = () => {
    if (process.client) {
      const savedToken = localStorage.getItem('auth_token')
      const savedRefresh = localStorage.getItem('auth_refresh')
      if (savedToken) {
        token.value = savedToken
        refreshToken.value = savedRefresh
      }
    }
  }

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    initAuth,
    autoLogin
  }
})
