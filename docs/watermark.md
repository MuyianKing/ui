# MuWatermark 水印

对 Element Plus `el-watermark` 的轻封装，仅提供本项目统一的水印样式类名。

- 组件目录：`packages/components/core/watermark/`
- 对外导出：`MuWatermark`（具名导出 + 默认导出）
- 样式入口：`packages/components/core/watermark/style/index.ts`（类名 `.mu-water-mark`）
- 演示页面：暂无
- 依赖：element-plus 的 `ElWatermark`（模板中以 `<el-watermark>` 使用）；无本库其它组件、无 utils

## 基础用法

```vue
<script setup lang="ts">
import { MuWatermark } from '@muyianking/ui'
</script>

<template>
  <!-- 组件未声明 props，el-watermark 的能力经属性透传使用 -->
  <MuWatermark content="内部资料" :font="{ color: 'rgba(0,0,0,0.15)' }" />
</template>
```

## Props

组件未显式声明任何 props（源码只有 `defineOptions({ name: 'MuWatermark' })` 与模板，不存在 `defineProps`）。`el-watermark` 支持的属性（如 `width`、`height`、`rotate`、`zIndex`、`content`、`image`、`font`、`gap`、`offset`）通过属性透传（fallthrough）落到根组件 `el-watermark` 上。

## Emits

无。

## Slots

无（模板中未定义 `<slot>`）。

## 暴露

无。

## 业务逻辑

- 模板仅一行：`<el-watermark class="mu-water-mark" />`，不传任何业务属性，也不做 `v-bind="$attrs"`。
- 组件是单根组件，外部传入的属性 / 事件由 Vue 的 fallthrough attrs 自动合并到 `el-watermark` 根节点，`class` 与 `mu-water-mark` 合并。
- `.mu-water-mark` 样式（`packages/theme-chalk/css/watermark.css`）将其设为 `width/height: 100%`、`position: absolute !important`、`top/left: 0`、`pointer-events: none`，即铺满并覆盖在定位父级之上且不拦截交互；因此使用方需要给包裹容器设置 `position: relative`（或其它定位上下文）。
- 样式入口先引 `element-plus/es/components/watermark/style/css` 再引本库 CSS，保证 el-watermark 的基础样式先就位。

## 约束与注意事项

- 组件只负责「加类名 + 引样式」，不提供默认水印内容；不传 `content` / `image` 时 `el-watermark` 不产生可见水印。
- `.mu-water-mark` 是 `position: absolute`，必须有定位父容器，否则会相对视口或最近的定位祖先铺满，出现覆盖范围异常。
- `pointer-events: none` 意味着水印区域不响应鼠标事件，这是刻意行为（避免遮挡底层交互），如需可交互水印须自行覆盖样式。
- 属性透传依赖单根实现；若将来在模板中新增同级根节点，fallthrough 会失效，需要显式 `v-bind="$attrs"`。

## 相关

- element-plus：`ElWatermark`
- 公共入口导出：`packages/components/index.ts`
- 全局配置（如需读取水印相关全局项，目前该组件未使用）：`packages/components/core/config-provider/src/Index.vue`
