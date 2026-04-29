export interface Partner {
  id: string
  type: string
  legalName: string
  displayName?: string
  inn: string
  phone: string
  email: string
  verifiedByFund?: boolean
  verifiedByBank?: boolean
  status: string
  createdAt: string
}

export interface TouristPlace {
  id: string
  name: string
  description: string
  shortDescription: string
  type: string
  subtype: string
  region: string
  lat: number
  lon: number
  season: string[]
  altitude: number
  bestTimeToVisit: string
  priceLevel: number
  suitableFor: string[]
  durationHours?: number
  keywords: string[]
  rating: number
  image?: string
  metadata?: Record<string, any>
}

export interface Property {
  id: string
  partnerId: string
  touristPlaceId?: string
  kind: string
  type?: string // Alias for kind if needed
  name: string
  description: string
  addressText: string
  lat: number
  lng: number
  status: string
  createdAt: string
  image?: string
  rating?: number
  reviewCount?: number
  amenities?: string[]
  metadata?: Record<string, any>
}

export interface UnitType {
  id: string
  propertyId: string
  kind: string
  name: string
  description: string
  capacity: number
  baseCurrency: string
  basePrice?: number
  totalInventory: number
  active: boolean
}

export interface RatePlan {
  id: string
  propertyId: string
  name: string
  retailRate: number
  currency: string
  totalQty: number
  availableQty: number
  refundable: boolean
  cancellationPolicy: string
  status: string
  createdAt: string
}

export interface Booking {
  id: string
  ratePlanId: string
  bookingCode: string
  guestName: string
  guestEmail: string
  guestPhone: string
  checkIn: string
  checkOut: string
  qty: number
  totalAmount: number
  currency: string
  status: string
  bookedAt: string
}
