# MuRadio 单选框组

一句话定位：基于 `el-radio-group` 封装的选项驱动单选组件，支持可取消、独占一行、只读与禁用。

- 组件目录：`packages/components/core/radio/`
- 对外导出：`MuRadio`
- 样式入口：`packages/components/core/radio/style/index.ts`（类名 `.mu-radio`、`.mu-radio-line-item`、`.mu-radio-readonly-group`）
- 演示页面：`playground/src/views/radio/Index.vue`
- 依赖：element-plus 的 `ElRadio`、`ElRadioGroup`；本库无其它组件依赖

## 基础用法

```vue
<script setup lang="ts">
import { MuRadio } from '@muyianking/ui'
import { ref } from 'vue'

const options = [
  { label: '测试1', value: 1 },
  { label: '测试2', value: 2 },
]

const radio = ref(1)
</script>

<template>
  <MuRadio v-model="radio" :options="options" />
</template>
```

可取消（再次点击已选项会清空）：

```vue
<MuRadio v-model="radio" :options="options" empty />
```

## Props

| 属性     | 类型      | 默认值     | 说明                                      |
| -------- | --------- | ---------- | ----------------------------------------- |
| options  | `any[]`   | `() => []` | 选项数组，每项至少含 `label` 与 `value`   |
| empty    | `boolean` | `false`    | 允许再次点击已选项取消选中（清空为 `''`） |
| line     | `boolean` | `false`    | 每个选项独占一行                          |
| readonly | `boolean` | `false`    | 只读，仅展示已选项，隐藏未选项与选择框    |
| disabled | `boolean` | `false`    | 禁用整组                                  |

`v-model` 由 `defineModel<string | number | boolean>({ default: '' })` 声明，等价于 `modelValue` prop 加 `update:modelValue` 事件；因此 `modelValue` 不能出现在 `defineProps` 中。

其余属性经组件单根节点自动继承透传给 `el-radio-group`。

## Emits

无（未使用 `defineEmits`；`update:modelValue` 由 `defineModel` 生成）。

## Slots

无（选项文案直接取 `item.label`，不提供插槽自定义）。

## 暴露

无。

## 业务逻辑

- `filteredOptions` 计算属性控制渲染哪些选项：非只读时直接返回全部 `options`；只读时若 `model` 为 `''` 返回空数组（什么都不渲染），否则只保留 `value === model.value` 的那一项。配合 CSS 的 `.mu-radio-readonly-group .el-radio { display: none }` 与 `.is-checked { display: inline-flex }`，只读态表现为一段纯文本。
- `handleClick` 实现「可取消」：仅当 `empty` 为真且非只读时生效。先读取当前 `model` 值，`nextTick` 后若该值仍是有效值（非 `undefined` / `null` / `''`）且等于 `model.value`，就把它清成 `''`。判断刻意不用 `val &&`，避免 `0`、`false` 这类合法值无法再次点击取消（源码注释明确标注）。
- 模板用 `:value="item.value"` 传值（Element Plus 2.6+ 以 `value` 取代旧的 `label`），文案通过默认插槽写 `{{ item.label }}`。
- `v-for` 的 `:key` 对布尔值做了 `+item.value` 转换（`true → 1`、`false → 0`），避免布尔值与数字/字符串混用导致 key 冲突。
- 分组容器 `:disabled="disabled || readonly"`，只读时同样禁用；并通过 `class` 追加 `mu-radio-line-item`（`line`）与 `mu-radio-readonly-group`（`readonly`）两个语义类。
- 组件无内部状态、无副作用请求。

## 约束与注意事项

- `options` 类型是 `any[]`，运行时只读取 `label` 与 `value`；`children` 等额外字段在这层不会被使用（分组单选请用 `MuSelect`）。
- `readonly` 且 `model` 为空时列表完全不渲染，不是「显示但不可点」，页面会出现空白，使用前需确认该分支符合预期。
- `empty` 清空后的值是空字符串 `''`，不是 `undefined` 或 `null`，请保证调用方 `model` 能接受该值。
- 只读态隐藏了选择框，样式依赖 `packages/theme-chalk/css/radio.css` 中的 `.mu-radio-readonly-group` 规则，删除该文件会退化为普通禁用单选。
- 其余属性经单根节点自动继承透传给 `el-radio-group`。

## 相关

- 关联组件：`MuSelect`（下拉选择，支持分组）
- 公共类型：`OptionsType`（`packages/components/core/types/common.ts`，`{ label, value, children? }`）
- 样式：`packages/theme-chalk/css/radio.css`
- 演示页面：`playground/src/views/radio/Index.vue`
