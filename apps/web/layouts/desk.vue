<script setup lang="ts">
/**
 * Оболочка кабинета госагентства. Ноутбук или проектор, НЕ телефон.
 *
 * Ни полосы связи, ни нижней навигации здесь нет намеренно: это не
 * рабочее место, за которым стоят на улице, а инструмент принятия решений,
 * который открывают один раз и читают. Офлайн-слой сюда тоже не тянется —
 * кабинет работает из сети.
 *
 * Отдельная шкала desk (от 12px) вместо field (от 13px): другое
 * устройство, другая дистанция до экрана, другая плотность.
 */
</script>

<template>
  <div class="desk">
    <slot />
  </div>
</template>

<style scoped>
.desk {
  min-height: 100dvh;
  padding: var(--nc-space-24);
  background: var(--nc-bg-canvas);
  color: var(--nc-text-primary);
  font-size: var(--nc-fs-desk-200);
  line-height: var(--nc-lh-desk-200);
}
</style>
