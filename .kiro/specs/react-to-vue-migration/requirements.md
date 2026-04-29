# Требования к миграции React/Next.js на Vue/Nuxt

## Введение

Миграция туристического маркетплейса NomadCore с React 19 + Next.js 16 на Vue 3 + Nuxt 3. Проект состоит из трёх основных приложений (Admin, Partner, Traveler) с ~115 React компонентами, которые необходимо переписать на Vue 3 Composition API с сохранением всей функциональности и структуры.

## Глоссарий

- **React_Component**: Компонент, написанный на React с использованием JSX синтаксиса
- **Vue_Component**: Компонент, написанный на Vue 3 с использованием Single File Component (SFC) синтаксиса
- **Composition_API**: Vue 3 API для создания компонентов с использованием функций вместо объектов
- **Radix_UI**: React компонентная библиотека с примитивами доступности
- **Radix_Vue**: Vue 3 версия Radix UI с теми же примитивами доступности
- **Composable**: Vue 3 функция для переиспользования логики (аналог React Hook)
- **Pinia**: State management библиотека для Vue 3 (аналог Redux/Context API)
- **VeeValidate**: Библиотека валидации форм для Vue 3 (аналог React Hook Form)
- **TypeScript**: Язык программирования с типизацией, используется в обоих стеках
- **Tailwind_CSS**: Утилитарный CSS фреймворк, сохраняется в обоих стеках
- **Admin_App**: Приложение администратора для управления платформой
- **Partner_App**: Приложение партнёра для управления своими объектами и бронированиями
- **Traveler_App**: Приложение путешественника для поиска и бронирования
- **UI_Components**: Базовые компоненты интерфейса (Button, Input, Dialog и т.д.)
- **Screen_Components**: Полноэкранные компоненты для каждого раздела приложения
- **Shared_Components**: Переиспользуемые компоненты, используемые несколькими приложениями
- **React_Hook**: Функция для переиспользования логики в React (useState, useEffect и т.д.)
- **State_Management**: Система управления состоянием приложения
- **Form_Validation**: Система валидации данных форм

## Требования

### Требование 1: Миграция структуры проекта

**User Story:** Как разработчик, я хочу сохранить структуру папок проекта, чтобы облегчить навигацию и поддержку кода.

#### Acceptance Criteria

1. WHEN проект мигрирует на Nuxt 3, THE Project_Structure SHALL сохранить иерархию папок: `/components/admin`, `/components/partner`, `/components/traveler`, `/components/shared`, `/components/ui`
2. WHEN компоненты переписываются на Vue, THE File_Names SHALL остаться идентичными (например, `admin-app.tsx` → `admin-app.vue`)
3. WHEN структура папок создаётся, THE Directory_Layout SHALL соответствовать Nuxt 3 конвенциям с папками `/components`, `/pages`, `/composables`, `/stores`, `/utils`
4. WHILE миграция выполняется, THE Original_React_Code SHALL оставаться в папке `/react` для справки и постепенного удаления
5. WHERE необходимо, THE Shared_Utilities SHALL быть перемещены в `/utils` и переписаны на TypeScript без зависимостей от React

### Требование 2: Миграция UI компонентов на Radix Vue

**User Story:** Как разработчик, я хочу переписать 57 UI компонентов на Radix Vue, чтобы сохранить доступность и функциональность.

#### Acceptance Criteria

1. WHEN UI компонент мигрирует, THE Radix_Vue_Component SHALL заменить Radix_UI_React компонент с сохранением всех props и функциональности
2. WHEN компонент использует `@radix-ui/react-*` пакеты, THE Migration SHALL заменить их на `radix-vue` пакет
3. WHEN компонент имеет TypeScript типы, THE Types SHALL быть обновлены для Vue 3 Composition API
4. WHEN компонент использует `cva` (class-variance-authority), THE Styling SHALL сохранить все варианты и размеры
5. WHILE компоненты переписываются, THE Tailwind_CSS_Classes SHALL остаться идентичными для сохранения стилей
6. IF компонент использует `Slot` из Radix UI, THEN THE Component SHALL использовать Vue 3 `<slot>` с поддержкой именованных слотов

### Требование 3: Переписать React хуки на Vue composables

**User Story:** Как разработчик, я хочу переписать все React хуки на Vue composables, чтобы переиспользовать логику в Vue приложении.

#### Acceptance Criteria

1. WHEN React Hook (например, `useIsMobile`) мигрирует, THE Composable SHALL быть создан в `/composables` с идентичной функциональностью
2. WHEN composable использует `useState`, THE State SHALL быть реализован через `ref()` или `reactive()`
3. WHEN composable использует `useEffect`, THE Side_Effects SHALL быть реализованы через `watch()` или `onMounted()`
4. WHEN composable возвращает значение, THE Return_Type SHALL быть типизирован через TypeScript interface
5. WHILE composable создаётся, THE Logic SHALL быть идентична оригинальному React Hook без изменения поведения
6. WHERE composable использует window API, THE Composable SHALL проверять наличие window объекта для SSR совместимости

### Требование 4: Миграция управления состоянием на Pinia

**User Story:** Как разработчик, я хочу мигрировать управление состоянием с React Context/Redux на Pinia, чтобы использовать Vue-native решение.

#### Acceptance Criteria

1. WHEN состояние приложения мигрирует, THE Pinia_Store SHALL быть создан для каждого основного модуля (auth, user, bookings, properties и т.д.)
2. WHEN React Context используется, THE Pinia_Store SHALL заменить его с сохранением всех actions и getters
3. WHEN Redux используется, THE Pinia_Store SHALL заменить reducers на actions и selectors на getters
4. WHEN store создаётся, THE Store_Structure SHALL следовать Pinia best practices с разделением state, getters, actions
5. WHILE store используется в компонентах, THE Component_Integration SHALL использовать `useStore()` composable для доступа к состоянию
6. IF состояние требует персистентности, THEN THE Store SHALL использовать `pinia-plugin-persistedstate` для сохранения в localStorage

### Требование 5: Миграция валидации форм на VeeValidate

**User Story:** Как разработчик, я хочу мигрировать валидацию форм с React Hook Form на VeeValidate, чтобы использовать Vue-native решение.

#### Acceptance Criteria

1. WHEN форма использует React Hook Form, THE VeeValidate_Form SHALL заменить её с сохранением всех правил валидации
2. WHEN правило валидации определено, THE Validation_Rule SHALL быть переписано на VeeValidate синтаксис (например, `required`, `email`, `minLength`)
3. WHEN форма отправляется, THE Form_Submission SHALL использовать `handleSubmit` из VeeValidate с идентичной логикой
4. WHILE форма валидируется, THE Error_Messages SHALL отображаться в тех же местах с тем же стилем
5. WHERE форма использует кастомные валидаторы, THE Custom_Validators SHALL быть переписаны как функции VeeValidate
6. IF форма использует асинхронную валидацию, THEN THE Async_Validation SHALL быть реализована через VeeValidate async validators

### Требование 6: Переписать React компоненты на Vue 3 Composition API

**User Story:** Как разработчик, я хочу переписать все ~115 React компонентов на Vue 3 Composition API, чтобы использовать Vue-native синтаксис.

#### Acceptance Criteria

1. WHEN React компонент переписывается, THE Vue_Component SHALL использовать Single File Component (SFC) синтаксис с `<template>`, `<script setup>`, `<style scoped>`
2. WHEN компонент использует `useState`, THE State SHALL быть реализован через `ref()` или `reactive()`
3. WHEN компонент использует `useEffect`, THE Lifecycle SHALL быть реализован через `watch()`, `onMounted()`, `onUnmounted()`
4. WHEN компонент использует props, THE Props SHALL быть определены через `defineProps()` с TypeScript типами
5. WHEN компонент использует события, THE Events SHALL быть определены через `defineEmits()` с TypeScript типами
6. WHILE компонент переписывается, THE Component_Logic SHALL остаться идентична оригинальному React компоненту
7. IF компонент использует children/slots, THEN THE Slots SHALL быть реализованы через Vue 3 `<slot>` с поддержкой именованных слотов
8. WHERE компонент использует условный рендеринг, THE Conditional_Rendering SHALL использовать `v-if`, `v-else`, `v-show` директивы

### Требование 7: Миграция Admin приложения

**User Story:** Как администратор, я хочу, чтобы Admin приложение было полностью мигрировано на Vue/Nuxt, чтобы управлять платформой.

#### Acceptance Criteria

1. WHEN Admin приложение мигрирует, THE Admin_App SHALL содержать все 6 экранов: Overview, Destinations, Infrastructure, Partners, Channels, Insights
2. WHEN экран переписывается, THE Screen_Functionality SHALL остаться идентична оригинальному React экрану
3. WHEN Admin Layout используется, THE Layout_Components SHALL быть переписаны на Vue с сохранением навигации и структуры
4. WHILE Admin приложение работает, THE Page_Navigation SHALL использовать Vue Router для переключения между экранами
5. WHERE данные отображаются, THE Data_Display SHALL использовать компоненты из `/components/shared` (DataTable, StatCard, InsightCard и т.д.)
6. IF Admin приложение требует аутентификации, THEN THE Auth_Check SHALL быть реализован через middleware Nuxt

### Требование 8: Миграция Partner приложения

**User Story:** Как партнёр, я хочу, чтобы Partner приложение было полностью мигрировано на Vue/Nuxt, чтобы управлять своими объектами.

#### Acceptance Criteria

1. WHEN Partner приложение мигрирует, THE Partner_App SHALL содержать все 8 экранов: Overview, Bookings, Channels, Inventory, Notifications, Packages, Properties, Reviews
2. WHEN экран переписывается, THE Screen_Functionality SHALL остаться идентична оригинальному React экрану
3. WHEN Partner Layout используется, THE Layout_Components SHALL быть переписаны на Vue с сохранением навигации и структуры
4. WHILE Partner приложение работает, THE Page_Navigation SHALL использовать Vue Router для переключения между экранами
5. WHERE данные отображаются, THE Data_Display SHALL использовать компоненты из `/components/shared` и `/components/ui`
6. IF Partner приложение требует аутентификации, THEN THE Auth_Check SHALL быть реализован через middleware Nuxt

### Требование 9: Миграция Traveler приложения

**User Story:** Как путешественник, я хочу, чтобы Traveler приложение было полностью мигрировано на Vue/Nuxt, чтобы искать и бронировать.

#### Acceptance Criteria

1. WHEN Traveler приложение мигрирует, THE Traveler_App SHALL содержать все 7 экранов: Home, Search, Destination, Property, Package, Bookings, Profile
2. WHEN экран переписывается, THE Screen_Functionality SHALL остаться идентична оригинальному React экрану
3. WHEN Traveler Layout используется, THE Layout_Components SHALL быть переписаны на Vue с сохранением навигации и структуры
4. WHILE Traveler приложение работает, THE Page_Navigation SHALL использовать Vue Router для переключения между экранами
5. WHERE карточки отображаются, THE Card_Components SHALL использовать компоненты (DestinationCard, PropertyCard, PackageCard, ExperienceCard)
6. IF Traveler приложение требует аутентификации, THEN THE Auth_Check SHALL быть реализован через middleware Nuxt

### Требование 10: Миграция общих компонентов

**User Story:** Как разработчик, я хочу мигрировать все общие компоненты, чтобы они переиспользовались во всех приложениях.

#### Acceptance Criteria

1. WHEN общие компоненты мигрируют, THE Shared_Components SHALL включать: Badges, DataTable, Drawer, EmptyState, InsightCard, MapPlaceholder, Modal, ReviewCard, SectionHeader, StatCard, Tabs
2. WHEN компонент переписывается, THE Component_Props SHALL остаться идентичны оригинальному React компоненту
3. WHEN компонент используется, THE Component_Import SHALL быть автоматически разрешён через Nuxt auto-imports
4. WHILE компоненты используются, THE Component_Styling SHALL сохранить все Tailwind CSS классы
5. WHERE компоненты используют Radix примитивы, THE Radix_Vue_Integration SHALL быть правильно настроена

### Требование 11: Миграция утилит и хелперов

**User Story:** Как разработчик, я хочу мигрировать все утилиты и хелперы, чтобы они работали в Vue приложении.

#### Acceptance Criteria

1. WHEN утилиты мигрируют, THE Utils_Functions SHALL быть переписаны на TypeScript без зависимостей от React
2. WHEN функция используется, THE Function_Signature SHALL остаться идентична оригинальной функции
3. WHILE утилиты используются, THE Function_Logic SHALL остаться идентична оригинальной логике
4. WHERE утилиты используют React-специфичный код, THE Code SHALL быть переписано на vanilla JavaScript/TypeScript
5. IF утилита используется в нескольких местах, THEN THE Utility SHALL быть размещена в `/utils` для переиспользования

### Требование 12: Обновить зависимости проекта

**User Story:** Как разработчик, я хочу обновить зависимости проекта, чтобы использовать Vue/Nuxt стек.

#### Acceptance Criteria

1. WHEN зависимости обновляются, THE Package_Json SHALL содержать: `nuxt@^4.4.2`, `vue@^3.5.32`, `vue-router@^5.0.4`, `pinia@^2.x`, `vee-validate@^4.x`, `radix-vue@^1.x`, `tailwindcss@^3.x`
2. WHEN зависимости устанавливаются, THE Installation SHALL быть выполнена через `pnpm install`
3. WHILE зависимости используются, THE Version_Compatibility SHALL быть проверена для совместимости
4. WHERE React зависимости больше не нужны, THE Dependencies SHALL быть удалены из package.json
5. IF новые зависимости требуют конфигурации, THEN THE Configuration SHALL быть добавлена в `nuxt.config.ts`

### Требование 13: Настроить TypeScript конфигурацию

**User Story:** Как разработчик, я хочу настроить TypeScript для Vue/Nuxt, чтобы иметь правильную типизацию.

#### Acceptance Criteria

1. WHEN TypeScript конфигурируется, THE Tsconfig SHALL быть обновлена для Vue 3 и Nuxt 3
2. WHEN компоненты переписываются, THE Type_Checking SHALL быть включена для всех файлов
3. WHILE компоненты разрабатываются, THE IDE_Support SHALL работать корректно с автодополнением
4. WHERE типы определены, THE Type_Definitions SHALL быть правильно экспортированы
5. IF типы конфликтуют, THEN THE Conflicts SHALL быть разрешены через правильное определение типов

### Требование 14: Настроить Tailwind CSS для Vue/Nuxt

**User Story:** Как разработчик, я хочу настроить Tailwind CSS для Vue/Nuxt, чтобы сохранить все стили.

#### Acceptance Criteria

1. WHEN Tailwind CSS конфигурируется, THE Tailwind_Config SHALL быть обновлена для работы с Vue компонентами
2. WHEN компоненты переписываются, THE Tailwind_Classes SHALL остаться идентичны оригинальным классам
3. WHILE компоненты стилизуются, THE CSS_Purging SHALL работать корректно для удаления неиспользуемых стилей
4. WHERE кастомные цвета определены, THE Color_Palette SHALL остаться идентична оригинальной палитре
5. IF новые утилиты требуются, THEN THE Utilities SHALL быть добавлены в `tailwind.config.ts`

### Требование 15: Настроить Nuxt конфигурацию

**User Story:** Как разработчик, я хочу настроить Nuxt конфигурацию, чтобы приложение работало корректно.

#### Acceptance Criteria

1. WHEN Nuxt конфигурируется, THE Nuxt_Config SHALL включать: auto-imports для компонентов и composables, Tailwind CSS модуль, TypeScript поддержку
2. WHEN приложение запускается, THE Dev_Server SHALL работать на порту 3000 с hot module replacement
3. WHILE приложение разрабатывается, THE Build_Process SHALL быть оптимизирована для быстрой компиляции
4. WHERE маршруты определены, THE Vue_Router SHALL быть правильно настроена для навигации между приложениями
5. IF SSR требуется, THEN THE SSR_Configuration SHALL быть настроена в `nuxt.config.ts`

### Требование 16: Создать миграционный гайд для разработчиков

**User Story:** Как разработчик, я хочу иметь гайд по миграции, чтобы понимать процесс и лучшие практики.

#### Acceptance Criteria

1. WHEN гайд создаётся, THE Guide SHALL содержать примеры миграции для каждого типа компонента (UI, Screen, Shared)
2. WHEN разработчик читает гайд, THE Examples SHALL показывать React код и его Vue эквивалент
3. WHILE разработчик мигрирует компоненты, THE Best_Practices SHALL быть описаны для каждого паттерна
4. WHERE паттерны описаны, THE Patterns SHALL включать: props, events, slots, lifecycle, state management, form validation
5. IF разработчик встречает проблему, THEN THE Troubleshooting_Section SHALL содержать решения для частых проблем

### Требование 17: Создать тестовую стратегию для миграции

**User Story:** Как QA инженер, я хочу иметь тестовую стратегию, чтобы убедиться, что миграция не сломала функциональность.

#### Acceptance Criteria

1. WHEN тестовая стратегия создаётся, THE Strategy SHALL включать: unit тесты для компонентов, integration тесты для экранов, e2e тесты для пользовательских сценариев
2. WHEN компонент мигрирует, THE Unit_Tests SHALL быть переписаны на Vitest для Vue компонентов
3. WHILE компоненты тестируются, THE Test_Coverage SHALL быть минимум 80% для критичных компонентов
4. WHERE функциональность проверяется, THE Integration_Tests SHALL проверять взаимодействие между компонентами
5. IF пользовательский сценарий требует проверки, THEN THE E2E_Tests SHALL быть написаны на Playwright или Cypress

### Требование 18: Документировать процесс миграции

**User Story:** Как разработчик, я хочу иметь документацию по миграции, чтобы отслеживать прогресс и проблемы.

#### Acceptance Criteria

1. WHEN документация создаётся, THE Documentation SHALL содержать: список всех компонентов для миграции, статус каждого компонента, известные проблемы и их решения
2. WHEN компонент мигрирует, THE Status SHALL быть обновлена в документации (Not Started, In Progress, Completed, Blocked)
3. WHILE миграция выполняется, THE Issues SHALL быть задокументированы с описанием проблемы и решением
4. WHERE проблемы возникают, THE Troubleshooting_Log SHALL содержать решения для будущих разработчиков
5. IF новые паттерны обнаруживаются, THEN THE Patterns SHALL быть добавлены в документацию для переиспользования

