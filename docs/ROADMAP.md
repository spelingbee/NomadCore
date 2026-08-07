# NomadCore — Что сделано и что осталось

> Дата актуализации: 30.07.2026 · Версия кода: 0.1.0
> Связанные документы: [DESIGN.md](./DESIGN.md) (архитектура и ADR) · [UI-DESIGN.md](./UI-DESIGN.md) · [API.md](./API.md) · [DEPLOYMENT.md](./DEPLOYMENT.md)

Этот файл — единая точка правды по состоянию работ. `DESIGN.md` отвечает на вопрос
«как устроено и почему», этот файл — «что уже стоит на диске, а что нет».

---

## 1. Готово

### Фаза 0.1 — «Тетрадка» (PMS-lite), Sprint 0–3

| Блок | Состояние |
|---|---|
| Монорепо pnpm (`apps/api`, `apps/web`), Docker Compose (PostgreSQL 16 + Redis 7) | ✅ |
| Prisma-схема + 2 миграции в репозитории (`init_sprint4`, `property_slug`) | ✅ |
| Seed демо-объекта «Ак-Кеме» | ✅ |
| Auth: OTP по телефону (stub) + JWT | ✅ |
| CRUD: объект, типы номеров, номера, гости | ✅ |
| Брони: создание, список по диапазону, смена статуса | ✅ |
| Анти-овербукинг: Serializable + `SELECT … FOR UPDATE` + ретраи (ADR-1) | ✅ код |
| Доменное ядро без Nest/Prisma (`bookings/domain.ts`) + юнит-тесты | ✅ |
| Сетка доступности «номер × дни» для календаря | ✅ |
| Nuxt 3 PWA: Сегодня / Календарь / Номера / Гости / Настройки | ✅ |
| Offline-first: Dexie-кэш GET + очередь мутаций | ✅ |
| i18n (`ru`, `ky`, плюс незадокументированный `en`) | ✅ |
| CI: lint → typecheck → migrate deploy → unit-тесты | ✅ |

### Фаза 0.2 — Бот и подписка, Sprint 4

| Блок | Состояние |
|---|---|
| Telegram webhook + секрет, `TELEGRAM_MODE=stub` | ✅ |
| Диалоговая машина бота как чистая функция + юнит-тесты | ✅ |
| Transactional outbox (`outbox_events`) + BullMQ-релей с `jobId = event.id` | ✅ |
| Воркер уведомлений поверх outbox | ✅ |
| Биллинг: `GET /billing/me`, ручная активация Pro (`POST /billing/activate`) | ✅ |
| Публичная витрина `public/:slug` (карточка, доступность, HOLD-бронь) | ✅ код, ❌ документация до 30.07.2026 |

---

## 2. Не проверено на живой среде (первоочередное)

Код писался без доступа к npm registry, поэтому ни одна команда сборки/тестов
не выполнялась против реальных PostgreSQL и Redis. До пилота это блокирующий пункт.

- [ ] `pnpm install` → `prisma:deploy` → `pnpm test` — первый реальный прогон.
- [ ] `pnpm --filter @nomadcore/api test:races` на живой БД — проверка инварианта ADR-1
      (N конкурентных броней одного номера → проходит ровно одна).
- [ ] Прогон outbox-релея и воркера уведомлений с живым Redis.
- [ ] Сквозной путь бота на реальном токене (`TELEGRAM_MODE=live` + webhook по HTTPS).
- [ ] Замер веса JS и времени первой отрисовки PWA на дешёвом Android.

### Пробелы CI

- [ ] В `.github/workflows/ci.yml` нет сервиса Redis — outbox и уведомления не покрыты.
- [ ] `pnpm test` запускает только два юнит-файла (`domain.test.ts`, `bot-flow.test.ts`);
      `test:races` в CI **не вызывается**, хотя PostgreSQL в workflow уже поднят.
- [ ] Нет прогона сборки `apps/web` (`nuxt build`) в CI.

PLACEHOLDER_ROADMAP
