# MuSelect 下拉选择

一句话定位：基于 `el-select` 封装的选项驱动下拉框，支持单选/多选、选项分组、禁用项、全部项、只读与自定义 loading。

- 组件目录：`packages/components/core/select/`
- 对外导出：`MuSelect`
- 样式入口：`packages/components/core/select/style/index.ts`（类名 `.mu-select`、`.mu-select-options`、`.mu-select-loading-item`、`.mu-select-readonly-item`）
- 演示页面：`playground/src/views/select/Index.vue`
- 依赖：element-plus 的 `ElSelect`、`ElOption`、`ElOptionGroup`、`vLoading`；本库无其它组件依赖

## 基础用法

```vue
<script setup lang="ts">
import { MuSelect } from '@muyianking/ui'
import { reactive } from 'vue'

const options = [
  { label: '测试1', value: 1 },
  { label: '测试2', value: 2 },
]

// 带 children 的项会渲染为 el-option-group 分组
const groupOptions = [
  {
    label: '测试1',
    value: 1,
    children: [
      { label: '测试1-1', value: 11 },
      { label: '测试1-2', value: 12 },
    ],
  },
  { label: '测试2', value: 2 },
]

const model = reactive({
  test: '',
  test2: [],
})
</script>

<template>
  <MuSelect v-model="model.test" :options="options" />
  <MuSelect v-model="model.test2" :options="options" multiple />
  <MuSelect v-model="model.test" :options="groupOptions" />
</template>
```

## Props

| 属性            | 类型                                   | 默认值     | 说明                                                                 |
| --------------- | -------------------------------------- | ---------- | -------------------------------------------------------------------- |
| options         | `any[]`                                | `() => []` | 选项数组，语义结构为 `OptionsType`（`label` / `value` / `children`） |
| placeholder     | `string`                               | `''`       | 占位文案；为空时按下方规则推导                                       |
| clearable       | `boolean`                              | `true`     | 是否可清空                                                           |
| all             | `boolean`                              | `false`    | 是否追加一个 `value=""`、文案为「全部」的选项                        |
| loading         | `boolean`                              | `false`    | 下拉面板 loading，并透传给 `el-select`                               |
| disabledOptions | `string \| any[] \| number \| boolean` | `() => []` | 需要禁用的选项值，或该类值的数组                                     |
| readonly        | `boolean`                              | `false`    | 只读，禁用交互并隐藏下拉箭头、去掉边框底色                           |
| disabled        | `boolean`                              | `false`    | 禁用                                                                 |

`v-model` 由 `defineModel<any>()` 声明，等价于 `modelValue` prop 加 `update:modelValue` 事件；因此 `modelValue` 不能出现在 `defineProps` 中。

其余属性经组件单根节点自动继承透传给 `el-select`（例如演示页使用的 `multiple`，以及 `filterable` 之外的 `collapse-tags`、`remote` 等）。

## Emits

| 事件   | 参数       | 说明                                                            |
| ------ | ---------- | --------------------------------------------------------------- |
| change | `val: any` | `el-select` 值变化时触发，原样透传 `el-select` 的 `change` 参数 |

（`update:modelValue` 由 `defineModel` 生成。）

## Slots

无（选项完全由 `options` 生成，不提供插槽覆盖）。

## 暴露

无。

## 业务逻辑

- **数据结构 `OptionsType`**：`{ label: string, value: string | number | boolean, children?: OptionsType[] }`（定义在 `packages/components/core/types/common.ts`）。有 `children` 的项渲染为 `el-option-group`（`label` 取该项的 `label`），子项渲染为 `el-option`；无 `children` 的项直接渲染为 `el-option`。
- **v-model 绑定**：`model` 直接绑定到 `el-select` 的 `v-model`。单选时值为单个 `value`，多选（`multiple` 经 `$attrs` 透传）时值为数组；组件对值的类型不做限制（`defineModel<any>()`）。
- **placeholder 推导**（`placeholderText` 计算属性，按优先级）：
  1. `readonly` 为真时返回空串（不显示占位）。
  2. 显式传入 `placeholder` 时用它。
  3. 否则读取父组件实例的 `label` prop（`instance.parent.props.label`），存在则返回 `请选择${label去掉末尾的冒号}`，用于在 `form-item` 内自动生成「请选择xxx」。
  4. 兜底返回 `请选择`。
- **禁用项**：`disabledOptionsList` 把 `disabledOptions` 归一化为数组（非数组真值包成单元素数组，假值得到 `[]`），模板对分组子项与普通项都用 `includes(value)` 判断 `:disabled`。
- **全部项**：`all` 为真时在列表最前插入 `el-option value=""`，文案「全部」。
- **loading**：`:loading` 透传给 `el-select`；同时通过 `#loading` 插槽渲染一个 `v-loading` 容器，文案「加载中...」，类 `.mu-select-loading-item`（高度由工具类 `h-[100px]` 提供，CSS 提供 `pointer-events: none`）。
- **只读**：`:disabled="readonly || disabled"`，并追加类 `mu-select-readonly-item`，由 CSS 去掉 `.el-select__wrapper` 的底色与阴影、隐藏后缀图标、文字颜色继承。
- 组件固定开启 `filterable`，始终可输入过滤。
- `getCurrentInstance()` 在 `setup` 同步执行期被取出并缓存，供 placeholder 推导读取父组件 props（放进 computed 内部会拿到 `null`，源码注释已标注）。

## 约束与注意事项

- `options` 声明为 `any[]`，但请按 `OptionsType` 组织；`children` 存在即视为分组，分组父项的 `value` 本身不会成为可选项。
- 分组父项与普通项的 `:key` 都用 `item.value`；若不同项出现重复 `value` 会触发 key 冲突，值必须唯一。布尔值作为选项值时，分组子项 key 会做 `+value` 转换，但普通项 key 不做转换。
- 在 `form-item` 内使用时，父级 `label` 会被用于生成占位文案；父级若没有 `label`，或不在该结构内，占位退回「请选择」。不需要该行为时显式传 `placeholder`。
- `all` 插入的「全部」值为空字符串 `''`，与「未选择」难以区分，多选场景注意业务语义。
- `readonly` 只是禁用加样式伪装，值仍然绑定在 `model` 上，不改变数据。
- 组件自身不发起请求、不做远程搜索；需要远程加载选项请用 `MuSelectRemote`。
- `.mu-select-loading-item` 是全局语义类，页面多个 `MuSelect` 同时 loading 时共用同一套样式。

## 相关

- 关联组件：`MuSelectRemote`（`packages/components/core/select-remote/`）、`MuFormItem`（`packages/components/core/form-item/`）
- 公共类型：`OptionsType`（`packages/components/core/types/common.ts`）
- 样式：`packages/theme-chalk/css/select.css`
- 演示页面：`playground/src/views/select/Index.vue`
