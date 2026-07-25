<script setup lang="ts">
type Guest = {
	id: string
	name: string
	phone?: string
	bookings?: Array<{ id: string; checkIn: string; checkOut: string; status: string }>
}

const { t } = useI18n()
const { request } = useApi()

const q = ref("")
const guests = ref<Guest[]>([])

async function load() {
	guests.value = await request<Guest[]>("/guests", {
		query: q.value ? { q: q.value } : undefined,
	})
}
await load()

let timer: ReturnType<typeof setTimeout> | undefined
watch(q, () => {
	clearTimeout(timer)
	timer = setTimeout(load, 300)
})

function initial(name: string): string {
	return (name.trim()[0] ?? "?").toUpperCase()
}
</script>

<template>
	<main class="page">
		<h1>{{ t("guests.title") }}</h1>
		<input v-model="q" type="search" :placeholder="t('guests.search')" />

		<p v-if="!guests.length" class="muted">{{ t("guests.empty") }}</p>
		<article v-for="g in guests" :key="g.id" class="card guest">
			<div class="head">
				<span class="avatar" aria-hidden="true">{{ initial(g.name) }}</span>
				<div class="who">
					<strong>{{ g.name }}</strong>
					<a v-if="g.phone" :href="`tel:${g.phone}`" class="muted phone">{{ g.phone }}</a>
				</div>
			</div>
			<details v-if="g.bookings?.length">
				<summary>{{ t("guests.lastBookings") }} ({{ g.bookings.length }})</summary>
				<ul>
					<li v-for="b in g.bookings" :key="b.id">
						{{ b.checkIn.slice(0, 10) }} → {{ b.checkOut.slice(0, 10) }}
						<span class="badge" :class="`st-${b.status}`">{{ t(`booking.status.${b.status}`) }}</span>
					</li>
				</ul>
			</details>
		</article>
	</main>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 12px; }
.guest { display: flex; flex-direction: column; gap: 8px; }
.head { display: flex; align-items: center; gap: 10px; }
.avatar {
	width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
	background: var(--brand-soft); color: var(--brand);
	display: flex; align-items: center; justify-content: center;
	font-weight: 700; font-size: 16px;
}
.who { display: flex; flex-direction: column; gap: 2px; }
.phone { text-decoration: none; }
summary { cursor: pointer; font-size: 14px; color: var(--muted); min-height: var(--tap); display: flex; align-items: center; }
ul { padding-left: 18px; margin: 4px 0 0; }
li { margin: 6px 0; font-size: 14px; }
</style>
