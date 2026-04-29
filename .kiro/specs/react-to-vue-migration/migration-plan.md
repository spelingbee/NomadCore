# Детальный план миграции React/Next.js на Vue/Nuxt

## Обзор проекта

**Текущий стек:**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Radix UI
- React Hook Form
- React Context/Redux

**Целевой стек:**
- Nuxt 3
- Vue 3
- TypeScript
- Tailwind CSS
- Radix Vue
- VeeValidate
- Pinia

**Масштаб:**
- 3 основных приложения (Admin, Partner, Traveler)
- ~115 React компонентов
- ~57 UI компонентов
- ~11 Shared компонентов
- ~2 React хука
- PostgreSQL база данных

---

## Фаза 1: Подготовка и планирование (1-2 недели)

### 1.1 Аудит текущего кода
- [ ] Провести полный аудит всех React компонентов
- [ ] Классифицировать компоненты по типам (UI, Screen, Shared, App)
- [ ] Идентифицировать все зависимости и их использование
- [ ] Создать матрицу зависимостей компонентов
- [ ] Документировать все React хуки и их использование
- [ ] Идентифицировать все состояния и их управление

### 1.2 Подготовка инфраструктуры
- [ ] Создать новую ветку `vue-migration` в git
- [ ] Настроить Nuxt 3 проект с базовой конфигурацией
- [ ] Установить все необходимые зависимости (Pinia, VeeValidate, Radix Vue и т.д.)
- [ ] Настроить TypeScript конфигурацию для Vue 3
- [ ] Настроить Tailwind CSS для Vue компонентов
- [ ] Создать структуру папок для Vue компонентов

### 1.3 Создание миграционного гайда
- [ ] Написать гайд по миграции React компонентов на Vue
- [ ] Создать примеры для каждого типа компонента
- [ ] Документировать паттерны и best practices
- [ ] Создать шаблоны для быстрого создания компонентов

### 1.4 Настройка тестирования
- [ ] Установить Vitest для unit тестов
- [ ] Установить Vue Test Utils для тестирования компонентов
- [ ] Установить Playwright или Cypress для e2e тестов
- [ ] Создать базовые тестовые конфигурации

---

## Фаза 2: Миграция базовой инфраструктуры (2-3 недели)

### 2.1 Миграция утилит и хелперов
- [ ] Переписать все утилиты из `/react/lib` на TypeScript без React зависимостей
- [ ] Переместить утилиты в `/utils`
- [ ] Обновить импорты во всех файлах
- [ ] Написать unit тесты для утилит

**Примеры утилит:**
- `cn()` - функция для объединения CSS классов
- `formatDate()` - форматирование дат
- `formatCurrency()` - форматирование валют
- `parseJSON()` - парсинг JSON
- Другие хелперы

### 2.2 Миграция React хуков на composables
- [ ] Переписать `useIsMobile()` на composable
- [ ] Переписать `useToast()` на composable
- [ ] Создать другие необходимые composables
- [ ] Разместить composables в `/composables`
- [ ] Написать unit тесты для composables

**Пример миграции `useIsMobile`:**

```typescript
// React версия
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: 767px)`)
    const onChange = () => setIsMobile(window.innerWidth < 768)
    mql.addEventListener('change', onChange)
    setIsMobile(window.innerWidth < 768)
    return () => mql.removeEventListener('change', onChange)
  }, [])
  return !!isMobile
}

// Vue версия
export function useIsMobile() {
  const isMobile = ref<boolean | undefined>(undefined)
  
  onMounted(() => {
    const mql = window.matchMedia(`(max-width: 767px)`)
    const onChange = () => {
      isMobile.value = window.innerWidth < 768
    }
    mql.addEventListener('change', onChange)
    isMobile.value = window.innerWidth < 768
    onUnmounted(() => mql.removeEventListener('change', onChange))
  })
  
  return computed(() => !!isMobile.value)
}
```

### 2.3 Настройка Pinia для управления состоянием
- [ ] Создать структуру stores в `/stores`
- [ ] Создать базовые stores для каждого модуля (auth, user, bookings и т.д.)
- [ ] Настроить Pinia плагины (persistence и т.д.)
- [ ] Написать unit тесты для stores

**Структура stores:**
```
/stores
  /auth.ts
  /user.ts
  /bookings.ts
  /properties.ts
  /reviews.ts
  /notifications.ts
  /channels.ts
  /inventory.ts
```

### 2.4 Настройка VeeValidate для валидации форм
- [ ] Установить и настроить VeeValidate
- [ ] Создать кастомные валидаторы
- [ ] Создать composable для работы с формами
- [ ] Написать примеры использования

---

## Фаза 3: Миграция UI компонентов (3-4 недели)

### 3.1 Миграция базовых UI компонентов (Приоритет 1)
Начать с компонентов, которые не зависят от других компонентов:

- [ ] Button
- [ ] Input
- [ ] Label
- [ ] Card
- [ ] Badge
- [ ] Separator
- [ ] Skeleton
- [ ] Spinner
- [ ] Alert
- [ ] Toast/Toaster

**Пример миграции Button компонента:**

```vue
<!-- React версия (button.tsx) -->
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-white hover:bg-destructive/90',
        outline: 'border bg-background shadow-xs hover:bg-accent',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3',
        lg: 'h-10 rounded-md px-6',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

<!-- Vue версия (Button.vue) -->
<template>
  <component
    :is="asChild ? 'div' : 'button'"
    :class="buttonVariants({ variant, size, class: $attrs.class })"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-white hover:bg-destructive/90',
        outline: 'border bg-background shadow-xs hover:bg-accent',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3',
        lg: 'h-10 rounded-md px-6',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

interface Props extends VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  asChild: false,
})
</script>
```

### 3.2 Миграция Radix UI компонентов на Radix Vue (Приоритет 2)
Компоненты, которые используют Radix примитивы:

- [ ] Dialog
- [ ] AlertDialog
- [ ] Dropdown Menu
- [ ] Context Menu
- [ ] Popover
- [ ] Tooltip
- [ ] Tabs
- [ ] Accordion
- [ ] Collapsible
- [ ] Select
- [ ] Checkbox
- [ ] Radio Group
- [ ] Switch
- [ ] Slider
- [ ] Toggle
- [ ] Toggle Group
- [ ] Scroll Area
- [ ] Hover Card
- [ ] Command
- [ ] Calendar
- [ ] Date Picker (если используется)

### 3.3 Миграция сложных UI компонентов (Приоритет 3)
Компоненты, которые зависят от других компонентов:

- [ ] Form
- [ ] Input Group
- [ ] Field
- [ ] Data Table
- [ ] Pagination
- [ ] Breadcrumb
- [ ] Navigation Menu
- [ ] Sidebar
- [ ] Sheet
- [ ] Drawer
- [ ] Carousel
- [ ] Chart
- [ ] Resizable
- [ ] Menubar
- [ ] Progress
- [ ] Aspect Ratio
- [ ] Avatar
- [ ] Kbd
- [ ] Item
- [ ] Empty
- [ ] Input OTP
- [ ] Button Group

---

## Фаза 4: Миграция Shared компонентов (2-3 недели)

### 4.1 Миграция Shared компонентов
- [ ] Badges
- [ ] DataTable
- [ ] Drawer
- [ ] EmptyState
- [ ] InsightCard
- [ ] MapPlaceholder
- [ ] Modal
- [ ] ReviewCard
- [ ] SectionHeader
- [ ] StatCard
- [ ] Tabs

**Пример миграции Shared компонента (StatCard):**

```vue
<!-- React версия (stat-card.tsx) -->
export function StatCard({ title, value, change, icon }: StatCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {change && (
            <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
    </div>
  )
}

<!-- Vue версия (StatCard.vue) -->
<template>
  <div class="rounded-lg border bg-card p-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-muted-foreground">{{ title }}</p>
        <p class="text-2xl font-bold">{{ value }}</p>
        <p v-if="change" :class="change > 0 ? 'text-green-600' : 'text-red-600'" class="text-sm">
          {{ change > 0 ? '+' : '' }}{{ change }}%
        </p>
      </div>
      <div v-if="$slots.icon" class="text-muted-foreground">
        <slot name="icon" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: string | number
  change?: number
}

defineProps<Props>()
</script>
```

---

## Фаза 5: Миграция Screen компонентов (4-5 недель)

### 5.1 Миграция Admin Screen компонентов
- [ ] OverviewScreen
- [ ] DestinationsScreen
- [ ] InfrastructureScreen
- [ ] PartnersScreen
- [ ] ChannelsScreen
- [ ] InsightsScreen

### 5.2 Миграция Partner Screen компонентов
- [ ] OverviewScreen
- [ ] BookingsScreen
- [ ] ChannelsScreen
- [ ] InventoryScreen
- [ ] NotificationsScreen
- [ ] PackagesScreen
- [ ] PropertiesScreen
- [ ] ReviewsScreen

### 5.3 Миграция Traveler Screen компонентов
- [ ] HomeScreen
- [ ] SearchScreen
- [ ] DestinationScreen
- [ ] PropertyScreen
- [ ] PackageScreen
- [ ] BookingsScreen
- [ ] ProfileScreen

### 5.4 Миграция Card компонентов (Traveler)
- [ ] DestinationCard
- [ ] PropertyCard
- [ ] PackageCard
- [ ] ExperienceCard
- [ ] BookingComponents

---

## Фаза 6: Миграция App компонентов (2-3 недели)

### 6.1 Миграция AdminApp
- [ ] Переписать AdminApp на Vue
- [ ] Настроить навигацию между экранами
- [ ] Интегрировать Pinia для управления состоянием
- [ ] Написать тесты

### 6.2 Миграция PartnerApp
- [ ] Переписать PartnerApp на Vue
- [ ] Настроить навигацию между экранами
- [ ] Интегрировать Pinia для управления состоянием
- [ ] Написать тесты

### 6.3 Миграция TravelerApp
- [ ] Переписать TravelerApp на Vue
- [ ] Настроить навигацию между экранами
- [ ] Интегрировать Pinia для управления состоянием
- [ ] Написать тесты

### 6.4 Миграция Layout компонентов
- [ ] AdminLayout
- [ ] PartnerLayout
- [ ] TravelerLayout

---

## Фаза 7: Интеграция и тестирование (2-3 недели)

### 7.1 Интеграция с API
- [ ] Обновить API клиент для работы с Vue
- [ ] Интегрировать API вызовы в Pinia stores
- [ ] Написать integration тесты

### 7.2 Тестирование функциональности
- [ ] Написать unit тесты для всех компонентов
- [ ] Написать integration тесты для экранов
- [ ] Написать e2e тесты для пользовательских сценариев
- [ ] Провести регрессионное тестирование

### 7.3 Оптимизация производительности
- [ ] Провести аудит производительности
- [ ] Оптимизировать bundle size
- [ ] Оптимизировать рендеринг компонентов
- [ ] Настроить кэширование

### 7.4 Документирование
- [ ] Написать документацию по новому коду
- [ ] Создать гайды для разработчиков
- [ ] Документировать известные проблемы и их решения

---

## Фаза 8: Развёртывание и миграция (1-2 недели)

### 8.1 Подготовка к развёртыванию
- [ ] Настроить CI/CD для Vue приложения
- [ ] Настроить окружение для production
- [ ] Провести финальное тестирование

### 8.2 Развёртывание
- [ ] Развернуть Vue приложение на staging
- [ ] Провести UAT тестирование
- [ ] Развернуть на production

### 8.3 Постмиграционные работы
- [ ] Удалить React код
- [ ] Очистить зависимости
- [ ] Архивировать старый код
- [ ] Обновить документацию

---

## Временная шкала

| Фаза | Описание | Длительность | Сроки |
|------|---------|--------------|-------|
| 1 | Подготовка и планирование | 1-2 недели | Неделя 1-2 |
| 2 | Миграция базовой инфраструктуры | 2-3 недели | Неделя 3-5 |
| 3 | Миграция UI компонентов | 3-4 недели | Неделя 6-9 |
| 4 | Миграция Shared компонентов | 2-3 недели | Неделя 10-12 |
| 5 | Миграция Screen компонентов | 4-5 недель | Неделя 13-17 |
| 6 | Миграция App компонентов | 2-3 недели | Неделя 18-20 |
| 7 | Интеграция и тестирование | 2-3 недели | Неделя 21-23 |
| 8 | Развёртывание и миграция | 1-2 недели | Неделя 24-25 |
| **ИТОГО** | | **18-25 недель** | **~6 месяцев** |

---

## Ресурсы и команда

### Рекомендуемый состав команды
- 1-2 Senior Vue разработчика (лидеры миграции)
- 2-3 Middle Vue разработчика (основная работа)
- 1 QA инженер (тестирование)
- 1 DevOps инженер (CI/CD, развёртывание)

### Инструменты и технологии
- **IDE**: VS Code с расширениями для Vue
- **Версионирование**: Git с GitHub/GitLab
- **CI/CD**: GitHub Actions / GitLab CI
- **Тестирование**: Vitest, Vue Test Utils, Playwright
- **Мониторинг**: Sentry для отслеживания ошибок
- **Документирование**: Markdown, Notion или Confluence

---

## Риски и смягчение

### Риск 1: Потеря функциональности
**Вероятность**: Средняя | **Влияние**: Высокое
- **Смягчение**: Написать comprehensive тесты, провести регрессионное тестирование, параллельное тестирование React и Vue версий

### Риск 2: Задержки в разработке
**Вероятность**: Средняя | **Влияние**: Среднее
- **Смягчение**: Четкое планирование, регулярные встречи, использование agile методологии

### Риск 3: Проблемы совместимости библиотек
**Вероятность**: Низкая | **Влияние**: Высокое
- **Смягчение**: Ранее тестирование всех зависимостей, использование проверенных версий

### Риск 4: Производительность Vue приложения
**Вероятность**: Низкая | **Влияние**: Среднее
- **Смягчение**: Регулярный аудит производительности, оптимизация bundle size, использование lazy loading

---

## Критерии успеха

1. ✅ Все 115 React компонентов успешно мигрированы на Vue
2. ✅ Все функции работают идентично оригинальному React приложению
3. ✅ Все тесты проходят (unit, integration, e2e)
4. ✅ Производительность не деградирует (bundle size, load time)
5. ✅ Документация полная и актуальная
6. ✅ Команда обучена работе с Vue/Nuxt
7. ✅ Production развёртывание успешно
8. ✅ Нет критичных багов в production

---

## Дополнительные ресурсы

- [Vue 3 Documentation](https://vuejs.org/)
- [Nuxt 3 Documentation](https://nuxt.com/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [VeeValidate Documentation](https://vee-validate.logaretm.com/)
- [Radix Vue Documentation](https://www.radix-vue.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

