import safeArea from 'tailwindcss-safe-area'

export default {
  corePlugins: {
    textOpacity: false,
    borderOpacity: false,
    backgroundOpacity: false,
  },
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: { extend: {} },
  plugins: [safeArea],
  darkMode: 'class',
}
