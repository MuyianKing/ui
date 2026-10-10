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
import type { IconQuery, IconQueryResult, UploadedFile, UploadFileOptions } from '@muyianking/ui'
import { MuConfigProvider } from '@muyianking/ui'

async function uploadFile(file: File, options: UploadFileOptions): Promise<UploadedFile> {
  // 由使用方实现的上传逻辑；必须返回含 path / id 的结果，
  // 可把 options.onProgress 接到请求的进度事件上来驱动组件的进度条
  return { path: '/api/file/1.png', id: '1', name: file.name }
}

function previewFileUrl(url: string, prefix?: string) {
  return `${prefix || ''}${url}`
}

function downloadFile(url: string, name: string) {
  // 由使用方实现的下载逻辑
}

// 入参为 { limit, page, query }；data 是图标名数组、count 是总数
async function getIcons(query: IconQuery): Promise<IconQueryResult> {
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

| 属性         | 类型                 | 默认值     | 说明                                         |
| ------------ | -------------------- | ---------- | -------------------------------------------- |
| customConfig | `GlobalCustomConfig` | 无（必填） | 注入到 `GLOBAL_CUSTOM_CONFIG` 的全局配置对象 |

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
- `customConfig` 的类型是 `packages/components/core/types/common.ts` 的 `GlobalCustomConfig`（随其它公共类型一起从公共入口导出），键全部可选，按源码各处 `inject` 统计如下：

| 配置键           | 类型                                                                                        | 消费组件                                                         | 未配置时行为               |
| ---------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------- |
| `uploadFile`     | `(file: File, options: UploadFileOptions) => UploadFileResult \| Promise<UploadFileResult>` | `core/upload`                                                    | 抛「未配置上传接口」       |
| `previewFileUrl` | `(url: string, prefix?: string) => string`                                                  | `core/image`、`core/video`、`core/file`（`file` 只声明、未使用） | 直接用原始地址             |
| `downloadFile`   | `(url: string, name: string) => void`                                                       | `core/file`                                                      | 下载入口无反应、不报错     |
| `getIcons`       | `(query: IconQuery) => Promise<IconQueryResult>`                                            | `core/icon-select`                                               | 静默无数据                 |
| `tableIcon`      | `'text' \| 'button' \| 'icon'`                                                              | `core/button` 的 Del / Detail / Edit 三个表格操作按钮            | 图标按钮                   |
| `buttonIcon`     | `boolean`                                                                                   | `MuAddButton` 与查询 / 导出 / 导入 / 重置按钮                    | 标准按钮形态不显示前置图标 |

- 上表用到的子类型同在 `common.ts` 导出：`UploadFileOptions = { onProgress: (e: ProgressEvent) => void }`、`UploadedFile = UploadFile & { path: string, id: string }`、`UploadFileResult = UploadedFile | UploadedFile[] | null | undefined`、`IconQuery = { limit: number, page: number, query: string }`、`IconQueryResult = { data: string[], count: number }`、`TableIcon = 'text' | 'button' | 'icon'`。
- `tableIcon` 的取值语义由 `useButton` 决定：`'button'` 标准按钮、`'text'` 文本按钮、`'icon'` 与未配置同为图标按钮；`MuAddButton` / `MuExportButton` / `MuImportButton` / `MuResetButton` 恒为标准按钮、不读 `tableIcon`，`MuSearchButton` 的 `text` 为真渲染成标准按钮、为假切图标形态。`buttonIcon` 只控制标准按钮形态的前置图标，不影响 `MuSearchButton` 的图标形态。
- `uploadFile` 返回单条或数组（数组只取第 `0` 项），返回空值视为上传失败；`UploadedFile` 的 `path` / `id` 是必填的：预览与下载依赖 `path`，文件标识与「重新上传」定位依赖 `id`。

## 约束与注意事项

- 必须把 `$attrs` 透传给 `el-config-provider`，否则 `locale` / `size` / `zIndex` 等全部丢失，这层包裹会变成空壳（源码注释明确说明）。
- 是 `provide` 而非全局单例：不在该组件子树内的组件注入不到配置；`inject` 未取到默认值时返回 `undefined`，消费组件需自行做可选链兜底。
- `provide` 在 `setup` 时对 `props.customConfig` 求值一次；整体替换 `customConfig` 对象不会自动改变已注入的引用（修改对象内部属性因引用相同而可被共享）。
- `customConfig` 为必填，没有默认值；类型是 `GlobalCustomConfig`，本库消费的 6 个键都有明确签名，键名写错、签名写错或键声明不全会编译报错（已不再是 `Record<string, any>`）。类型声明集中在 `packages/components/core/types/common.ts`，消费组件也不再各自写匿名 `inject<{ ... }>`。
- 需要业务自定义键时先扩展接口，不要放宽回 `Record<string, any>`：`interface AppConfig extends GlobalCustomConfig { myKey?: string }`，注入侧用 `inject<AppConfig>('GLOBAL_CUSTOM_CONFIG')`。未声明的键出现在直接传给 `custom-config` 的对象字面量里会因 TS 的多余属性检查而编译报错（用变量传对象时不受此检查约束，但注入侧要拿到类型仍需扩展接口）。
- 项目约定不新增全局单例，全局能力一律经此组件注入。

## 相关

- 消费方组件：`packages/components/core/upload/`、`packages/components/core/icon-select/`、`packages/components/core/image/`、`packages/components/core/video/`、`packages/components/core/file/`、`packages/components/core/button/`
- 演示页面：`playground/src/App.vue`（根组件）
- 文档：`docs/README.md`（全局配置说明）、`docs/theme-chalk.md`
