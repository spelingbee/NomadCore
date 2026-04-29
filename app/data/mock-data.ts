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
  lat: number;
  lon: number;
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

// Mock Data from SQL Seeds
export const destinations: DestinationArea[] = [
  {
    id: '31000000-0000-0000-0000-000000000001',
    name: 'Ущелье Ала-Арча',
    slug: 'ala-archa',
    description: 'Национальный парк Ала-Арча — горное ущелье в 40 км от Бишкека. Популярное место для треккинга, альпинизма и пикников.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop',
    region: 'Чуйская',
    facts: [
      { label: 'Высота', value: '1500 - 4895м' },
      { label: 'Сезон', value: 'Май - Октябрь' },
      { label: 'Дистанция от Бишкека', value: '40 км' },
    ],
    stats: { bookings: 1240, revenue: 5000000, occupancy: 85 },
    lat: 42.5976,
    lon: 74.4771,
  },
  {
    id: '31000000-0000-0000-0000-000000000002',
    name: 'Озеро Иссык-Куль',
    slug: 'issyk-kul',
    description: 'Второе по величине высокогорное озеро в мире. Пляжный отдых, водные виды спорта, санатории.',
    image: 'https://images.unsplash.com/photo-1596392927852-2a18c336bd54?w=800&h=600&fit=crop',
    region: 'Иссык-Кульская',
    facts: [
      { label: 'Длина', value: '182 км' },
      { label: 'Высота', value: '1607м' },
      { label: 'Макс. глубина', value: '668 м' },
    ],
    stats: { bookings: 8500, revenue: 25000000, occupancy: 92 },
    lat: 42.6475,
    lon: 77.0811,
  },
  {
    id: '31000000-0000-0000-0000-000000000003',
    name: 'Озеро Сары-Челек',
    slug: 'sary-chelek',
    description: 'Биосферный заповедник ЮНЕСКО. Горное озеро на высоте 1873 м, окружённое ореховыми лесами.',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop',
    region: 'Джалал-Абадская',
    facts: [
      { label: 'Высота', value: '1873м' },
      { label: 'Макс. глубина', value: '234 м' },
      { label: 'Статус', value: 'ЮНЕСКО' },
    ],
    stats: { bookings: 450, revenue: 1200000, occupancy: 62 },
    lat: 41.8700,
    lon: 71.9700,
  }
];

export const partners: Partner[] = [
  {
    id: 'a1000000-0000-0000-0000-000000000001',
    name: 'Юрточный лагерь Ала-Арча',
    type: 'yurt_camp',
    verified: true,
    joinedDate: '2024-01-15',
    stats: { properties: 2, bookings: 156, revenue: 2340000 },
  },
  {
    id: 'a1000000-0000-0000-0000-000000000002',
    name: 'Гостевой дом Бирюза',
    type: 'guest_house',
    verified: true,
    joinedDate: '2024-02-01',
    stats: { properties: 2, bookings: 89, revenue: 890000 },
  },
  {
    id: 'a1000000-0000-0000-0000-000000000003',
    name: 'Kyrgyz Travel',
    type: 'tour_operator',
    verified: false,
    joinedDate: '2023-11-20',
    stats: { properties: 1, bookings: 234, revenue: 4560000 },
  }
];

export const properties: Property[] = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    partnerId: 'a1000000-0000-0000-0000-000000000001',
    destinationId: '31000000-0000-0000-0000-000000000001',
    name: 'Юрточный лагерь Ала-Арча',
    type: 'Yurt Camp',
    description: 'Традиционные юрты в горном ущелье Ала-Арча, 40 км от Бишкека.',
    image: 'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?w=800&h=600&fit=crop',
    amenities: ['Традиционные кровати', 'Общий санузел', 'Завтрак включен', 'Конные прогулки'],
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000003',
    partnerId: 'a1000000-0000-0000-0000-000000000002',
    destinationId: '31000000-0000-0000-0000-000000000004',
    name: 'Гостевой дом Бирюза',
    type: 'Guest House',
    description: 'Уютный гостевой дом в Чолпон-Ате. 8 номеров, домашняя кухня, Wi-Fi.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    amenities: ['Частные номера', 'Горячий душ', 'Ресторан', 'Wi-Fi'],
    rating: 4.5,
    reviewCount: 167,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000004',
    partnerId: 'a1000000-0000-0000-0000-000000000002',
    destinationId: '31000000-0000-0000-0000-000000000005',
    name: 'Гостевой дом Каракол',
    type: 'Guest House',
    description: 'Гостевой дом в Караколе — база для треккинга в горах Тянь-Шань.',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4df85b?w=800&h=600&fit=crop',
    amenities: ['Зона для треккеров', 'Сушилка', 'Местные гиды', 'Завтрак'],
    rating: 4.6,
    reviewCount: 92,
  },
  {
    id: 'c1000000-0000-0000-0000-000000000005',
    partnerId: 'a1000000-0000-0000-0000-000000000001',
    destinationId: '31000000-0000-0000-0000-000000000001',
    name: 'Rest Point Kegeti',
    type: 'Rest Point',
    description: 'Современная точка отдыха: кафе, чистые санузлы, инфо-центр и зарядка для электромобилей.',
    image: 'https://images.unsplash.com/photo-1493246507139-91e8bef99c02?w=800&h=600&fit=crop',
    amenities: ['Кафе', 'Чистые туалеты', 'Wi-Fi', 'EV Charging', 'Инфо-центр'],
    rating: 4.9,
    reviewCount: 45,
  }
];

export const unitTypes: UnitType[] = [
  { id: '11000000-0000-0000-0000-000000000001', propertyId: 'c1000000-0000-0000-0000-000000000001', name: 'Юрта стандарт', description: 'Традиционная юрта на 2 человека', capacity: 2, basePrice: 2500, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop' },
  { id: '11000000-0000-0000-0000-000000000002', propertyId: 'c1000000-0000-0000-0000-000000000001', name: 'Юрта VIP', description: 'Просторная юрта на 4 человека', capacity: 4, basePrice: 4500, image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop' },
  { id: '11000000-0000-0000-0000-000000000006', propertyId: 'c1000000-0000-0000-0000-000000000003', name: 'Стандартный номер', description: 'Номер с двуспальной кроватью', capacity: 2, basePrice: 2000, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop' },
];

export const tourPackages: TourPackage[] = [
  {
    id: 'pkg-1',
    name: 'Жемчужина Кыргызстана 7 дней',
    destinationId: '31000000-0000-0000-0000-000000000002',
    partnerId: 'a1000000-0000-0000-0000-000000000003',
    description: 'Маршрут: Бишкек → Ала-Арча → Иссык-Куль → Каракол → Джеты-Огуз → Бишкек. Всё включено.',
    image: 'https://images.unsplash.com/photo-1596392927852-2a18c336bd54?w=800&h=600&fit=crop',
    duration: '7 дней / 6 ночей',
    retailPrice: 45000,
    netPrice: 38000,
    items: [
      { type: 'Проживание', name: 'Юрты и гостевые дома', details: 'Лучшие локации по маршруту' },
      { type: 'Транспорт', name: 'Внедорожник 4x4', details: 'Профессиональный водитель' },
      { type: 'Питание', name: 'Полный пансион', details: 'Традиционная кухня' },
    ],
    itinerary: [
      { day: 1, title: 'Бишкек и Ала-Арча', description: 'Встреча в аэропорту, поездка в ущелье Ала-Арча.' },
      { day: 2, title: 'Иссык-Куль', description: 'Переезд на северный берег озера.' },
    ],
  }
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

export function getUnitTypesByProperty(propertyId: string) {
  return unitTypes.filter(u => u.propertyId === propertyId);
}

export function getServicesByProperty(propertyId: string) {
  // Mock services since they aren't in the schema yet
  return [
    { id: 's1', name: 'Breakfast', description: 'Traditional Kyrgyz breakfast', price: 500, category: 'Food' },
    { id: 's2', name: 'Horse Riding', description: '1 hour guided tour', price: 1200, category: 'Activity' }
  ]
}

export function formatPrice(amount: number) {
  return `${amount.toLocaleString()} KGS`;
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric', year: 'numeric' });
}

export const bookings = [
  { id: 'b-1', propertyId: 'c1000000-0000-0000-0000-000000000001', channelId: 'ch-1', guestName: 'Ivan Petrov', checkIn: '2026-05-10', checkOut: '2026-05-12', total: 5000, status: 'confirmed' },
  { id: 'b-2', propertyId: 'c1000000-0000-0000-0000-000000000001', channelId: 'ch-2', guestName: 'Alice Smith', checkIn: '2026-05-15', checkOut: '2026-05-20', total: 12500, status: 'pending' },
  { id: 'b-3', propertyId: 'c1000000-0000-0000-0000-000000000003', channelId: 'ch-1', guestName: 'John Doe', checkIn: '2026-05-05', checkOut: '2026-05-07', total: 4000, status: 'confirmed' },
];

export const channels = [
  { id: 'ch-1', name: 'Direct', color: '#10b981' },
  { id: 'ch-2', name: 'Booking.com', color: '#3b82f6' },
  { id: 'ch-3', name: 'Tunduk', color: '#f59e0b' },
];

export const currentPartner = partners[0];

