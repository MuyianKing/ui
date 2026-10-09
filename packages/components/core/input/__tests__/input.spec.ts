import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { ElForm, ElPopover } from 'element-plus'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { MuFormItem } from '../../form-item'
import { MuInput } from '../index'

/** MuInput 的真实用法是放在 MuFormItem 里（label 会参与 placeholder 回退），这里按真实层级挂载。 */
function mountInFormItem(itemProps: Record<string, any> = {}) {
  const value = ref('')
  const Wrapper = defineComponent({
    name: 'InputHarness',
    setup() {
      return () => h(ElForm, { model: { value: value.value } }, {
        default: () => h(MuFormItem, { label: '姓名：', prop: 'value', ...itemProps }, {
          default: () => h(MuInput, {
            'modelValue': value.value,
            'onUpdate:modelValue': (v?: string) => {
              value.value = v ?? ''
            },
          }),
        }),
      })
    },
  })

  return { wrapper: mount(Wrapper), value }
}

/** 取最后一次 emit 的参数（tsconfig 的 lib 是 ES2020，没有 Array.prototype.at） */
function lastEmitted(wrapper: VueWrapper<any>, name: string) {
  const events = wrapper.emitted(name)
  return events?.[events.length - 1]
}

describe('MuInput 的值处理', () => {
  it('输入时同步 v-model', async () => {
    const wrapper = mount(MuInput, { props: { modelValue: '' } })
    await wrapper.find('input').setValue('张三')

    expect(lastEmitted(wrapper, 'update:modelValue')).toEqual(['张三'])
  })

  it('非 number 类型会删除输入中的单引号（防粘贴带入）', async () => {
    const wrapper = mount(MuInput, { props: { modelValue: '' } })
    const input = wrapper.find('input')

    await input.setValue('it\'s mu')
    expect(lastEmitted(wrapper, 'update:modelValue')).toEqual(['its mu'])
  })

  it('type=number 时原样透传，保留 \'1.\' 这类输入中间态', async () => {
    const wrapper = mount(MuInput, { props: { modelValue: '', type: 'number' } })
    const input = wrapper.find('input')

    expect(input.attributes('type')).toBe('number')

    await input.setValue('1.5')
    expect(lastEmitted(wrapper, 'update:modelValue')).toEqual(['1.5'])

    // 如果这里被压成 '1'，用户就永远打不出小数
    await input.setValue('1.')
    expect(lastEmitted(wrapper, 'update:modelValue')).toEqual(['1.'])
  })
})

describe('MuInput 的 placeholder 回退链', () => {
  it('显式 placeholder 优先', () => {
    const wrapper = mount(MuInput, { props: { placeholder: '请输入手机号' } })

    expect(wrapper.find('input').attributes('placeholder')).toBe('请输入手机号')
  })

  it('未传 placeholder 时取直接父组件的 label，并去掉冒号', () => {
    const { wrapper } = mountInFormItem()

    expect(wrapper.find('input').attributes('placeholder')).toBe('请输入姓名')
  })

  it('父组件也没有 label 时回退「请输入」', () => {
    const wrapper = mount(MuInput, { props: {} })

    expect(wrapper.find('input').attributes('placeholder')).toBe('请输入')
  })
})

describe('MuInput 的插槽与透传', () => {
  it('prefix 透传给 el-input 的 #prefix，append 映射到 #suffix', () => {
    const wrapper = mount(MuInput, {
      props: { modelValue: '' },
      slots: {
        prefix: () => h('i', { class: 'pre-slot' }),
        append: () => h('i', { class: 'app-slot' }),
      },
    })

    expect(wrapper.find('.el-input__prefix .pre-slot').exists()).toBe(true)
    expect(wrapper.find('.el-input__suffix .app-slot').exists()).toBe(true)
  })

  it('$attrs 透传给 el-input（自带 type prop 覆盖同名透传值）', () => {
    const wrapper = mount(MuInput, {
      props: { modelValue: '', placeholder: '占位' },
      attrs: { 'maxlength': 5, 'data-test': 'mu-input' },
    })

    expect(wrapper.find('input').attributes('maxlength')).toBe('5')
    expect(wrapper.find('[data-test="mu-input"]').exists()).toBe(true)
  })
})

describe('MuInput 的聚焦提示浮层', () => {
  // el-popover 的内容常驻 DOM（teleport 到 body、用 display 切换显隐），
  // 所以显隐统一断言绑定到 el-popover 的 visible，内容另按文本断言；
  // 不用 document.querySelector('.el-popover')——上一个用例卸载后 teleport 节点仍可能留在 body 里，会选错节点。

  it('tip 为空时聚焦不弹浮层', async () => {
    const wrapper = mount(MuInput, { props: { modelValue: '' }, attachTo: document.body })
    await nextTick()
    // 用真实 focus() 而不是 trigger('focus')：el-input 只在浏览器焦点流程里转发 focus 事件
    ;(wrapper.find('input').element as HTMLInputElement).focus()
    await nextTick()

    expect(wrapper.findComponent(ElPopover).props('visible')).toBe(false)

    wrapper.unmount()
  })

  it('tip 非空时聚焦弹出浮层，标题用 tipLabel，失焦关闭', async () => {
    const wrapper = mount(MuInput, {
      props: { modelValue: '', tip: '仅允许中文、字母与数字', tipLabel: '命名规则' },
      attachTo: document.body,
    })
    // popover 的受控 visible 需要一次渲染同步，挂载后立刻聚焦会被吞掉（真实场景里用户聚焦远晚于挂载）
    await nextTick()

    const input = wrapper.find('input').element as HTMLInputElement

    input.focus()
    await nextTick()
    await flushPromises()

    expect(wrapper.findComponent(ElPopover).props('visible')).toBe(true)
    expect(document.body.textContent).toContain('命名规则')
    expect(document.body.textContent).toContain('仅允许中文、字母与数字')

    input.blur()
    await nextTick()

    expect(wrapper.findComponent(ElPopover).props('visible')).toBe(false)

    wrapper.unmount()
  })

  it('浮层宽度跟随输入框 clientWidth', async () => {
    const wrapper = mount(MuInput, {
      props: { modelValue: '', tip: '提示正文' },
      attachTo: document.body,
    })
    await nextTick()

    const dom = wrapper.find('.el-input').element as HTMLElement
    Object.defineProperty(dom, 'clientWidth', { value: 240, configurable: true })

    ;(wrapper.find('input').element as HTMLInputElement).focus()
    await nextTick()

    expect(wrapper.findComponent(ElPopover).props('width')).toBe('240px')

    wrapper.unmount()
  })
})
