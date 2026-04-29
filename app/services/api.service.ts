import type { TouristPlace, Property, Booking, RatePlan } from '~/types/database'

export const useApiService = () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.apiBaseUrl

  // Helper for requests
  const request = async <T>(path: string, options?: any) => {
    const authStore = useAuthStore()
    const headers: Record<string, string> = {
      'ngrok-skip-browser-warning': 'true',
      ...options?.headers
    }

    if (authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`
    }

    return await $fetch<T>(`${baseUrl}${path}`, {
      ...options,
      headers
    })
  }

  // --- Auth ---
  const login = async (credentials: any) => {
    return await request<any>(`/auth/login`, {
      method: 'POST',
      body: credentials
    })
  }

  const register = async (userData: any) => {
    return await request<any>(`/auth/register`, {
      method: 'POST',
      body: userData
    })
  }

  const refreshToken = async (token: string) => {
    return await request<any>(`/auth/refresh`, {
      method: 'POST',
      body: { refreshToken: token }
    })
  }

  // --- Tourist Places (Destination Areas) ---
  const fetchPlaces = async (params?: { region?: string; type?: string; page?: number; size?: number }) => {
    return await request<any>(`/destination-areas`, {
      params: { ...params }
    })
  }

  const fetchPlaceById = async (id: string) => {
    return await request<TouristPlace>(`/destination-areas/${id}`)
  }

  const fetchPlaceProperties = async (id: string) => {
    return await request<any>(`/destination-areas/${id}/properties`)
  }

  // --- Properties ---
  const fetchProperties = async (params?: { page?: number; size?: number; touristPlaceId?: string }) => {
    return await request<any>(`/properties`, {
      params: { page: 0, size: 50, ...params }
    })
  }

  const fetchMyProperties = async () => {
    return await request<any>(`/properties/my`)
  }

  const fetchPropertyById = async (id: string) => {
    return await request<Property>(`/properties/${id}`)
  }

  const createProperty = async (data: any) => {
    return await request<Property>(`/properties`, {
      method: 'POST',
      body: data
    })
  }

  // --- Rate Plans / Unit Types ---
  const fetchRatePlans = async (params?: { propertyId?: string }) => {
    return await request<any>(`/rate-plans`, {
      params
    })
  }

  const fetchPropertyRatePlans = async (propertyId: string) => {
    return await request<any>(`/properties/${propertyId}/rate-plans`)
  }

  // --- Bookings ---
  const fetchBookings = async (params?: { page?: number; size?: number }) => {
    return await request<any>(`/bookings`, {
      params: { page: 0, size: 50, ...params }
    })
  }

  const createBooking = async (data: any) => {
    return await request<Booking>(`/bookings`, {
      method: 'POST',
      body: data
    })
  }

  const cancelBooking = async (id: string) => {
    return await request<any>(`/bookings/${id}/cancel`, {
      method: 'PUT'
    })
  }

  const registerCheckIn = async (bookingCode: string) => {
    return await request<any>(`/checkins/scan`, {
      method: 'POST',
      body: { bookingCode }
    })
  }

  // --- Inventory ---
  const fetchInventory = async (params: { ratePlanId: string; dateFrom: string; dateTo: string }) => {
    return await request<any>(`/inventory`, {
      params
    })
  }

  const updateInventoryBulk = async (data: any) => {
    return await request<any>(`/inventory/bulk`, {
      method: 'POST',
      body: data
    })
  }

  // --- Analytics ---
  const fetchAnalyticsSummary = async () => {
    return await request<any>(`/analytics/summary`)
  }

  const fetchAnalyticsRevenue = async () => {
    return await request<any>(`/analytics/revenue`)
  }

  return {
    fetchPlaces,
    fetchPlaceById,
    fetchProperties,
    fetchMyProperties,
    fetchPropertyById,
    createProperty,
    fetchBookings,
    createBooking,
    cancelBooking,
    registerCheckIn,
    fetchInventory,
    updateInventoryBulk,
    fetchAnalyticsSummary,
    fetchAnalyticsRevenue,
    login,
    register,
    refreshToken
  }
}
