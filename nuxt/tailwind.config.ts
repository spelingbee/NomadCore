import type { Config } from 'tailwindcss'
import { ncPreset } from './design-system/tailwind-preset'

// Никаких литералов цвета и кегля здесь: единственный источник — tokens.css,
// который preset читает через var(--nc-*).
export default <Partial<Config>>{
  presets: [ncPreset],
  content: ['./components/**/*.vue', './pages/**/*.vue', './composables/**/*.ts'],
  corePlugins: { preflight: true }
}
