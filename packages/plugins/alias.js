export function UIAlias() {
  return {
    name: 'my-plugin',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('style/index.js')) {
        return
      }

      return code.replace(/@muyianking\/theme-chalk/g, '@muyinking/ui/theme-chalk')
    },
  }
}
