export default {
  plugins: {
    'postcss-import': {},
    tailwindcss: {},
    'tailwindcss/nesting': 'postcss-nesting',
    autoprefixer: {},
    'postcss-inline-svg': {
      paths: ['./src/lib/icons'],
    },
    cssnano: {
      preset: ['default', { calc: false }],
    },
  },
}
