<script setup lang="ts">
type Cell = { date: string; bookingId?: string; status?: string; guestName?: string }
type GridRow = { roomId: string; label: string; roomTypeName: string; cells: Cell[] }

const { t, locale } = useI18n()
const { request } = useApi()
const route = useRoute()

const DAYS = 14
const todayIso = new Date().toISOString().slice(0, 10)
const start = ref(todayIso)
const from = computed(() => start.value)
const to = computed(() => addDays(start.value, DAYS))

const rows = ref<GridRow[]>([])
const dates = computed(() =>
	Array.from({ length: DAYS }, (_, i) => addDays(start.value, i)),
)
const hasBookings = computed(() =>
	rows.value.some((r) => r.cells.some((c) => c.bookingId)),
)

function addDays(iso: string, n: number): string {
	return new Date(Date.parse(`${iso}T00:00:00Z`) + n * 86_400_000)
		.toISOString()
		.slice(0, 10)
}

function fmtDay(iso: string): string {
	return `${iso.slice(8, 10)}.${iso.slice(5, 7)}`
}

function weekday(iso: string): string {
	return new Date(`${iso}T00:00:00Z`).toLocaleDateString(
		locale.value === "ky" ? "ky-KG" : locale.value === "en" ? "en-US" : "ru-RU",
		{ weekday: "short", timeZone: "UTC" },
	)
}

async function load() {
	const res = await request<{ rooms: GridRow[] }>("/availability", {
		query: { from: from.value, to: to.value },
	})
	rows.value = res.rooms
}
await load()

function shift(days: number) {
	start.value = addDays(start.value, days)
	load()
}

function goToday() {
	start.value = todayIso
	load()
}

// --- шторка новой брони (§3.5, §4.3) ---
const sheet = ref(false)
const roomId = ref("")
const guestName = ref("")
const guestPhone = ref("")
const checkIn = ref(todayIso)
const checkOut = ref(addDays(todayIso, 1))
const errorMsg = ref("")
const saving = ref(false)

const nights = computed(() => {
	const n = Math.round(
		(Date.parse(checkOut.value) - Date.parse(checkIn.value)) / 86_400_000,
	)
	return Number.isFinite(n) && n > 0 ? n : 0
})

watch(checkIn, (v) => {
	if (v && checkOut.value <= v) checkOut.value = addDays(v, 1)
})

function openFromCell(row: GridRow, cell: Cell) {
	if (cell.bookingId) return
	roomId.value = row.roomId
	checkIn.value = cell.date
	checkOut.value = addDays(cell.date, 1)
	openSheet()
}

function openBlank() {
	roomId.value = rows.value[0]?.roomId ?? ""
	checkIn.value = start.value
	checkOut.value = addDays(start.value, 1)
	openSheet()
}

function openSheet() {
	guestName.value = ""
	guestPhone.value = ""
	errorMsg.value = ""
	sheet.value = true
}

async function createBooking() {
	if (saving.value || nights.value <= 0 || !roomId.value) return
	saving.value = true
	errorMsg.value = ""
	try {
		await request("/bookings", {
			method: "POST",
			body: {
				roomId: roomId.value,
				checkIn: checkIn.value,
				checkOut: checkOut.value,
				guestName: guestName.value,
				guestPhone: guestPhone.value || undefined,
			},
		})
		sheet.value = false
		await load()
	} catch (e: unknown) {
		const code = (e as { data?: { code?: string } })?.data?.code
		errorMsg.value =
			code === "OVERBOOKING" ? t("booking.overbooking") : String(e)
	} finally {
		saving.value = false
	}
}

onMounted(() => {
	if (route.query.new) openBlank()
})
</script>

<template>
	<main class="page">
		<header class="bar">
			<h1>{{ t("calendar.title") }}</h1>
			<div class="nav-btns">
				<button v-if="start !== todayIso" class="ghost" @click="goToday()">{{ t("calendar.today") }}</button>
				<button class="ghost icon" aria-label="←" @click="shift(-7)">←</button>
				<button class="ghost icon" aria-label="→" @click="shift(7)">→</button>
			</div>
		</header>

		<p v-if="!hasBookings" class="muted hint">{{ t("calendar.hint") }}</p>

		<div class="grid-wrap card">
			<table>
				<thead>
					<tr>
						<th class="room"></th>
						<th v-for="d in dates" :key="d" :class="{ today: d === todayIso }">
							<span class="dow">{{ weekday(d) }}</span>
							{{ fmtDay(d) }}
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="row in rows" :key="row.roomId">
						<th class="room">{{ row.label }}<span class="muted">{{ row.roomTypeName }}</span></th>
						<td
							v-for="cell in row.cells"
							:key="cell.date"
							:class="[cell.bookingId ? `st-${cell.status}` : 'free', { today: cell.date === todayIso }]"
							:title="cell.guestName ?? t('calendar.free')"
							@click="openFromCell(row, cell)"
						>
							{{ cell.guestName ? cell.guestName.slice(0, 6) : "" }}
						</td>
					</tr>
				</tbody>
			</table>
		</div>

		<!-- Легенда = реальная семантика статусов (§2.1) -->
		<div class="legend">
			<span><i class="sw free"></i>{{ t("calendar.legendFree") }}</span>
			<span><i class="sw hold"></i>{{ t("calendar.legendHold") }}</span>
			<span><i class="sw confirmed"></i>{{ t("calendar.legendConfirmed") }}</span>
			<span><i class="sw checkedin"></i>{{ t("calendar.legendCheckedIn") }}</span>
		</div>

		<button class="fab" @click="openBlank()">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
			{{ t("today.addBooking") }}
		</button>

		<div v-if="sheet" class="overlay" @click.self="sheet = false">
			<div class="sheet">
				<div class="sheet-head">
					<h2>{{ t("calendar.newBooking") }}</h2>
					<button type="button" class="close" :aria-label="t('booking.cancel')" @click="sheet = false">✕</button>
				</div>
				<form @submit.prevent="createBooking">
					<label class="field">
						<span>{{ t("booking.room") }}</span>
						<select v-model="roomId" required>
							<option v-for="r in rows" :key="r.roomId" :value="r.roomId">{{ r.label }} · {{ r.roomTypeName }}</option>
						</select>
					</label>
					<label class="field">
						<span>{{ t("booking.guestName") }}</span>
						<input v-model="guestName" required />
					</label>
					<label class="field">
						<span>{{ t("booking.guestPhone") }}</span>
						<input v-model="guestPhone" type="tel" inputmode="tel" placeholder="+996" />
					</label>
					<div class="row">
						<label class="field">
							<span>{{ t("booking.checkIn") }}</span>
							<input v-model="checkIn" type="date" required />
						</label>
						<label class="field">
							<span>{{ t("booking.checkOut") }}</span>
							<input v-model="checkOut" type="date" required />
						</label>
					</div>
					<p class="muted nights">{{ t("booking.nights", { n: nights }) }}</p>
					<p v-if="errorMsg" class="error">{{ errorMsg }}</p>
					<button class="primary" type="submit" :disabled="saving || nights <= 0">{{ t("booking.create") }}</button>
				</form>
			</div>
		</div>
	</main>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 12px; flex: 1; }
.bar { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.nav-btns { display: flex; gap: 8px; }
button.ghost { border-color: var(--color-border); color: var(--color-text); background: var(--color-surface); }
button.ghost.icon { width: 48px; padding: 0; font-size: 18px; }
.hint { margin: 0; }

/* Сетка занимает всю высоту, явные рамки (§4.2) */
.grid-wrap { overflow: auto; padding: 0; flex: 1; }
table { border-collapse: collapse; width: 100%; font-size: 13px; }
th, td { border: 1px solid var(--color-border); padding: 2px 4px; min-width: 46px; height: 44px; text-align: center; }
thead th {
	background: var(--color-bg); color: var(--color-text-secondary);
	font-weight: 600; font-size: 13px;
	position: sticky; top: 0; z-index: 2;
}
thead th .dow { display: block; font-weight: 400; font-size: 12px; }
thead th.today { background: var(--color-primary-soft); color: var(--color-primary); font-weight: 700; }
th.room {
	text-align: left; white-space: nowrap;
	position: sticky; left: 0; z-index: 3;
	background: var(--color-surface);
	padding: 4px 8px; font-size: 14px;
}
th.room .muted { display: block; font-weight: 400; font-size: 12px; }

/* Заливки ячеек = семантика статусов (§2.1) */
td.free { background: var(--color-surface); cursor: pointer; }
td.free.today { background: var(--color-primary-soft); }
td.st-HOLD {
	background: repeating-linear-gradient(135deg, var(--st-hold-bg) 0 6px, #f3deba 6px 12px);
	color: var(--st-hold); cursor: default;
}
td.st-CONFIRMED { background: var(--st-confirmed-bg); color: var(--st-confirmed); cursor: default; }
td.st-CHECKED_IN {
	background: var(--st-checkedin-bg); color: var(--st-checkedin);
	box-shadow: inset 0 0 0 2px var(--st-checkedin);
	cursor: default;
}
td.st-CHECKED_OUT { background: var(--st-checkedout-bg); color: var(--st-checkedout); cursor: default; }

.legend { display: flex; gap: 12px; flex-wrap: wrap; font-size: 14px; color: var(--color-text-secondary); }
.legend span { display: inline-flex; align-items: center; gap: 6px; }
.sw { width: 16px; height: 16px; border-radius: var(--radius-cell); border: 1px solid var(--color-border); display: inline-block; }
.sw.free { background: var(--color-surface); }
.sw.hold { background: repeating-linear-gradient(135deg, var(--st-hold-bg) 0 4px, #f3deba 4px 8px); }
.sw.confirmed { background: var(--st-confirmed-bg); }
.sw.checkedin { background: var(--st-checkedin-bg); border-color: var(--st-checkedin); }

.sheet-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.sheet-head h2 { margin: 0; }
.close {
	width: 48px; min-height: 48px; padding: 0; flex-shrink: 0;
	border: none; background: none;
	color: var(--color-text-secondary); font-size: 20px;
}
.sheet form { display: flex; flex-direction: column; gap: 12px; }
.row { display: flex; gap: 8px; }
.row .field { flex: 1; }
.nights { margin: -4px 0 0; }
.error { color: var(--color-danger); font-size: 14px; margin: 0; }
</style>
