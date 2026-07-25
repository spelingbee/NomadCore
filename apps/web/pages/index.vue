<script setup lang="ts">
type Booking = {
	id: string
	status: string
	source: string
	checkIn: string
	checkOut: string
	priceTotal: string
	guest: { name: string; phone?: string }
	room: { label: string; roomType?: { name: string } }
}
type AvailabilityRow = { roomId: string; cells: Array<{ bookingId?: string }> }

const { t, locale } = useI18n()
const { request } = useApi()

const today = new Date().toISOString().slice(0, 10)
const tomorrow = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10)

const todayWords = computed(() =>
	new Date().toLocaleDateString(locale.value === "ky" ? "ky-KG" : locale.value === "en" ? "en-US" : "ru-RU", {
		weekday: "long",
		day: "numeric",
		month: "long",
	}),
)

const bookings = ref<Booking[]>([])
const totalRooms = ref(0)
const freeRooms = ref<number | null>(null)

async function load() {
	const [list, availability] = await Promise.all([
		request<Booking[]>("/bookings", { query: { from: today, to: tomorrow } }),
		request<{ rooms: AvailabilityRow[] }>("/availability", {
			query: { from: today, to: tomorrow },
		}),
	])
	bookings.value = list
	totalRooms.value = availability.rooms.length
	freeRooms.value = availability.rooms.filter(
		(r) => !r.cells.some((c) => c.bookingId),
	).length
}
await load()

const requests = computed(() => bookings.value.filter((b) => b.status === "HOLD"))
const arrivals = computed(() =>
	bookings.value.filter((b) => b.checkIn.slice(0, 10) === today && b.status === "CONFIRMED"),
)
const departures = computed(() =>
	bookings.value.filter((b) => b.checkOut.slice(0, 10) === today && b.status === "CHECKED_IN"),
)

// Защита от двойного тапа (дизайн-система §3.1, §9)
const busy = ref<string | null>(null)
async function setStatus(b: Booking, status: string) {
	if (busy.value) return
	busy.value = b.id
	try {
		await request(`/bookings/${b.id}/status`, { method: "PATCH", body: { status } })
		await load()
	} finally {
		busy.value = null
	}
}

function fmtDay(iso: string): string {
	return `${iso.slice(8, 10)}.${iso.slice(5, 7)}`
}
</script>

<template>
	<main class="page">
		<header class="head">
			<h1>{{ t("today.title") }}</h1>
			<p class="muted date">{{ todayWords }}</p>
		</header>

		<!-- Крупные числа дня (display 28/700, §4.1) -->
		<div class="stats">
			<div class="stat card">
				<span class="display">{{ arrivals.length }}</span>
				<span class="muted">{{ t("today.arrivals") }}</span>
			</div>
			<div class="stat card">
				<span class="display">{{ departures.length }}</span>
				<span class="muted">{{ t("today.departures") }}</span>
			</div>
			<div class="stat card" :class="{ hot: requests.length > 0 }">
				<span class="display">{{ requests.length }}</span>
				<span class="muted">{{ t("today.requests") }}</span>
			</div>
		</div>
		<p v-if="freeRooms !== null && totalRooms > 0" class="free muted">
			{{ t("today.free", { free: freeRooms, total: totalRooms }) }}
		</p>

		<section v-if="requests.length">
			<h2>{{ t("today.requests") }}</h2>
			<article v-for="b in requests" :key="b.id" class="card booking hot-card">
				<div class="line1">
					<h2 class="name">{{ b.guest.name }}</h2>
					<span class="badge st-HOLD">{{ t("booking.status.HOLD") }}</span>
				</div>
				<p class="meta muted">
					{{ b.room.label }}<template v-if="b.room.roomType"> · {{ b.room.roomType.name }}</template>
					· {{ fmtDay(b.checkIn) }} → {{ fmtDay(b.checkOut) }} · <span class="num">{{ b.priceTotal }}</span> сом
				</p>
				<div class="actions">
					<button class="primary" :disabled="busy === b.id" @click="setStatus(b, 'CONFIRMED')">{{ t("booking.confirm") }}</button>
					<button class="danger" :disabled="busy === b.id" @click="setStatus(b, 'CANCELLED')">{{ t("booking.reject") }}</button>
					<a v-if="b.guest.phone" class="call" :href="`tel:${b.guest.phone}`" :aria-label="b.guest.phone">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
					</a>
				</div>
			</article>
		</section>

		<section>
			<h2>{{ t("today.arrivals") }}</h2>
			<div v-if="!arrivals.length" class="empty">
				<p>{{ t("today.emptyArrivals") }}. {{ t("today.emptyHint") }}</p>
				<button @click="navigateTo('/calendar')">{{ t("today.toCalendar") }}</button>
			</div>
			<article v-for="b in arrivals" :key="b.id" class="card booking">
				<div class="line1">
					<h2 class="name">{{ b.guest.name }}</h2>
					<span class="badge st-CONFIRMED">{{ t("booking.status.CONFIRMED") }}</span>
				</div>
				<p class="meta muted">
					{{ b.room.label }}<template v-if="b.room.roomType"> · {{ b.room.roomType.name }}</template>
					· → {{ fmtDay(b.checkOut) }} · <span class="num">{{ b.priceTotal }}</span> сом
				</p>
				<div class="actions">
					<button class="primary" :disabled="busy === b.id" @click="setStatus(b, 'CHECKED_IN')">{{ t("today.checkIn") }}</button>
					<a v-if="b.guest.phone" class="call" :href="`tel:${b.guest.phone}`" :aria-label="b.guest.phone">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
					</a>
				</div>
			</article>
		</section>

		<section>
			<h2>{{ t("today.departures") }}</h2>
			<p v-if="!departures.length" class="muted">{{ t("today.emptyDepartures") }}</p>
			<article v-for="b in departures" :key="b.id" class="card booking">
				<div class="line1">
					<h2 class="name">{{ b.guest.name }}</h2>
					<span class="badge st-CHECKED_IN">{{ t("booking.status.CHECKED_IN") }}</span>
				</div>
				<p class="meta muted">{{ b.room.label }}<template v-if="b.room.roomType"> · {{ b.room.roomType.name }}</template></p>
				<div class="actions">
					<button class="primary" :disabled="busy === b.id" @click="setStatus(b, 'CHECKED_OUT')">{{ t("today.checkOut") }}</button>
					<a v-if="b.guest.phone" class="call" :href="`tel:${b.guest.phone}`" :aria-label="b.guest.phone">
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
					</a>
				</div>
			</article>
		</section>

		<!-- FAB «+ Бронь» (§3.1): главное действие продукта -->
		<button class="fab" @click="navigateTo('/calendar?new=1')">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
			{{ t("today.addBooking") }}
		</button>
	</main>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 16px; flex: 1; }
.head { display: flex; flex-direction: column; gap: 2px; }
.date { text-transform: capitalize; }
.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.stat { display: flex; flex-direction: column; gap: 2px; padding: 12px; }
.stat.hot { border-color: var(--color-accent); }
.stat.hot .display { color: var(--color-accent); }
.free { margin: -8px 0 0; }
.booking { display: flex; flex-direction: column; gap: 10px; margin-bottom: 8px; }
.hot-card { border-color: var(--color-accent); }
.line1 { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.name { margin: 0; }
.meta { margin: 0; }
.actions { display: flex; gap: 8px; align-items: stretch; }
.actions button.primary { flex: 1; width: auto; min-height: 48px; }
.actions button.danger { flex: 0 0 auto; }
.call {
	flex: 0 0 auto; width: 48px;
	display: inline-flex; align-items: center; justify-content: center;
	border: 1.5px solid var(--color-primary); border-radius: var(--radius-btn);
	color: var(--color-primary);
}
.call svg { width: 20px; height: 20px; }
</style>
