/** Сессия владельца + счётчик несинхронизированных офлайн-изменений. */
export function useSession() {
	const token = useCookie<string | null>("nomadcore_token", {
		maxAge: 60 * 60 * 24 * 30,
	})
	const syncPending = useState<number>("syncPending", () => 0)

	const isAuthed = computed(() => Boolean(token.value))

	function setToken(value: string | null) {
		token.value = value
	}

	function logout() {
		token.value = null
		navigateTo("/login")
	}

	return { token, isAuthed, setToken, logout, syncPending }
}
