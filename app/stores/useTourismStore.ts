import { defineStore } from 'pinia'
import type { TouristPlace, Property, Booking } from '~/types/database'
import { useApiService } from '~/services/api.service'

export const useTourismStore = defineStore('tourism', () => {
  const api = useApiService()
  
  const places = ref<TouristPlace[]>([])
  const properties = ref<Property[]>([])
  const unitTypes = ref<any[]>([]) // Used for Rate Plans
  const units = ref<any[]>([])
  const experiences = ref<any[]>([])
  const bookings = ref<Booking[]>([])
  const analyticsSummary = ref<any>(null)
  const propertyImages = ref<any[]>([])
  
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Helper to extract data from various response formats
  const extractData = (res: any) => {
    if (!res) return []
    if (Array.isArray(res)) return res
    if (res.success && Array.isArray(res.data)) return res.data
    if (Array.isArray(res.content)) return res.content
    if (res._embedded) {
      const keys = Object.keys(res._embedded)
      if (keys.length > 0) return res._embedded[keys[0]]
    }
    return res.data || []
  }

  const mapProperty = (p: any) => {
    if (!p) return p
    if (p.imageUrls && p.imageUrls.length > 0 && !p.image) {
      p.image = p.imageUrls[0]
    }
    if (p.metadata && p.metadata.amenities) {
      p.amenities = p.metadata.amenities
    }
    return p
  }

  const loadPlaces = async (params?: any) => {
    isLoading.value = true
    try {
      const res = await api.fetchPlaces(params)
      places.value = extractData(res)
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  const loadProperties = async (params?: any) => {
    isLoading.value = true
    try {
      const res = await api.fetchProperties(params)
      properties.value = extractData(res).map(mapProperty)
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  const loadPlaceProperties = async (id: string) => {
    properties.value = []
    isLoading.value = true
    try {
      const res = await api.fetchPlaceProperties(id)
      properties.value = extractData(res).map(mapProperty)
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  const loadMyProperties = async () => {
    isLoading.value = true
    try {
      const res = await api.fetchMyProperties()
      properties.value = extractData(res).map(mapProperty)
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  const loadUnitTypes = async (params?: { propertyId?: string }) => {
    isLoading.value = true
    try {
      const res = params?.propertyId 
        ? await api.fetchPropertyRatePlans(params.propertyId)
        : await api.fetchRatePlans(params)
        
      const newData = extractData(res)
      // Append only unique items
      const existingIds = new Set(unitTypes.value.map(u => u.id))
      const uniqueNewData = newData.filter((u: any) => !existingIds.has(u.id))
      unitTypes.value = [...unitTypes.value, ...uniqueNewData]
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  const loadUnits = async (propertyId: string) => {
    isLoading.value = true
    try {
      const res = await api.fetchUnitTypes(propertyId)
      units.value = extractData(res)
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  const loadExperiences = async (params?: any) => {
    isLoading.value = true
    try {
      const res = await api.fetchExperiences(params)
      experiences.value = extractData(res)
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  const createExperience = async (data: any) => {
    isLoading.value = true
    try {
      await api.createExperience(data)
      // Re-load experiences if we have selected property
      // It's better to just fetch them again in the component or return the result
      return true
    } catch (e: any) {
      error.value = e.message
      return false
    } finally {
      isLoading.value = false
    }
  }

  const loadBookings = async (params?: any) => {
    isLoading.value = true
    try {
      const res = await api.fetchBookings(params)
      bookings.value = extractData(res)
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  const loadAnalytics = async () => {
    isLoading.value = true
    try {
      const res = await api.fetchAnalyticsSummary()
      analyticsSummary.value = res.data || res
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  const loadPropertyImages = async (propertyId: string) => {
    isLoading.value = true
    try {
      const res = await api.fetchPropertyImages(propertyId)
      propertyImages.value = extractData(res)
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  const uploadPropertyImage = async (propertyId: string, file: File) => {
    isLoading.value = true
    try {
      await api.uploadPropertyImage(propertyId, file)
      await loadPropertyImages(propertyId)
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  const updateProperty = async (id: string, data: any) => {
    isLoading.value = true
    try {
      await api.updateProperty(id, data)
      await loadMyProperties()
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  const deletePropertyImage = async (propertyId: string, imageId: string) => {
    isLoading.value = true
    try {
      await api.deletePropertyImage(propertyId, imageId)
      await loadPropertyImages(propertyId)
    } catch (e: any) {
      error.value = e.message
    } finally {
      isLoading.value = false
    }
  }

  const getPropertyById = async (id: string) => {
    // Check if we already have it
    const existing = properties.value.find(p => p.id === id)
    if (existing) return existing
    
    try {
      const res = await api.fetchPropertyById(id)
      const data = (res as any).data || res
      return mapProperty(data)
    } catch (e) {
      console.error('Error fetching property:', e)
      return null
    }
  }

  const getPlaceById = async (id: string) => {
    const existing = places.value.find(p => p.id === id)
    if (existing) return existing
    
    try {
      const res = await api.fetchPlaceById(id)
      return (res as any).data || res
    } catch (e) {
      console.error('Error fetching place:', e)
      return null
    }
  }

  return {
    places,
    properties,
    unitTypes,
    units,
    experiences,
    propertyImages,
    bookings,
    analyticsSummary,
    isLoading,
    error,
    loadPlaces,
    loadProperties,
    loadPlaceProperties,
    loadMyProperties,
    loadUnitTypes,
    loadUnits,
    loadExperiences,
    createExperience,
    loadPropertyImages,
    uploadPropertyImage,
    deletePropertyImage,
    loadBookings,
    loadAnalytics,
    updateProperty,
    getPropertyById,
    getPlaceById,
    getUnitTypesByProperty: (propertyId: string) => unitTypes.value.filter(u => 
      u.propertyId === propertyId || 
      u.property_id === propertyId || 
      (u.sellableType === 'property' && u.sellableId === propertyId)
    ),
    getPropertyPrice: (propertyId: string) => {
      const plans = unitTypes.value.filter(u => 
        u.propertyId === propertyId || 
        u.property_id === propertyId || 
        (u.sellableType === 'property' && u.sellableId === propertyId)
      )
      if (plans.length === 0) return null
      const prices = plans.map(p => (p as any).retailRate || (p as any).basePrice).filter(p => p !== undefined)
      return prices.length > 0 ? Math.min(...prices) : null
    },
    packages: computed(() => properties.value.filter(p => p.kind === 'tour_operator' || (p as any).type === 'tour_operator'))
  }
})
