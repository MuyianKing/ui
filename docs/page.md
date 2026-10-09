# MuPage 分页

对 ElPagination 的分页封装，左侧附带「共 N 条，当前第 x~y 条」信息行。

- 组件目录：`packages/components/core/page/`
- 对外导出：`MuPage`
- 样式入口：`packages/components/core/page/style/index.ts`（类名 `.mu-pagination-wrapper`，信息行选择器 `.info` / `.num`）
- 演示页面：`playground/src/views/page/Index.vue`
- 依赖：element-plus 的 `ElPagination`

## 基础用法

```vue
<script setup lang="ts">
import { MuPage } from '@muyianking/ui'
import { reactive } from 'vue'

const query = reactive({ limit: 20, page: 1 })
const table = reactive({ count: 100 })

function getData() {
  // 重新拉取列表
}
</script>

<template>
  <MuPage v-model="query.page" :size="query.limit" :count="table.count" @change="getData" />
</template>
```

带每页条数切换：

```vue
<template>
  <mu-page v-model="query.page" v-model:size="query.limit" :count="table.count" sizes @change="getData" />
</template>
```

## Props

| 属性       | 类型    | 默认值  | 说明                                                              |
| ---------- | ------- | ------- | ----------------------------------------------------------------- |
| modelValue | number  | `1`     | 当前页码，配合 `v-model`                                          |
| count      | number  | `0`     | 数据总条数（对应 ElPagination 的 `total`）；为 0 时整个组件不渲染 |
| size       | number  | `20`    | 每页条数（对应 ElPagination 的 `page-size`），配合 `v-model:size` |
| sizes      | boolean | `false` | 是否显示每页条数选择器，决定 layout 是否加 `sizes`                |
| pagerCount | number  | `7`     | 页码按钮数量，传给 ElPagination                                   |

组件未使用 `v-bind="$attrs"`，只暴露上表 5 个属性，其余 ElPagination 能力不再透传。

## Emits

| 事件              | 参数   | 说明                               |
| ----------------- | ------ | ---------------------------------- |
| update:modelValue | number | 页码变化（v-model）                |
| update:size       | number | 每页条数变化（v-model:size）       |
| change            | 无     | 页码或每页条数变化时触发，不带参数 |

## Slots

无。

## 暴露

无。

## 业务逻辑

- 根节点 `div.mu-pagination-wrapper` 用 `v-if="count"` 控制，`count` 为 0（或假值）时整个组件不渲染。
- 信息行 `div.info` 仅在 `lastNum` 为真时渲染，内容为：`共 {count} 条，当前第 {firstNum}~{lastNum} 条`；当 `firstNum === lastNum` 时省略 `~lastNum`。
  - `firstNum = size * (modelValue - 1) + 1`
  - `lastNum = count > size * modelValue ? modelValue * size : count`
- `layout` computed：`sizes` 为真输出 `sizes,prev, pager, next`，否则 `prev, pager, next`；模板中固定 `background` 与 `hide-on-single-page`。
- ElPagination 绑定：`:current-page="modelValue"`、`:page-size="size"`、`:total="count"`、`:pager-count="pagerCount"`、`:layout`。
- 事件映射：`@update:current-page` 触发 `handlePageChange`，依次 `emit('update:modelValue', val)` 与 `emit('change')`；`@update:page-size` 触发 `handleSizeChange`，依次 `emit('update:size', val)` 与 `emit('change')`。

## 约束与注意事项

- `count` 为 0 时组件完全不渲染，含信息行与页码；这是设计前提，空数据无需分页。
- props / emits 只覆盖 ElPagination 的一个子集，且没有 `$attrs` 透传：`total`、`current-page`、`page-size`、`pager-count`、`layout`、`background`、`hide-on-single-page` 之外的属性与事件无法经 `MuPage` 传入，需要自行扩展 props。
- `size` 在本组件里表示「每页条数」（映射到 ElPagination 的 `page-size`），不是 ElPagination 用于控制组件尺寸的 `size` 属性；命名为历史约定，勿混淆。
- `change` 事件不带任何参数，需要具体页码 / 每页条数时用 `v-model` 与 `v-model:size`（或 `update:*` 事件）读取。
- `sizes` 只控制 layout 是否包含 `sizes`，每页条数候选值沿用 ElPagination 默认，本组件不提供自定义候选的入口。
- 无 `defineExpose`，拿不到 ElPagination 实例方法。

## 相关

- element-plus `ElPagination`
- 演示页面 `playground/src/views/page/Index.vue`
- 样式 `packages/theme-chalk/css/page.css`
