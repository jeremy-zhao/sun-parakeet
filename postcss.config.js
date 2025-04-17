export default {
  plugins: {
    'postcss-import': {},
    tailwindcss: {},
    'tailwindcss/nesting': 'postcss-nesting',
    autoprefixer: {},
    cssnano: {
      preset: ['default', { calc: false }],
    },
  },
}
