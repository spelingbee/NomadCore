<script setup lang="ts">
/**
 * «Очередь» — четвёртая точка присутствия офлайн-слоя. Первые три: полоса
 * связи сверху, счётчик на вкладке и пометка «Не отправлено» на конкретной
 * броне. Всплывающих уведомлений нет ни одного.
 *
 * Про иерархию. Включение отправки — действие ГЛОБАЛЬНОЕ, оно относится ко
 * всей очереди, а не к отдельной мутации, поэтому живёт внизу единственной
 * залитой кнопкой. В карточках его нет: дублирование давало N+1 залитых
 * кнопок, причём громче всех звучало самое безопасное действие.
 *
 * Про конфликт версий. Экран рассчитан на выбор владельца между своей и
 * серверной версией. Сегодня этого выбора нет и быть не может: сервер
 * отвечает на конфликт версий пятисоткой, а не 409 с телом, и второй
 * версии клиенту взять негде. Поэтому состояние conflict сюда попасть не
 * может, а отказ сервера деградирует до «повторить или отклонить».
 * TODO: полноценный выбор «Оставить моё» / «Принять серверное» — после
 * правки контракта, постановка в nuxt/API-CONFLICTS.md, дыры перечислены
 * в docs/WEB-API-GAPS.md.
 */
const { t } = useI18n()
const { items, broken, load, retry, discard } = useQueue()
const { online, pending } = useSyncState()
const { flushQueue } = useApi()
const showGaps = useRuntimeConfig().public.showApiGaps

await load()

const hasSendable = computed(() => items.value.some((i) => i.state === "pending"))

const stats = computed(() => [
  { n: String(items.value.length), label: t("queue.statInQueue"), bad: false },
  { n: String(broken.value), label: t("queue.statBroken"), bad: broken.value > 0 },
  {
    n: online.value ? "—" : "⏸",
    label: online.value ? t("sync.online") : t("sync.offline"),
    bad: false,
  },
])

/** Код сервера → человеческая строка. Неизвестный код печатаем как есть. */
function errorText(code: string | undefined): string {
  if (!code) return ""
  const known = ["OVERBOOKING", "INVALID_TRANSITION"]
  return known.includes(code) ? t(`queue.error.${code}`) : code
}

async function sendNow() {
  await flushQueue()
  await load()
}
</script>

<template>
  <header class="head">
    <h1 class="head__title">{{ t('nav.queue') }}</h1>
    <p class="head__sub">
      {{ items.length ? t('sync.inQueue', { n: items.length }) : t('sync.allSent') }}
      <template v-if="broken">· {{ t('queue.needsDecision', { n: broken }) }}</template>
    </p>
  </header>

  <main class="main">
    <div class="stats">
      <div v-for="stat in stats" :key="stat.label" class="stat">
        <span class="stat__n nc-tnum" :class="{ 'stat__n--bad': stat.bad }">{{ stat.n }}</span>
        <span class="stat__label">{{ stat.label }}</span>
      </div>
    </div>

    <p v-if="!items.length" class="empty">{{ t('queue.empty') }}</p>

    <article v-for="item in items" :key="item.id" class="item">
      <div class="item__head">
        <div class="item__text">
          <h2 class="item__title">{{ item.title }}</h2>
          <p v-if="item.subtitle" class="item__sub">{{ item.subtitle }}</p>
        </div>
        <NcPill :tone="item.state === 'pending' ? (online ? 'neutral' : 'outline') : 'error'">
          {{ item.state === 'pending'
            ? (online ? t('sync.sending') : t('sync.notSent'))
            : (item.state === 'conflict' ? t('sync.conflict') : t('sync.rejected')) }}
        </NcPill>
      </div>

      <NcBanner v-if="item.state === 'rejected'" tone="error">
        {{ errorText(item.error) }}
      </NcBanner>

      <!-- Колонка «На сервере» появится, когда API начнёт отдавать тело 409 -->
      <dl v-if="item.theirs" class="versions">
        <div class="versions__row">
          <dt class="versions__k">{{ t('queue.mine') }}</dt>
          <dd class="versions__v">{{ item.mine }}</dd>
        </div>
        <div class="versions__row">
          <dt class="versions__k">{{ t('queue.theirs') }}</dt>
          <dd class="versions__v">{{ item.theirs }}</dd>
        </div>
        <div v-if="item.changedBy" class="versions__row">
          <dt class="versions__k">{{ t('queue.changedBy') }}</dt>
          <dd class="versions__v">{{ item.changedBy }} · {{ item.changedAt }}</dd>
        </div>
      </dl>

      <div v-if="item.state !== 'pending'" class="item__actions">
        <NcButton variant="danger" size="md" @click="discard(item.id)">
          {{ t('queue.discard') }}
        </NcButton>
        <NcButton variant="secondary" size="md" @click="retry(item.id)">
          {{ t('queue.retry') }}
        </NcButton>
      </div>
      <p v-if="showGaps && item.state === 'rejected'" class="blocked">
        {{ t('queue.blockedOtherRoom') }}
      </p>
    </article>
  </main>

  <!-- Единственное залитое действие экрана, и оно глобальное -->
  <footer v-if="hasSendable" class="foot">
    <NcButton size="lg" block @click="sendNow">{{ t('queue.send') }}</NcButton>
  </footer>
</template>

<style scoped>
.head {
  flex: none;
  padding: var(--nc-space-12);
  background: var(--nc-bg-surface);
  border-bottom: var(--nc-stroke-hair) solid var(--nc-border-line);
}
.head__title {
  margin: 0;
  font-size: var(--nc-fs-500);
  line-height: var(--nc-lh-500);
  font-weight: var(--nc-fw-bold);
}
.head__sub {
  margin: var(--nc-space-2) 0 0;
  font-size: var(--nc-fs-200);
  line-height: var(--nc-lh-200);
  color: var(--nc-text-secondary);
}

.main { flex: 1; min-height: 0; overflow-y: auto; }

.stats {
  display: flex;
  background: var(--nc-bg-surface);
  border-bottom: var(--nc-stroke-hair) solid var(--nc-border-line);
}
.stat {
  flex: 1;
  padding: var(--nc-space-8) var(--nc-space-4);
  text-align: center;
  border-right: var(--nc-stroke-hair) solid var(--nc-border-hair);
}
.stat:last-child { border-right: 0; }
.stat__n {
  display: block;
  font-size: var(--nc-fs-500);
  line-height: var(--nc-lh-500);
  font-weight: var(--nc-fw-bold);
  color: var(--nc-text-primary);
}
.stat__n--bad { color: var(--nc-signal-error-fg); }
.stat__label {
  display: block;
  font-size: var(--nc-fs-100);
  line-height: var(--nc-lh-100);
  color: var(--nc-text-secondary);
}

.item {
  margin-bottom: var(--nc-space-8);
  background: var(--nc-bg-surface);
  border-bottom: var(--nc-stroke-hair) solid var(--nc-border-line);
}
.item__head {
  display: flex;
  align-items: flex-start;
  gap: var(--nc-space-8);
  padding: var(--nc-space-12);
}
.item__text { flex: 1; min-width: 0; }
.item__title {
  margin: 0;
  font-size: var(--nc-fs-300);
  line-height: var(--nc-lh-300);
  font-weight: var(--nc-fw-bold);
}
.item__sub {
  margin: var(--nc-space-2) 0 0;
  font-size: var(--nc-fs-200);
  line-height: var(--nc-lh-200);
  color: var(--nc-text-secondary);
}
.item__actions {
  display: flex;
  gap: var(--nc-space-8);
  padding: var(--nc-space-12);
}
.item__actions :deep(.nc-btn) { flex: 1; }

.versions {
  margin: 0 var(--nc-space-12) var(--nc-space-12);
  padding: var(--nc-space-12);
  background: var(--nc-bg-sunken);
  border-left: var(--nc-stroke-accent) solid var(--nc-border-line);
  font-size: var(--nc-fs-200);
  line-height: var(--nc-lh-200);
}
.versions__row { display: flex; gap: var(--nc-space-8); }
.versions__k { flex: none; width: var(--nc-space-48); font-weight: var(--nc-fw-bold); color: var(--nc-text-secondary); }
.versions__v { margin: 0; font-weight: var(--nc-fw-medium); }

.blocked {
  margin: 0;
  padding: 0 var(--nc-space-12) var(--nc-space-12);
  font-size: var(--nc-fs-100);
  line-height: var(--nc-lh-100);
  color: var(--nc-text-secondary);
}

.empty {
  margin: 0;
  padding: var(--nc-space-24) var(--nc-space-16);
  text-align: center;
  font-size: var(--nc-fs-300);
  line-height: var(--nc-lh-300);
  color: var(--nc-text-secondary);
}

.foot {
  flex: none;
  padding: var(--nc-space-12);
  background: var(--nc-bg-surface);
  border-top: var(--nc-stroke-hair) solid var(--nc-border-line);
}
</style>
