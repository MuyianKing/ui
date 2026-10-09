import { describe, expect, it } from 'vitest'
import { MuUiResolver } from '../resolver'

/** resolver 有两种合法形态（函数式 / 对象式），本库用的是对象式，这里顺带把它钉住 */
function resolverObject() {
  const [resolver] = MuUiResolver()
  if (typeof resolver === 'function')
    throw new Error('MuUiResolver 必须返回对象式解析器')

  return resolver
}

describe('muUiResolver', () => {
  it('声明为组件解析器', () => {
    expect(MuUiResolver()).toHaveLength(1)
    expect(resolverObject().type).toBe('component')
  })

  it('只有 Mu 前缀的组件名会被 claim', () => {
    expect(resolverObject().resolve('MuButton')).toEqual({ name: 'MuButton', from: '@muyianking/ui' })
    expect(resolverObject().resolve('MuFormItem')).toEqual({ name: 'MuFormItem', from: '@muyianking/ui' })
  })

  it('非 Mu 前缀一律返回 undefined，避免 claim 消费者自己的组件', () => {
    // 这是 resolver 的硬约束：无条件下返回会让 unplugin 把所有未识别组件名
    // 都指向本库，产出无效 import 直接构建失败
    expect(resolverObject().resolve('Button')).toBeUndefined()
    expect(resolverObject().resolve('MyButton')).toBeUndefined()
    expect(resolverObject().resolve('ElButton')).toBeUndefined()
    expect(resolverObject().resolve('')).toBeUndefined()
  })

  it('Mu 前缀本身也照常返回，前缀判断只是短路而非白名单', () => {
    expect(resolverObject().resolve('MuNotExist')).toEqual({ name: 'MuNotExist', from: '@muyianking/ui' })
  })
})
