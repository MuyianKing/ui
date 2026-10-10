import type { MuButtonMode } from '../src/useButton'
import { mount } from '@vue/test-utils'
import { ElTooltip } from 'element-plus'
import { describe, expect, it, vi } from 'vitest'
import IconAddOne from '~icons/icon-park-outline/add-one'
import IconDelete from '~icons/icon-park-outline/delete'
import IconRefresh from '~icons/icon-park-outline/refresh-one'
import IconSearch from '~icons/lucide/search'
import IconImport from '~icons/ph/download-simple-bold'
import IconExport from '~icons/ph/export-bold'
import IconEdit from '~icons/uil/edit'
import { MuAddButton, MuButton, MuDelButton, MuDetailButton, MuEditButton, MuExportButton, MuImportButton, MuResetButton, MuSearchButton } from '../index'

// 字符串图标名走真实 Icon（@iconify/vue）会按图标名向 api.iconify.design 取图标，
// 测试里换成结构等价的 svg 桩保持 hermetic（不打网络）；
// 编译期图标（~icons/*）不走网络，直接用真实组件并按组件定义 findComponent 断言。
vi.mock('@iconify/vue', async () => {
  const { defineComponent, h: create } = await import('vue')
  return {
    Icon: defineComponent({
      name: 'MockIcon',
      inheritAttrs: false,
      props: { icon: { type: String, default: '' } },
      setup(props, { attrs }) {
        return () => create('svg', { ...attrs, 'class': ['mu-icon', attrs.class], 'data-icon': props.icon })
      },
    }),
  }
})

const ICON = 'lucide:search'
const CONFIG_KEY = 'GLOBAL_CUSTOM_CONFIG'

describe('muButton 的四种渲染形态', () => {
  it('默认走 button 形态：el-button + 默认 primary 类型，文案取自默认插槽', () => {
    const wrapper = mount(MuButton, { slots: { default: () => '提交' } })

    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.text()).toBe('提交')
    expect(wrapper.find('button').classes()).toContain('el-button--primary')
    expect(wrapper.find('button').classes()).toContain('mu-button')
  })

  it('text 形态走 el-link，带 whitespace-nowrap', () => {
    const wrapper = mount(MuButton, { props: { mode: 'text' }, slots: { default: () => '查看' } })

    expect(wrapper.find('a').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(false)
    expect(wrapper.find('a').classes()).toEqual(expect.arrayContaining(['mu-button', 'whitespace-nowrap']))
    expect(wrapper.text()).toBe('查看')
  })

  it('icon 且有 tip 时用 tooltip 包裹图标，插槽被忽略', () => {
    const wrapper = mount(MuButton, {
      props: { mode: 'icon', icon: ICON, tip: '查询' },
      slots: { default: () => '插槽文案' },
    })

    expect(wrapper.findComponent(ElTooltip).exists()).toBe(true)
    expect(wrapper.findComponent(ElTooltip).props('content')).toBe('查询')
    expect(wrapper.find('svg.mu-icon').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(false)
    expect(wrapper.text()).toBe('')
  })

  it('icon 且无 tip 时只渲染图标', () => {
    const wrapper = mount(MuButton, { props: { mode: 'icon', icon: ICON } })

    expect(wrapper.findComponent(ElTooltip).exists()).toBe(false)
    expect(wrapper.find('svg.mu-icon').exists()).toBe(true)
  })
})

describe('muButton 的图标显隐与事件', () => {
  it('button 形态下 icon 非空才渲染图标', () => {
    expect(mount(MuButton, { props: { icon: ICON } }).find('svg.mu-icon').exists()).toBe(true)
    expect(mount(MuButton, { props: { icon: '' } }).find('svg.mu-icon').exists()).toBe(false)
    expect(mount(MuButton, { props: {} }).find('svg.mu-icon').exists()).toBe(false)
  })

  it('size 经 $attrs 透传给 el-button（不被图标 prop 吞掉）', () => {
    const wrapper = mount(MuButton, { props: { icon: ICON }, attrs: { size: 'small' } })

    expect(wrapper.find('button').classes()).toContain('el-button--small')
  })

  it('图标形态的图标字号由 iconSize 决定', () => {
    const wrapper = mount(MuButton, { props: { mode: 'icon', icon: ICON, iconSize: 22 } })

    expect(wrapper.find('svg.mu-icon').attributes('style')).toContain('font-size: 22px')
  })

  it('四种形态点击都只 emit 一次 click', async () => {
    const cases: Array<{ props: { mode: MuButtonMode, icon: string, tip: string }, selector: string }> = [
      { props: { mode: 'button', icon: '', tip: '' }, selector: 'button' },
      { props: { mode: 'text', icon: '', tip: '' }, selector: 'a' },
      { props: { mode: 'icon', icon: ICON, tip: '查询' }, selector: 'svg' },
      { props: { mode: 'icon', icon: ICON, tip: '' }, selector: 'svg' },
    ]

    for (const item of cases) {
      const wrapper = mount(MuButton, { props: item.props })
      await wrapper.find(item.selector).trigger('click')
      expect(wrapper.emitted('click')).toHaveLength(1)
    }
  })

  it('文案只来自默认插槽：无插槽时 button 形态渲染为空', () => {
    expect(mount(MuButton, { slots: { default: () => '自定义内容' } }).text()).toBe('自定义内容')
    expect(mount(MuButton).find('button').text()).toBe('')
  })

  it('$attrs 的落点随形态变化：button 形态落到 el-button，icon 形态落到 Icon', () => {
    const asButton = mount(MuButton, { slots: { default: () => '提交' }, attrs: { 'data-test': 'as-button' } })
    expect(asButton.find('button[data-test="as-button"]').exists()).toBe(true)

    const asIcon = mount(MuButton, { props: { mode: 'icon', icon: ICON }, attrs: { 'data-test': 'as-icon' } })
    expect(asIcon.find('svg[data-test="as-icon"]').exists()).toBe(true)
  })
})

describe('预设按钮的 useButton 逻辑', () => {
  it('muSearchButton 的 text 有默认值，默认渲染为标准按钮（与添加按钮一致，不带前置图标）', () => {
    const wrapper = mount(MuSearchButton)

    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.find('a').exists()).toBe(false)
    expect(wrapper.text()).toBe('查询')
    expect(wrapper.find('svg.mu-icon').exists()).toBe(false)
  })

  it('muSearchButton 的 text 传假值时切换为图标形态', () => {
    const wrapper = mount(MuSearchButton, { props: { text: false } })

    expect(wrapper.find('button').exists()).toBe(false)
    expect(wrapper.findComponent(IconSearch).exists()).toBe(true)
  })

  it('muExportButton / muImportButton / muResetButton 恒为标准按钮，文案取默认插槽回退', () => {
    const exportBtn = mount(MuExportButton)
    expect(exportBtn.find('button').exists()).toBe(true)
    expect(exportBtn.find('a').exists()).toBe(false)
    expect(exportBtn.text()).toBe('导出')
    expect(exportBtn.find('svg.mu-icon').exists()).toBe(false)

    const importBtn = mount(MuImportButton)
    expect(importBtn.find('button').exists()).toBe(true)
    expect(importBtn.text()).toBe('导入')

    const resetBtn = mount(MuResetButton)
    expect(resetBtn.find('button').exists()).toBe(true)
    expect(resetBtn.text()).toBe('重置')
  })

  it('muAddButton / muExportButton / muImportButton / muResetButton 的文案由默认插槽自定义（无 text prop）', () => {
    expect(mount(MuAddButton, { slots: { default: () => '创建' } }).text()).toBe('创建')
    expect(mount(MuExportButton, { slots: { default: () => '点击导出' } }).text()).toBe('点击导出')
    expect(mount(MuImportButton, { slots: { default: () => '点击导入' } }).text()).toBe('点击导入')
    expect(mount(MuResetButton, { slots: { default: () => '恢复' } }).text()).toBe('恢复')
  })

  it('muResetButton 的 noConfirm 分支文案同样走插槽，图标显隐跟随 buttonIcon', () => {
    const noConfirm = mount(MuResetButton, { props: { noConfirm: true }, slots: { default: () => '恢复' } })
    expect(noConfirm.find('button').exists()).toBe(true)
    expect(noConfirm.text()).toBe('恢复')
    expect(noConfirm.findComponent(IconRefresh).exists()).toBe(false)

    const withConfig = mount(MuResetButton, {
      props: { noConfirm: true },
      slots: { default: () => '恢复' },
      global: { provide: { [CONFIG_KEY]: { buttonIcon: true } } },
    })
    expect(withConfig.findComponent(IconRefresh).exists()).toBe(true)
  })

  it('muSearchButton 的 text 传布尔真时取默认文案，而不是渲染出 "true"', () => {
    expect(mount(MuSearchButton, { props: { text: true } }).text()).toBe('查询')
  })

  it('muEditButton 的 text 未传时默认渲染为图标形态', () => {
    const wrapper = mount(MuEditButton)

    expect(wrapper.find('a').exists()).toBe(false)
    expect(wrapper.find('button').exists()).toBe(false)
    expect(wrapper.findComponent(IconEdit).exists()).toBe(true)
  })

  it('muEditButton / muDetailButton 未传 text 时由全局配置 tableIcon 决定形态', () => {
    // 这三个按钮的 text 类型含 Boolean，必须靠 withDefaults 里显式的 `text: undefined`
    // 跳过 Vue 的布尔转换，否则 props.text 会变成 false、tableIcon 永远不参与判断
    const editIconForm = mount(MuEditButton)
    expect(editIconForm.find('a').exists()).toBe(false)
    expect(editIconForm.findComponent(IconEdit).exists()).toBe(true)

    const editTextForm = mount(MuEditButton, {
      global: { provide: { [CONFIG_KEY]: { tableIcon: 'text' } } },
    })
    expect(editTextForm.find('a').exists()).toBe(true)
    expect(editTextForm.text()).toBe('编辑')

    const detailTextForm = mount(MuDetailButton, {
      global: { provide: { [CONFIG_KEY]: { tableIcon: 'text' } } },
    })
    expect(detailTextForm.find('a').exists()).toBe(true)
    expect(detailTextForm.text()).toBe('详情')
  })

  it('muDelButton 未传 text 时同样跟随 tableIcon（noPopover 分支）', () => {
    const iconForm = mount(MuDelButton, { props: { noPopover: true } })
    expect(iconForm.findComponent(IconDelete).exists()).toBe(true)
    // MuButton 的图标形态只认 tip，预设按钮必须把 buttonText 传下去，否则悬浮提示丢失
    expect(iconForm.findComponent(ElTooltip).props('content')).toBe('删除')

    const textForm = mount(MuDelButton, {
      props: { noPopover: true },
      global: { provide: { [CONFIG_KEY]: { tableIcon: 'text' } } },
    })
    expect(textForm.find('a').exists()).toBe(true)
    expect(textForm.text()).toBe('删除')
  })

  it('muEditButton 显式传 text 才切换为文本形态', () => {
    const wrapper = mount(MuEditButton, { props: { text: '编辑' } })

    expect(wrapper.find('a').exists()).toBe(true)
    expect(wrapper.text()).toBe('编辑')
  })

  it('muAddButton 的图标显隐由全局配置 buttonIcon 决定', () => {
    const withoutConfig = mount(MuAddButton)
    expect(withoutConfig.find('button').exists()).toBe(true)
    expect(withoutConfig.text()).toBe('添加')
    expect(withoutConfig.find('svg.mu-icon').exists()).toBe(false)

    const withConfig = mount(MuAddButton, {
      global: { provide: { [CONFIG_KEY]: { buttonIcon: true } } },
    })
    expect(withConfig.findComponent(IconAddOne).exists()).toBe(true)
  })

  it('查询 / 导出 / 导入 / 重置按钮的标准按钮形态前置图标同样由 buttonIcon 决定（图标形态不受影响）', () => {
    const provide = { [CONFIG_KEY]: { buttonIcon: true } }
    expect(mount(MuSearchButton, { global: { provide } }).findComponent(IconSearch).exists()).toBe(true)
    expect(mount(MuExportButton, { global: { provide } }).findComponent(IconExport).exists()).toBe(true)
    expect(mount(MuImportButton, { global: { provide } }).findComponent(IconImport).exists()).toBe(true)
    expect(mount(MuResetButton, { global: { provide } }).findComponent(IconRefresh).exists()).toBe(true)

    // 未配置 / 配置为 false 时不渲染前置图标（默认形态用例已覆盖），图标形态的图标不受 buttonIcon 影响
    expect(mount(MuSearchButton, { props: { text: false }, global: { provide } }).findComponent(IconSearch).exists()).toBe(true)
  })

  it('icon 传编译期图标组件时直接渲染该组件（字符串名才走运行时 Icon）', () => {
    const wrapper = mount(MuButton, { props: { mode: 'icon', icon: IconEdit } })

    expect(wrapper.findComponent(IconEdit).exists()).toBe(true)
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('预设按钮把 click 冒泡给使用方', async () => {
    const wrapper = mount(MuAddButton, { slots: { default: () => '创建' } })
    await wrapper.find('button').trigger('click')

    expect(wrapper.text()).toBe('创建')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
