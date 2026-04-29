<script setup lang="ts">
import { Share2, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-vue-next'
import SectionHeader from "~/components/shared/SectionHeader.vue";
import { Button } from "~/components/ui/button";

definePageMeta({
  layout: 'partner',
})

const { t } = useI18n()

const channels = computed(() => [
  {
    id: 'tunduk',
    title: t('channels.tunduk_title'),
    description: t('channels.tunduk_desc'),
    status: 'pending',
    icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_pP3_XN-rJmS6Z8J_f1w-v4e_8_yL-o0_9g&s',
    badge: 'National'
  },
  {
    id: 'mtravel',
    title: t('channels.mtravel_title'),
    description: t('channels.mtravel_desc'),
    status: 'connected',
    icon: 'https://media.licdn.com/dms/image/C4D0BAQG0Z_2Z_0Z_0Q/company-logo_200_200/0/1630571816111?e=2147483647&v=beta&t=7_Z_0Z_0Q',
    badge: 'Fintech'
  },
  {
    id: 'booking',
    title: t('channels.booking_title'),
    description: t('channels.booking_desc'),
    status: 'disconnected',
    icon: 'https://cf.bstatic.com/static/img/b26_logo_apple_touch_icon/761270bc483109a96e95c106a77d5a570f0310e8.png',
    badge: 'Global OTA'
  },
  {
    id: 'kettik',
    title: t('channels.kettik_title'),
    description: t('channels.kettik_desc'),
    status: 'connected',
    icon: 'https://kettik.kg/wp-content/uploads/2021/04/kettik-logo.png',
    badge: 'Local'
  }
])
</script>

<template>
  <div class="space-y-6">
    <SectionHeader
      :title="t('channels.title')"
      :description="t('channels.description')"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="channel in channels"
        :key="channel.id"
        class="bg-card border border-border rounded-xl p-6 flex flex-col justify-between"
      >
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg border border-border overflow-hidden bg-white p-1">
              <img :src="channel.icon" :alt="channel.title" class="w-full h-full object-contain" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-bold">{{ channel.title }}</h3>
                <span class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted">
                  {{ channel.badge }}
                </span>
              </div>
              <p class="text-xs text-muted-foreground mt-1">{{ channel.description }}</p>
            </div>
          </div>
          <div class="flex items-center gap-1.5">
            <template v-if="channel.status === 'connected'">
              <CheckCircle2 class="w-4 h-4 text-emerald-500" />
              <span class="text-xs font-medium text-emerald-600">{{ t('channels.status_connected') }}</span>
            </template>
            <template v-else-if="channel.status === 'pending'">
              <AlertCircle class="w-4 h-4 text-amber-500" />
              <span class="text-xs font-medium text-amber-600">{{ t('channels.status_pending') }}</span>
            </template>
            <template v-else>
              <span class="text-xs font-medium text-muted-foreground">{{ t('channels.status_disconnected') }}</span>
            </template>
          </div>
        </div>

        <div class="mt-8 flex items-center justify-between gap-4">
          <div class="flex items-center gap-4 text-xs text-muted-foreground">
            <div class="flex flex-col">
              <span class="font-bold text-foreground">5%</span>
              <span>Commission</span>
            </div>
            <div class="w-px h-4 bg-border" />
            <div class="flex flex-col">
              <span class="font-bold text-foreground">Real-time</span>
              <span>Sync</span>
            </div>
          </div>
          
          <div class="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings class="w-3.5 h-3.5 mr-1.5" />
              Settings
            </Button>
            <Button v-if="channel.status === 'disconnected'" size="sm">
              {{ t('channels.connect') }}
            </Button>
            <Button v-else variant="ghost" size="sm">
              <ExternalLink class="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Info Card -->
    <div class="bg-primary/5 border border-primary/10 rounded-xl p-6 flex items-start gap-4 mt-8">
      <div class="bg-primary/10 p-2 rounded-lg">
        <Share2 class="w-6 h-6 text-primary" />
      </div>
      <div>
        <h4 class="font-bold text-primary">Distribution Layer</h4>
        <p class="text-sm text-muted-foreground mt-1 max-w-2xl">
          NomadCore acts as your central distribution hub. Any changes you make to your availability, prices, or content are automatically pushed to all connected channels, including national platforms like Tunduk Travel and local ecosystems like MTravel.
        </p>
      </div>
    </div>
  </div>
</template>
