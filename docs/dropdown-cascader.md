# MuDropdownCascader 下拉级联选择

以「下拉面板 + 级联选择」形式提供单/多选层级数据选择，并支持关键字过滤与内置「全部」项。

- 组件目录：`packages/components/core/dropdown-cascader/`
- 对外导出：`MuDropdownCascader`
- 样式入口：`packages/components/core/dropdown-cascader/style/index.ts`（类名 `.mu-dropdown-cascader`）
- 演示页面：`playground/src/views/dropdown-cascader/Index.vue`
- 依赖：element-plus 的 `ElDropdown`、`ElCascaderPanel`、`ElInput`；本库 `MuIcon`；未使用 utils

## 基础用法

```vue
<script setup lang="ts">
import { MuDropdownCascader } from '@muyianking/ui'
import { ref } from 'vue'

const value = ref()
const options = [
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
</script>

<template>
  <MuDropdownCascader v-model="value" :options="options" label="下拉" />
</template>
```

## Props

| 属性          | 类型                  | 默认值       | 说明                                                           |
| ------------- | --------------------- | ------------ | -------------------------------------------------------------- |
| options       | `any[]`               | `() => []`   | 级联数据源，节点默认按 `label` / `value` / `children` 取值     |
| multiple      | `boolean`             | `false`      | 是否多选                                                       |
| label         | `string`              | `''`         | 显示文案：多选时直接显示该值；单选时作为未匹配到选项的回退文案 |
| hasSearch     | `boolean`             | `false`      | 是否在面板内显示关键字搜索框                                   |
| noAll         | `boolean`             | `false`      | 为 `true` 时不插入内置「全部」项                               |
| noArrow       | `boolean`             | `false`      | 为 `true` 时隐藏右侧箭头图标                                   |
| cascaderProps | `Record<string, any>` | `() => ({})` | 覆盖/合并传给 `el-cascader-panel` 的 props 配置                |

组件通过 `defineModel<any>({ default: '' })` 支持 `v-model`（`modelValue` / `update:modelValue`）。其余属性经 `$attrs` 自动透传给根节点 `el-dropdown`。

## Emits

| 事件   | 参数       | 说明                                                            |
| ------ | ---------- | --------------------------------------------------------------- |
| change | `val: any` | 选中变化时触发；单选为选中节点的 data，多选为选中节点 data 数组 |

## Slots

无。

## 暴露

无。

## 业务逻辑

- `cascaderPropsConfig` 是 `computed`：在内部默认配置（`multiple`、`checkStrictly: false`、`emitPath: false`、`label` / `value` / `children` 键名）之上展开 `props.cascaderProps`。必须保持 `computed`，写成 setup 期一次性快照会导致 `multiple` / `cascaderProps` 变化不响应。
- `filteredOptions`：`noAll` 为 `false` 时在数据源头部插入一项 `{ [labelKey]: '全部', [valueKey]: '' }`，随后按 `searchKey` 过滤。过滤走纯函数 `filterTree`，返回新数组、不改写 `props.options` 的子节点；父节点命中关键字时保留完整子树，仅子节点命中时以 `{ ...item, [childrenKey]: matched }` 浅拷贝保留匹配分支。
- `handleChange`：`nextTick` 后读取 `cascaderPanelRef.getCheckedNodes(false)`（只取叶子节点）。多选下若 `model` 含内置「全部」的值 `''`，则清空选中节点、`model = []` 并 `emit('change', [])`；否则 `emit('change', 节点 data 数组)`。单选下 `emit('change', getCheckedNodes(false)[0]?.data)`。
- `activeStatus` 决定标签是否加 `active-label` 类：单选要求 `model` 不为 `''` / `null` / `undefined`，多选要求为非空数组。
- `displayLabel`：多选直接返回 `props.label`；单选在**完整** `props.options` 中递归查找 `model` 对应标签（避免搜索过滤后选中项无法回显），查不到时回退 `props.label`。
- `arrowStatus` 由 `el-dropdown` 的 `visible-change` 事件驱动，控制箭头 180 度旋转。

## 约束与注意事项

- 选中「全部」在单选下会把 `model` 设为 `''`，`activeStatus` 随之变为未激活态，属预期行为。
- 搜索匹配只按当前 `cascaderPropsConfig.label` 指定的键做字符串 `includes`，区分大小写，不支持拼音或模糊匹配。
- 单选回显依赖 `label` / `value` 键名与 `cascaderProps` 一致；自定义键名时 `findLabel` 与 `filterTree` 会同步使用。
- `options` 类型为 `any[]`，组件不做节点结构校验。

## 相关

- 关联组件：`MuIcon`（箭头图标）
- utils：无
- 公共类型：无（节点结构未收敛到公共类型）
- 演示页面：`playground/src/views/dropdown-cascader/Index.vue`
