import type { ComponentResolver } from 'unplugin-vue-components'

export default function MuUiResolver(): ComponentResolver[] {
  return [
    {
      type: 'component',
      resolve: (name: string) => {
        if (!['MuTable', 'MuTableColumn'].includes(name) && name.startsWith('Mu')) {
          return {
            name,
            importName: name,
            from: '@muyianking/ui',
            path: `@muyianking/ui/es/index.js`,
          }
        }
      },
    },
  ]
}