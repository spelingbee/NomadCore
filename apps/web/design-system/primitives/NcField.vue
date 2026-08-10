<script setup lang="ts">
/**
 * Поле ввода. type/inputmode/autocomplete добавлены сверх исходного набора:
 * без них примитив не мог сделать поле телефона и поле кода из SMS, и на
 * экране входа пришлось бы верстать input мимо системы.
 */
withDefaults(
  defineProps<{
    label: string
    hint?: string
    error?: string
    type?: 'text' | 'tel' | 'email' | 'number'
    inputmode?: 'text' | 'tel' | 'numeric' | 'email'
    autocomplete?: string
    required?: boolean
  }>(),
  { type: 'text' },
)
const model = defineModel<string>()
</script>

<template>
  <label class="nc-field">
    <span class="nc-field__label">{{ label }}</span>
    <input
      v-model="model"
      class="nc-field__input"
      :type="type"
      :inputmode="inputmode"
      :autocomplete="autocomplete"
      :required="required"
      :placeholder="hint"
    />
    <span v-if="error" class="nc-field__error">{{ error }}</span>
  </label>
</template>

<style scoped>
.nc-field { display: block; }
.nc-field__label {
  display: block;
  font-size: var(--nc-fs-100);
  font-weight: var(--nc-fw-bold);
  letter-spacing: var(--nc-tracking-caps);
  text-transform: uppercase;
  color: var(--nc-text-secondary);
  margin-bottom: var(--nc-space-8);
}
.nc-field__input {
  width: 100%;
  min-height: var(--nc-touch-action);
  padding: 0 var(--nc-space-12);
  background: var(--nc-bg-surface);
  color: var(--nc-text-primary);
  border: var(--nc-stroke-control) solid var(--nc-border-strong);
  border-radius: var(--nc-radius-md);
  font-family: var(--nc-font-sans);
  font-size: var(--nc-fs-300);
  font-weight: var(--nc-fw-medium);
}
.nc-field__input::placeholder { color: var(--nc-text-tertiary); font-weight: var(--nc-fw-regular); }
.nc-field__error {
  display: block;
  margin-top: var(--nc-space-8);
  padding: var(--nc-space-12);
  background: var(--nc-signal-error-bg);
  border-left: var(--nc-stroke-accent) solid var(--nc-action-danger-fg);
  color: var(--nc-signal-error-fg);
  font-size: var(--nc-fs-200);
  line-height: var(--nc-lh-200);
  font-weight: var(--nc-fw-medium);
}
</style>
