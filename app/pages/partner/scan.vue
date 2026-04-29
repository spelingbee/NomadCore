<script setup lang="ts">
import { Html5QrcodeScanner } from 'html5-qrcode'
import { CheckCircle2, QrCode, RefreshCcw, AlertTriangle } from 'lucide-vue-next'
import SectionHeader from '~/components/shared/SectionHeader.vue'
import { Button } from '~/components/ui/button'

definePageMeta({
  layout: 'partner',
})

const { t } = useI18n()
const scanner = ref<Html5QrcodeScanner | null>(null)
const scanResult = ref<string | null>(null)
const isProcessing = ref(false)
const error = ref<string | null>(null)

const api = useApiService()

function onScanSuccess(decodedText: string) {
  if (isProcessing.value) return
  
  scanResult.value = decodedText
  isProcessing.value = true
  
  // Call API to register check-in
  api.registerCheckIn(decodedText)
    .then(() => {
      isProcessing.value = false
    })
    .catch((err) => {
      isProcessing.value = false
      error.value = err.message || 'Failed to register check-in'
      console.error(err)
    })
  
  if (scanner.value) {
    scanner.value.pause()
  }
}

function onScanError(err: any) {
  // Silent errors are fine during active scanning
}

function resetScanner() {
  scanResult.value = null
  error.value = null
  if (scanner.value) {
    scanner.value.resume()
  }
}

onMounted(() => {
  scanner.value = new Html5QrcodeScanner(
    'qr-reader',
    { 
      fps: 10, 
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0
    },
    /* verbose= */ false
  )
  scanner.value.render(onScanSuccess, onScanError)
})

onUnmounted(() => {
  if (scanner.value) {
    scanner.value.clear().catch(error => {
      console.error('Failed to clear html5QrcodeScanner', error)
    })
  }
})
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <SectionHeader
      :title="t('scan.title')"
      :description="t('scan.description')"
    />

    <div class="relative bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
      <!-- Scanner UI -->
      <div v-show="!scanResult" class="p-4">
        <div id="qr-reader" class="rounded-xl overflow-hidden"></div>
        <div class="mt-4 flex items-center gap-3 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">
          <QrCode class="w-5 h-5" />
          <p>{{ t('scan.instructions') }}</p>
        </div>
      </div>

      <!-- Success UI -->
      <div v-if="scanResult" class="p-8 text-center animate-in fade-in zoom-in duration-300">
        <div v-if="isProcessing" class="flex flex-col items-center">
          <RefreshCcw class="w-16 h-16 text-primary animate-spin" />
          <h3 class="text-xl font-bold mt-6">{{ t('scan.processing') }}</h3>
          <p class="text-muted-foreground mt-2">Checking booking status in NomadCore system</p>
        </div>

        <div v-else class="flex flex-col items-center">
          <div class="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
            <CheckCircle2 class="w-10 h-10" />
          </div>
          <h3 class="text-2xl font-black mt-6">{{ t('scan.success') }}</h3>
          <p class="text-muted-foreground mt-2">
            {{ t('scan.success_desc') }}
          </p>
          
          <div class="mt-8 p-4 bg-muted rounded-xl w-full text-left">
            <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Scanned Data</p>
            <p class="font-mono font-bold text-lg mt-1">{{ scanResult }}</p>
          </div>

          <Button class="mt-8 w-full py-6 text-lg font-bold" @click="resetScanner">
            {{ t('scan.scan_next') }}
          </Button>
        </div>
      </div>
    </div>

    <!-- Instructions -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="p-4 bg-muted/50 rounded-xl border border-border">
        <h4 class="font-bold text-sm">Why scan?</h4>
        <p class="text-xs text-muted-foreground mt-1">
          Scanning verifies the booking and automatically reports tourist presence to Tunduk Travel for statistics and safety.
        </p>
      </div>
      <div class="p-4 bg-muted/50 rounded-xl border border-border">
        <h4 class="font-bold text-sm">Offline Mode</h4>
        <p class="text-xs text-muted-foreground mt-1">
          The scanner works without internet. Data will be uploaded automatically once you are back online.
        </p>
      </div>
    </div>
  </div>
</template>

<style>
/* Customizing html5-qrcode styles to match NomadCore aesthetic */
#qr-reader {
  border: none !important;
}
#qr-reader__scan_region {
  background: #f8fafc !important;
}
#qr-reader__dashboard {
  padding: 20px !important;
}
#qr-reader__dashboard_section_csr button {
  background: hsl(var(--primary)) !important;
  color: white !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
  font-weight: 600 !important;
  border: none !important;
  cursor: pointer !important;
}
#qr-reader img {
  display: none !important;
}
</style>
