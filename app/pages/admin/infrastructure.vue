<script setup lang="ts">
import {
  AlertCircle,
  Building,
  CheckCircle,
  Clock,
  DollarSign,
  Plus,
  TrendingUp,
} from 'lucide-vue-next'
import { mockInfrastructureProjects } from '~/data/mock-data'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import SectionHeader from "../../components/shared/SectionHeader.vue";
import StatCard from "../../components/shared/StatCard.vue";

definePageMeta({
  layout: 'admin',
})

const statusFilter = ref('all')

const filteredProjects = computed(() => {
  if (statusFilter.value === 'all') return mockInfrastructureProjects
  return mockInfrastructureProjects.filter(p => p.status === statusFilter.value)
})

const totalBudget = computed(() =>
  mockInfrastructureProjects.reduce((sum, p) => sum + p.budget, 0),
)

const completedProjects = computed(() =>
  mockInfrastructureProjects.filter(p => p.status === 'completed').length,
)

const inProgressProjects = computed(() =>
  mockInfrastructureProjects.filter(p => p.status === 'in-progress').length,
)

const statusColors: Record<string, string> = {
  'completed': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'planned': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
}

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  low: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
}

const regionalBudgets = computed(() => {
  const regions = Array.from(new Set(mockInfrastructureProjects.map(p => p.region)))
  return regions.map((region) => {
    const regionProjects = mockInfrastructureProjects.filter(p => p.region === region)
    const regionBudget = regionProjects.reduce((sum, p) => sum + p.budget, 0)
    const percentage = (regionBudget / totalBudget.value) * 100
    return { region, budget: regionBudget, percentage }
  })
})

const criticalProjects = computed(() =>
  mockInfrastructureProjects.filter(p => p.progress < 50 && p.status === 'in-progress').slice(0, 3),
)
</script>

<template>
  <div class="space-y-6">
    <SectionHeader
      title="Infrastructure Projects"
      description="Track and manage tourism infrastructure development"
    >
      <template #action>
        <Button class="gap-2">
          <Plus class="h-4 w-4" />
          New Project
        </Button>
      </template>
    </SectionHeader>

    <div class="grid gap-4 md:grid-cols-4">
      <StatCard
        label="Total Projects"
        :value="mockInfrastructureProjects.length"
      >
        <template #icon><Building class="h-4 w-4" /></template>
      </StatCard>
      <StatCard
        label="Total Budget"
        :value="`$${(totalBudget / 1000000).toFixed(1)}M`"
      >
        <template #icon><DollarSign class="h-4 w-4" /></template>
      </StatCard>
      <StatCard
        label="In Progress"
        :value="inProgressProjects"
      >
        <template #icon><Clock class="h-4 w-4" /></template>
      </StatCard>
      <StatCard
        label="Completed"
        :value="completedProjects"
        change="+25%"
        change-type="positive"
      >
        <template #icon><CheckCircle class="h-4 w-4" /></template>
      </StatCard>
    </div>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between pb-2">
        <CardTitle class="text-base font-semibold">Project Overview</CardTitle>
        <div class="flex gap-2">
          <Button
            v-for="filter in ['all', 'in-progress', 'planned', 'completed']"
            :key="filter"
            :variant="statusFilter === filter ? 'default' : 'outline'"
            size="sm"
            class="capitalize"
            @click="statusFilter = filter"
          >
            {{ filter.replace('-', ' ') }}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div
            v-for="project in filteredProjects"
            :key="project.id"
            class="rounded-lg border p-4 hover:bg-muted/50 transition-colors"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-semibold">{{ project.name }}</h3>
                  <Badge :class="statusColors[project.status]">
                    {{ project.status.replace('-', ' ') }}
                  </Badge>
                  <Badge :class="priorityColors[project.priority]">
                    {{ project.priority }} priority
                  </Badge>
                </div>
                <p class="text-sm text-muted-foreground mb-3">
                  {{ project.description }}
                </p>
                <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <span class="flex items-center gap-1.5">
                    <Building class="h-4 w-4 text-muted-foreground" />
                    {{ project.region }}
                  </span>
                  <span class="flex items-center gap-1.5">
                    <DollarSign class="h-4 w-4 text-muted-foreground" />
                    ${{ (project.budget / 1000000).toFixed(2) }}M budget
                  </span>
                  <span class="flex items-center gap-1.5">
                    <Clock class="h-4 w-4 text-muted-foreground" />
                    {{ project.timeline }}
                  </span>
                </div>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold">{{ project.progress }}%</p>
                <p class="text-sm text-muted-foreground">Complete</p>
              </div>
            </div>
            <div class="mt-4">
              <Progress :model-value="project.progress" class="h-2" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <div class="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle class="text-base flex items-center gap-2 font-semibold">
            <AlertCircle class="h-4 w-4 text-amber-500" />
            Projects Requiring Attention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div
              v-for="project in criticalProjects"
              :key="project.id"
              class="flex items-center justify-between p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
            >
              <div>
                <p class="font-medium">{{ project.name }}</p>
                <p class="text-sm text-muted-foreground">
                  {{ project.progress }}% complete - {{ project.timeline }}
                </p>
              </div>
              <Button variant="outline" size="sm">Review</Button>
            </div>
            <p v-if="criticalProjects.length === 0" class="text-sm text-muted-foreground text-center py-4">
              All projects are on track
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle class="text-base flex items-center gap-2 font-semibold">
            <TrendingUp class="h-4 w-4 text-emerald-500" />
            Budget Allocation by Region
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4">
            <div v-for="item in regionalBudgets" :key="item.region">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-sm font-medium">{{ item.region }}</span>
                <span class="text-sm text-muted-foreground">
                  ${{ (item.budget / 1000000).toFixed(1) }}M ({{ item.percentage.toFixed(0) }}%)
                </span>
              </div>
              <Progress :model-value="item.percentage" class="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
