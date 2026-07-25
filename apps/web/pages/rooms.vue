<script setup lang="ts">
type RoomType = { id: string; name: string; capacity: number; basePrice: string }
type Room = { id: string; label: string; roomTypeId: string }

const { t } = useI18n()
const { request } = useApi()

function goBack() {
	if (window.history.length > 1) window.history.back()
	else navigateTo("/settings")
}

const roomTypes = ref<RoomType[]>([])
const rooms = ref<Room[]>([])

async function load() {
	roomTypes.value = await request<RoomType[]>("/room-types")
	rooms.value = await request<Room[]>("/rooms")
}
await load()

const newType = ref({ name: "", capacity: 2, basePrice: 1500 })
async function addType() {
	await request("/room-types", { method: "POST", body: { ...newType.value } })
	newType.value = { name: "", capacity: 2, basePrice: 1500 }
	await load()
}

const newRoom = ref({ label: "", roomTypeId: "" })
async function addRoom() {
	await request("/rooms", { method: "POST", body: { ...newRoom.value } })
	newRoom.value = { label: "", roomTypeId: "" }
	await load()
}

function typeName(id: string) {
	return roomTypes.value.find((rt) => rt.id === id)?.name ?? ""
}
</script>

<template>
	<main class="page">
		<header class="page-head">
			<button class="back" type="button" :aria-label="t('common.back')" @click="goBack()">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
			</button>
			<h1>{{ t("rooms.title") }}</h1>
		</header>

		<section class="card">
			<h2>{{ t("rooms.types") }}</h2>
			<p v-if="!roomTypes.length" class="muted">{{ t("rooms.emptyTypes") }}</p>
			<ul v-else class="list">
				<li v-for="rt in roomTypes" :key="rt.id">
					<strong>{{ rt.name }}</strong>
					<span class="muted">{{ t("rooms.capacity") }}: {{ rt.capacity }} · <span class="num">{{ rt.basePrice }}</span> сом</span>
				</li>
			</ul>
			<!-- Все label — над полем, placeholder не заменяет подпись (§3.2) -->
			<form class="add-form" @submit.prevent="addType">
				<label class="field">
					<span>{{ t("rooms.typeName") }}</span>
					<input v-model="newType.name" :placeholder="t('rooms.typeNamePh')" required />
				</label>
				<div class="row">
					<label class="field">
						<span>{{ t("rooms.capacity") }}</span>
						<input v-model.number="newType.capacity" type="number" inputmode="numeric" min="1" required />
					</label>
					<label class="field">
						<span>{{ t("rooms.basePrice") }}</span>
						<input v-model.number="newType.basePrice" type="number" inputmode="numeric" min="0" required />
					</label>
				</div>
				<button class="primary" type="submit">{{ t("rooms.addType") }}</button>
			</form>
		</section>

		<section class="card">
			<h2>{{ t("rooms.list") }}</h2>
			<p v-if="!roomTypes.length" class="muted">{{ t("rooms.emptyTypes") }}</p>
			<template v-else>
				<p v-if="!rooms.length" class="muted">{{ t("rooms.emptyRooms") }}</p>
				<ul v-else class="list">
					<li v-for="r in rooms" :key="r.id">
						<strong>{{ r.label }}</strong>
						<span class="muted">{{ typeName(r.roomTypeId) }}</span>
					</li>
				</ul>
				<form class="add-form" @submit.prevent="addRoom">
					<label class="field">
						<span>{{ t("rooms.label") }}</span>
						<input v-model="newRoom.label" :placeholder="t('rooms.labelPh')" required />
					</label>
					<label class="field">
						<span>{{ t("rooms.selectType") }}</span>
						<select v-model="newRoom.roomTypeId" required>
							<option value="" disabled>—</option>
							<option v-for="rt in roomTypes" :key="rt.id" :value="rt.id">{{ rt.name }}</option>
						</select>
					</label>
					<button class="primary" type="submit">{{ t("rooms.addRoom") }}</button>
				</form>
			</template>
		</section>
	</main>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 16px; }
.page-head { display: flex; align-items: center; gap: 4px; }
.page-head h1 { margin: 0; }
.back {
	width: 48px; min-height: 48px; padding: 0; flex-shrink: 0;
	display: flex; align-items: center; justify-content: center;
	border: none; background: none; color: var(--color-text);
}
.back svg { width: 24px; height: 24px; }
.list { list-style: none; margin: 0 0 4px; padding: 0; }
.list li {
	display: flex; align-items: center; justify-content: space-between; gap: 8px;
	min-height: 48px; padding: 8px 0;
	border-bottom: 1px solid var(--color-border);
}
.list li:last-child { border-bottom: none; }
.add-form {
	display: flex; flex-direction: column; gap: 12px;
	border-top: 1px solid var(--color-border);
	padding-top: 16px; margin-top: 8px;
}
.row { display: flex; gap: 8px; }
.row .field { flex: 1; }
</style>
