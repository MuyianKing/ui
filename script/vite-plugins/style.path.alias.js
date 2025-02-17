export default function StylePathAlias() {
  return {
    name: 'style-path-alias',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('style/index.ts')) {
        return
      }

      return code.replace(/@ui\/theme-chalk/g, '@muyianking/ui/theme-chalk')
    },
  }
}
