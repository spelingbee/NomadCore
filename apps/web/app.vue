<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<style>
/* Дизайн-система NomadCore — токены и базовые компоненты.
   Источник: Notion «NomadCore — Дизайн-система (UI/UX)» §2–§3. */
:root {
	/* Цвет (§2.1): «горы и войлок» — тёмно-бирюзовый + терракота */
	--color-primary: #0f6b63;
	--color-primary-pressed: #0a4e48;
	--color-primary-soft: #e0efed;
	--color-accent: #d96c3d;
	--color-accent-pressed: #b85427;
	--color-bg: #f7f6f3;
	--color-surface: #ffffff;
	--color-text: #1c2321;
	--color-text-secondary: #5a6663;
	--color-border: #dddad3;
	--color-success: #1e7f3c;
	--color-warning: #b45309;
	--color-danger: #c0392b;

	/* Семантика статусов броней (§2.1) */
	--st-hold: #b45309;
	--st-hold-bg: #fcefdc;
	--st-confirmed: #1e7f3c;
	--st-confirmed-bg: #e3f2e7;
	--st-checkedin: #0f6b63;
	--st-checkedin-bg: #e0efed;
	--st-checkedout: #5a6663;
	--st-checkedout-bg: #edece8;
	--st-cancelled: #c0392b;
	--st-cancelled-bg: #fbe7e4;

	/* Геометрия (§2.3) */
	--radius-card: 16px;
	--radius-btn: 12px;
	--radius-cell: 6px;
	--shadow-float: 0 2px 8px rgba(0, 0, 0, 0.12);
	--tap: 48px;

	/* Алиасы для существующего кода */
	--brand: var(--color-primary);
	--brand-strong: var(--color-primary-pressed);
	--brand-soft: var(--color-primary-soft);
	--accent: var(--color-accent);
	--bg: var(--color-bg);
	--surface: var(--color-surface);
	--border: var(--color-border);
	--text: var(--color-text);
	--muted: var(--color-text-secondary);
	--danger: var(--color-danger);
	--hold: var(--st-hold);
	--hold-bg: var(--st-hold-bg);
	--confirmed: var(--st-confirmed);
	--confirmed-bg: var(--st-confirmed-bg);
	--checkedin: var(--st-checkedin);
	--checkedin-bg: var(--st-checkedin-bg);
	--checkedout: var(--st-checkedout);
	--checkedout-bg: var(--st-checkedout-bg);
	--cancelled: var(--st-cancelled);
	--cancelled-bg: var(--st-cancelled-bg);
	--radius: var(--radius-card);
	--radius-sm: var(--radius-btn);
	--shadow: var(--shadow-float);
}

* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body {
	margin: 0;
	font-family: system-ui, Roboto, "Segoe UI", sans-serif;
	background: var(--color-bg);
	color: var(--color-text);
	font-size: 16px;
	line-height: 1.45;
}

/* Типографика (§2.2) */
h1 { font-size: 22px; font-weight: 700; margin: 0; }
h2 { font-size: 18px; font-weight: 600; margin: 0 0 8px; }
.display { font-size: 28px; font-weight: 700; line-height: 1.1; font-variant-numeric: tabular-nums; }
.muted { color: var(--color-text-secondary); font-size: 14px; }
.num { font-variant-numeric: tabular-nums; }

.app { display: flex; flex-direction: column; min-height: 100vh; }

/* Верхняя панель + индикатор синхронизации (§5) */
.topbar {
	position: sticky; top: 0; z-index: 20;
	display: flex; align-items: center; justify-content: space-between; gap: 8px;
	padding: 12px 16px;
	padding-top: calc(12px + env(safe-area-inset-top));
	background: var(--color-primary); color: #fff;
}
.topbar .logo { font-size: 17px; font-weight: 700; letter-spacing: 0.2px; }
.sync {
	display: inline-flex; align-items: center; gap: 6px;
	font-size: 14px; color: rgba(255, 255, 255, 0.9);
}
.sync.quiet { opacity: 0.65; }
.sync svg { width: 16px; height: 16px; flex-shrink: 0; }

/* Чипы статусов (§3.3): фон + точка-индикатор + текст */
.badge {
	display: inline-flex; align-items: center; gap: 6px;
	font-size: 14px; font-weight: 600;
	padding: 3px 12px; border-radius: 999px;
	white-space: nowrap;
}
.badge::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
.badge.st-HOLD { background: var(--st-hold-bg); color: var(--st-hold); }
.badge.st-CONFIRMED { background: var(--st-confirmed-bg); color: var(--st-confirmed); }
.badge.st-CHECKED_IN { background: var(--st-checkedin-bg); color: var(--st-checkedin); }
.badge.st-CHECKED_OUT { background: var(--st-checkedout-bg); color: var(--st-checkedout); }
.badge.st-CANCELLED { background: var(--st-cancelled-bg); color: var(--st-cancelled); }

.content {
	flex: 1; display: flex; flex-direction: column;
	padding: 16px;
	padding-bottom: calc(96px + env(safe-area-inset-bottom));
}

/* Нижняя навигация (§3.6): 4 вкладки, монохромные иконки, активная — primary */
.tabbar {
	position: fixed; bottom: 0; left: 0; right: 0; z-index: 20;
	display: grid; grid-template-columns: repeat(4, 1fr);
	gap: 4px;
	background: var(--color-surface); border-top: 1px solid var(--color-border);
	padding: 6px 8px calc(6px + env(safe-area-inset-bottom));
}
.tabbar .tab {
	display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px;
	min-height: var(--tap);
	text-decoration: none; color: var(--color-text-secondary);
	font-size: 14px; padding: 6px 2px; border-radius: var(--radius-btn);
}
.tabbar .tab svg { width: 22px; height: 22px; }
.tabbar .tab.router-link-exact-active {
	color: var(--color-primary); font-weight: 700;
	background: var(--color-primary-soft);
}

/* Кнопки (§3.1) */
button {
	font: inherit; font-size: 16px;
	min-height: var(--tap);
	padding: 10px 16px;
	border: 1.5px solid var(--color-primary);
	border-radius: var(--radius-btn);
	background: transparent;
	color: var(--color-primary);
	cursor: pointer;
	transition: transform 150ms, background 150ms;
}
button:active { transform: scale(0.98); }
button.primary {
	background: var(--color-primary); border-color: var(--color-primary); color: #fff;
	font-weight: 600;
	min-height: 56px; width: 100%;
}
button.primary:active { background: var(--color-primary-pressed); }
button.danger { border: none; background: transparent; color: var(--color-danger); }
button:disabled { opacity: 0.6; cursor: default; }

/* FAB «+ Бронь» (§3.1): терракота, только на «Сегодня» и «Календаре» */
.fab {
	position: fixed; right: 16px; bottom: calc(84px + env(safe-area-inset-bottom)); z-index: 25;
	display: inline-flex; align-items: center; gap: 8px;
	min-height: 56px; width: auto; padding: 0 20px;
	border: none; border-radius: 999px;
	background: var(--color-accent); color: #fff;
	font-size: 16px; font-weight: 700;
	box-shadow: var(--shadow-float);
}
.fab:active { background: var(--color-accent-pressed); transform: scale(0.98); }
.fab svg { width: 20px; height: 20px; }

/* Поля ввода (§3.2): label всегда НАД полем */
.field { display: flex; flex-direction: column; gap: 6px; }
.field > span { font-size: 14px; color: var(--color-text-secondary); }
input, select {
	width: 100%;
	min-height: 52px;
	padding: 12px 14px; font-size: 16px; font-family: inherit;
	border: 1px solid var(--color-border); border-radius: var(--radius-btn);
	background: var(--color-surface);
	color: var(--color-text);
}
input:focus-visible, select:focus-visible, button:focus-visible {
	outline: 2px solid var(--color-primary); outline-offset: 1px;
}

/* Карточки: фон + рамка, без тяжёлых теней (§2.3) */
.card {
	background: var(--color-surface);
	border: 1px solid var(--color-border);
	border-radius: var(--radius-card);
	padding: 16px;
}

/* Шторка снизу (§3.5) */
.overlay {
	position: fixed; inset: 0; z-index: 30;
	background: rgba(28, 35, 33, 0.45);
	display: flex; align-items: flex-end; justify-content: center;
}
.sheet {
	width: 100%; max-width: 480px;
	background: var(--color-surface);
	border-radius: var(--radius-card) var(--radius-card) 0 0;
	padding: 8px 16px calc(16px + env(safe-area-inset-bottom));
	max-height: 88vh; overflow-y: auto;
}
.sheet::before {
	content: ""; display: block;
	width: 44px; height: 4px; border-radius: 999px;
	background: var(--color-border);
	margin: 4px auto 12px;
}

/* Живые пустые состояния (§3.7) */
.empty {
	display: flex; flex-direction: column; align-items: flex-start; gap: 10px;
	padding: 16px;
	background: var(--color-surface);
	border: 1px dashed var(--color-border);
	border-radius: var(--radius-card);
	color: var(--color-text-secondary); font-size: 16px;
}
.empty p { margin: 0; }
.empty button { width: auto; }
</style>
