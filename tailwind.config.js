/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Point the utility colours at the same tokens the inline styles use, so
      // a class like `text-muted` flips with the theme instead of pinning the
      // dark palette. `<alpha-value>` keeps the /10, /25, /30 modifiers working.
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface-raised)',
        border: 'var(--border)',
        accent: 'rgb(var(--accent-rgb) / <alpha-value>)',
        muted: 'var(--text-muted)',
        // Named for the role it plays — a wash lifting away from the page
        // background. White on dark, black on light.
        overlay: 'rgb(var(--overlay-rgb) / <alpha-value>)',
        strong: 'var(--text)',
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
