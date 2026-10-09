# MuVideo 视频播放

基于原生 `<video>` 的视频播放组件，单击播放/暂停、双击进出全屏，并支持通过全局配置解析视频地址。

- 组件目录：`packages/components/core/video/`
- 对外导出：`MuVideo`（具名导出 + 默认导出）
- 样式入口：`packages/components/core/video/style/index.ts`（类名 `.mu-video`、`.mu-video-placeholder`）
- 演示页面：暂无
- 依赖：无 element-plus 组件、无本库其它组件、无 utils；使用原生 `<video>`，**不依赖 wavesurfer**。全局能力经 `GLOBAL_CUSTOM_CONFIG.previewFileUrl` 注入

## 基础用法

```vue
<script setup lang="ts">
import { MuVideo } from '@muyianking/ui'
</script>

<template>
  <!-- 有 src：解析地址后渲染 video -->
  <MuVideo src="2026/10/09/demo.mp4" width="480px" height="270px" controls />

  <!-- 无 src：渲染默认插槽内容作为占位 -->
  <MuVideo width="480px" height="270px">
    暂无视频
  </MuVideo>
</template>
```

## Props

| 属性      | 类型                                                       | 默认值      | 说明                                     |
| --------- | ---------------------------------------------------------- | ----------- | ---------------------------------------- |
| src       | `string`                                                   | `''`        | 视频地址；会被全局 `previewFileUrl` 解析 |
| prefix    | `string`                                                   | `''`        | 传给 `previewFileUrl` 的前缀参数         |
| height    | `string`                                                   | `'auto'`    | 根容器高度，作用于 `:style`              |
| width     | `string`                                                   | `'300px'`   | 根容器宽度，作用于 `:style`              |
| controls  | `boolean`                                                  | `false`     | 是否显示原生播放控件，透传给 `<video>`   |
| fit       | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `'contain'` | 映射为 `<video>` 的 `object-fit`         |
| noPreview | `boolean`                                                  | `false`     | 源码中已声明默认值，但模板与逻辑均未使用 |

## Emits

无。

## Slots

| 插槽    | 作用域参数 | 说明                                                             |
| ------- | ---------- | ---------------------------------------------------------------- |
| default | 无         | 无 `src`（解析后为空）时显示，作为占位内容，默认渲染「暂无视频」 |

## 暴露

无。

## 业务逻辑

- `videoSrc` 计算属性：`src` 非空时，若 `inject('GLOBAL_CUSTOM_CONFIG')` 提供了 `previewFileUrl`，则返回 `previewFileUrl(src, prefix)` 的结果，否则回退为原始 `src`；`src` 为空则返回 `''`。
- 根元素 `<div class="mu-video">` 承载 `height` / `width` 内联样式与两个交互：`@click` 调 `togglePlay`、`@dblclick` 调 `handleDblclick`。
- `togglePlay`：读取 `<video>` 的真实 `paused` 状态决定 `play()` 还是 `pause()`；`play()` 可能因浏览器自动播放策略被 reject，用 `.catch(() => {})` 吞掉异常，且**不维护自管播放态**，避免「播放失败时记录的状态与真实状态相反」。
- `handleDblclick`：根据 `document.fullscreenElement` 判断，进入全屏为 `video.requestFullscreen()`，退出为 `document.exitFullscreen()`，二者均 `.catch(() => {})`。
- `<video>` 仅在 `videoSrc` 非空时用 `v-if` 渲染，`:controls` 与 `:style="{ objectFit: fit }"` 分别来自 `controls`、`fit`。
- 根元素未显式 `v-bind="$attrs"`，但为单根组件，Vue 的 fallthrough attrs 仍会合并到根 `div`。

## 约束与注意事项

- 未声明 `$attrs` 透传写法，属单根 fallthrough；透传的 `class` 会与 `.mu-video` 合并，但元素属性会落到包裹 `div`（根）而非 `<video>`，需要直接控制 `<video>` 原生属性（如 `poster`、`autoplay`）时无法经属性透传实现。
- `src` 是「相对路径 / 业务路径」而非最终 URL：配置了全局 `previewFileUrl` 时一律先经它解析，未配置时直接当 URL 使用，两种模式下 `src` 语义不同，接入时要与全局配置保持一致。
- `noPreview` 已写入 props 却没有任何消费点，属预留或遗留属性，改动前请确认是否有隐式依赖。
- 全屏能力依赖浏览器 Fullscreen API（`requestFullscreen` / `exitFullscreen`），不支持该 API 的环境下双击静默无效。
- 视频地址依赖 `GLOBAL_CUSTOM_CONFIG`（由 `MuConfigProvider` provide）才能做业务解析；不配也能播，但要求后端返回的就是可直接访问的 URL。

## 相关

- 全局配置：`packages/components/core/config-provider/src/Index.vue`（provide `GLOBAL_CUSTOM_CONFIG`，含 `previewFileUrl`）
- 使用方：`packages/components/core/preview/src/Index.vue`（按后缀识别视频后渲染 `MuVideo`）
- 公共入口导出：`packages/components/index.ts`
