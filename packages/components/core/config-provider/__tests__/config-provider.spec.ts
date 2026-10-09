import type { GlobalCustomConfig } from '../../types/common'
import { mount } from '@vue/test-utils'
import { ElButton, ElConfigProvider } from 'element-plus'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, inject } from 'vue'
import { MuConfigProvider } from '../index'

const CONFIG_KEY = 'GLOBAL_CUSTOM_CONFIG'

const InjectChild = defineComponent({
  name: 'InjectChild',
  setup() {
    const config = inject<GlobalCustomConfig>(CONFIG_KEY)
    // 函数型配置项会被 JSON.stringify 丢掉，所以额外渲染一次它的 typeof
    return () => h('span', { class: 'cfg' }, config ? `${JSON.stringify(config)}|${typeof config.uploadFile}` : 'none')
  },
})

describe('MuConfigProvider', () => {
  it('用 provide 下发 customConfig，子组件能 inject 到同一份内容', () => {
    const customConfig: GlobalCustomConfig = {
      uploadFile: () => Promise.resolve({ path: '/api/file', id: '1' }),
      tableIcon: 'text',
    }
    const wrapper = mount(MuConfigProvider, {
      props: { customConfig },
      slots: { default: () => h(InjectChild) },
    })

    expect(wrapper.find('.cfg').text()).toBe(`${JSON.stringify(customConfig)}|function`)
  })

  it('没有 provider 时子组件 inject 到空值（组件不提供兜底默认）', () => {
    const wrapper = mount(InjectChild)

    expect(wrapper.find('.cfg').text()).toBe('none')
  })

  it('默认插槽内容照常渲染', () => {
    const wrapper = mount(MuConfigProvider, {
      props: { customConfig: {} },
      slots: { default: () => h('div', { class: 'app' }, '应用内容') },
    })

    expect(wrapper.find('.app').text()).toBe('应用内容')
  })

  it('$attrs 透传给 el-config-provider（否则 locale / size / zIndex 丢失）', () => {
    const mountWithSize = (size: string) => mount(MuConfigProvider, {
      props: { customConfig: {} },
      attrs: { size },
      slots: { default: () => h(ElButton, null, () => '按钮') },
    })

    // size 经 ElConfigProvider 的全局配置落到子组件上，透传失败时按钮只会是默认尺寸
    expect(mountWithSize('small').find('button').classes()).toContain('el-button--small')
    expect(mountWithSize('large').find('button').classes()).toContain('el-button--large')
  })

  it('包裹层就是 el-config-provider，没有额外的自有根节点', () => {
    const wrapper = mount(MuConfigProvider, {
      props: { customConfig: {} },
      slots: { default: () => h('div', { class: 'app' }, '应用内容') },
    })

    expect(wrapper.findComponent(ElConfigProvider).exists()).toBe(true)
    expect(wrapper.classes()).toHaveLength(0)
  })
})
