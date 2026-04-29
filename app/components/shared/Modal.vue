<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { watch, onUnmounted } from 'vue'
import { cn } from '~/lib/utils'

interface ModalProps {
  isOpen: boolean
  title?: string
  className?: string
}

const props = defineProps<ModalProps>()
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
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <div
        class="absolute inset-0 bg-black/50"
        @click="emit('close')"
      />
      <div :class="cn(
        'relative bg-card rounded-lg shadow-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-auto',
        className
      )">
        <div v-if="title" class="flex items-center justify-between p-4 border-b border-border">
          <h2 class="text-lg font-semibold">{{ title }}</h2>
          <button @click="emit('close')" class="text-muted-foreground hover:text-foreground">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div :class="cn(!title && 'pt-4')">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>
