import type { VueWrapper } from '@vue/test-utils'
import type { FormInstance } from 'element-plus'
import type { Ref } from 'vue'
import { mount } from '@vue/test-utils'
import { ElForm, ElInput } from 'element-plus'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { MuFormItem } from '../index'

interface HarnessOptions {
  /** 表单项的取值，写入 el-form 的 model */
  value?: any
  /** 传给 MuFormItem 的 props */
  itemProps?: Record<string, any>
  /** 是否用 el-input 作为内容控件；false 时用普通 div（挂载期探测会判为「请选择」） */
  withInput?: boolean
}

/**
 * 校验必须挂在 el-form 上才能真正跑起来，这里按真实层级搭一个最小表单：
 * el-form（提供 model 与 validate） → MuFormItem（合并规则 + prop） → 内容控件。
 */
function mountField(options: HarnessOptions = {}) {
  const { value = '', itemProps = {}, withInput = true } = options
  const formRef = ref<FormInstance>()
  const model = ref({ field: value })

  const Wrapper = defineComponent({
    name: 'FormItemHarness',
    setup() {
      return () => h(ElForm, { ref: formRef, model: model.value }, {
        default: () => h(MuFormItem, { prop: 'field', ...itemProps }, {
          default: () => (withInput
            ? h(ElInput, {
                'modelValue': model.value.field,
                'onUpdate:modelValue': (v: string) => {
                  model.value.field = v
                },
              })
            : h('div', { class: 'plain-control' }, '自定义控件')),
        }),
      })
    },
  })

  return { wrapper: mount(Wrapper), formRef }
}

/**
 * 触发校验并读出渲染出的错误文案（校验通过时为空串）。
 *
 * 两个时序坑：
 * ① 挂载期 info 探测在 onMounted 里写 info.value，mergedRules 要等一个 tick 才更新，
 *    挂载后立刻校验会跑到**旧**规则（前缀还是回退值）；
 * ② el-form-item 内部用 refDebounced 把错误节点延迟 100ms 才渲染
 *    （is-error 类立刻生效、错误文案滞后），所以必须等过防抖窗口再读 DOM。
 */
async function validateAndReadError(wrapper: VueWrapper<any>, formRef: Ref<FormInstance | undefined>) {
  await nextTick()
  await formRef.value!.validate().catch(() => {})
  await new Promise(resolve => setTimeout(resolve, 120))
  await nextTick()

  const error = wrapper.find('.el-form-item__error')
  return error.exists() ? error.text() : ''
}

describe('MuFormItem 的规则合并', () => {
  it('required 的提示词由探测前缀 + 去冒号的 label 拼成', async () => {
    const { wrapper, formRef } = mountField({ itemProps: { required: true, label: '姓名：' } })

    expect(await validateAndReadError(wrapper, formRef)).toBe('请输入姓名')
  })

  it('内容控件不是输入框时，探测前缀变成「请选择」', async () => {
    const { wrapper, formRef } = mountField({
      itemProps: { required: true, label: '状态：' },
      withInput: false,
    })

    expect(await validateAndReadError(wrapper, formRef)).toBe('请选择状态')
  })

  it('info 显式指定时优先于探测结果', async () => {
    const { wrapper, formRef } = mountField({
      itemProps: { required: true, label: '状态', info: '请输入' },
      withInput: false,
    })

    expect(await validateAndReadError(wrapper, formRef)).toBe('请输入状态')
  })

  it('关闭的开关不产生规则，脏值也能通过校验', async () => {
    const { formRef } = mountField({ value: '不是邮箱', itemProps: { label: '邮箱' } })

    await expect(formRef.value!.validate()).resolves.toBe(true)
  })

  it('email 开关挂上 v_email 规则', async () => {
    const { wrapper, formRef } = mountField({ value: '不是邮箱', itemProps: { email: true } })

    expect(await validateAndReadError(wrapper, formRef)).toBe('邮箱地址格式错误')
  })

  it('number 开关拦截非数字，但空串仍然放行', async () => {
    const failed = mountField({ value: 'abc', itemProps: { number: true } })
    expect(await validateAndReadError(failed.wrapper, failed.formRef)).toBe('请输入数字')

    // +'' === 0，空值要靠 required 约束
    const passed = mountField({ value: '', itemProps: { number: true } })
    await expect(passed.formRef.value!.validate()).resolves.toBe(true)
  })

  it('maxLength / minLength 按长度报错', async () => {
    const tooLong = mountField({ value: 'abcd', itemProps: { maxLength: 3 } })
    expect(await validateAndReadError(tooLong.wrapper, tooLong.formRef)).toBe('最大长度为3')

    const tooShort = mountField({ value: 'a', itemProps: { minLength: 2 } })
    expect(await validateAndReadError(tooShort.wrapper, tooShort.formRef)).toBe('最小长度为2')
  })

  it('uploadLoading 命中数组内任一项的 loading 就拦住', async () => {
    const arrayValue = mountField({
      value: [{ loading: false }, { loading: true }],
      itemProps: { uploadLoading: true },
      withInput: false,
    })
    expect(await validateAndReadError(arrayValue.wrapper, arrayValue.formRef)).toBe('请等待文件上传')

    const singleValue = mountField({
      value: { loading: true },
      itemProps: { uploadLoading: true },
      withInput: false,
    })
    expect(await validateAndReadError(singleValue.wrapper, singleValue.formRef)).toBe('请等待文件上传')

    const noLoading = mountField({
      value: [{ loading: false }],
      itemProps: { uploadLoading: true },
      withInput: false,
    })
    await expect(noLoading.formRef.value!.validate()).resolves.toBe(true)
  })

  it('minCount 只作用于数组，文案可被 minCountMsg 覆盖', async () => {
    const defaults = mountField({ value: [], itemProps: { minCount: 2 }, withInput: false })
    expect(await validateAndReadError(defaults.wrapper, defaults.formRef)).toBe('最少2个')

    const custom = mountField({
      value: [],
      itemProps: { minCount: 2, minCountMsg: '至少上传两项' },
      withInput: false,
    })
    expect(await validateAndReadError(custom.wrapper, custom.formRef)).toBe('至少上传两项')

    const enough = mountField({ value: [1, 2], itemProps: { minCount: 2 }, withInput: false })
    await expect(enough.formRef.value!.validate()).resolves.toBe(true)
  })

  it('自定义 rules 排在自动规则之前，同字段报自定义文案', async () => {
    const { wrapper, formRef } = mountField({
      value: '',
      itemProps: {
        required: true,
        label: '备注',
        rules: [{ required: true, message: '自定义提示', trigger: 'change' }],
      },
    })

    expect(await validateAndReadError(wrapper, formRef)).toBe('自定义提示')
  })
})

describe('MuFormItem 的标签宽度', () => {
  it('labelWidth 为 fit 时按 label 长度换算', () => {
    const { wrapper } = mountField({
      itemProps: { label: '姓名', labelWidth: 'fit' },
      withInput: false,
    })

    expect(wrapper.find('.el-form-item__label').attributes('style')).toContain('calc(2em + 15px)')
  })

  it('labelWidth 显式给值时原样下发', () => {
    const { wrapper } = mountField({
      itemProps: { label: '姓名', labelWidth: '150px' },
      withInput: false,
    })

    expect(wrapper.find('.el-form-item__label').attributes('style')).toContain('width: 150px')
  })

  it('labelWidth 为空时继承外层 el-form', () => {
    const formRef = ref<FormInstance>()
    const Wrapper = defineComponent({
      name: 'LabelWidthHarness',
      setup() {
        return () => h(ElForm, { ref: formRef, model: {}, labelWidth: '120px' }, {
          default: () => h(MuFormItem, { label: '姓名' }, { default: () => h('div') }),
        })
      },
    })

    const wrapper = mount(Wrapper)
    expect(wrapper.find('.el-form-item__label').attributes('style')).toContain('width: 120px')
  })
})
