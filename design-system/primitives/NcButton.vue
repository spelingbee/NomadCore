<script setup lang="ts">
/**
 * Единственная кнопка в системе. Вариант задаёт РОЛЬ, а не цвет,
 * и роль назначается по ЦЕНЕ ОШИБКИ, а не по важности задачи:
 *
 *   primary   — то, чего экран ждёт прямо сейчас и что дёшево откатить.
 *               На экране ровно одна. Создание сущностей и выселение
 *               её не получают никогда.
 *   secondary — рутинное действие в строке, откатывается одним тапом.
 *   careful   — приглушённый контур: статус разойдётся с физическим миром
 *               (выселение). Обязательно сопровождается подтверждением.
 *   danger    — необратимое, красным только текст, никогда не залито.
 *   quiet     — навигация и утилиты, последствий ноль.
 *
 * Размер задаёт зону нажатия, а не только кегль.
 */
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'careful' | 'danger' | 'quiet'
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
  align?: 'center' | 'start'
  disabled?: boolean
}>(), { variant: 'primary', size: 'md', align: 'center' })
</script>

<template>
  <button
    class="nc-btn"
    :class="['nc-btn--' + variant, 'nc-btn--size-' + size, { 'nc-btn--block': block, 'nc-btn--start': align === 'start' }]"
    :disabled="disabled"
    type="button"
  >
    <slot />
  </button>
</template>

<style scoped>
.nc-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--nc-space-8);
  padding: 0 var(--nc-space-12);
  border: 2px solid transparent;
  border-radius: var(--nc-radius-md);
  font-family: var(--nc-font-sans);
  font-weight: var(--nc-fw-bold);
  line-height: 1.15;
  text-align: center;
  cursor: pointer;
  transition: background-color var(--nc-motion-state) var(--nc-ease);
}
.nc-btn--block { width: 100%; }
.nc-btn--start { justify-content: flex-start; text-align: left; }

/* Размеры: нижняя граница 44px — предел, а не рекомендация */
.nc-btn--size-sm { min-height: var(--nc-touch-min);     min-width: var(--nc-touch-min); font-size: var(--nc-fs-200); }
.nc-btn--size-md { min-height: var(--nc-touch-action);  min-width: 114px;               font-size: var(--nc-fs-300); }
.nc-btn--size-lg { min-height: var(--nc-touch-primary); font-size: var(--nc-fs-400); border-radius: var(--nc-radius-lg); }

/* Роли */
.nc-btn--primary {
  background: var(--nc-action-primary-bg);
  color: var(--nc-action-primary-fg);
}
.nc-btn--secondary {
  background: var(--nc-action-secondary-bg);
  color: var(--nc-action-secondary-fg);
  border-color: var(--nc-action-secondary-bd);
}
/* Тише соседей: чем дороже ошибка, тем менее нажимаемо выглядит действие */
.nc-btn--careful {
  background: var(--nc-action-secondary-bg);
  color: var(--nc-text-secondary);
  border-color: var(--nc-text-tertiary);
}
.nc-btn--danger {
  background: var(--nc-action-secondary-bg);
  color: var(--nc-action-danger-fg);
  border-color: var(--nc-action-danger-fg);
}
.nc-btn--quiet {
  background: transparent;
  color: var(--nc-text-primary);
  padding: 0 var(--nc-space-8);
}
.nc-btn:disabled {
  background: var(--nc-action-disabled-bg);
  color: var(--nc-action-disabled-fg);
  border-color: transparent;
  cursor: default;
}
</style>
