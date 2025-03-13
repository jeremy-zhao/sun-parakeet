export default {
  plugins: {
    'postcss-import': {},
    tailwindcss: {},
    'tailwindcss/nesting': 'postcss-nesting',
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
  },
}
