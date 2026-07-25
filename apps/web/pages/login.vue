<script setup lang="ts">
definePageMeta({ layout: false })

const { t } = useI18n()
const { request } = useApi()
const { setToken } = useSession()

const phone = ref("")
const name = ref("")
const code = ref("")
const devCode = ref("")
const step = ref<"phone" | "code">("phone")
const error = ref(false)

async function sendCode() {
	error.value = false
	try {
		const res = await request<{ devCode?: string }>("/auth/otp", {
			method: "POST",
			body: { phone: phone.value, name: name.value },
		})
		devCode.value = res.devCode ?? ""
		step.value = "code"
	} catch {
		error.value = true
	}
}

async function verify() {
	error.value = false
	try {
		const res = await request<{ accessToken: string }>("/auth/verify", {
			method: "POST",
			body: { phone: phone.value, code: code.value, name: name.value || undefined },
		})
		setToken(res.accessToken)
		await navigateTo("/")
	} catch {
		error.value = true
	}
}
</script>

<template>
	<main class="login">
		<div class="brand">
			<div class="logo-mark" aria-hidden="true">N</div>
			<h1>NomadCore</h1>
			<p class="muted">{{ t("login.subtitle") }}</p>
		</div>

		<div class="card">
			<form v-if="step === 'phone'" @submit.prevent="sendCode">
				<label>{{ t("login.phone") }}
					<input v-model="phone" type="tel" placeholder="+996700000001" required />
				</label>
				<label>{{ t("login.name") }}
					<input v-model="name" type="text" />
				</label>
				<button class="primary" type="submit">{{ t("login.sendCode") }}</button>
			</form>

			<form v-else @submit.prevent="verify">
				<p v-if="devCode" class="hint">{{ t("login.devCodeHint", { code: devCode }) }}</p>
				<label>{{ t("login.code") }}
					<input v-model="code" inputmode="numeric" autocomplete="one-time-code" required />
				</label>
				<button class="primary" type="submit">{{ t("login.verify") }}</button>
				<button class="linklike" type="button" @click="step = 'phone'; code = ''">← {{ t("login.changePhone") }}</button>
			</form>

			<p v-if="error" class="error">{{ t("login.error") }}</p>
		</div>
	</main>
</template>

<style scoped>
.login {
	max-width: 380px; margin: 0 auto; padding: 16px;
	min-height: 100vh;
	display: flex; flex-direction: column; justify-content: center; gap: 20px;
}
.brand { text-align: center; display: flex; flex-direction: column; gap: 6px; align-items: center; }
.logo-mark {
	width: 56px; height: 56px; border-radius: 16px;
	background: var(--brand); color: #fff;
	display: flex; align-items: center; justify-content: center;
	font-size: 28px; font-weight: 700;
}
.brand .muted { margin: 0; }
.card { padding: 16px; }
form { display: flex; flex-direction: column; gap: 12px; }
label { display: flex; flex-direction: column; gap: 4px; font-size: 14px; }
.hint { background: var(--checkedin-bg); padding: 8px 10px; border-radius: var(--radius-sm); font-size: 13px; margin: 0; }
.error { color: var(--danger); font-size: 14px; margin: 8px 0 0; }
.linklike {
	border: none; background: none;
	color: var(--muted); font-size: 14px;
	min-height: var(--tap);
}
</style>
