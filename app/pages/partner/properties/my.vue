<script setup lang="ts">
import { Edit, MapPin, MoreVertical, Plus, Star } from 'lucide-vue-next'
import { useTourismStore } from '~/stores/useTourismStore'
import {
  getDestinationById,
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
const isAddServiceModalOpen = ref(false)
const newService = ref({ name: '', description: '', price: 0, durationMinutes: 60 })
const partnerProperties = computed(() => tourismStore.properties)

onMounted(async () => {
  await tourismStore.loadMyProperties()
})

const tabs = [
  { id: 'basic', label: 'Основная инфа' },
  { id: 'photos', label: 'Фотографии' },
  { id: 'units', label: 'Юниты' },
  { id: 'services', label: 'Услуги' },
  { id: 'amenities', label: 'Удобства' },
]

const selectedProp = computed(() => partnerProperties.value.find(p => p.id === selectedPropertyId.value))
const unitTypes = computed(() => tourismStore.units)
const services = computed(() => tourismStore.experiences)
const propertyImages = computed(() => tourismStore.propertyImages)

watch(selectedPropertyId, (newId) => {
  if (newId) {
    tourismStore.loadUnits(newId)
    tourismStore.loadPropertyImages(newId)
    tourismStore.loadExperiences({ partnerId: selectedProp.value?.partnerId || selectedProp.value?.partner_id })
  }
})
const predefinedAmenities = [
  'WiFi', 
  'Душ (внутри)', 
  'Душ (на улице)', 
  'Горячая вода', 
  'Завтрак включен', 
  'Отопление', 
  'Парковка', 
  'Кондиционер'
]

const toggleAmenity = (amenity: string) => {
  if (!selectedProp.value) return
  if (!selectedProp.value.metadata) selectedProp.value.metadata = {}
  if (!selectedProp.value.metadata.amenities) selectedProp.value.metadata.amenities = selectedProp.value.amenities || []
  
  const list = selectedProp.value.metadata.amenities
  if (list.includes(amenity)) {
    selectedProp.value.metadata.amenities = list.filter((a: string) => a !== amenity)
  } else {
    selectedProp.value.metadata.amenities.push(amenity)
  }
  // Sync back for UI
  selectedProp.value.amenities = selectedProp.value.metadata.amenities
}

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
              Активен
            </span>
            <span class="text-xs bg-muted px-2 py-0.5 rounded">
              {{ property.reviewCount || 0 }} отзывов
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
              Редактировать
            </Button>
            <Button variant="outline" size="sm" class="flex-1">
              Смотреть
            </Button>
          </div>
        </div>
      </div>

      <!-- Add Property Card -->
      <button type="button" class="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-muted-foreground hover:border-foreground hover:text-foreground transition-colors min-h-[300px]">
        <Plus class="w-8 h-8" />
        <p class="font-medium mt-2">Добавить объект</p>
        <p class="text-sm">Разместите ваше жилье</p>
      </button>
    </div>

    <!-- Property Detail Modal -->
    <Modal
      :is-open="!!selectedPropertyId"
      @close="selectedPropertyId = null"
      :title="selectedProp?.name || 'Детали объекта'"
      class-name="max-w-2xl"
    >
      <div v-if="selectedProp">
        <Tabs :tabs="tabs">
          <template #basic>
            <div class="space-y-6">
              <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                  <label class="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Название</label>
                  <input
                    type="text"
                    id="propName"
                    :value="selectedProp.name"
                    class="w-full mt-2 px-4 py-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label class="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Тип объекта</label>
                  <input
                    type="text"
                    :value="selectedProp.type || selectedProp.kind"
                    class="w-full mt-2 px-4 py-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    disabled
                  />
                </div>
                <div>
                  <label class="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Дестинация</label>
                  <input
                    type="text"
                    :value="getDestinationById(selectedProp.destinationArea?.id || selectedProp.destinationAreaId)?.name || 'Кыргызстан'"
                    class="w-full mt-2 px-4 py-3 border border-border rounded-xl bg-muted/50 cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>
              <div>
                <label class="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Описание</label>
                <textarea
                  id="propDesc"
                  :value="selectedProp.description"
                  rows="4"
                  class="w-full mt-2 px-4 py-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                />
              </div>
              <Button class="w-full h-12 text-base font-bold shadow-lg shadow-primary/20" @click="() => {
                if (selectedProp) {
                  const name = (document.getElementById('propName') as HTMLInputElement).value
                  const desc = (document.getElementById('propDesc') as HTMLTextAreaElement).value
                  tourismStore.updateProperty(selectedProp.id, { name, description: desc, metadata: selectedProp.metadata || {} })
                }
              }">Сохранить изменения</Button>
            </div>
          </template>

          <template #photos>
            <div class="space-y-6">
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div 
                  v-for="img in propertyImages" 
                  :key="img.id"
                  class="relative aspect-square rounded-xl overflow-hidden border border-border group"
                >
                  <img :src="img.url" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button class="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur">
                      <Edit class="w-4 h-4" />
                    </button>
                    <button 
                      class="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-full text-white backdrop-blur"
                      @click="() => tourismStore.deletePropertyImage(selectedProp.id, img.id)"
                    >
                      <Plus class="w-4 h-4 rotate-45" />
                    </button>
                  </div>
                </div>
                <label class="border-2 border-dashed border-border rounded-xl aspect-square flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all cursor-pointer bg-muted/30">
                  <Plus class="w-8 h-8" />
                  <span class="text-xs mt-2 font-bold uppercase">Загрузить фото</span>
                  <input 
                    type="file" 
                    class="hidden" 
                    @change="(e: any) => {
                      const file = e.target.files[0]
                      if (file && selectedPropertyId) {
                        tourismStore.uploadPropertyImage(selectedPropertyId, file)
                      }
                    }" 
                  />
                </label>
              </div>
              <div class="bg-primary/5 border border-primary/10 rounded-xl p-4 text-sm text-primary">
                <p class="font-bold">Совет:</p>
                <p>Качественные фотографии (соотношение 16:9) значительно увеличивают конверсию бронирований.</p>
              </div>
            </div>
          </template>
          <template #units>
            <div class="space-y-4">
              <div v-for="unit in unitTypes" :key="unit.id" class="flex flex-col gap-4 p-5 border border-border rounded-2xl bg-muted/20 hover:bg-muted/40 transition-colors">
                <div class="flex items-start gap-5">
                  <div class="relative w-28 h-28 rounded-2xl overflow-hidden group shadow-md">
                    <img
                      :src="unit.imageUrl || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'"
                      :alt="unit.name"
                      class="w-full h-full object-cover"
                    />
                    <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-[2px]">
                      <Edit class="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div class="flex-1">
                    <div class="flex justify-between">
                      <h4 class="font-bold text-xl">{{ unit.name }}</h4>
                      <span class="text-xs font-bold uppercase px-2 py-1 bg-primary/10 text-primary rounded-md">{{ unit.kind }}</span>
                    </div>
                    <div class="mt-3 flex gap-3">
                      <div class="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Взрослых: {{ unit.capacityAdults }}
                      </div>
                      <div class="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Детей: {{ unit.capacityChildren }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex gap-3 pt-2">
                  <div class="flex-1">
                    <input 
                      type="text" 
                      v-model="unit.imageUrl" 
                      class="w-full px-4 py-2 border border-border rounded-xl text-sm bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="Вставьте ссылку на картинку..."
                    />
                  </div>
                  <Button variant="outline" class="font-bold">Обновить фото</Button>
                </div>
              </div>
              <Button variant="outline" class="w-full h-12 border-2 border-dashed font-bold border-border hover:border-primary hover:text-primary transition-all">
                <Plus class="w-5 h-5 mr-2" />
                Создать новый юнит
              </Button>
            </div>
          </template>
          <template #services>
            <div class="p-4 space-y-3">
              <div v-for="service in services" :key="service.id" class="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
                <div>
                  <p class="font-medium text-sm">{{ service.name }}</p>
                  <p class="text-xs text-muted-foreground">{{ service.description }}</p>
                </div>
                <div class="text-right">
                  <p class="font-medium text-sm">{{ service.price || service.retailPrice || 0 }} {{ service.currency || 'KGS' }}</p>
                  <p class="text-xs text-muted-foreground">{{ service.durationMinutes }} мин</p>
                </div>
              </div>
              <div v-if="services.length === 0" class="text-center py-6 text-muted-foreground border border-dashed rounded-lg bg-muted/20">
                Нет доступных услуг.
              </div>
              <Button variant="outline" class="w-full font-bold h-12 border-2 border-dashed" @click="isAddServiceModalOpen = true">
                <Plus class="w-5 h-5 mr-2" />
                Добавить услугу
              </Button>
            </div>
          </template>
          <template #amenities>
            <div class="space-y-6">
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                <label v-for="amenity in predefinedAmenities" :key="amenity" class="flex items-center gap-3 p-3 border border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                  <input 
                    type="checkbox" 
                    :checked="(selectedProp.amenities || []).includes(amenity)"
                    @change="toggleAmenity(amenity)"
                    class="w-5 h-5 rounded border-border text-primary focus:ring-primary/20"
                  />
                  <span class="text-sm font-medium">{{ amenity }}</span>
                </label>
              </div>
              <hr class="border-border" />
              <div class="flex flex-wrap gap-2.5">
                <div 
                  v-for="(amenity, i) in selectedProp.amenities || []" 
                  :key="i" 
                  class="px-4 py-2 bg-primary/5 text-primary border border-primary/10 rounded-xl text-sm font-semibold flex items-center gap-3 group hover:bg-primary/10 transition-colors"
                >
                  {{ amenity }}
                  <button type="button" @click="toggleAmenity(amenity)" class="text-primary/40 hover:text-primary transition-colors">
                    <Plus class="w-4 h-4 rotate-45" />
                  </button>
                </div>
              </div>
              <div class="flex gap-2 mt-4">
                <input type="text" id="customAmenity" class="flex-1 px-4 py-2 border border-border rounded-xl bg-background outline-none focus:ring-2 focus:ring-primary/20" placeholder="Свое удобство (например, трансфер)" />
                <Button variant="outline" class="font-bold" @click="() => {
                  const el = document.getElementById('customAmenity') as HTMLInputElement
                  if (el && el.value) {
                    if (!(selectedProp.amenities || []).includes(el.value)) toggleAmenity(el.value)
                    el.value = ''
                  }
                }">Добавить</Button>
              </div>
              <Button class="w-full h-12 mt-4 text-base font-bold shadow-lg shadow-primary/20" @click="() => {
                if (selectedProp) {
                  tourismStore.updateProperty(selectedProp.id, { metadata: selectedProp.metadata || {} })
                }
              }">Сохранить удобства</Button>
            </div>
          </template>
        </Tabs>
      </div>
    </Modal>

    <!-- Add Property Modal -->
    <Modal
      :is-open="isAddModalOpen"
      @close="isAddModalOpen = false"
      title="Добавить новый объект"
      class-name="max-w-xl"
    >
      <div class="p-4 space-y-4">
        <div>
          <label class="text-sm font-medium">Название</label>
          <input type="text" class="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background" placeholder="например, Гостевой дом Алай" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium">Тип</label>
            <select class="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background">
              <option>Юрточный лагерь</option>
              <option>Гостевой дом</option>
              <option>Отель</option>
              <option>Rest Point</option>
            </select>
          </div>
          <div>
            <label class="text-sm font-medium">Дестинация</label>
            <select class="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background">
              <option>Иссык-Куль</option>
              <option>Ала-Арча</option>
              <option>Сон-Куль</option>
              <option>Каракол</option>
            </select>
          </div>
        </div>
        <div>
          <label class="text-sm font-medium">Описание</label>
          <textarea rows="3" class="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background resize-none" placeholder="Опишите ваше жилье..."></textarea>
        </div>
        <div>
          <label class="text-sm font-medium">Ссылка на картинку</label>
          <input type="text" class="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background" placeholder="https://images.unsplash.com/..." />
        </div>
        <div class="flex gap-3 pt-2">
          <Button variant="outline" class="flex-1" @click="isAddModalOpen = false">Отмена</Button>
          <Button class="flex-1" @click="isAddModalOpen = false">Создать</Button>
        </div>
      </div>
    </Modal>

    <!-- Add Service Modal -->
    <Modal
      :is-open="isAddServiceModalOpen"
      @close="isAddServiceModalOpen = false"
      title="Добавить услугу"
      class-name="max-w-md"
    >
      <div class="p-4 space-y-4">
        <div>
          <label class="text-sm font-medium">Название услуги</label>
          <input type="text" v-model="newService.name" class="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background" placeholder="например, Трансфер" />
        </div>
        <div>
          <label class="text-sm font-medium">Описание</label>
          <textarea rows="2" v-model="newService.description" class="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background resize-none" placeholder="Краткое описание..."></textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium">Стоимость (KGS)</label>
            <input type="number" v-model="newService.price" class="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background" />
          </div>
          <div>
            <label class="text-sm font-medium">Продолжительность (мин)</label>
            <input type="number" v-model="newService.durationMinutes" class="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background" />
          </div>
        </div>
        <div class="flex gap-3 pt-2">
          <Button variant="outline" class="flex-1" @click="isAddServiceModalOpen = false">Отмена</Button>
          <Button class="flex-1" @click="async () => {
            if (selectedProp) {
              await tourismStore.createExperience({
                ...newService,
                currency: 'KGS',
                destinationAreaId: selectedProp.destinationArea?.id || selectedProp.destinationAreaId,
              })
              isAddServiceModalOpen = false
              tourismStore.loadExperiences({ partnerId: selectedProp.partnerId || selectedProp.partner_id })
              newService.name = ''
              newService.description = ''
              newService.price = 0
              newService.durationMinutes = 60
            }
          }">Добавить</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
