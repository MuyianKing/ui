# MuGridLayout 自适应网格布局

按容器实际宽度自动计算列数的网格容器，列数随容器尺寸变化重排。

- 组件目录：`packages/components/core/grid-layout/`
- 对外导出：`MuGridLayout`
- 样式入口：`packages/components/core/grid-layout/style/index.ts`（类名 `.mu-grid-layout`，该入口只引 `@muyianking/theme-chalk/css/grid-layout.css`，而该 CSS 当前为空文件，样式实际由 JS 写入行内）
- 演示页面：`playground/src/views/grid/Index.vue`
- 依赖：element-plus 无（未引入）；本库其它组件无；utils 无。核心逻辑来自同目录 `src/useGridLayout.ts`。

## 基础用法

取自演示页 `playground/src/views/grid/Index.vue`。

```vue
<script setup lang="ts">
import { MuGridLayout } from '@muyianking/ui'
</script>

<template>
  <MuGridLayout :width="300" :min-width="300" class="flex-1 overflow-auto">
    <div v-for="index in 30" :key="index" class="grid-item">
      {{ index }}
    </div>
  </MuGridLayout>
</template>
```

## Props

| 属性      | 类型     | 默认值     | 说明                                             |
| --------- | -------- | ---------- | ------------------------------------------------ |
| width     | `number` | 无（必填） | 期望的单列宽度，单位为 px，直接参与列数计算      |
| minWidth  | `number` | `0`        | 单列最小宽度；计算出的单列宽度小于该值时列数减 1 |
| gap       | `number` | `10`       | 行、列间距的统一回退值，单位为 px                |
| rowGap    | `number` | `0`        | 行间距，单位为 px；为 0 时回退到 `gap`           |
| columnGap | `number` | `0`        | 列间距，单位为 px；为 0 时回退到 `gap`           |

其余属性默认透传到根 `div.mu-grid-layout`（原生元素，非 el-\* 组件），演示页即通过 `class` 透传控制高度与滚动。

## Emits

无。

## Slots

| 插槽    | 作用域参数 | 说明                                              |
| ------- | ---------- | ------------------------------------------------- |
| default | 无         | 网格子项内容，直接渲染在 `.mu-grid-layout` 容器内 |

## 暴露

无。

## 业务逻辑

- 组件本体通过 `useTemplateRef<HTMLElement>('containerRef')` 获取根容器，并把模板引用与配置 getter 交给 `useGridLayout`。
- 间距取值链：`rowGap || gap || 10`、`columnGap || gap || 10`；因 `rowGap`/`columnGap` 默认值为 `0`，未显式指定时结果等价于 `gap`（默认 10）。
- `useGridLayout` 的第二参数是 getter 而非快照，`initStyle` / `setColumnRow` 每次执行都用 `toValue(config)` 取最新值。
- 列数计算（`setColumnRow`）：`column = clientWidth / width`，小数部分大于 `0.5` 向上取整，否则向下取整；再判断 `minWidth && clientWidth / column < minWidth` 时列数减 1；最终写入 `gridTemplateColumns = repeat(max(column, 1), 1fr)`，保证至少 1 列。
- `initStyle` 写入 `display: grid` 与 `rowGap` / `columnGap`（px）到元素行内样式。
- 尺寸变化由 `ResizeObserver` 监听容器驱动重算；`onScopeDispose` 中 `disconnect()` 并置空，组件卸载后观察器不再存活。
- `useGridLayout` 的第一个参数支持三种形态：getter 函数、`ref` 对象（含 `value`）、原生 `HTMLElement`。`ref` 形态会 `watch` 一次（`flush: 'post'`），待挂载拿到元素后再初始化。

## 约束与注意事项

- `width` 必填，源码按像素直接参与除法与比较，请传数值（px）。
- 容器必须有可测量的宽度。若父级未约束宽度，`clientWidth` 为 0，列数会经 `Math.max(column, 1)` 退化为 1 列。
- 列数重算由 `ResizeObserver` 触发；仅修改 `width` 等 prop 而不改变容器尺寸时，不保证立即重排。
- 布局与间距通过行内 style 写入，不是 CSS 类；`.mu-grid-layout` 仅作语义标记，`grid-layout.css` 当前为空。
- 组件没有声明 `defineExpose`，无法从外部调用重算方法。

## 相关

- 组合式函数：[`packages/components/core/grid-layout/src/useGridLayout.ts`](packages/components/core/grid-layout/src/useGridLayout.ts)
- 样式文件：[`packages/theme-chalk/css/grid-layout.css`](packages/theme-chalk/css/grid-layout.css)
- 演示页面：[`playground/src/views/grid/Index.vue`](playground/src/views/grid/Index.vue)
