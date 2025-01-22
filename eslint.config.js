import antfu from '@antfu/eslint-config'
import eslint from '@muyianking/config/eslint.config.js'

export default antfu({
  formatters: true,
  ignores: ['**/public/**'],
}, {
  rules: eslint,
  files: ['**/src/**', '**/script/**', '**/packages/**'],
})
