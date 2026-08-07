import type { Config } from 'tailwindcss'

/**
 * Tailwind читает те же переменные, что и примитивы. Литералов цвета и кегля
 * в утилитах нет — иначе система разъезжается на второй неделе.
 * Подключение: presets: [ncPreset] в tailwind.config.ts.
 */
export const ncPreset: Partial<Config> = {
  theme: {
    /* spacing задан целиком, а не через extend: иначе рядом живут родная
       шкала Tailwind (p-4 = 16px) и наша (space-4 = 4px) — гарантированная
       путаница. Имя утилиты равно числу пикселей. */
    spacing: {
      0: '0', 2: 'var(--nc-space-2)', 4: 'var(--nc-space-4)', 8: 'var(--nc-space-8)',
      12: 'var(--nc-space-12)', 16: 'var(--nc-space-16)', 24: 'var(--nc-space-24)',
      32: 'var(--nc-space-32)', 48: 'var(--nc-space-48)'
    },
    extend: {
      colors: {
        canvas: 'var(--nc-bg-canvas)',
        surface: 'var(--nc-bg-surface)',
        sunken: 'var(--nc-bg-sunken)',
        band: 'var(--nc-bg-band)',
        primary: 'var(--nc-text-primary)',
        secondary: 'var(--nc-text-secondary)',
        tertiary: 'var(--nc-text-tertiary)',
        line: 'var(--nc-border-line)',
        hair: 'var(--nc-border-hair)',
        strong: 'var(--nc-border-strong)',
        hold: 'var(--nc-status-hold)',
        confirmed: 'var(--nc-status-confirmed)',
        inhouse: 'var(--nc-status-inhouse)',
        danger: 'var(--nc-action-danger-fg)'
      },
      fontSize: {
        100: ['var(--nc-fs-100)', 'var(--nc-lh-100)'],
        200: ['var(--nc-fs-200)', 'var(--nc-lh-200)'],
        300: ['var(--nc-fs-300)', 'var(--nc-lh-300)'],
        400: ['var(--nc-fs-400)', 'var(--nc-lh-400)'],
        500: ['var(--nc-fs-500)', 'var(--nc-lh-500)'],
        600: ['var(--nc-fs-600)', 'var(--nc-lh-600)'],
        700: ['var(--nc-fs-700)', 'var(--nc-lh-700)']
      },
      borderRadius: {
        sm: 'var(--nc-radius-sm)', md: 'var(--nc-radius-md)',
        lg: 'var(--nc-radius-lg)', pill: 'var(--nc-radius-pill)'
      },
      minHeight: {
        touch: 'var(--nc-touch-min)',
        action: 'var(--nc-touch-action)',
        primary: 'var(--nc-touch-primary)'
      },
      minWidth: { touch: 'var(--nc-touch-min)' },
      transitionDuration: { state: 'var(--nc-motion-state)' }
    }
  }
}
export default ncPreset
