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

  const loginCustomer = async (credentials: any) => {
    return await request<any>(`/auth/loginCustomer`, {
      method: 'POST',
      body: credentials
    })
  }

  const registerCustomer = async (userData: any) => {
    return await request<any>(`/auth/registerCustomer`, {
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
  const fetchProperties = async (params?: { page?: number; size?: number; destinationAreaId?: string }) => {
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

  const updateProperty = async (id: string, data: any) => {
    return await request<Property>(`/properties/${id}`, {
      method: 'PUT',
      body: data
    })
  }

  const uploadPropertyImage = async (propertyId: string, file: File, sortOrder = 0) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('sortOrder', sortOrder.toString())
    
    return await request<any>(`/properties/${propertyId}/images`, {
      method: 'POST',
      body: formData
    })
  }

  const fetchPropertyImages = async (propertyId: string) => {
    return await request<any[]>(`/properties/${propertyId}/images`)
  }

  const deletePropertyImage = async (propertyId: string, imageId: string) => {
    return await request<any>(`/properties/${propertyId}/images/${imageId}`, {
      method: 'DELETE'
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

  const fetchUnitTypes = async (propertyId: string) => {
    return await request<any>(`/properties/${propertyId}/unit-types`)
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
  const fetchInventory = async (params: { ratePlanId?: string; propertyId?: string; date?: string; dateFrom?: string; dateTo?: string }) => {
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

  // --- Experiences ---
  const fetchExperiences = async (params?: { partnerId?: string; destinationAreaId?: string }) => {
    let path = '/experiences'
    if (params?.partnerId) path = '/experiences/by-partner'
    else if (params?.destinationAreaId) path = '/experiences/by-area'
    
    return await request<any>(path, { params })
  }

  const createExperience = async (data: any) => {
    return await request<any>('/experiences', {
      method: 'POST',
      body: data
    })
  }

  return {
    fetchPlaces,
    fetchPlaceById,
    fetchPlaceProperties,
    fetchProperties,
    fetchMyProperties,
    fetchPropertyById,
    createProperty,
    updateProperty,
    uploadPropertyImage,
    fetchPropertyImages,
    deletePropertyImage,
    fetchRatePlans,
    fetchPropertyRatePlans,
    fetchUnitTypes,
    fetchBookings,
    createBooking,
    cancelBooking,
    registerCheckIn,
    fetchInventory,
    updateInventoryBulk,
    fetchAnalyticsSummary,
    fetchAnalyticsRevenue,
    fetchExperiences,
    createExperience,
    login,
    register,
    loginCustomer,
    registerCustomer,
    refreshToken
  }
}
