# MuCheckbox 复选框

以 `options` 数据驱动的复选框组，支持多选 / 单选、竖排与只读展示。

- 组件目录：`packages/components/core/checkbox/`
- 对外导出：`MuCheckbox`（`export const MuCheckbox`，同时 `export default`）
- 样式入口：`packages/components/core/checkbox/style/index.ts`（类名 `.mu-checkbox`、`.mu-checkbox-line-item`、`.mu-checkbox-readonly-group`）
- 演示页面：暂无
- 依赖：element-plus 的 `ElCheckboxGroup`、`ElCheckbox`；不依赖本库其它组件

## 基础用法

```vue
<script setup lang="ts">
import { MuCheckbox } from '@muyianking/ui'
import { ref } from 'vue'

const value = ref<string[]>([])
const options = [
  { label: '选项一', value: 1 },
  { label: '选项二', value: 2 },
]
</script>

<template>
  <MuCheckbox v-model="value" :options="options" />
</template>
```

单选（`multiple=false`，`v-model` 为单值）：

```vue
<script setup lang="ts">
import { ref } from 'vue'

const single = ref('')
</script>

<template>
  <MuCheckbox v-model="single" :options="options" :multiple="false" line />
</template>
```

## Props

| 属性     | 类型    | 默认值     | 说明                                                              |
| -------- | ------- | ---------- | ----------------------------------------------------------------- |
| options  | any[]   | `() => []` | 选项数组，每项需含 `label` 与 `value`                             |
| multiple | boolean | `true`     | 是否多选；`false` 时回写值为单个值                                |
| line     | boolean | `false`    | 竖向单列排列（追加 `mu-checkbox-line-item`）                      |
| readonly | boolean | `false`    | 只读：强制禁用并仅展示已选项（追加 `mu-checkbox-readonly-group`） |
| disabled | boolean | `false`    | 禁用整个复选框组；`readonly` 时同样会禁用                         |

另支持 `v-model`：`modelValue` 类型为 `any[] | string | number`，默认值 `() => []`（由 `defineModel` 声明）。其余属性经 `v-bind="$attrs"` 透传到 `el-checkbox-group`。

## Emits

无显式 `defineEmits`。通过 `defineModel` 隐式提供 `update:modelValue`（`v-model` 双向绑定）。

## Slots

无。

## 暴露

无。

## 业务逻辑

- 使用 `defineModel<any[] | string | number>({ default: () => [] })` 承载受控值。
- `value` 计算属性把多种形态的 `modelValue` 归一化为数组：`null` / `undefined` / `''` 返回 `[]`；数组原样；`number` / `boolean` 包成 `[值]`；字符串按 `','` 拆分并过滤空串。
- `multiple=true` 时，归一化后的值再经 `valueMap` 映射为选项的原始 `value`，并过滤掉 `undefined`（即不在 `options` 中的值）；`multiple=false` 时直接返回归一化数组（保留原始类型）。
- `valueMap` 由 `watch(() => props.options, ..., { immediate: true, deep: true })` 构建，键为 `${item.value}`，用于抹平模型值与选项值之间的字符串 / 数字类型差异。
- `handleChange(val)`：多选直接把数组写回 `model`；单选取数组最后一个值，数组为空则写 `''`。源码注释指出：不能用 `pop() || ''`，否则 `0` / `false` 这类合法值会被误判为空。
- 模板把 `disabled || readonly` 作为 `el-checkbox-group` 的 `disabled`；`readonly` 通过 `mu-checkbox-readonly-group` 类名配合 CSS 隐藏未选中项与勾选框，实现“仅展示”效果。
- 选项渲染为 `el-checkbox :value="item.value"`，显示 `item.label`。

## 约束与注意事项

- 其余属性经 `v-bind="$attrs"` 透传给 `el-checkbox-group`（如 `size`、`min`、`max` 等），不逐一列举。
- 内部用 `el-checkbox` 的 `value` 而非 `label` 承载值，需较新版 Element Plus（本项目为 2.14.7）。
- 单选模式（`multiple=false`）回写值的类型跟随传入的 `modelValue` 形态；传入逗号分隔字符串时也会按字符串拆分再取单值。
- 多选模式下不在 `options` 里的模型值会被过滤掉，不会回显。
- `readonly` 只是禁用 + CSS 隐藏，`el-checkbox` 仍全部渲染在 DOM 中；如需彻底只读展示请自行处理。
- `options` 的每一项需要同时提供 `label` 与 `value`。
- 无插槽，交互文案与结构固定。

## 相关

- 样式：`packages/theme-chalk/css/checkbox.css`
- 演示页面：暂无
- 文档：`docs/theme-chalk.md`
