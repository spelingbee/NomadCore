/**
 * Глобальный гвард авторизации.
 * Неавторизованных отправляем на /login до рендера страницы,
 * чтобы setup-код страниц не дергал API без токена.
 */
export default defineNuxtRouteMiddleware((to) => {
	// В демо-режиме бэкенда рядом нет, токен взять неоткуда, и гвард
	// заворачивал бы все четыре экрана на /login. Проверка живёт здесь,
	// а не в каждой странице: гвард глобальный, обходить его точечно хуже.
	if (useRuntimeConfig().public.demo) return

	const { isAuthed } = useSession()
	if (!isAuthed.value && to.path !== "/login") {
		return navigateTo("/login")
	}
	if (isAuthed.value && to.path === "/login") {
		return navigateTo("/")
	}
})
