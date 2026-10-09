# MuPreview 文件预览列表

按文件后缀自动分派图片 / 视频 / 普通文件三种渲染方式的预览容器。

- 组件目录：`packages/components/core/preview/`
- 对外导出：`MuPreview`
- 样式入口：`packages/components/core/preview/style/index.ts`（模板根类名 `.mu-preview`；`theme-chalk/css/preview.css` 现有选择器为 `.mu-preview-wrapper`，与模板不一致，属历史遗留）
- 演示页面：暂无
- 依赖：本库 `MuImage`、`MuVideo`、`MuFile`（其中 `MuImage` 用 ElImage，`MuFile` 用 `MuIcon`）；经子组件间接依赖 `GLOBAL_CUSTOM_CONFIG` 的 `previewFileUrl` / `downloadFile`

## 基础用法

```vue
<script setup lang="ts">
import { MuPreview } from '@muyianking/ui'

const files = [
  { path: 'https://cdn.example.com/a.png', name: 'a.png' },
  { path: 'https://cdn.example.com/b.mp4', name: 'b.mp4' },
  { path: 'https://cdn.example.com/c.pdf', name: 'c.pdf' },
]
</script>

<template>
  <MuPreview :files="files" :width="120" :height="120" />
</template>
```

依赖全局配置时（图片地址拼接、文件下载）：

```vue
<template>
  <mu-config-provider :custom-config="{ previewFileUrl, downloadFile }">
    <mu-preview :files="files" card />
  </mu-config-provider>
</template>
```

## Props

| 属性      | 类型                                   | 默认值    | 说明                                     |
| --------- | -------------------------------------- | --------- | ---------------------------------------- |
| files     | `any[] \| Record<string, any> \| null` | `null`    | 单个文件对象或文件数组；为空渲染空容器   |
| height    | string                                 | `'100px'` | 单个预览项高度，透传给子组件             |
| width     | string                                 | `'100px'` | 单个预览项宽度，透传给子组件             |
| noPreview | boolean                                | `false`   | 关闭图片点击大图预览，仅透传给 `MuImage` |
| card      | boolean                                | `false`   | 卡片样式，透传给 `MuFile`                |

## Emits

无。

## Slots

无。

## 暴露

无。

## 业务逻辑

- `fileList` computed：`files` 为假值返回 `[]`；是数组则原样使用；单个对象则包装成 `[files]`。空数组 / `null` 时根节点仍渲染，但内部无内容。
- `getFileUrl(file)`：字符串元素本身即地址；对象取 `file.path || file.url`，两者都没有则返回 `''`。类型判定与 `src` 统一走这一个地址，避免判定与渲染取到不同字段。
- `getFileType(file)`：取 `getFileUrl(file)` 的最后一个 `.` 后缀并转小写；命中 `jpg/jpeg/png/gif/bmp/webp/svg` 返回 `'image'`，命中 `mp4/webm/ogg/mov/avi` 返回 `'video'`，其余（含无后缀）返回 `'file'`。字符串 URL 因此能正常识别为图片 / 视频。
- 分派渲染（`v-for` 以 index 为 key）：
  - image → `mu-image`，`:src="getFileUrl(file)"`，带 `:height`、`:width`、`:no-preview="noPreview"`。
  - video → `mu-video`，`:src="getFileUrl(file)"`，带 `:height`、`:width`。
  - 其余 → `mu-file`，`:file="typeof file === 'object' ? file : { path: file }"`，带 `:card`、`:height`、`:width`。
- 地址解析与下载由子组件完成：`MuImage` / `MuVideo` 注入 `GLOBAL_CUSTOM_CONFIG.previewFileUrl(url, prefix)` 生成真实地址，未配置时直接用原始 `src`；`MuFile` 注入 `previewFileUrl` 与 `downloadFile`，只有配置了 `downloadFile` 才可下载。
- `noPreview` 只影响图片（视频的 `noPreview` 在 `MuVideo` 中虽有声明，但其模板未使用）。

## 约束与注意事项

- 类型判定与 `src` 统一取 `getFileUrl(file)`（对象 `path` 优先、回退 `url`），不会再出现「判定为图片 / 视频、却把整个对象当 `src`」的 `[object Object]` 渲染。对象两个字段都缺失时 `src` 为空字符串，`MuImage` / `MuVideo` 内部按空值处理（不渲染媒体元素）。
- `MuFile` 未接收 `noDownload`，普通文件的下载入口是否可用完全取决于 `MuConfigProvider` 是否提供了 `downloadFile`；同时 `MuFile` 的 `fileName` 取 `file.name || file.fileName`，缺失时列表显示为空。
- 图片大图预览与视频 / 文件真实地址依赖 `GLOBAL_CUSTOM_CONFIG.previewFileUrl`，需要外层 `MuConfigProvider` 提供；未提供时按原始地址直连，可能因鉴权或前缀缺失而加载失败。
- `files` 为数组时不校验元素类型；元素为字符串 URL，或带 `path`（或 `url`）的对象时，都能正确分派图片 / 视频 / 普通文件。
- 无 emits、无插槽、无 `defineExpose`；`MuImage` / `MuVideo` / `MuFile` 自身支持的插槽不由此组件转发。

## 相关

- `packages/components/core/image/src/Index.vue`（`previewFileUrl`、ElImage 大图预览）
- `packages/components/core/video/src/Index.vue`（`previewFileUrl`、点击播放 / 双击全屏）
- `packages/components/core/file/src/Index.vue`（`previewFileUrl`、`downloadFile`、`MuIcon`）
- 全局配置 `MuConfigProvider` 的 `GLOBAL_CUSTOM_CONFIG`（`previewFileUrl`、`downloadFile`），详见 `docs/README.md` 的「全局配置」
