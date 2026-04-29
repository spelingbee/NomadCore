<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { watch, onUnmounted } from 'vue'
import { cn } from '~/lib/utils'

interface DrawerProps {
  isOpen: boolean
  title?: string
  side?: 'left' | 'right'
  className?: string
}

const props = withDefaults(defineProps<DrawerProps>(), {
  side: 'right',
})

const emit = defineEmits<{
  close: []
}>()

watch(() => props.isOpen, (newVal) => {
  if (!import.meta.client) return
  document.body.style.overflow = newVal ? 'hidden' : ''
}, { immediate: true })

onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-50">
      <div
        class="absolute inset-0 bg-black/50"
        @click="emit('close')"
      />
      <div
        :class="cn(
          'absolute top-0 bottom-0 bg-card shadow-lg w-full max-w-md flex flex-col transition-transform duration-300',
          side === 'right' ? 'right-0' : 'left-0',
          className
        )"
      >
        <div class="flex items-center justify-between p-4 border-b border-border">
          <h2 class="text-lg font-semibold">{{ title }}</h2>
          <button @click="emit('close')" class="text-muted-foreground hover:text-foreground">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="flex-1 overflow-auto p-4">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>
