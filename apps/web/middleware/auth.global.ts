/**
 * Глобальный гвард авторизации.
 * Неавторизованных отправляем на /login до рендера страницы,
 * чтобы setup-код страниц не дергал API без токена.
 */
export default defineNuxtRouteMiddleware((to) => {
	const { isAuthed } = useSession()
	if (!isAuthed.value && to.path !== "/login") {
		return navigateTo("/login")
	}
	if (isAuthed.value && to.path === "/login") {
		return navigateTo("/")
	}
})
