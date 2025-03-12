import safeArea from 'tailwindcss-safe-area'

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  plugins: [safeArea],
  darkMode: 'class',
}
