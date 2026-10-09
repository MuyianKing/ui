# MuDropdown 下拉选择

基于 Element Plus `el-dropdown` 的下拉选择封装：支持单选 / 多选、内置「全部」项、关键字搜索、以及 label 显示策略。

- 组件目录：`packages/components/core/dropdown/`
- 对外导出：`MuDropdown`
- 样式入口：`packages/components/core/dropdown/style/index.ts`（模板类名 `.mu-dropdown`、`.dropdown-label`、`.active-label`、`.arrow-icon`、`.deg-180`；主题另定义 `.mu-dropdown-popover`）
- 演示页面：`playground/src/views/dropdown/Index.vue`
- 依赖：element-plus 的 `ElDropdown`、`ElDropdownMenu`、`ElDropdownItem`、`ElCheckbox`、`ElCheckboxGroup`、`ElScrollbar`、`ElInput`（对应样式在 style/index.ts 逐条引入）；本库 `MuIcon`（`../../icon`，用于右侧箭头）；utils 无

## 基础用法

```vue
<script setup lang="ts">
import { MuDropdown } from '@muyianking/ui'
import { ref } from 'vue'

const options = [
  { label: '测试1', value: 1 },
  { label: '测试2', value: 2 },
]

const single = ref()
const multiple = ref([])
</script>

<template>
  <!-- 单选：选中后 label 区显示选项文本 -->
  <MuDropdown v-model="single" :options="options" label="下拉" />

  <!-- 保持 label + 搜索 -->
  <MuDropdown v-model="single" :options="options" keep-label has-search label="下拉" />

  <!-- 多选 -->
  <MuDropdown v-model="multiple" :options="options" multiple label="下拉" />
</template>
```

## Props

| 属性      | 类型      | 默认值             | 说明                                                     |
| --------- | --------- | ------------------ | -------------------------------------------------------- |
| options   | `any[]`   | `[]`（`() => []`） | 选项数组，读取 `item.label` 与 `item.value`              |
| multiple  | `boolean` | `false`            | 多选模式，改为渲染 `el-checkbox-group`                   |
| label     | `string`  | `''`               | 未选中时的占位文案；`keepLabel` 为 `true` 时作为固定文案 |
| keepLabel | `boolean` | `false`            | 始终显示 `label`，不随选中值替换为选项文本               |
| hasSearch | `boolean` | `false`            | 显示搜索输入框，按 `label` 是否包含关键字过滤            |
| noAll     | `boolean` | `false`            | 隐藏「全部」项                                           |
| noArrow   | `boolean` | `false`            | 隐藏右侧箭头图标                                         |

另含由 `defineModel<any>({ default: () => undefined })` 生成的 `v-model`（`modelValue`）：单选时为单个值，多选时为数组。

其余属性经 `$attrs` 透传给根 `el-dropdown`（组件模板唯一根元素即 `el-dropdown`，自动透传）。

## Emits

| 事件   | 参数       | 说明                                              |
| ------ | ---------- | ------------------------------------------------- |
| change | `val: any` | 单选选中值、多选选中数组；单选「全部」时抛出 `''` |

## Slots

无。

## 暴露

无。

## 业务逻辑

- `model` 为单 / 多选共用的 `defineModel<any>`。`selectedValues` 把 `model` 归一化为数组（空值 → `[]`，非数组 → 单元素数组），供多选 `el-checkbox-group` 的 `model-value` 使用。
- 单选：点击 `el-dropdown-item` 触发 `handleSelect`，写入 `model` 并 `emit('change', val)`；「全部」项传入空字符串。
- 多选：`el-checkbox-group` 的 `@change` 触发 `handleCheckboxChange`，直接写入数组并 `emit('change', val)`。
- 搜索：`filteredOptions` 在 `hasSearch` 且 `searchKey` 非空时按 `item.label?.includes(searchKey)` 过滤，否则原样返回 `options`。
- 展示文案 `displayLabel`：`keepLabel` 为 `true` 时恒为 `label`；否则单选且 `model` 有值时从 `options` 反查匹配项的 `label`（查不到回退 `label`）；多选时恒为 `label`。
- 交互态：`el-dropdown` 的 `@visible-change` 写入 `arrowStatus`，展开时箭头加 `.deg-180` 旋转 180 度；`.active-label` 高亮条件为单选时 `model` 有值、多选时 `selectedValues.length > 0`（避免空数组 `[]` 被真值判断误判为有值）。
- 选项列表外层包 `el-scrollbar`，`max-height="300px"`；`hasSearch` 时容器加 `p-2`。
- 触发方式固定为 `trigger="click"`。

## 约束与注意事项

- `options` 类型是 `any[]`，未与 `OptionsType` 强绑定；搜索依赖 `item.label` 为字符串。
- 多选的「全部」是一个 `value=""` 的普通 `el-checkbox`，不参与全选 / 全不选联动，勾选只会在数组里增删空字符串。
- 多选下即使不传 `keepLabel`，label 区也始终显示 `label`，不会汇总已选标签。
- `trigger="click"`、列表 `max-height` 为源码写死，无法通过 props 调整。
- 箭头旋转与激活高亮依赖 `packages/theme-chalk/css/dropdown.css`（`.mu-dropdown` / `.deg-180` / `.active-label`）；该文件中的 `.mu-dropdown-popover .active` 等选择器在当前模板中未见对应类名。
- 组件依赖本库 `MuIcon`，使用方需保证 `icon` 组件样式已随包引入。
- 其余属性经 `$attrs` 透传给 `el-dropdown`。

## 相关

- 关联组件：`MuIcon`（`packages/components/core/icon/`，箭头图标）、`MuDropdownCascader`（同族下拉级联）。
- 公共类型：`OptionsType` 定义于 `packages/components/core/types/common.ts`（本组件未直接引用）。
- 演示页面：`playground/src/views/dropdown/Index.vue`。
