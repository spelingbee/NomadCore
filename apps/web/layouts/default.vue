<script setup lang="ts">
/**
 * Оболочка приложения владельца: полоса связи сверху, экран посередине,
 * навигация снизу. Обе полосы неподвижны, прокручивается только содержимое —
 * владелец работает стоя и одной рукой, и главное действие не должно
 * уезжать из зоны большого пальца.
 *
 * Высота считается от 100dvh, а не 100vh: на Android адресная строка
 * съедает часть экрана, и при 100vh нижняя кнопка уходит под неё.
 */
const { load: loadProperty } = useProperty()
const { load: loadBookings } = useBookings()
const { load: loadQueue } = useQueue()

await loadProperty()
await loadBookings()
// Очередь грузится в оболочке, а не на своём экране: её счётчик стоит
// в полосе связи и на вкладке, то есть виден со всех четырёх экранов.
await loadQueue()
</script>

<template>
  <div class="app">
    <SyncBar />
    <div class="app__body">
      <slot />
    </div>
    <AppTabBar />
  </div>
</template>

<style scoped>
.app {
  /* Опорный контейнер для NcSheet: шторка позиционируется inset:0 и должна
     накрывать в том числе нижнюю навигацию, а не только область экрана. */
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100dvh;
  background: var(--nc-bg-canvas);
}
.app__body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
</style>
