/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // RGB-channel CSS vars + <alpha-value> so bg-dark-800/40 opacity modifiers work
        dark: {
          900: 'rgb(var(--surface-900) / <alpha-value>)',
          800: 'rgb(var(--surface-800) / <alpha-value>)',
          700: 'rgb(var(--surface-700) / <alpha-value>)',
          600: 'rgb(var(--surface-600) / <alpha-value>)',
          500: 'rgb(var(--surface-500) / <alpha-value>)',
        },
        // Gray text — no opacity modifiers used, plain var() is fine
        gray: {
          100: 'var(--tx-100)',
          200: 'var(--tx-200)',
          300: 'var(--tx-300)',
          400: 'var(--tx-400)',
          500: 'var(--tx-500)',
          600: 'var(--tx-600)',
          700: 'var(--tx-700)',
          800: 'var(--tx-800)',
          900: 'var(--tx-900)',
        },
        threat: {
          safe:     '#22c55e',
          low:      '#eab308',
          medium:   '#f97316',
          high:     '#ef4444',
          critical: '#dc2626',
        },
      },
    },
  },
  plugins: [],
}
