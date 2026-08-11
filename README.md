# NomadCore — PMS-lite для гостевых домов КР

Фаза 0.1 «Тетрадка» + задел Фазы 0.2 (Telegram-бот, подписка).
Цифровая замена бумажной тетрадки с анти-овербукингом, offline-first, ky/ru.

## Стек

- **API:** NestJS 10 + Prisma 5 + PostgreSQL 16 + Redis 7 / BullMQ
- **Web:** Nuxt 3 (PWA), Dexie (IndexedDB), i18n ky/ru
- **Монорепо:** pnpm workspaces (`apps/api`, `apps/web`)

## Структура

```
apps/
  api/            NestJS + Prisma
    prisma/       схема (§3 ТЗ), seed демо-объекта
    src/
      auth/       OTP (заглушка) + JWT
      properties/ room-types/ rooms/ guests/   CRUD ядра данных
      bookings/   доменное ядро + анти-овербукинг + статусная машина
      availability/ сетка номера × дни для календаря
      outbox/     transactional outbox + BullMQ-релей (Sprint 4)
      notifications/ воркер уведомлений поверх outbox (Sprint 4)
      telegram/   бот-канал бронирования: webhook + чистая диалоговая машина (Sprint 4)
      billing/    подписка FREE/PRO, гейтинг автоматизации (Sprint 4)
  web/            Nuxt PWA: Сегодня / Календарь / Номера / Гости / Настройки
```

## Быстрый старт

```bash
docker compose up -d          # PostgreSQL + Redis
pnpm install
pnpm --filter @nomadcore/api prisma:migrate   # первая миграция
pnpm --filter @nomadcore/api prisma:seed      # демо-объект «Ак-Кеме»
pnpm --filter @nomadcore/api dev              # API → http://localhost:3001/api
pnpm --filter @nomadcore/web dev              # Web → http://localhost:3000
```

Демо-логин: телефон `+996700000001` (OTP-код в режиме stub возвращается в ответе / логах).

## Тесты

```bash
# Юниты без БД: доменное ядро броней + диалоговая машина бота
pnpm --filter @nomadcore/api test

# Интеграционный тест гонок (нужен DATABASE_URL):
# 2 конкурентные брони одного номера → ровно одна проходит
pnpm --filter @nomadcore/api test:races
```

## Ключевые решения (открытые вопросы §8 ТЗ — зафиксировано)

1. **Анти-овербукинг:** интерактивная транзакция `Serializable` + `SELECT ... FOR UPDATE`
   по строке номера + ретраи при serialization failure (P2034/40001).
   Колонка `version` — оптимистичный лок для офлайн-синхронизации.
2. **Даты:** `@db.Date`, полуинтервалы `[checkIn, checkOut)` — back-to-back брони не конфликтуют.
   Таймзона объекта `Asia/Bishkek` хранится в `Property.timezone`.
3. **Офлайн:** Dexie (IndexedDB) — кэш GET + очередь мутаций, проигрываемая при появлении сети;
   разрешение конфликтов — last-write + `version`.
4. **OTP:** режим stub (код в логах/ответе); SMS-провайдер КР подключается заменой `OTP_MODE`.
5. **Outbox → бот:** события пишутся в транзакции брони; релей публикует их в BullMQ
   (jobId = id события — идемпотентность), воркер рассылает уведомления в Telegram.
6. **Красная линия монетизации:** базовый учёт и анти-овербукинг бесплатны всегда;
   Pro (подписка) гейтит только автоматизацию (Telegram-бот, уведомления).

## Telegram-бот (Sprint 4, MVP)

Сценарий: гость пишет `/start` → даты (`10.08-13.08`) → выбор типа номера → имя →
создаётся **HOLD**-бронь (тот же анти-овербукинг-путь, что и UI) → владелец получает
уведомление и подтверждает в приложении (HOLD → CONFIRMED) → гость получает подтверждение.

- Webhook: `POST /api/telegram/webhook` (защита через `TELEGRAM_WEBHOOK_SECRET`).
- Привязка чата владельца: команда `/owner +996700000001` (MVP; в проде — через OTP).
- `TELEGRAM_MODE=stub` — сообщения логируются, сеть не нужна (для разработки).
- Упрощения MVP: один объект на бота, in-memory сессии диалогов (в проде — Redis),
  мультитенантность через deep-link `/start <propertyCode>` — следующая итерация.

## Статус спринтов (по ТЗ §6)

| Спринт | Статус |
| --- | --- |
| Sprint 0 — Setup | ✅ миграции в репозитории, применяются на чистую БД (`prisma migrate deploy`) |
| Sprint 1 — Ядро данных | ✅ CRUD + экраны + seed |
| Sprint 2 — Брони + анти-овербукинг | ✅ + юниты домена, интеграционный тест гонок |
| Sprint 3 — Offline + языки | ✅ PWA-каркас, очередь мутаций, ky/ru |
| Sprint 4 — Бот + подписка (0.2) | ✅ Telegram-бот (MVP), outbox-релей + воркер, FREE/PRO-гейтинг. ⏳ WhatsApp и приём оплаты (Элсом/O!Деньги/MBank) — после выбора провайдера |

## Статус проверки

Проект запущен и проверен полностью: зависимости установлены, PostgreSQL 16 поднят
через `docker compose`, миграции применены на **чистую** базу (`prisma migrate deploy`,
2 миграции), тесты прогнаны. Последний прогон — 11.08.2026, pnpm 10.34.3.

| Проверка | Команда | Результат |
| --- | --- | --- |
| Типы | `pnpm typecheck` | ✅ api + web |
| Миграции на пустой БД | `prisma migrate deploy` | ✅ 2/2 применились |
| Юниты домена и бота | `pnpm test` | ✅ 24 теста, 6 сьютов, 0 падений |
| Гонки при бронировании | `pnpm --filter @nomadcore/api test:races` | ✅ 2 теста |

Что именно покрывает `test:races` (§2 DoD, живой PostgreSQL):

- две конкурентные брони одного номера на пересекающиеся даты → ровно одна проходит,
  вторая отклоняется; в БД остаётся ровно одна запись;
- outbox-событие `booking.created` записано атомарно с бронью (ровно одно);
- back-to-back бронь (заезд = день выезда предыдущей) проходит — полуинтервал
  `[checkIn, checkOut)` работает как задумано.

То есть инвариант анти-овербукинга (ADR-1: `Serializable` + `SELECT ... FOR UPDATE`
по строке номера + ретраи на 40001/P2034) проверен на реальной базе, а не только
в юнитах.

Тот же набор гоняется в CI на каждый push и PR — см. `.github/workflows/ci.yml`.

**Известный пробел:** `pnpm lint` не работает ни в одном из воркспейсов — ESLint 9
требует flat-конфиг (`eslint.config.js`), а его нет ни в `apps/api`, ни в `apps/web`.
Шаг намеренно исключён из CI, пока конфиги не написаны.
