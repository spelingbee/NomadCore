<script setup lang="ts">
/**
 * Корень приложения. Стилей здесь нет и не будет: раньше в этом файле жили
 * ~230 строк глобального CSS, и он был фактической дизайн-системой проекта.
 * Теперь единственный источник правды — design-system/tokens.css,
 * подключённый через nuxt.config.
 */
const { init } = useTheme()

onMounted(init)
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
