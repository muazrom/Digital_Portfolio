/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0a',
        surface: '#1a1a1a',
        border: '#2a2a2a',
        accent: '#2563eb',
        muted: '#a0a0a0',
        // Console severity palette. These hexes were already scattered as
        // literals across the section components; naming them here is what
        // makes an LED, a status chip and a rail node agree on what "ok" is.
        ok: '#22c55e',
        warn: '#f59e0b',
        crit: '#ef4444',
        idle: '#9ca3af',
        panel: '#0f0f0f',
        line: '#232323',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
