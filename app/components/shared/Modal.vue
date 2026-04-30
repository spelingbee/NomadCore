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
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        class="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        @click="emit('close')"
      />
      <div :class="cn(
        'relative bg-card rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden border border-border flex flex-col',
        className
      )">
        <div v-if="title" class="flex items-center justify-between p-4 lg:p-6 border-b border-border bg-muted/30">
          <h2 class="text-xl font-bold tracking-tight">{{ title }}</h2>
          <button @click="emit('close')" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors">
            <X class="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <div class="flex-1 overflow-y-auto">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>
