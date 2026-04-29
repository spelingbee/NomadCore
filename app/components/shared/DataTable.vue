<script setup lang="ts" generic="T">
import { cn } from '~/lib/utils'

interface Column {
  key: string
  header: string
  className?: string
}

interface DataTableProps {
  columns: Column[]
  data: T[]
  keyExtractor: (item: T) => string
  emptyMessage?: string
  className?: string
}

const props = withDefaults(defineProps<DataTableProps>(), {
  emptyMessage: 'No data available',
})

defineEmits<{
  rowClick: [item: T]
}>()
</script>

<template>
  <div v-if="data.length === 0" class="border border-border rounded-lg p-8 text-center">
    <p class="text-muted-foreground">{{ emptyMessage }}</p>
  </div>

  <div v-else :class="cn('border border-border rounded-lg overflow-hidden', className)">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-muted/50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="cn(
                'px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider',
                column.className
              )"
            >
              {{ column.header }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-card divide-y divide-border">
          <tr
            v-for="item in data"
            :key="keyExtractor(item)"
            @click="$emit('rowClick', item)"
            :class="cn(
              'transition-colors',
              $attrs.onRowClick && 'cursor-pointer hover:bg-muted/50'
            )"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              :class="cn('px-4 py-3 text-sm', column.className)"
            >
              <slot :name="`cell-${column.key}`" :item="item">
                {{ (item as any)[column.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
