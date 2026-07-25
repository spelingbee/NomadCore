<script setup lang="ts">
const { t } = useI18n()
const { isAuthed, syncPending } = useSession()

// Индикатор офлайна/синхронизации — спокойный, не красный (дизайн-система §5)
const isOffline = ref(false)
function updateOnline() {
	isOffline.value = !navigator.onLine
}
onMounted(() => {
	updateOnline()
	window.addEventListener("online", updateOnline)
	window.addEventListener("offline", updateOnline)
})
onBeforeUnmount(() => {
	window.removeEventListener("online", updateOnline)
	window.removeEventListener("offline", updateOnline)
})
</script>

<template>
	<div class="app">
		<header v-if="isAuthed" class="topbar">
			<strong class="logo">NomadCore</strong>
			<span v-if="isOffline" class="sync" :title="t('sync.offlineFull')">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" /></svg>
				{{ t("sync.offline") }}
			</span>
			<span v-else-if="syncPending > 0" class="sync">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>
				{{ t("sync.pending", { count: syncPending }) }}
			</span>
			<span v-else class="sync quiet">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
				{{ t("sync.synced") }}
			</span>
		</header>
		<main class="content">
			<slot />
		</main>
		<nav v-if="isAuthed" class="tabbar">
			<NuxtLink to="/" class="tab">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></svg>
				<span>{{ t("nav.today") }}</span>
			</NuxtLink>
			<NuxtLink to="/calendar" class="tab">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
				<span>{{ t("nav.calendar") }}</span>
			</NuxtLink>
			<NuxtLink to="/guests" class="tab">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
				<span>{{ t("nav.guests") }}</span>
			</NuxtLink>
			<NuxtLink to="/settings" class="tab">
				<svg viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg>
				<span>{{ t("nav.more") }}</span>
			</NuxtLink>
		</nav>
	</div>
</template>
