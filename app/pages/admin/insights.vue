<script setup lang="ts">
import {
  AlertCircle,
  Calendar,
  Lightbulb,
  Target,
  TrendingUp,
  Users,
} from 'lucide-vue-next'
import SectionHeader from "../../components/shared/SectionHeader.vue";
import InsightCard from "../../components/shared/InsightCard.vue";

definePageMeta({
  layout: 'admin',
})

interface Insight {
  id: string
  title: string
  insight: string
  type: 'info' | 'success' | 'warning'
  category: string
  impact: 'high' | 'medium' | 'low'
}

const insights: Insight[] = [
  {
    id: '1',
    title: 'Song-Kul Weekend Demand',
    insight: 'Song-Kul occupancy is projected to reach 95% for July weekends. Current yurt capacity may be insufficient. Consider fast-tracking new partner verifications in the area.',
    type: 'warning',
    category: 'Capacity',
    impact: 'high',
  },
  {
    id: '2',
    title: 'Ala-Archa Vehicle Entry Peaks',
    insight: 'Ala-Archa vehicle entry demand peaks on Saturdays at 150% of weekday average. Recommend implementing advance booking system or dynamic pricing for park entry.',
    type: 'info',
    category: 'Infrastructure',
    impact: 'high',
  },
  {
    id: '3',
    title: 'Rest Point Service Bundling',
    insight: 'Rest point shower service has 35% higher attach rate when bundled with packages. Recommend partner incentives for service bundling.',
    type: 'success',
    category: 'Revenue',
    impact: 'medium',
  },
  {
    id: '4',
    title: 'Sary-Chelek Underperformance',
    insight: 'Sary-Chelek has 38% lower bookings than capacity suggests. Marketing campaign targeting eco-tourism and nature photography segments recommended.',
    type: 'info',
    category: 'Marketing',
    impact: 'medium',
  },
  {
    id: '5',
    title: 'International Booking Growth',
    insight: 'International bookings up 45% YoY, primarily from Germany, Japan, and France. Consider multi-language support and international payment options.',
    type: 'success',
    category: 'Growth',
    impact: 'high',
  },
  {
    id: '6',
    title: 'Partner Verification Backlog',
    insight: '3 partner applications pending verification for 2+ weeks. Faster verification correlates with 28% higher partner activation rates.',
    type: 'warning',
    category: 'Operations',
    impact: 'medium',
  },
]

const highImpact = computed(() => insights.filter(i => i.impact === 'high'))
const otherInsights = computed(() => insights.filter(i => i.impact !== 'high'))

const impactColors: Record<string, string> = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
}
</script>

<template>
  <div class="space-y-6">
    <SectionHeader
      title="AI Insights"
      description="Data-driven recommendations for tourism optimization"
    />

    <!-- Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 flex items-center justify-center">
          <AlertCircle class="w-6 h-6" />
        </div>
        <div>
          <p class="text-2xl font-bold">{{ highImpact.length }}</p>
          <p class="text-sm text-muted-foreground">High Priority</p>
        </div>
      </div>
      <div class="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 flex items-center justify-center">
          <TrendingUp class="w-6 h-6" />
        </div>
        <div>
          <p class="text-2xl font-bold">{{ insights.filter(i => i.type === 'success').length }}</p>
          <p class="text-sm text-muted-foreground">Opportunities</p>
        </div>
      </div>
      <div class="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
        <div class="w-12 h-12 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center">
          <Lightbulb class="w-6 h-6" />
        </div>
        <div>
          <p class="text-2xl font-bold">{{ insights.length }}</p>
          <p class="text-sm text-muted-foreground">Total Insights</p>
        </div>
      </div>
    </div>

    <!-- High Priority -->
    <div>
      <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
        <AlertCircle class="w-5 h-5 text-red-600" />
        High Priority Actions
      </h2>
      <div class="space-y-4">
        <div v-for="insight in highImpact" :key="insight.id" class="bg-card border border-border rounded-xl p-4 transition-all hover:shadow-md">
          <div class="flex items-center gap-2 mb-3">
            <span :class="['px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider', impactColors[insight.impact]]">
              {{ insight.impact }} IMPACT
            </span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground">
              {{ insight.category }}
            </span>
          </div>
          <InsightCard
            :title="insight.title"
            :insight="insight.insight"
            :type="insight.type"
          />
        </div>
      </div>
    </div>

    <!-- Other Insights -->
    <div>
      <h2 class="text-lg font-semibold mb-4">Other Insights</h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div v-for="insight in otherInsights" :key="insight.id" class="group">
          <div class="flex items-center gap-2 mb-2">
            <span :class="['px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider', impactColors[insight.impact]]">
              {{ insight.impact }}
            </span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground">
              {{ insight.category }}
            </span>
          </div>
          <InsightCard
            :title="insight.title"
            :insight="insight.insight"
            :type="insight.type"
            class="group-hover:shadow-sm"
          />
        </div>
      </div>
    </div>

    <!-- Strategic Recommendations -->
    <div class="bg-card border border-border rounded-xl p-6">
      <h2 class="text-lg font-semibold mb-6 flex items-center gap-2">
        <Target class="w-5 h-5 text-primary" />
        Strategic Recommendations
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="space-y-4">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
              <Calendar class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-bold text-sm">Short-term (1-3 months)</h3>
              <ul class="text-sm text-muted-foreground mt-2 space-y-2">
                <li class="flex items-start gap-2">
                  <span class="text-primary font-bold">•</span>
                  Implement Ala-Archa advance booking system
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-primary font-bold">•</span>
                  Fast-track Song-Kul partner verifications
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-primary font-bold">•</span>
                  Launch rest point service bundling program
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="space-y-4">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Users class="w-5 h-5" />
            </div>
            <div>
              <h3 class="font-bold text-sm">Long-term (6-12 months)</h3>
              <ul class="text-sm text-muted-foreground mt-2 space-y-2">
                <li class="flex items-start gap-2">
                  <span class="text-primary font-bold">•</span>
                  Develop Sary-Chelek eco-tourism packages
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-primary font-bold">•</span>
                  Multi-language platform support
                </li>
                <li class="flex items-start gap-2">
                  <span class="text-primary font-bold">•</span>
                  International payment integration
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
