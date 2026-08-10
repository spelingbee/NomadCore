import type { Lang } from '~/types'

/**
 * Свой словарь вместо i18n-библиотеки: 120 строк и один реактивный ref
 * дешевле 20 КБ рантайма. Кыргызский длиннее русского на 15–30 %,
 * поэтому в вёрстке нет фиксированных ширин.
 */
const dict = {
  ru: {
    today: 'Сегодня', occupancy: 'Занятость', queue: 'Очередь',
    checkouts: 'Выезды сегодня', checkins: 'Заезды сегодня', inHouse: 'В доме', awaiting: 'Ждут подтверждения',
    // Короткие формы для счётчика на «Сегодня»: он стоит в трёх колонках по 120px,
    // и кыргызский вариант должен уместиться туда же.
    arrivals: 'Заезды', departures: 'Выезды', waiting: 'Ждут',
    priority: 'Сначала', all: 'Все', nothing: 'На сегодня всё сделано',
    day: 'День', nights: 'Ночи', grid: 'Сетка',
    confirm: 'Подтвердить', checkin: 'Заселить', checkout: 'Выселить', cancelBooking: 'Отменить бронь',
    newBooking: 'Новая бронь', free: 'Свободно', notSent: 'Не отправлено', offline: 'Нет сети',
    online: 'Сеть есть', allSynced: 'Всё отправлено', sending: 'Отправка…', inQueue: 'в очереди',
    documents: 'Документы', noDocuments: 'Не предъявлены', hasDocuments: 'Паспорт предъявлен',
    extend: 'Продлить на 1 ночь', earlyCheckout: 'Ранний выезд сегодня',
    versionConflict: 'Конфликт версии', keepMine: 'Оставить моё', takeServer: 'Принять серверное',
    serverRejected: 'Отказ сервера', otherRoom: 'Другой номер', dropBooking: 'Отклонить бронь',
    noFreeRooms: 'Свободных номеров нет', day: 'День', grid: 'Сетка', list: 'Список',
    fromTelegram: 'Из Telegram', night: 'ноч.',
    status: { HOLD: 'Ожидает', CONFIRMED: 'Подтверждена', CHECKED_IN: 'В доме', CHECKED_OUT: 'Выехал', CANCELLED: 'Отменена' }
  },
  kg: {
    today: 'Бүгүн', occupancy: 'Бош эместик', queue: 'Кезек',
    checkouts: 'Бүгүнкү чыгуулар', checkins: 'Бүгүнкү кирүүлөр', inHouse: 'Үйдө жашагандар', awaiting: 'Ырастоону күтүүдө',
    arrivals: 'Кирүү', departures: 'Чыгуу', waiting: 'Күтүүдө',
    priority: 'Алгач', all: 'Баары', nothing: 'Бүгүнкү иштер бүттү',
    day: 'Күн', nights: 'Түндөр', grid: 'Тор',
    confirm: 'Ырастоо', checkin: 'Жайгаштыруу', checkout: 'Чыгаруу', cancelBooking: 'Брондоону жокко чыгаруу',
    newBooking: 'Жаңы брондоо', free: 'Бош', notSent: 'Жөнөтүлгөн жок', offline: 'Байланыш жок',
    online: 'Байланыш бар', allSynced: 'Баары жөнөтүлдү', sending: 'Жөнөтүлүүдө…', inQueue: 'кезекте',
    documents: 'Документтер', noDocuments: 'Көрсөтүлгөн жок', hasDocuments: 'Паспорт көрсөтүлдү',
    extend: 'Бир түнгө узартуу', earlyCheckout: 'Бүгүн эрте чыгуу',
    versionConflict: 'Версия карама-каршылыгы', keepMine: 'Меникин калтыруу', takeServer: 'Сервердикин алуу',
    serverRejected: 'Сервер четке какты', otherRoom: 'Башка бөлмө', dropBooking: 'Брондоону четке кагуу',
    noFreeRooms: 'Бош бөлмө жок', day: 'Күн', grid: 'Тор', list: 'Тизме',
    fromTelegram: 'Telegram аркылуу', night: 'түн',
    status: { HOLD: 'Күтүүдө', CONFIRMED: 'Ырасталган', CHECKED_IN: 'Үйдө', CHECKED_OUT: 'Чыккан', CANCELLED: 'Жокко чыгарылган' }
  }
}

const lang = ref<Lang>((import.meta.client && (localStorage.getItem('nc.lang') as Lang)) || 'ru')

watch(lang, v => { if (import.meta.client) localStorage.setItem('nc.lang', v) })

export const useI18n = () => ({
  lang,
  t: computed(() => dict[lang.value]),
  toggle: () => { lang.value = lang.value === 'ru' ? 'kg' : 'ru' }
})
