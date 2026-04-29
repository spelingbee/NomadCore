import { ref } from 'vue'

export const useDemoCore = () => {
  const isLoading = ref(false)
  const error = ref(null)

  // 1. Быстрое создание объекта (Property + UnitType)
  // Это то, что вы покажете как "Партнер зашел и оцифровал свою юрту"
  const createQuickProperty = async (partnerId: string, areaId: string) => {
    isLoading.value = true
    try {
      // Имитация API запроса к вашему бэкенду
      // В реальности тут будет fetch('/api/properties', ...)
      const property = {
        name: "Yurt Camp 'Son-Kul Heaven'",
        kind: 'yurt_camp',
        partner_id: partnerId,
        destination_area_id: areaId,
        lat: 41.8234,
        lng: 75.1234,
        metadata: { amenities: ['wifi', 'breakfast', 'mountain_view'] }
      }
      
      console.log('🚀 Creating property...', property)
      // return await $fetch('/api/properties', { method: 'POST', body: property })
      
      return { id: 'mock-prop-123', ...property }
    } finally {
      isLoading.value = false
    }
  }

  // 2. Главный флоу БРОНИРОВАНИЯ
  // Это то, что происходит "под капотом", когда турист жмет кнопку в МБанке
  const performFullBooking = async (data: {
    unitTypeId: string,
    partnerId: string,
    customerId: string,
    dateFrom: string,
    dateTo: string
  }) => {
    isLoading.value = true
    try {
      const bookingCode = `NOMAD-${Math.random().toString(36).toUpperCase().substring(2, 8)}`
      
      const bookingPayload = {
        booking_code: bookingCode,
        customer_id: data.customerId,
        partner_id: data.partnerId,
        source: 'mbank', // Показываем на демо, что пришло из МБанка!
        status: 'confirmed',
        items: [
          {
            unit_type_id: data.unitTypeId,
            date_from: data.dateFrom,
            date_to: data.dateTo,
            qty: 1,
            unit_price: 2500
          }
        ],
        payment: {
          provider: 'mbank',
          amount: 2500,
          status: 'paid'
        }
      }

      console.log('💰 Performing full booking flow...', bookingPayload)
      // return await $fetch('/api/bookings/full', { method: 'POST', body: bookingPayload })
      
      return { success: true, bookingCode }
    } catch (e) {
      error.value = e
    } finally {
      isLoading.value = false
    }
  }

  return {
    createQuickProperty,
    performFullBooking,
    isLoading,
    error
  }
}
