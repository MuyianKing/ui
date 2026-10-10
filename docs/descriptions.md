# MuDescriptions 描述列表（容器）

描述列表的容器组件：只提供一个 flex 布局外壳与列数上下文，具体字段由配套的 `MuDescriptionsItem` 渲染。

- 组件目录：`packages/components/core/descriptions/`
- 对外导出：`MuDescriptions`
- 样式入口：`packages/components/core/descriptions/style/index.ts`（类名 `.mu-descriptions`）
- 演示页面：`playground/src/views/descriptions/Index.vue`（与 `MuDescriptionsItem` 同页）
- 依赖：element-plus 无；本库其它组件无（与 `MuDescriptionsItem` 配套）；utils 无

## 基础用法

```vue
<script setup lang="ts">
import { MuDescriptions, MuDescriptionsItem } from '@muyianking/ui'

const config = [
  { label: '接警编号', key: 'jjbh' },
  { label: '接警时间', key: 'djsj_time' },
  { label: '事发地址', key: 'sfdd', span: 3 },
]
</script>

<template>
  <MuDescriptions :column="4">
    <MuDescriptionsItem
      v-for="item in config"
      :key="item.key"
      :label="item.label"
      :span="item.span"
    >
      {{ item.label }}
    </MuDescriptionsItem>
  </MuDescriptions>
</template>
```

## Props

| 属性   | 类型     | 默认值 | 说明                                                                                       |
| ------ | -------- | ------ | ------------------------------------------------------------------------------------------ |
| column | `number` | `4`    | 栅格列数，通过 `provide('column', ...)` 传给子项，决定每个 `MuDescriptionsItem` 的宽度占比 |

其余属性经 `$attrs` 落到根 `div.mu-descriptions`（组件模板唯一根元素，自动透传）。

## Emits

无。

## Slots

| 插槽    | 作用域参数 | 说明                                        |
| ------- | ---------- | ------------------------------------------- |
| default | 无         | 描述项容器，通常放若干 `MuDescriptionsItem` |

## 暴露

无。

## 业务逻辑

- 组件渲染唯一根元素 `div.mu-descriptions` 并渲染默认插槽，本身不产生任何条目。
- setup 中执行 `provide('column', computed(() => props.column))`，把列数注入子孙层；`MuDescriptionsItem` 通过 `inject('column', 4)` 读取并用 `unref` 解包。
- 布局完全由 `packages/theme-chalk/css/descriptions.css` 控制：`display: flex` + `flex-wrap: wrap` + 宽度 100%，配合上/左边框形成网格外框（子项负责下/右边框）。

## 约束与注意事项

- `provide` 提供的是 `computed`，父级运行期改动 `column` 会广播给已渲染的子项、宽度自动重算；无需 `v-if` 重新挂载容器。
- 注入的是 ref 形态（`number | ComputedRef<number>`），脱离本组件直接 `inject('column')` 的第三方代码需要自行 `unref`。
- 只提供布局与列数上下文，没有数据源、label 宽度等 props；每个字段必须显式写一个 `MuDescriptionsItem`。
- 必须与 `MuDescriptionsItem` 搭配使用，单用只会得到一个空的 flex 容器。
- 视觉依赖 `descriptions.css` / `descriptions-item.css` 两份 theme-chalk CSS，两端任一缺失都会破坏边框网格。

## 相关

- 配套组件：`MuDescriptionsItem`（见 `docs/descriptions-item.md`）。
- 演示页面：`playground/src/views/descriptions/Index.vue`。
