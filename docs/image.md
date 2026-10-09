# MuImage 图片

对 `el-image` 的封装，统一尺寸、填充方式与预览，并支持通过全局配置为图片地址拼接前缀。

- 组件目录：`packages/components/core/image/`
- 对外导出：`MuImage`
- 样式入口：`packages/components/core/image/style/index.ts`（类名 `.mu-preview-img`；注意不是 `.mu-image`）
- 演示页面：暂无
- 依赖：element-plus 的 `ElImage`、`vLoading`（loading 指令）；运行时可选注入 `MuConfigProvider` 的 `GLOBAL_CUSTOM_CONFIG.previewFileUrl`。

## 基础用法

演示页不存在，以下据源码推断。

```vue
<script setup lang="ts">
import { MuImage } from '@muyianking/ui'
</script>

<template>
  <MuImage src="/files/demo.png" prefix="/oss" :preview="['/files/demo.png']" />
</template>
```

## Props

| 属性      | 类型                                                       | 默认值      | 说明                                                   |
| --------- | ---------------------------------------------------------- | ----------- | ------------------------------------------------------ |
| src       | `string`                                                   | `''`        | 图片地址；为空时不渲染 `el-image`                      |
| prefix    | `string`                                                   | `''`        | 传给 `previewFileUrl` 的前缀参数                       |
| preview   | `string[]`                                                 | `() => []`  | 自定义预览图地址列表；非空时作为 `el-image` 的预览列表 |
| noPreview | `boolean`                                                  | `false`     | 为 `true` 时禁用预览（预览列表置空）                   |
| fit       | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `'contain'` | 透传给 `el-image` 的图片填充方式                       |
| height    | `string`                                                   | `'100px'`   | 容器高度，写入内容 `style`                             |
| width     | `string`                                                   | `'100px'`   | 容器宽度，写入内容 `style`                             |

## Emits

无。

## Slots

| 插槽    | 作用域参数 | 说明                                                                           |
| ------- | ---------- | ------------------------------------------------------------------------------ |
| default | 无         | 渲染在 `.mu-preview-img` 容器内、`el-image` 之后；`src` 为空时它是唯一可见内容 |

## 暴露

无。

## 业务逻辑

- `prevSrc`（实际展示地址）：`src` 非空时，若注入了 `GLOBAL_CUSTOM_CONFIG.previewFileUrl` 则调用 `previewFileUrl(src, prefix)` 得到最终地址，否则直接用 `src`；`src` 为空时结果为 `''`。
- `el-image` 由 `v-if="prevSrc"` 控制：`src` 为空即整块不渲染；`src` 非空但处理后为空字符串时同样不渲染。
- `previewList`：`noPreview` 为 `true` 时返回 `[]`（禁用点击预览）；否则 `preview` 非空时用 `preview`，为空时回退为 `[prevSrc]`。
- 预览固定开启 `preview-teleported`；`#placeholder` 插槽内置一个 `v-loading="true"` 且文案为“加载中...”的占位块（加载态由 `el-image` 的占位机制驱动）。
- 容器 `.mu-preview-img` 由 `height` / `width` 通过内联 `style` 控制尺寸，默认 100px × 100px。

## 约束与注意事项

- 只有主图 `src` 会经过 `previewFileUrl` 处理；`preview` 数组中的地址原样传给 `el-image`，不做前缀拼接。若预览图也需前缀，请自行传入处理后的地址。
- `previewFileUrl` 必须由 `MuConfigProvider` 的 `customConfig` 注入；未注入时直接使用 `src`，`prefix` 不生效。
- `src` 为空时不会渲染 `el-image`，但仍会渲染默认插槽，可用于放占位内容。
- `el-image` 使用 Tailwind 类 `w-full h-full`，需消费方应用启用 Tailwind。
- `.mu-preview-img` 仅设置 `position: relative`，尺寸由内联样式决定。

## 相关

- 全局配置：[`packages/components/core/config-provider/src/Index.vue`](packages/components/core/config-provider/src/Index.vue) 的 `GLOBAL_CUSTOM_CONFIG.previewFileUrl`
- 同类组件：[`packages/components/core/video/`](packages/components/core/video/)（同样注入 `previewFileUrl`）
- 样式文件：[`packages/theme-chalk/css/image.css`](packages/theme-chalk/css/image.css)
