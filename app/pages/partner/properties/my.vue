<script setup lang="ts">
import { Edit, MapPin, MoreVertical, Plus, Star } from 'lucide-vue-next'
import { useTourismStore } from '~/stores/useTourismStore'
import {
  currentPartner,
  getDestinationById,
  getServicesByProperty,
  getUnitTypesByProperty,
} from '~/data/mock-data'
import { Button } from '~/components/ui/button'
import SectionHeader from "~/components/shared/SectionHeader.vue";
import Modal from "~/components/shared/Modal.vue";
import Tabs from "~/components/shared/Tabs.vue";

definePageMeta({
  layout: 'partner',
})

const { t } = useI18n()
const tourismStore = useTourismStore()

const selectedPropertyId = ref<string | null>(null)
const isAddModalOpen = ref(false)
const partnerProperties = computed(() => tourismStore.properties)

onMounted(async () => {
  await tourismStore.loadMyProperties()
})

const selectedProp = computed(() => partnerProperties.value.find(p => p.id === selectedPropertyId.value))
const unitTypes = computed(() => selectedProp.value ? getUnitTypesByProperty(selectedProp.value.id) : [])
const services = computed(() => selectedProp.value ? getServicesByProperty(selectedProp.value.id) : [])

const tabs = [
  { id: 'basic', label: 'Basic Info' },
  { id: 'units', label: 'Unit Types' },
  { id: 'services', label: 'Services' },
  { id: 'amenities', label: 'Amenities' },
]
</script>

<template>
  <div class="space-y-6">
    <SectionHeader
      :title="t('properties.title')"
      :description="t('properties.description')"
    >
      <template #action>
        <Button @click="isAddModalOpen = true">
          <Plus class="w-4 h-4 mr-2" />
          {{ t('properties.add_property') }}
        </Button>
      </template>
    </SectionHeader>

    <!-- Properties Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="property in partnerProperties"
        :key="property.id"
        class="bg-card border border-border rounded-xl overflow-hidden"
      >
        <div class="relative aspect-video">
          <img
            :src="property.image"
            :alt="property.name"
            class="w-full h-full object-cover"
          />
          <div class="absolute top-2 right-2">
            <button type="button" class="w-8 h-8 rounded-full bg-card/90 backdrop-blur flex items-center justify-center">
              <MoreVertical class="w-4 h-4" />
            </button>
          </div>
        </div>
        <div class="p-4">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="font-semibold">{{ property.name }}</h3>
              <p class="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin class="w-3.5 h-3.5" />
                {{ getDestinationById(property.destinationId)?.name }}
              </p>
            </div>
            <div class="flex items-center gap-1 text-sm">
              <Star class="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{{ property.rating }}</span>
            </div>
          </div>

          <div class="mt-3 flex flex-wrap gap-2">
            <span class="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
              Active
            </span>
            <span class="text-xs bg-muted px-2 py-0.5 rounded">
              {{ getUnitTypesByProperty(property.id).length }} unit types
            </span>
            <span class="text-xs bg-muted px-2 py-0.5 rounded">
              {{ property.reviewCount }} reviews
            </span>
          </div>

          <div class="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              class="flex-1"
              @click="selectedPropertyId = property.id"
            >
              <Edit class="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button variant="outline" size="sm" class="flex-1">
              View
            </Button>
          </div>
        </div>
      </div>

      <!-- Add Property Card -->
      <button type="button" class="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-muted-foreground hover:border-foreground hover:text-foreground transition-colors min-h-[300px]">
        <Plus class="w-8 h-8" />
        <p class="font-medium mt-2">Add New Property</p>
        <p class="text-sm">List your accommodation</p>
      </button>
    </div>

    <!-- Property Detail Modal -->
    <Modal
      :is-open="!!selectedPropertyId"
      @close="selectedPropertyId = null"
      :title="selectedProp?.name || 'Property Details'"
      class-name="max-w-2xl"
    >
      <div v-if="selectedProp">
        <Tabs :tabs="tabs">
          <template #basic>
            <div class="p-4 space-y-4">
              <div>
                <label class="text-sm text-muted-foreground">Property Name</label>
                <input
                  type="text"
                  :value="selectedProp.name"
                  class="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background"
                />
              </div>
              <div>
                <label class="text-sm text-muted-foreground">Property Type</label>
                <input
                  type="text"
                  :value="selectedProp.type"
                  class="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background"
                />
              </div>
              <div>
                <label class="text-sm text-muted-foreground">Description</label>
                <textarea
                  :value="selectedProp.description"
                  rows="3"
                  class="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background resize-none"
                />
              </div>
              <Button class="w-full">Save Changes</Button>
            </div>
          </template>
          <template #units>
            <div class="p-4 space-y-3">
              <div v-for="unit in unitTypes" :key="unit.id" class="flex items-center gap-3 p-3 border border-border rounded-lg">
                <img
                  :src="unit.image"
                  :alt="unit.name"
                  class="w-16 h-16 rounded-lg object-cover"
                />
                <div class="flex-1">
                  <p class="font-medium text-sm">{{ unit.name }}</p>
                  <p class="text-xs text-muted-foreground">{{ unit.description }}</p>
                  <p class="text-xs text-muted-foreground mt-1">Capacity: {{ unit.capacity }} | Base: {{ unit.basePrice }} KGS</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              <Button variant="outline" class="w-full">
                <Plus class="w-4 h-4 mr-2" />
                Add Unit Type
              </Button>
            </div>
          </template>
          <template #services>
            <div class="p-4 space-y-3">
              <div v-for="service in services" :key="service.id" class="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p class="font-medium text-sm">{{ service.name }}</p>
                  <p class="text-xs text-muted-foreground">{{ service.description }}</p>
                </div>
                <div class="text-right">
                  <p class="font-medium text-sm">{{ service.price }} KGS</p>
                  <p class="text-xs text-muted-foreground">{{ service.category }}</p>
                </div>
              </div>
              <Button variant="outline" class="w-full">
                <Plus class="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </div>
          </template>
          <template #amenities>
            <div class="p-4">
              <div class="flex flex-wrap gap-2">
                <span v-for="(amenity, i) in selectedProp.amenities || []" :key="i" class="px-3 py-1.5 bg-muted rounded-full text-sm flex items-center gap-2">
                  {{ amenity }}
                  <button type="button" class="text-muted-foreground hover:text-foreground">
                    <span class="sr-only">Remove</span>
                    &times;
                  </button>
                </span>
              </div>
              <Button variant="outline" class="w-full mt-4">
                <Plus class="w-4 h-4 mr-2" />
                Add Amenity
              </Button>
            </div>
          </template>
        </Tabs>
      </div>
    </Modal>

    <!-- Add Property Modal -->
    <Modal
      :is-open="isAddModalOpen"
      @close="isAddModalOpen = false"
      title="Add New Property"
      class-name="max-w-xl"
    >
      <div class="p-4 space-y-4">
        <div>
          <label class="text-sm font-medium">Property Name</label>
          <input type="text" class="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background" placeholder="e.g. Alay Guest House" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium">Type</label>
            <select class="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background">
              <option>Yurt Camp</option>
              <option>Guest House</option>
              <option>Hotel</option>
              <option>Rest Point</option>
            </select>
          </div>
          <div>
            <label class="text-sm font-medium">Destination</label>
            <select class="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background">
              <option>Issyk-Kul</option>
              <option>Ala-Archa</option>
              <option>Song-Kul</option>
              <option>Karakol</option>
            </select>
          </div>
        </div>
        <div>
          <label class="text-sm font-medium">Description</label>
          <textarea rows="3" class="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background resize-none" placeholder="Describe your property..."></textarea>
        </div>
        <div>
          <label class="text-sm font-medium">Image URL</label>
          <input type="text" class="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background" placeholder="https://images.unsplash.com/..." />
        </div>
        <div class="flex gap-3 pt-2">
          <Button variant="outline" class="flex-1" @click="isAddModalOpen = false">Cancel</Button>
          <Button class="flex-1" @click="isAddModalOpen = false">Create Property</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
