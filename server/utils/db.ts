import type { Partner, Property, TouristPlace, Booking, RatePlan, UnitType } from '~/types/database'

export const db = {
  touristPlaces: [
    {
      id: '10693a8a-d53e-486b-baac-786e6699edb9',
      name: 'Национальный парк Ала-Арча',
      description: 'Национальный природный парк Ала-Арча расположен в Кыргызском хребте Тянь-Шаня, всего в 40 км от Бишкека. Парк простирается на высотах от 1600 до 4860 метров над уровнем моря. Здесь находится более 50 горных вершин, несколько ледников и богатая экосистема.',
      shortDescription: 'Главный природный парк страны в 40 км от Бишкека — ледники, альпийские луга и маршруты.',
      type: 'nature',
      subtype: 'горный заповедник',
      region: 'Чуйская область',
      lat: 42.5639,
      lon: 74.4939,
      altitude: 1860,
      season: ['spring', 'summer', 'autumn'],
      bestTimeToVisit: 'Июнь–сентябрь',
      priceLevel: 2,
      suitableFor: ['families', 'couples', 'solo', 'active'],
      durationHours: 4.0,
      keywords: ['ала-арча', 'горы', 'трекинг', 'ледник', 'природа', 'бишкек'],
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop',
      metadata: { has_cafe: true, has_toilet: true, parking: true, entry_fee_som: 200 }
    },
    {
      id: '20d0d295-1503-4263-8be5-3cab30f0f7e4',
      name: 'Башня Бурана',
      description: 'Средневековый минарет XI–XII веков, единственный сохранившийся архитектурный памятник древнего города Баласагун — столицы Карахандского каганата.',
      shortDescription: 'Минарет XI века — один из самых известных памятников Великого Шёлкового пути в Кыргызстане.',
      type: 'historical',
      subtype: 'средневековый минарет',
      region: 'Чуйская область',
      lat: 42.7417,
      lon: 75.0133,
      altitude: 920,
      season: ['spring', 'summer', 'autumn'],
      bestTimeToVisit: 'Апрель–октябрь',
      priceLevel: 1,
      suitableFor: ['families', 'couples', 'solo', 'elderly'],
      keywords: ['бурана', 'башня', 'шёлковый путь', 'история', 'средневековье', 'юнеско'],
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1596392927852-2a18c336bd54?w=800&h=600&fit=crop',
      metadata: { has_toilet: true, entry_fee_som: 100, museum_on_site: true }
    },
    {
      id: '60bcc860-54b7-4a4b-bedf-57f42ca0d301',
      name: 'Озеро Иссык-Куль',
      description: 'Одно из крупнейших горных озёр мира. Название переводится как «горячее озеро»: благодаря солёности и термальной активности оно не замерзает даже в сильные морозы.',
      shortDescription: 'Второе по величине горное озеро в мире — незамерзающее, солёное, с пляжами и курортами.',
      type: 'lake',
      subtype: 'горное озеро',
      region: 'Иссык-Кульская область',
      lat: 42.45,
      lon: 77.0,
      altitude: 1607,
      season: ['spring', 'summer', 'autumn'],
      bestTimeToVisit: 'Июль–август для купания',
      priceLevel: 2,
      suitableFor: ['families', 'couples', 'solo', 'elderly'],
      keywords: ['иссык-куль', 'озеро', 'пляж', 'отдых', 'горы', 'курорт'],
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1596392927852-2a18c336bd54?w=800&h=600&fit=crop',
      metadata: { has_cafe: true, has_toilet: true, beach_available: true }
    },
    {
      id: '16f4e46d-d3de-4d41-a2d4-3ec6f9f8c49e',
      name: 'Озеро Сон-Куль',
      description: 'Высокогорное озеро на высоте 3016 метров. Окружено пастбищами (жайлоо), где кочевники пасут скот в летний период.',
      shortDescription: 'Высокогорное озеро (3016 м), окруженное эдельвейсами и юрточными лагерями кочевников.',
      type: 'lake',
      subtype: 'горное озеро',
      region: 'Нарынская область',
      lat: 41.83,
      lon: 75.12,
      altitude: 3016,
      season: ['summer'],
      bestTimeToVisit: 'Июль–август',
      priceLevel: 2,
      suitableFor: ['couples', 'solo', 'active'],
      keywords: ['сон-куль', 'озеро', 'юрты', 'кочевники', 'горы'],
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      metadata: { has_cafe: false, has_toilet: true, permit_required: false }
    }
  ] as TouristPlace[],

  partners: [
    {
      id: 'a1000000-0000-0000-0000-000000000001',
      type: 'yurt_camp',
      legalName: 'ИП Матисаков А.Б.',
      displayName: 'Юрточный лагерь Ала-Арча',
      inn: '12345678901234',
      phone: '+996700111001',
      email: 'ala-archa@example.com',
      verifiedByFund: true,
      verifiedByBank: true,
      status: 'active',
      createdAt: '2026-03-25T10:00:00Z'
    },
    {
      id: '01000000-0000-0000-0000-000000000005',
      type: 'guest_house',
      legalName: 'ООО Горный Приют',
      displayName: 'Горный Приют',
      inn: '22233344455566',
      phone: '+996700555005',
      email: 'mountain.stay@example.com',
      verifiedByFund: true,
      verifiedByBank: false,
      status: 'active',
      createdAt: '2026-03-10T10:00:00Z'
    },
    {
      id: '01000000-0000-0000-0000-000000000006',
      type: 'yurt_camp',
      legalName: 'ИП Асанов Б.Т.',
      displayName: 'Сон-Куль Юрта Кемп',
      inn: '33344455566677',
      phone: '+996700666006',
      email: 'sonkul.camp@example.com',
      verifiedByFund: true,
      verifiedByBank: true,
      status: 'active',
      createdAt: '2026-01-25T10:00:00Z'
    }
  ] as Partner[],

  properties: [
    {
      id: 'c1000000-0000-0000-0000-000000000001',
      partnerId: 'a1000000-0000-0000-0000-000000000001',
      touristPlaceId: '10693a8a-d53e-486b-baac-786e6699edb9',
      kind: 'yurt_camp',
      name: 'Юрточный лагерь Ала-Арча',
      description: 'Традиционные юрты в горном ущелье Ала-Арча, 40 км от Бишкека. Конные прогулки, треккинг.',
      addressText: 'Кыргызстан, Чуйская область, ущелье Ала-Арча',
      lat: 42.5600,
      lng: 74.4900,
      status: 'active',
      rating: 4.8,
      reviewCount: 124,
      amenities: ['Традиционные кровати', 'Общий санузел', 'Завтрак включен', 'Конные прогулки'],
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      createdAt: '2026-04-01T10:00:00Z'
    },
    {
      id: '02000000-0000-0000-0000-000000000001',
      partnerId: '01000000-0000-0000-0000-000000000005',
      touristPlaceId: '10693a8a-d53e-486b-baac-786e6699edb9',
      kind: 'guest_house',
      name: 'Гостевой дом Ала-Арча Вью',
      description: 'Уютный гостевой дом у входа в национальный парк с видом на горы',
      addressText: 'Кыргызстан, Чуйская область, Ала-Арча',
      lat: 42.5650,
      lng: 74.4950,
      status: 'active',
      rating: 4.7,
      reviewCount: 45,
      amenities: ['Частные номера', 'Горячий душ', 'Вид на горы'],
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop',
      createdAt: '2026-03-05T10:00:00Z'
    },
    {
      id: '03000000-0000-0000-0000-000000000001',
      partnerId: '01000000-0000-0000-0000-000000000006',
      touristPlaceId: '16f4e46d-d3de-4d41-a2d4-3ec6f9f8c49e',
      kind: 'yurt_camp',
      name: 'Юрта Кочевник 1 (Сон-Куль)',
      description: 'Традиционная юрта на северном берегу Сон-Куля. Полное погружение в быт кочевников.',
      addressText: 'Кыргызстан, Нарынская область, Сон-Куль, северный берег',
      lat: 41.8400,
      lng: 75.1200,
      status: 'active',
      rating: 4.9,
      reviewCount: 32,
      amenities: ['Традиционный быт', 'Печное отопление', 'Местная кухня'],
      image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop',
      createdAt: '2026-01-15T10:00:00Z'
    }
  ] as Property[],

  bookings: [
    {
      id: 'e1000000-0000-0000-0000-000000000001',
      ratePlanId: 'd1000000-0000-0000-0000-000000000001',
      bookingCode: 'TUR-20260601-A1B2C3',
      guestName: 'Данияр Усупов',
      guestEmail: 'daniyar@example.com',
      guestPhone: '+996555100001',
      checkIn: '2026-06-10',
      checkOut: '2026-06-13',
      qty: 2,
      totalAmount: 15000.00,
      currency: 'KGS',
      status: 'confirmed',
      bookedAt: '2026-04-20T10:00:00Z'
    }
  ] as Booking[],

  unitTypes: [
    {
      id: '11000000-0000-0000-0000-000000000001',
      propertyId: 'c1000000-0000-0000-0000-000000000001',
      kind: 'yurt',
      name: 'Юрта стандарт',
      description: 'Традиционная юрта на 2 человека',
      capacity: 2,
      baseCurrency: 'KGS',
      basePrice: 2500,
      totalInventory: 6,
      active: true
    }
  ] as UnitType[],

  ratePlans: [
    {
      id: 'd1000000-0000-0000-0000-000000000001',
      propertyId: 'c1000000-0000-0000-0000-000000000001',
      name: 'Юрта стандарт (2 чел.)',
      retailRate: 2500.00,
      currency: 'KGS',
      totalQty: 6,
      availableQty: 6,
      refundable: true,
      cancellationPolicy: 'Бесплатная отмена за 24 часа',
      status: 'active',
      createdAt: '2026-04-01T10:00:00Z'
    }
  ] as RatePlan[]
}
