<script setup lang="ts">
import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'

interface BookingFormProps {
  className?: string
}
defineProps<BookingFormProps>()
defineEmits<{
  submit: []
}>()
</script>

<template>
  <div :class="cn('space-y-4', className)">
    <h3 class="font-semibold">Contact Details</h3>
    <div class="space-y-3">
      <div>
        <label class="text-sm text-muted-foreground">Full Name</label>
        <input
          type="text"
          value="Anna Schmidt"
          class="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background"
        />
      </div>
      <div>
        <label class="text-sm text-muted-foreground">Email</label>
        <input
          type="email"
          value="anna@email.com"
          class="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background"
        />
      </div>
      <div>
        <label class="text-sm text-muted-foreground">Phone</label>
        <input
          type="tel"
          value="+49 123 456 789"
          class="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background"
        />
      </div>
    </div>
    <Button @click="$emit('submit')" class="w-full" size="lg">
      Confirm Booking
    </Button>
  </div>
</template>
