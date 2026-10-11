# MuFile 文件展示

按文件名后缀显示对应图标的文件展示控件，支持单行与卡片两种形态，并触发下载。

- 组件目录：`packages/components/core/file/`
- 对外导出：`MuFile`
- 样式入口：`packages/components/core/file/style/index.ts`（类名 `.mu-file-card` / `.mu-file-line`）
- 演示页面：暂无
- 依赖：unplugin-icons 编译期图标（`~icons/vscode-icons/*`、`~icons/ep/download`）、`utils/message` 的 `success`、`GLOBAL_CUSTOM_CONFIG` 全局配置；未直接使用 element-plus 组件

## 基础用法

```vue
<script setup lang="ts">
import { MuFile } from '@muyianking/ui'

const file = { name: '合同.pdf', url: 'https://example.com/contract.pdf' }
</script>

<template>
  <MuFile :file="file" />
  <MuFile :file="file" card />
</template>
```

## Props

| 属性       | 类型                          | 默认值    | 说明                                                           |
| ---------- | ----------------------------- | --------- | -------------------------------------------------------------- |
| file       | `Record<string, any> \| null` | `null`    | 文件对象；名称取 `name` 或 `fileName`，地址取 `url` 或 `path`  |
| noDownload | `boolean`                     | `false`   | 为 `true` 时隐藏下载入口（卡片态隐藏按钮、单行态点击不再下载） |
| card       | `boolean`                     | `false`   | 为 `true` 时渲染卡片形态，否则渲染单行形态                     |
| height     | `string`                      | `'100px'` | 卡片态高度                                                     |
| width      | `string`                      | `'100px'` | 卡片态宽度                                                     |

其余属性经 `$attrs` 自动透传到根节点（卡片态 `div.mu-file-card` / 单行态 `div.mu-file-line`）。

## Emits

无。

## Slots

无。

## 暴露

无。

## 业务逻辑

- `fileName`：依次取 `file.name`、`file.fileName`，都没有则为 `''`。
- `fileUrl`：依次取 `file.url`、`file.path`。上传链路里存的是 `path`，只读 `url` 会拿到 `undefined`，故两者都要兼容。
- `fileSuffix`：取文件名最后一个 `.` 之后的小写字符串。
- `fileIcon`：按后缀映射图标（`xls` / `xlsx` → Excel，`doc` / `docx` → Word，`ppt` / `pptx` → PowerPoint，`pdf` → PDF，`mp3` / `wav` → 音频），未命中回退 `vscode-icons:file-type-text`（原 `file-type-default` 图标名在 @iconify/json 中不存在，属历史坏引用）。
- `handleDownload`：`noDownload` 为 `true`、未注入 `downloadFile`、或地址为空时直接返回；否则调用 `GLOBAL_CUSTOM_CONFIG.downloadFile(fileUrl, fileName)` 并 `success('开始下载')`。
- 单行态点击的范围是 `.file-link`（含图标与文件名），卡片态为右侧 `.file-actions` 内的下载图标。

## 约束与注意事项

- 下载能力依赖 `MuConfigProvider` 经 `GLOBAL_CUSTOM_CONFIG` 注入的 `downloadFile`；未注入时点击不会报错，但也不会有任何反应。
- 组件 `inject` 的类型声明里包含 `previewFileUrl`，但当前实现并未使用它——本组件只有下载，没有预览。
- `noDownload` 为 `true` 时卡片态不渲染 `.file-actions`，单行态仍渲染可点击样式但 `handleDownload` 会提前返回。
- 卡片态 `.mu-file-card`：主色描边 + `--el-color-primary-light-9` 底色、内容居中；`.file-name` 占满整行、单行超出省略号截断（固定 100px 高的 flex 列装不下多行文件名）；文件类型图标带 `shrink-0`——SVG 无最小高度下限，不加会在内容超高时被 flex 压缩成 0 高度而「消失」。单行态 `.file-link` 文字为主色。

## 相关

- 关联组件：`MuConfigProvider`（提供 `downloadFile`）；图标经 unplugin-icons 编译期组件渲染
- utils：`packages/components/utils/message.ts` 的 `success`
- 公共类型：无
- 演示页面：暂无
