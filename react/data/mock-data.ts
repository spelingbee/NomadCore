// Types
export type DestinationArea = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  region: string;
  facts: { label: string; value: string }[];
  stats: { bookings: number; revenue: number; occupancy: number };
};

export type Partner = {
  id: string;
  name: string;
  type: 'yurt_camp' | 'guest_house' | 'tour_operator' | 'park_admin' | 'rest_point';
  verified: boolean;
  joinedDate: string;
  stats: { properties: number; bookings: number; revenue: number };
};

export type Property = {
  id: string;
  partnerId: string;
  destinationId: string;
  name: string;
  type: string;
  description: string;
  image: string;
  amenities: string[];
  rating: number;
  reviewCount: number;
};

export type UnitType = {
  id: string;
  propertyId: string;
  name: string;
  description: string;
  capacity: number;
  basePrice: number;
  image: string;
};

export type Service = {
  id: string;
  propertyId: string;
  name: string;
  description: string;
  price: number;
  category: string;
};

export type Experience = {
  id: string;
  destinationId: string;
  partnerId: string;
  name: string;
  description: string;
  duration: string;
  price: number;
  image: string;
};

export type RatePlan = {
  id: string;
  unitTypeId: string;
  name: string;
  netRate: number;
  retailRate: number;
  season: 'low' | 'mid' | 'high';
};

export type InventoryDaily = {
  id: string;
  unitTypeId: string;
  date: string;
  available: number;
  netRate: number;
  retailRate: number;
  stopSell: boolean;
};

export type Channel = {
  id: string;
  name: string;
  color: string;
  commission: number;
};

export type ChannelMapping = {
  id: string;
  propertyId: string;
  channelId: string;
  status: 'active' | 'pending' | 'inactive';
  priceModifier: number;
};

export type TourPackage = {
  id: string;
  name: string;
  destinationId: string;
  partnerId: string;
  description: string;
  image: string;
  duration: string;
  retailPrice: number;
  netPrice: number;
  items: { type: string; name: string; details: string }[];
  itinerary: { day: number; title: string; description: string }[];
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
};

export type Booking = {
  id: string;
  code: string;
  customerId: string;
  packageId?: string;
  propertyId?: string;
  channelId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  totalPrice: number;
  createdAt: string;
};

export type Payment = {
  id: string;
  bookingId: string;
  amount: number;
  status: 'paid' | 'pending' | 'refunded';
  method: string;
  paidAt?: string;
};

export type CheckinEvent = {
  id: string;
  bookingId: string;
  type: 'checkin' | 'checkout';
  timestamp: string;
  location: string;
};

export type Review = {
  id: string;
  bookingId: string;
  customerId: string;
  propertyId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

// Mock Data
export const destinations: DestinationArea[] = [
  {
    id: 'dest-1',
    name: 'Song-Kul',
    slug: 'song-kul',
    description: 'A stunning alpine lake at 3,016m altitude, surrounded by lush summer pastures where nomadic herders live in traditional yurts. Experience authentic Kyrgyz culture and breathtaking mountain scenery.',
    image: 'https://images.unsplash.com/photo-1596392927852-2a18c336bd54?w=800&h=600&fit=crop',
    region: 'Naryn',
    facts: [
      { label: 'Altitude', value: '3,016m' },
      { label: 'Best Season', value: 'June - September' },
      { label: 'Lake Size', value: '278 km²' },
      { label: 'Distance from Bishkek', value: '300 km' },
    ],
    stats: { bookings: 342, revenue: 4850000, occupancy: 78 },
  },
  {
    id: 'dest-2',
    name: 'Ala-Archa',
    slug: 'ala-archa',
    description: 'A spectacular national park just 40km from Bishkek, featuring dramatic alpine peaks, glaciers, and pristine hiking trails. Perfect for day trips or multi-day mountaineering expeditions.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop',
    region: 'Chuy',
    facts: [
      { label: 'Peak Altitude', value: '4,895m' },
      { label: 'Best Season', value: 'Year-round' },
      { label: 'Park Area', value: '194 km²' },
      { label: 'Distance from Bishkek', value: '40 km' },
    ],
    stats: { bookings: 892, revenue: 3200000, occupancy: 85 },
  },
  {
    id: 'dest-3',
    name: 'Sary-Chelek',
    slug: 'sary-chelek',
    description: 'A pristine biosphere reserve in western Kyrgyzstan featuring turquoise lakes surrounded by walnut forests. One of the most biodiverse areas in Central Asia.',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop',
    region: 'Jalal-Abad',
    facts: [
      { label: 'Lake Altitude', value: '1,940m' },
      { label: 'Best Season', value: 'May - October' },
      { label: 'Reserve Area', value: '241 km²' },
      { label: 'Distance from Bishkek', value: '450 km' },
    ],
    stats: { bookings: 156, revenue: 1890000, occupancy: 62 },
  },
];

export const partners: Partner[] = [
  {
    id: 'partner-1',
    name: 'Nomad Yurt Camp',
    type: 'yurt_camp',
    verified: true,
    joinedDate: '2024-01-15',
    stats: { properties: 2, bookings: 156, revenue: 2340000 },
  },
  {
    id: 'partner-2',
    name: 'Mountain Vista Guest House',
    type: 'guest_house',
    verified: true,
    joinedDate: '2024-02-01',
    stats: { properties: 1, bookings: 89, revenue: 890000 },
  },
  {
    id: 'partner-3',
    name: 'Kyrgyz Adventures',
    type: 'tour_operator',
    verified: true,
    joinedDate: '2023-11-20',
    stats: { properties: 0, bookings: 234, revenue: 4560000 },
  },
  {
    id: 'partner-4',
    name: 'Ala-Archa National Park',
    type: 'park_admin',
    verified: true,
    joinedDate: '2024-03-01',
    stats: { properties: 1, bookings: 892, revenue: 1250000 },
  },
  {
    id: 'partner-5',
    name: 'Song-Kul Rest Point',
    type: 'rest_point',
    verified: false,
    joinedDate: '2024-04-15',
    stats: { properties: 1, bookings: 78, revenue: 390000 },
  },
];

export const properties: Property[] = [
  {
    id: 'prop-1',
    partnerId: 'partner-1',
    destinationId: 'dest-1',
    name: 'Song-Kul Lakeside Yurts',
    type: 'Yurt Camp',
    description: 'Traditional yurts right on the shore of Song-Kul lake with stunning sunrise views.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    amenities: ['Traditional Bedding', 'Shared Bathroom', 'Breakfast Included', 'Horse Riding'],
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: 'prop-2',
    partnerId: 'partner-1',
    destinationId: 'dest-1',
    name: 'Nomad Family Camp',
    type: 'Yurt Camp',
    description: 'Family-friendly yurt camp with authentic nomadic experience and local cuisine.',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop',
    amenities: ['Family Yurts', 'Local Cuisine', 'Cultural Activities', 'Guided Tours'],
    rating: 4.6,
    reviewCount: 89,
  },
  {
    id: 'prop-3',
    partnerId: 'partner-2',
    destinationId: 'dest-2',
    name: 'Ala-Archa Mountain Lodge',
    type: 'Guest House',
    description: 'Cozy mountain lodge at the entrance of Ala-Archa National Park.',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
    amenities: ['Private Rooms', 'Hot Shower', 'Restaurant', 'Equipment Rental'],
    rating: 4.5,
    reviewCount: 167,
  },
  {
    id: 'prop-4',
    partnerId: 'partner-4',
    destinationId: 'dest-2',
    name: 'Ala-Archa Visitor Center',
    type: 'Park Facility',
    description: 'Official park visitor center with information, permits, and basic amenities.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    amenities: ['Information Desk', 'Permits', 'Parking', 'Restrooms'],
    rating: 4.2,
    reviewCount: 234,
  },
  {
    id: 'prop-5',
    partnerId: 'partner-5',
    destinationId: 'dest-1',
    name: 'Song-Kul Rest Point',
    type: 'Rest Point',
    description: 'Essential services for travelers including hot showers, food, and vehicle charging.',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&h=600&fit=crop',
    amenities: ['Hot Shower', 'Food Service', 'Phone Charging', 'Basic Supplies'],
    rating: 4.0,
    reviewCount: 56,
  },
  {
    id: 'prop-6',
    partnerId: 'partner-2',
    destinationId: 'dest-3',
    name: 'Sary-Chelek Forest Lodge',
    type: 'Guest House',
    description: 'Eco-friendly lodge surrounded by ancient walnut forests near the lake.',
    image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&h=600&fit=crop',
    amenities: ['Eco Rooms', 'Nature Walks', 'Local Guides', 'Organic Meals'],
    rating: 4.7,
    reviewCount: 78,
  },
];

export const unitTypes: UnitType[] = [
  { id: 'unit-1', propertyId: 'prop-1', name: 'Standard Yurt', description: '2-person traditional yurt', capacity: 2, basePrice: 3500, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop' },
  { id: 'unit-2', propertyId: 'prop-1', name: 'Family Yurt', description: '4-person spacious yurt', capacity: 4, basePrice: 5500, image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop' },
  { id: 'unit-3', propertyId: 'prop-2', name: 'Traditional Yurt', description: 'Authentic nomad yurt', capacity: 3, basePrice: 3000, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop' },
  { id: 'unit-4', propertyId: 'prop-3', name: 'Double Room', description: 'Comfortable mountain room', capacity: 2, basePrice: 4500, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop' },
  { id: 'unit-5', propertyId: 'prop-3', name: 'Family Suite', description: 'Large suite with mountain views', capacity: 4, basePrice: 7000, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop' },
  { id: 'unit-6', propertyId: 'prop-5', name: 'Day Pass', description: 'Access to rest point facilities', capacity: 10, basePrice: 500, image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&h=300&fit=crop' },
  { id: 'unit-7', propertyId: 'prop-6', name: 'Eco Room', description: 'Sustainable forest accommodation', capacity: 2, basePrice: 4000, image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=400&h=300&fit=crop' },
  { id: 'unit-8', propertyId: 'prop-4', name: 'Park Entry', description: 'National park entrance fee', capacity: 20, basePrice: 400, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' },
];

export const services: Service[] = [
  { id: 'svc-1', propertyId: 'prop-1', name: 'Dinner', description: 'Traditional Kyrgyz dinner', price: 800, category: 'Food' },
  { id: 'svc-2', propertyId: 'prop-1', name: 'Breakfast', description: 'Continental breakfast', price: 500, category: 'Food' },
  { id: 'svc-3', propertyId: 'prop-5', name: 'Hot Shower', description: '15-minute hot shower', price: 300, category: 'Amenity' },
  { id: 'svc-4', propertyId: 'prop-3', name: 'Equipment Rental', description: 'Hiking gear rental', price: 1500, category: 'Equipment' },
  { id: 'svc-5', propertyId: 'prop-3', name: 'Packed Lunch', description: 'Trail lunch box', price: 600, category: 'Food' },
  { id: 'svc-6', propertyId: 'prop-4', name: 'Guided Tour', description: '2-hour guided park tour', price: 2000, category: 'Activity' },
];

export const experiences: Experience[] = [
  { id: 'exp-1', destinationId: 'dest-1', partnerId: 'partner-3', name: 'Horse Trekking', description: '2-hour horseback ride around Song-Kul lake', duration: '2 hours', price: 2500, image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&h=300&fit=crop' },
  { id: 'exp-2', destinationId: 'dest-1', partnerId: 'partner-3', name: 'Eagle Hunting Demo', description: 'Traditional eagle hunting demonstration', duration: '1.5 hours', price: 3000, image: 'https://images.unsplash.com/photo-1611689342806-0f1e7e9b4c7e?w=400&h=300&fit=crop' },
  { id: 'exp-3', destinationId: 'dest-2', partnerId: 'partner-3', name: 'Glacier Hike', description: 'Guided hike to Ak-Sai glacier', duration: '6 hours', price: 5000, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop' },
  { id: 'exp-4', destinationId: 'dest-2', partnerId: 'partner-4', name: 'Sunrise Photography', description: 'Early morning photography tour', duration: '3 hours', price: 3500, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' },
  { id: 'exp-5', destinationId: 'dest-3', partnerId: 'partner-3', name: 'Walnut Forest Walk', description: 'Guided nature walk through ancient forests', duration: '4 hours', price: 2000, image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop' },
];

export const ratePlans: RatePlan[] = [
  { id: 'rate-1', unitTypeId: 'unit-1', name: 'Low Season', netRate: 2800, retailRate: 3500, season: 'low' },
  { id: 'rate-2', unitTypeId: 'unit-1', name: 'High Season', netRate: 4800, retailRate: 6000, season: 'high' },
  { id: 'rate-3', unitTypeId: 'unit-2', name: 'Low Season', netRate: 4400, retailRate: 5500, season: 'low' },
  { id: 'rate-4', unitTypeId: 'unit-2', name: 'High Season', netRate: 7200, retailRate: 9000, season: 'high' },
  { id: 'rate-5', unitTypeId: 'unit-4', name: 'Standard', netRate: 3600, retailRate: 4500, season: 'mid' },
  { id: 'rate-6', unitTypeId: 'unit-4', name: 'Peak', netRate: 5600, retailRate: 7000, season: 'high' },
];

export const inventoryDaily: InventoryDaily[] = [
  { id: 'inv-1', unitTypeId: 'unit-1', date: '2024-07-15', available: 3, netRate: 4800, retailRate: 6000, stopSell: false },
  { id: 'inv-2', unitTypeId: 'unit-1', date: '2024-07-16', available: 2, netRate: 4800, retailRate: 6000, stopSell: false },
  { id: 'inv-3', unitTypeId: 'unit-1', date: '2024-07-17', available: 0, netRate: 4800, retailRate: 6000, stopSell: true },
  { id: 'inv-4', unitTypeId: 'unit-2', date: '2024-07-15', available: 2, netRate: 7200, retailRate: 9000, stopSell: false },
  { id: 'inv-5', unitTypeId: 'unit-2', date: '2024-07-16', available: 1, netRate: 7200, retailRate: 9000, stopSell: false },
  { id: 'inv-6', unitTypeId: 'unit-1', date: '2024-02-15', available: 5, netRate: 2800, retailRate: 3500, stopSell: false },
  { id: 'inv-7', unitTypeId: 'unit-1', date: '2024-02-16', available: 5, netRate: 2800, retailRate: 3500, stopSell: false },
];

export const channels: Channel[] = [
  { id: 'ch-1', name: 'Direct', color: '#10B981', commission: 0 },
  { id: 'ch-2', name: 'MTravel', color: '#3B82F6', commission: 15 },
  { id: 'ch-3', name: 'Kettik', color: '#F59E0B', commission: 12 },
  { id: 'ch-4', name: 'Tunduk Travel', color: '#8B5CF6', commission: 10 },
];

export const channelMappings: ChannelMapping[] = [
  { id: 'map-1', propertyId: 'prop-1', channelId: 'ch-1', status: 'active', priceModifier: 0 },
  { id: 'map-2', propertyId: 'prop-1', channelId: 'ch-2', status: 'active', priceModifier: 15 },
  { id: 'map-3', propertyId: 'prop-1', channelId: 'ch-3', status: 'active', priceModifier: 12 },
  { id: 'map-4', propertyId: 'prop-1', channelId: 'ch-4', status: 'pending', priceModifier: 10 },
  { id: 'map-5', propertyId: 'prop-3', channelId: 'ch-1', status: 'active', priceModifier: 0 },
  { id: 'map-6', propertyId: 'prop-3', channelId: 'ch-2', status: 'active', priceModifier: 15 },
];

export const tourPackages: TourPackage[] = [
  {
    id: 'pkg-1',
    name: 'Song-Kul Starter Package',
    destinationId: 'dest-1',
    partnerId: 'partner-1',
    description: 'The perfect introduction to Song-Kul lake and nomadic culture. Experience authentic yurt life with all essentials included.',
    image: 'https://images.unsplash.com/photo-1596392927852-2a18c336bd54?w=800&h=600&fit=crop',
    duration: '2 days / 1 night',
    retailPrice: 12500,
    netPrice: 10000,
    items: [
      { type: 'Accommodation', name: '1 night in traditional yurt', details: 'Song-Kul Lakeside Yurts' },
      { type: 'Transport', name: 'Round-trip transfer from Kochkor', details: '4x4 vehicle, shared' },
      { type: 'Meal', name: 'Dinner + Breakfast', details: 'Traditional Kyrgyz cuisine' },
      { type: 'Service', name: 'Hot shower at rest point', details: 'Song-Kul Rest Point' },
      { type: 'Activity', name: '2-hour horse trekking', details: 'Guided lakeside ride' },
    ],
    itinerary: [
      { day: 1, title: 'Arrival & Lake Discovery', description: 'Transfer to Song-Kul (3h), lunch en route. Arrive at yurt camp, settle in. Afternoon horse trekking around the lake. Traditional dinner with nomad family.' },
      { day: 2, title: 'Sunrise & Departure', description: 'Early morning sunrise viewing. Breakfast at camp. Hot shower at rest point. Transfer back to Kochkor by noon.' },
    ],
  },
  {
    id: 'pkg-2',
    name: 'Ala-Archa Day Adventure',
    destinationId: 'dest-2',
    partnerId: 'partner-3',
    description: 'A full day of mountain exploration in Kyrgyzstan\'s most accessible national park, just 40km from Bishkek.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop',
    duration: '1 day',
    retailPrice: 8500,
    netPrice: 6800,
    items: [
      { type: 'Transport', name: 'Round-trip from Bishkek', details: 'Comfortable minivan' },
      { type: 'Entry', name: 'Park entrance fee', details: 'Ala-Archa National Park' },
      { type: 'Activity', name: 'Guided glacier hike', details: '6-hour trek to Ak-Sai glacier' },
      { type: 'Meal', name: 'Packed lunch', details: 'Trail lunch box' },
      { type: 'Equipment', name: 'Hiking poles', details: 'Rental included' },
    ],
    itinerary: [
      { day: 1, title: 'Mountain Adventure', description: 'Morning pickup from Bishkek (7am). Drive to Ala-Archa (40min). Begin guided hike to Ak-Sai glacier. Lunch at scenic viewpoint. Return hike. Drive back to Bishkek by 6pm.' },
    ],
  },
];

export const customers: Customer[] = [
  { id: 'cust-1', name: 'Anna Schmidt', email: 'anna@email.com', phone: '+49123456789', nationality: 'German' },
  { id: 'cust-2', name: 'John Miller', email: 'john@email.com', phone: '+1234567890', nationality: 'American' },
  { id: 'cust-3', name: 'Yuki Tanaka', email: 'yuki@email.com', phone: '+81234567890', nationality: 'Japanese' },
  { id: 'cust-4', name: 'Marie Dubois', email: 'marie@email.com', phone: '+33123456789', nationality: 'French' },
];

export const bookings: Booking[] = [
  { id: 'book-1', code: 'NC-2024-001', customerId: 'cust-1', packageId: 'pkg-1', channelId: 'ch-1', checkIn: '2024-07-15', checkOut: '2024-07-17', guests: 2, status: 'confirmed', totalPrice: 25000, createdAt: '2024-06-20' },
  { id: 'book-2', code: 'NC-2024-002', customerId: 'cust-2', propertyId: 'prop-3', channelId: 'ch-2', checkIn: '2024-07-18', checkOut: '2024-07-20', guests: 2, status: 'confirmed', totalPrice: 14000, createdAt: '2024-06-22' },
  { id: 'book-3', code: 'NC-2024-003', customerId: 'cust-3', packageId: 'pkg-2', channelId: 'ch-3', checkIn: '2024-07-20', checkOut: '2024-07-20', guests: 1, status: 'pending', totalPrice: 8500, createdAt: '2024-06-25' },
  { id: 'book-4', code: 'NC-2024-004', customerId: 'cust-4', propertyId: 'prop-1', channelId: 'ch-1', checkIn: '2024-07-22', checkOut: '2024-07-24', guests: 4, status: 'confirmed', totalPrice: 18000, createdAt: '2024-06-28' },
  { id: 'book-5', code: 'NC-2024-005', customerId: 'cust-1', propertyId: 'prop-6', channelId: 'ch-4', checkIn: '2024-08-01', checkOut: '2024-08-03', guests: 2, status: 'confirmed', totalPrice: 16000, createdAt: '2024-07-01' },
  { id: 'book-6', code: 'NC-2024-006', customerId: 'cust-2', packageId: 'pkg-1', channelId: 'ch-2', checkIn: '2024-07-25', checkOut: '2024-07-27', guests: 2, status: 'completed', totalPrice: 25000, createdAt: '2024-06-15' },
  { id: 'book-7', code: 'NC-2024-007', customerId: 'cust-3', propertyId: 'prop-3', channelId: 'ch-1', checkIn: '2024-08-05', checkOut: '2024-08-07', guests: 3, status: 'confirmed', totalPrice: 21000, createdAt: '2024-07-05' },
  { id: 'book-8', code: 'NC-2024-008', customerId: 'cust-4', propertyId: 'prop-1', channelId: 'ch-3', checkIn: '2024-08-10', checkOut: '2024-08-12', guests: 2, status: 'cancelled', totalPrice: 12000, createdAt: '2024-07-08' },
];

export const payments: Payment[] = [
  { id: 'pay-1', bookingId: 'book-1', amount: 25000, status: 'paid', method: 'Card', paidAt: '2024-06-20' },
  { id: 'pay-2', bookingId: 'book-2', amount: 14000, status: 'paid', method: 'Bank Transfer', paidAt: '2024-06-23' },
  { id: 'pay-3', bookingId: 'book-3', amount: 8500, status: 'pending', method: 'Card' },
  { id: 'pay-4', bookingId: 'book-4', amount: 18000, status: 'paid', method: 'Cash', paidAt: '2024-06-28' },
];

export const checkinEvents: CheckinEvent[] = [
  { id: 'chk-1', bookingId: 'book-1', type: 'checkin', timestamp: '2024-07-15T14:30:00', location: 'Song-Kul Lakeside Yurts' },
  { id: 'chk-2', bookingId: 'book-1', type: 'checkout', timestamp: '2024-07-17T10:00:00', location: 'Song-Kul Lakeside Yurts' },
  { id: 'chk-3', bookingId: 'book-6', type: 'checkin', timestamp: '2024-07-25T15:00:00', location: 'Song-Kul Lakeside Yurts' },
  { id: 'chk-4', bookingId: 'book-6', type: 'checkout', timestamp: '2024-07-27T11:00:00', location: 'Song-Kul Lakeside Yurts' },
];

export const reviews: Review[] = [
  { id: 'rev-1', bookingId: 'book-6', customerId: 'cust-2', propertyId: 'prop-1', rating: 5, comment: 'Absolutely magical experience! The yurt was cozy and the lake views were breathtaking. The horse riding was a highlight.', createdAt: '2024-07-28' },
  { id: 'rev-2', bookingId: 'book-1', customerId: 'cust-1', propertyId: 'prop-1', rating: 4, comment: 'Great location and friendly hosts. The food was delicious. Only minor issue was the shared bathroom facilities.', createdAt: '2024-07-18' },
  { id: 'rev-3', bookingId: 'book-2', customerId: 'cust-2', propertyId: 'prop-3', rating: 5, comment: 'Perfect base for exploring Ala-Archa. Clean rooms and excellent restaurant. Will definitely return!', createdAt: '2024-07-21' },
  { id: 'rev-4', bookingId: 'book-5', customerId: 'cust-1', propertyId: 'prop-6', rating: 4, comment: 'Beautiful eco-lodge in a stunning setting. The forest walks were peaceful and the guides were knowledgeable.', createdAt: '2024-08-04' },
];

// Helper functions
export function getPartnerById(id: string) {
  return partners.find(p => p.id === id);
}

export function getPropertyById(id: string) {
  return properties.find(p => p.id === id);
}

export function getDestinationById(id: string) {
  return destinations.find(d => d.id === id);
}

export function getChannelById(id: string) {
  return channels.find(c => c.id === id);
}

export function getCustomerById(id: string) {
  return customers.find(c => c.id === id);
}

export function getPackageById(id: string) {
  return tourPackages.find(p => p.id === id);
}

export function getPropertiesByDestination(destId: string) {
  return properties.filter(p => p.destinationId === destId);
}

export function getExperiencesByDestination(destId: string) {
  return experiences.filter(e => e.destinationId === destId);
}

export function getUnitTypesByProperty(propertyId: string) {
  return unitTypes.filter(u => u.propertyId === propertyId);
}

export function getServicesByProperty(propertyId: string) {
  return services.filter(s => s.propertyId === propertyId);
}

export function formatPrice(amount: number) {
  return `${amount.toLocaleString()} KGS`;
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Current demo user state
export const currentPartner = partners[0];
export const currentCustomer = customers[0];

// Admin dashboard data
export const mockDestinations = destinations.map(d => ({
  ...d,
  category: d.region === 'Naryn' ? 'Lake' : d.region === 'Chuy' ? 'Mountains' : 'Nature',
  properties: properties.filter(p => p.destinationId === d.id).length,
  experiences: experiences.filter(e => e.destinationId === d.id).length,
}));

export const mockRegionalStats = [
  { region: 'Naryn', destinations: 5, visitors: 45000, growth: 22 },
  { region: 'Chuy', destinations: 8, visitors: 120000, growth: 15 },
  { region: 'Issyk-Kul', destinations: 12, visitors: 180000, growth: 28 },
  { region: 'Jalal-Abad', destinations: 4, visitors: 25000, growth: 18 },
  { region: 'Osh', destinations: 3, visitors: 35000, growth: 12 },
];

export const mockInfrastructureProjects = [
  {
    id: 'infra-1',
    name: 'Song-Kul Access Road Improvement',
    description: 'Upgrading 45km of gravel road to asphalt for year-round access',
    region: 'Naryn',
    budget: 2500000,
    progress: 65,
    status: 'in-progress' as const,
    priority: 'high' as const,
    timeline: 'Q2 2024 - Q4 2024',
  },
  {
    id: 'infra-2',
    name: 'Ala-Archa Visitor Center Expansion',
    description: 'New visitor facilities including museum, cafe, and equipment rental',
    region: 'Chuy',
    budget: 800000,
    progress: 90,
    status: 'in-progress' as const,
    priority: 'medium' as const,
    timeline: 'Q1 2024 - Q2 2024',
  },
  {
    id: 'infra-3',
    name: 'Sary-Chelek Eco-Trail Network',
    description: 'Building sustainable hiking trails with minimal environmental impact',
    region: 'Jalal-Abad',
    budget: 450000,
    progress: 100,
    status: 'completed' as const,
    priority: 'medium' as const,
    timeline: 'Q3 2023 - Q1 2024',
  },
  {
    id: 'infra-4',
    name: 'Issyk-Kul Marina Development',
    description: 'Construction of modern marina facilities for water tourism',
    region: 'Issyk-Kul',
    budget: 3200000,
    progress: 25,
    status: 'in-progress' as const,
    priority: 'high' as const,
    timeline: 'Q1 2024 - Q4 2025',
  },
  {
    id: 'infra-5',
    name: 'National Tourism Signage System',
    description: 'Multilingual signage across all major tourism destinations',
    region: 'Nationwide',
    budget: 350000,
    progress: 0,
    status: 'planned' as const,
    priority: 'low' as const,
    timeline: 'Q1 2025 - Q3 2025',
  },
];
