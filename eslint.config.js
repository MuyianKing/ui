import antfu from '@antfu/eslint-config'
import eslint from '@muyianking/config/eslint.config.js'

export default antfu({
  formatters: true,
  ignores: ['**/public/**'],
}, {
  rules: {
    ...eslint,
    'vue/custom-event-name-casing': 0,
  },
  files: ['**/src/**', '**/script/**', '**/packages/**', '**/test/**', '**/*.config.*'],
})
