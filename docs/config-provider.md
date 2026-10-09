# MuConfigProvider 全局配置提供者

向整棵子树注入全局自定义配置，并把其余能力透传给 Element Plus 的 `config-provider`。

- 组件目录：`packages/components/core/config-provider/`
- 对外导出：`MuConfigProvider`（`export const MuConfigProvider`，同时 `export default`）
- 样式入口：`packages/components/core/config-provider/style/index.ts`（类名无：`config-provider.css` 为空文件，模板也未使用语义类名）
- 演示页面：暂无（`playground/src/App.vue` 以根组件方式整体使用）
- 依赖：element-plus 的 `ElConfigProvider`；无本库其它组件与 utils 依赖

## 基础用法

```vue
<script setup lang="ts">
import { MuConfigProvider } from '@muyianking/ui'

async function uploadFile(file: File, options: any) {
  // 由使用方实现的上传逻辑，返回 { url, path, name, id, ... }
}

function previewFileUrl(url: string, prefix?: string) {
  return `${prefix || ''}${url}`
}

function downloadFile(url: string, name: string) {
  // 由使用方实现的下载逻辑
}

async function getIcons(query: any) {
  return { data: [], count: 0 }
}
</script>

<template>
  <MuConfigProvider :custom-config="{ uploadFile, previewFileUrl, downloadFile, getIcons }">
    <router-view />
  </MuConfigProvider>
</template>
```

## Props

| 属性         | 类型                  | 默认值     | 说明                                     |
| ------------ | --------------------- | ---------- | ---------------------------------------- |
| customConfig | `Record<string, any>` | 无（必填） | 注入到 `GLOBAL_CUSTOM_CONFIG` 的配置对象 |

其余属性经 `v-bind="$attrs"` 透传到 `el-config-provider`（如 `locale`、`size`、`zIndex` 等），不逐一列举。

## Emits

无。

## Slots

| 插槽    | 作用域参数 | 说明                   |
| ------- | ---------- | ---------------------- |
| default | 无         | 需要共享配置的子树内容 |

## 暴露

无。

## 业务逻辑

- `setup` 阶段执行 `provide('GLOBAL_CUSTOM_CONFIG', props.customConfig)`，后代组件通过 `inject('GLOBAL_CUSTOM_CONFIG')` 读取。
- 模板把 `$attrs` 透传给 `el-config-provider`，并渲染默认插槽；组件本身不产生额外 DOM 包裹语义。
- 源码在本库内被消费的配置键（按各处 `inject` 统计）：
  - `uploadFile`：上传组件（`core/upload`），签名约 `(file: File, options: { onProgress }) => Promise<上传结果>`，未配置时上传组件抛 “未配置上传接口”。
  - `previewFileUrl`：图片 / 视频 / 文件组件（`core/image`、`core/video`、`core/file`），用于把存储路径拼成可访问 URL。
  - `downloadFile`：文件组件（`core/file`）,用于下载。
  - `getIcons`：图标选择组件（`core/icon-select`），约 `(query) => Promise<{ data, count }>`。
  - `tableIcon`：按钮族（`MuDelButton`、`MuDetailButton`、`MuEditButton`、`MuExportButton`、`MuImportButton`、`MuResetButton`、`MuSearchButton`），决定“图标按钮 / 文本按钮”形态。
  - `buttonIcon`：`MuAddButton`，决定是否显示添加图标。
- 除上述键外，`customConfig` 为开放对象，消费者可自行添加并在业务组件中 inject 读取。

## 约束与注意事项

- 必须把 `$attrs` 透传给 `el-config-provider`，否则 `locale` / `size` / `zIndex` 等全部丢失，这层包裹会变成空壳（源码注释明确说明）。
- 是 `provide` 而非全局单例：不在该组件子树内的组件注入不到配置；`inject` 未取到默认值时返回 `undefined`，消费组件需自行做可选链兜底。
- `provide` 在 `setup` 时对 `props.customConfig` 求值一次；整体替换 `customConfig` 对象不会自动改变已注入的引用（修改对象内部属性因引用相同而可被共享）。
- `customConfig` 为必填，没有默认值；类型是宽泛的 `Record<string, any>`，键名靠约定，没有集中类型约束。
- 项目约定不新增全局单例，全局能力一律经此组件注入。

## 相关

- 消费方组件：`packages/components/core/upload/`、`packages/components/core/icon-select/`、`packages/components/core/image/`、`packages/components/core/video/`、`packages/components/core/file/`、`packages/components/core/button/`
- 演示页面：`playground/src/App.vue`（根组件）
- 文档：`docs/README.md`（全局配置说明）、`docs/theme-chalk.md`
