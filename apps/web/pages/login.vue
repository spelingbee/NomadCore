<script setup lang="ts">
/**
 * Вход по коду из SMS. Поведение не менялось: те же два шага и те же два
 * запроса, POST /auth/otp затем POST /auth/verify. Переверстано на токены —
 * раньше экран держался на переменных из app.vue, которого больше нет.
 *
 * Оболочки здесь нет намеренно: полоса связи и нижняя навигация показывают
 * состояние объекта, а объекта до входа ещё нет.
 *
 * Залитая кнопка одна — отправка формы. «Изменить номер» её не получает:
 * это навигация, последствий ноль.
 */
definePageMeta({ layout: false })

const { t } = useI18n()
const { request } = useApi()
const { setToken } = useSession()
const { init } = useTheme()

onMounted(init)

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
			body: {
				phone: phone.value,
				code: code.value,
				name: name.value || undefined,
			},
		})
		setToken(res.accessToken)
		await navigateTo("/")
	} catch {
		error.value = true
	}
}

function backToPhone() {
	step.value = "phone"
	code.value = ""
}
</script>

<template>
	<main class="login">
		<div class="brand">
			<h1 class="brand__name">NomadCore</h1>
			<p class="brand__sub">{{ t("login.subtitle") }}</p>
		</div>

		<form v-if="step === 'phone'" class="form" @submit.prevent="sendCode">
			<NcField
				v-model="phone"
				:label="t('login.phone')"
				type="tel"
				inputmode="tel"
				autocomplete="tel"
				hint="+996 700 000 001"
				required
			/>
			<NcField
				v-model="name"
				:label="t('login.name')"
				autocomplete="name"
			/>
			<NcButton size="lg" block type="submit">
				{{ t("login.sendCode") }}
			</NcButton>
		</form>

		<form v-else class="form" @submit.prevent="verify">
			<NcBanner v-if="devCode" tone="neutral">
				{{ t("login.devCodeHint", { code: devCode }) }}
			</NcBanner>
			<NcField
				v-model="code"
				:label="t('login.code')"
				inputmode="numeric"
				autocomplete="one-time-code"
				required
			/>
			<NcButton size="lg" block type="submit">
				{{ t("login.verify") }}
			</NcButton>
			<NcButton variant="quiet" size="sm" block @click="backToPhone">
				{{ t("login.changePhone") }}
			</NcButton>
		</form>

		<NcBanner v-if="error" tone="error">{{ t("login.error") }}</NcBanner>
	</main>
</template>

<style scoped>
.login {
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: var(--nc-space-24);
	min-height: 100dvh;
	padding: var(--nc-space-16);
	background: var(--nc-bg-canvas);
}
.brand { text-align: center; }
.brand__name {
	margin: 0;
	font-size: var(--nc-fs-600);
	line-height: var(--nc-lh-600);
	font-weight: var(--nc-fw-bold);
}
.brand__sub {
	margin: var(--nc-space-4) 0 0;
	font-size: var(--nc-fs-200);
	line-height: var(--nc-lh-200);
	color: var(--nc-text-secondary);
}
.form {
	display: flex;
	flex-direction: column;
	gap: var(--nc-space-16);
}
</style>
