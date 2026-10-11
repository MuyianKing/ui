# MuDescriptionsItem 描述列表项

描述列表的字段项：渲染「标签 + 内容」双栏单元格，宽度由父级 `MuDescriptions` 的列数与本项 `span` 共同决定。

- 组件目录：`packages/components/core/descriptions-item/`
- 对外导出：`MuDescriptionsItem`
- 样式入口：`packages/components/core/descriptions-item/style/index.ts`（类名 `.mu-descriptions-item`、`.mu-descriptions-item-label`、`.mu-descriptions-item-content`）
- 演示页面：`playground/src/views/descriptions/Index.vue`（与 `MuDescriptions` 同页）
- 依赖：element-plus 无；本库 `MuDescriptions`（通过 `inject('column')` 读取列数，非组件依赖）；utils 无

## 基础用法

```vue
<script setup lang="ts">
import { MuDescriptions, MuDescriptionsItem } from '@muyianking/ui'
</script>

<template>
  <MuDescriptions :column="4">
    <MuDescriptionsItem label="接警编号">
      J20241009001
    </MuDescriptionsItem>
    <MuDescriptionsItem label="事发地址" :span="3">
      某某路 100 号
    </MuDescriptionsItem>
  </MuDescriptions>
</template>
```

## Props

| 属性       | 类型     | 默认值 | 说明                                            |
| ---------- | -------- | ------ | ----------------------------------------------- |
| label      | `string` | `''`   | 标签文本，模板中以 `{{ label }}` 插值渲染       |
| span       | `number` | `1`    | 占用的列数，单元格宽度 = `span / column * 100%` |
| labelWidth | `string` | `''`   | 标签栏宽度；为空时由工具类 `w-20`（80px）控制   |

其余属性经 `$attrs` 落到根 `div.mu-descriptions-item`（组件模板唯一根元素，自动透传）。

## Emits

无。

## Slots

| 插槽    | 作用域参数 | 说明               |
| ------- | ---------- | ------------------ |
| default | 无         | 单元格右侧的内容区 |

## 暴露

无。

## 业务逻辑

- `inject('column', 4)` 读取父容器注入的列数（父级注入的是 `computed`，本组件用 `unref` 解包后再参与计算），脱离 `MuDescriptions` 使用时回退为 `4`。
- `itemStyle` 计算 `width = (span / columnCount) * 100%`，作为单元格的行内宽度；是否换行由父容器的 `flex-wrap` 决定。`columnCount` 取注入列数，取不到或为 0 时回退 `4`。
- `labelStyle`：`labelWidth` 非空时作为标签栏行内宽度，否则返回空对象，走模板工具类 `w-20`（80px）的默认宽度。
- 结构为 `.mu-descriptions-item`（flex）内嵌 `.mu-descriptions-item-label` 与 `.mu-descriptions-item-content`；label 栏带右侧分隔线、灰底 `var(--el-fill-color-light)`、加粗、`flex-shrink: 0`，内容区 `flex: 1; min-width: 0`；两栏内边距由工具类 `px-[11px] py-2` 提供。

## 约束与注意事项

- 必须放在 `MuDescriptions` 内才能拿到正确的列数，否则按 4 列计算宽度。
- `span` 不会自动夹紧到 `column`，`span` 与 `column` 不成整数比例时会出现不满行或提前换行。
- `label` 只支持字符串；图标、富文本等需要放进默认插槽自行布局。
- 边框由 `descriptions.css` 与 `descriptions-item.css` 分别负责外框与单元格，两份样式需同时引入。

## 相关

- 配套组件：`MuDescriptions`（见 `docs/descriptions.md`）。
- 演示页面：`playground/src/views/descriptions/Index.vue`。
