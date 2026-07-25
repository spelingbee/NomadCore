<script setup lang="ts">
const { t, locale, setLocale } = useI18n()
const { request } = useApi()
const { logout } = useSession()

type Property = { name: string; region?: string; slug?: string | null }
type Billing = { plan: "FREE" | "PRO"; isPro: boolean; validUntil?: string | null }

const property = ref<Property>({ name: "", region: "" })
const billing = ref<Billing | null>(null)
const saved = ref(false)
const saveError = ref("")

property.value = await request<Property>("/properties/me")
try {
	billing.value = await request<Billing>("/billing/me")
} catch {
	billing.value = null
}

async function save() {
	saveError.value = ""
	try {
		const updated = await request<Property>("/properties/me", {
			method: "PATCH",
			body: {
				name: property.value.name,
				region: property.value.region,
				slug: property.value.slug ?? "",
			},
		})
		property.value = updated
		saved.value = true
		setTimeout(() => (saved.value = false), 2000)
	} catch (e) {
		const data = (e as { data?: { code?: string; message?: string } })?.data
		saveError.value =
			data?.code === "SLUG_TAKEN"
				? t("settings.slugTaken")
				: data?.message === "INVALID_SLUG"
					? t("settings.slugInvalid")
					: t("settings.saveError")
	}
}
</script>

<template>
	<main class="page">
		<h1>{{ t("settings.title") }}</h1>

		<!-- Номера и цены живут в «Ещё» (§3.6) -->
		<NuxtLink to="/rooms" class="card link-row">
			<span class="link-title">{{ t("settings.roomsLink") }}</span>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
		</NuxtLink>

		<section class="card">
			<h2>{{ t("settings.language") }}</h2>
			<div class="seg">
				<button :class="{ primary: locale === 'ru' }" @click="setLocale('ru')">Русский</button>
				<button :class="{ primary: locale === 'ky' }" @click="setLocale('ky')">Кыргызча</button>
				<button :class="{ primary: locale === 'en' }" @click="setLocale('en')">English</button>
			</div>
		</section>

		<section class="card">
			<h2>{{ t("settings.property") }}</h2>
			<form @submit.prevent="save">
				<label class="field">
					<span>{{ t("settings.propertyName") }}</span>
					<input v-model="property.name" required />
				</label>
				<label class="field">
					<span>{{ t("settings.region") }}</span>
					<input v-model="property.region" />
				</label>
				<label class="field">
					<span>{{ t("settings.slug") }}</span>
					<input
						v-model="property.slug"
						placeholder="my-guest-house"
						autocapitalize="off"
						autocomplete="off"
						spellcheck="false"
					/>
					<small class="hint">{{ t("settings.slugHint") }}</small>
				</label>
				<button class="primary" type="submit">{{ t("settings.save") }}</button>
				<p v-if="saved" class="saved">✓ {{ t("settings.saved") }}</p>
				<p v-if="saveError" class="error">{{ saveError }}</p>
			</form>
		</section>

		<section v-if="billing" class="card">
			<h2>{{ t("settings.subscription") }}</h2>
			<div class="plan">
				<span class="badge" :class="billing.isPro ? 'st-CONFIRMED' : 'st-CHECKED_OUT'">
					{{ billing.isPro ? "PRO" : "FREE" }}
				</span>
				<p class="muted">{{ billing.isPro ? t("settings.planPro") : t("settings.planFree") }}</p>
			</div>
		</section>

		<!-- Опасное действие — текстовое, внизу, приглушённое (§3.1) -->
		<button class="danger logout" @click="logout()">{{ t("settings.logout") }}</button>
	</main>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 16px; }
.link-row {
	display: flex; align-items: center; justify-content: space-between; gap: 8px;
	text-decoration: none; color: var(--color-text);
	min-height: 56px;
}
.link-row svg { width: 20px; height: 20px; color: var(--color-text-secondary); flex-shrink: 0; }
.link-title { font-size: 16px; font-weight: 600; }
.seg { display: flex; gap: 8px; }
.seg button { flex: 1; width: auto; min-height: 48px; }
.seg button.primary { width: auto; min-height: 48px; }
form { display: flex; flex-direction: column; gap: 12px; }
.saved { color: var(--color-success); font-size: 14px; margin: 0; text-align: center; }
.error { color: var(--color-danger); font-size: 14px; margin: 0; text-align: center; }
.hint { color: var(--color-text-secondary); font-size: 13px; }
.plan { display: flex; align-items: center; gap: 10px; }
.plan p { margin: 0; }
.logout { margin-top: 8px; align-self: center; opacity: 0.85; }
</style>
