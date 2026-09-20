import type { ComponentResolver } from 'unplugin-vue-components'

const LIB_PATH = '@muyianking/ui'

export function MuUiResolver(): ComponentResolver[] {
  return [
    {
      type: 'component',
      resolve: (name: string) => {
        // 必须前缀短路：unplugin 会依次问每个 resolver，无条件下返回就等于
        // 把所有未识别的组件名（含消费者自己的组件）都 claim 到本库，产出
        // import { Foo } from '@muyianking/ui' 直接构建失败
        if (!name.startsWith('Mu'))
          return

        // 契约字段只有 name / from，原来的 importName、path 会被忽略
        return {
          name,
          from: LIB_PATH,
        }
      },
    },
  ]
}

export default MuUiResolver
