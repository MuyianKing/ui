import type { ComponentResolver } from 'unplugin-vue-components'

const LIB_PATH = '@muyianking/ui'

export function MuUiResolver(): ComponentResolver[] {
  return [
    {
      type: 'component',
      resolve: (name: string) => {
        return {
          name,
          importName: name,
          from: LIB_PATH,
          path: `${LIB_PATH}/es/index.js`,
        }
      },
    },
  ]
}

export default MuUiResolver
