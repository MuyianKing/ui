# MuUpload 文件上传

基于原生 `<input type="file">` 自实现的文件选择与上传组件，支持图片/视频/文件/音频过滤、单选多选、卡片或一行展示、上传进度浮层与自定义预览/触发。

- 组件目录：`packages/components/core/upload/`（主文件为根目录 `Index.vue`，非 `src/Index.vue`；对外类型在同级 `types.ts`）
- 对外导出：`MuUpload` 与类型 `UploadFile`（仅具名导出，`index.ts` 内无 `export default`）
- 样式入口：`packages/components/core/upload/style/index.ts`（类名 `.mu-upload-wrapper`、`.mu-upload-flex-style`、`.mu-upload-multiple-margin`、`.mu-upload-preview-wrapper`、`.mu-upload-trigger-comp`、`.mu-ui-progress-shadow`；类名 `.mu-upload` 本身未使用）
- 演示页面：`playground/src/views/upload/Index.vue`
- 依赖：element-plus 的 `vLoading` 指令、`ElProgress`（子组件 Progress 使用）；本库组件 `MuPreview`（内部再经其渲染 `MuImage` / `MuVideo` / `MuFile`）；`utils/message` 的 `error` / `confirm`；`@muyianking/utils` 的 `guid`、`getType`、`getSuffix`、`getMimeType`、`IMAGE_SUFFIX`、`VIDEO_SUFFIX`、`FILE_SUFFIX`、`AUDIO_SUFFIX`；全局 `GLOBAL_CUSTOM_CONFIG.uploadFile`

## 基础用法

```vue
<script setup lang="ts">
import { MuButton, MuUpload } from '@muyianking/ui'
import { ref } from 'vue'

// 单选：值为单个文件对象，多选：值为文件对象数组
const file = ref(null)
const files = ref([])

function handleFinish(id: string) {
  console.log('上传完成', id)
}
</script>

<template>
  <!-- 单选附件（默认 type="image"） -->
  <MuUpload v-model="file" />

  <!-- 多选文件 -->
  <MuUpload v-model="files" multiple type="file" />

  <!-- 自定义触发 + 进度条 + 无内置预览 -->
  <MuUpload v-model="files" no-preview progress @upload-finish="handleFinish">
    <MuButton>导入</MuButton>
  </MuUpload>

  <!-- 自定义预览区 -->
  <MuUpload v-model="files" multiple trigger-type="line">
    <template #preview="{ files: previewFiles }">
      <div v-for="f in previewFiles" :key="f.id">
        {{ f.name }}
      </div>
    </template>
  </MuUpload>
</template>
```

## Props

组件用对象式 `defineProps({...})` 声明（非 `withDefaults`），另有 `defineModel` 生成的 `v-model`。

| 属性        | 类型                 | 默认值    | 说明                                                                                             |
| ----------- | -------------------- | --------- | ------------------------------------------------------------------------------------------------ |
| type        | `string \| string[]` | `'image'` | 文件类型：`video` / `image` / `file` / `audio` / `all`（`all` 不在类型映射表中，等价于不限类型） |
| suffix      | `string \| string[]` | `''`      | 指定后缀，与 `type` 推导出的后缀取交集                                                           |
| multiple    | `boolean`            | `false`   | 是否多选，决定 `v-model` 值是数组还是单个对象                                                    |
| maxCount    | `number`             | `99`      | 最大数量，决定触发区「添加」按钮是否继续显示                                                     |
| autoUpload  | `boolean`            | `true`    | 选择后是否立即上传；为 false 时只保留所选 `File` 与 blob 预览地址                                |
| progress    | `boolean`            | `false`   | 是否启用上传进度浮层                                                                             |
| disabled    | `boolean`            | `false`   | 禁用触发（`triggerAdd` 直接返回）                                                                |
| readonly    | `boolean`            | `false`   | 只读，整个触发区不渲染（预览仍显示）                                                             |
| noPreview   | `boolean`            | `false`   | 隐藏内置预览区；同时使触发区始终显示、跳过「已选满」判断                                         |
| listType    | `string`             | `''`      | 展示方式：`card` / `line`，不传则自动判断                                                        |
| triggerType | `string`             | `''`      | 触发区样式：`card` / `line`，不传则沿用展示方式                                                  |

其余属性经组件内层 `v-bind="$attrs"` 透传给包裹 `div`（`.mu-upload-wrapper`）。

## Emits

| 事件              | 参数                                 | 说明                                           |
| ----------------- | ------------------------------------ | ---------------------------------------------- |
| upload-start      | 无                                   | 真正调用 `uploadFile` 前触发（每次上传开始时） |
| upload-finish     | `id: string`                         | 上传成功后触发，携带服务端返回结果中的 `id`    |
| update:modelValue | `UploadFile \| UploadFile[] \| null` | `defineModel` 生成，`v-model` 同步文件列表     |

## Slots

| 插槽     | 作用域参数                                      | 说明                                                                                                         |
| -------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| default  | 无                                              | 自定义触发区内容；存在时会替换触发组件内的默认「+ / 点击上传附件」图标（作为 Trigger 的 `trigger` 插槽传入） |
| preview  | `files`（当前文件列表，单选为对象、多选为数组） | 自定义预览区；存在时不再渲染内置 `Preview`                                                                   |
| progress | `{ percentage }`（进度百分比）                  | 自定义进度浮层内容；存在时不再渲染内置 `ElProgress`                                                          |

## 暴露

| 名称           | 类型                        | 说明                                                                                    |
| -------------- | --------------------------- | --------------------------------------------------------------------------------------- |
| handleDel      | `(row: UploadFile) => void` | 删除指定文件；多选按 `id` 定位并 `splice`，单选置 `null`，删除前释放 blob 地址          |
| handleReupload | `(row: UploadFile) => void` | 重新上传：打开文件选择框并把 `row` 记为待替换文件，选完新文件后原位替换（未找到则追加） |

## 业务逻辑

- **展示形态推导**：`_list_type` = `listType` 或（`is_only_video_image` 为 true 时 `card`，否则 `line`）；`_trigger_type` = `triggerType` 或 `_list_type`。`is_only_video_image` 用 `getAllType(type, suffix)` 判断后缀是否全部落在图片/视频集合内（出现音频或普通文件后缀即为 false），并经 `provide('is_only_video_image', ...)` 向下提供。
- **上层职责切分**：`Index.vue` 负责状态、上传与事件；`components/Trigger.vue` 负责文件选择与类型拦截；`components/Preview.vue` 负责列表渲染与删除/重新上传交互；`components/Progress.vue` 负责进度浮层；`hooks/index.ts` 提供类型与 `accept` 推导。
- **上传流程**：
  1. 触发：`Trigger` 的 `triggerAdd` 点击隐藏的 `<input type="file">`；`selectMedia` 先清空 `input.value`（保证同文件可再次触发 `change`），多选时整批取 `selected`、单选取 `selected.slice(0, 1)`。
  2. 类型校验：逐个文件用 `isAccepted` 比对 `getMimeType(getSuffix(fileName))` 与 `accept_type`；**任一不符合即弹警告并整批中止**（避免混入越权文件后继续上传）。
  3. 选择完成：`select-file` 事件回到 `handleSelect`，构造 `{ id: guid(), name, path: URL.createObjectURL(file) }`，按 `multiple` 决定推入数组或整体替换；进入回调时先取出并**清空** `replace_file`，待替换项存在则按 `id` 原位替换，否则新增。
  4. 上传：`autoUpload` 为 true 时 `await nextTick()` 后把该文件 `loading` 置 true，调用 `uploadFile(file, { onProgress })`；成功写入 `path` / `id` 并清除 `loading`，再 `emit('upload-finish', result.id)`；失败走 `error(e, '文件上传失败')`。`autoUpload` 为 false 时只写入原始 `file`。
  5. 进度：`onProgress` 用 `e.total > 0 ? Math.round(loaded/total*100) : 0` 且 `Math.min(100, ...)` 更新 `progress_percent`；`show_progress` 在 `progress` 为 true 时随上传开合，且 `finally` 中无论成败都会收起并归零。
  6. 预览：内置 `Preview` 按 `loading` 用 `v-loading` 转圈，用 `MuPreview`（100×100，禁预览、禁下载，card 时 `card=true`）渲染；card 模式悬停出现删除/重新上传按钮，line 模式点击整行即触发重新上传，右侧为删除图标。
- **全局配置依赖**：只 `inject('GLOBAL_CUSTOM_CONFIG')` 取 `uploadFile`（注入泛型是 `GlobalCustomConfig`，默认值为 `{}`，未包 `MuConfigProvider` 也能安全解构）；未配置时 `handleUploadFile` 抛「未配置上传接口」并被 `handleSelect` 的 catch 捕获为错误提示。预览中的 `previewFileUrl` / `downloadFile` 由 `MuPreview` / `MuImage` / `MuVideo` / `MuFile` 间接消费，`MuUpload` 自身不读取。`uploadFile` 需返回含 `path`、`id` 的结果（或结果数组，取第 `[0]` 项），空结果会抛「上传失败」；类型即 `GlobalCustomConfig['uploadFile']` —— `(file: File, options: UploadFileOptions) => UploadFileResult | Promise<UploadFileResult>`，其中 `UploadedFile` 把 `path` / `id` 声明为必填。
- **文件列表数据结构**：即对外导出的 `UploadFile` 类型 —— `{ id?, name?, path?, loading?, file?, [key: string]: any }`。以下载路径判类型时以 `path` 为准、回退 `name`（`Preview` 内 `getType(path) || getType(name)`）；`uploadFile` 返回的其余字段会被原样写回该对象。
- **`UploadFile` 为何独立成 `types.ts`**：它被 `defineModel` 与 `#preview` 插槽引用，属于组件对外类型。留在 `Index.vue` 的 `<script setup>` 内时它不是模块导出，`core/upload/index.ts` 的 `export const MuUpload = Upload` 会触发 TS4023「类型无法命名」，`core/upload` 生成不出 `index.d.ts`，声明包中会残留指向 `./core/upload` 的悬空引用（消费者拿不到 `MuUpload` 的类型）。独立成模块后由 `index.ts` 与公共入口一并导出。
- **`loading` 与表单校验的联动**：上传中 `loading: true`，成功后 `setModelValue` 会**删除** `loading` 键（而非置 false）。`MuFormItem` 的 `uploadLoading` 校验（`form-item/src/Index.vue` 的 `validateUploadLoading`）正是遍历数组或对象上的 `.loading`，为真时报「请等待文件上传」。因此若在流程外自行往列表塞了带 `loading: true` 的项且不清除，表单会被永久拦住。
- **内存管理**：所有本地 blob 预览地址在删除或替换时经 `revokeBlob` 调 `URL.revokeObjectURL` 释放，避免「选过又删掉」的文件常驻内存。
- **`setModelValue` 的时机**：`defineModel` 更新有延迟，`handleSelect` 中在推入数组后 `await nextTick()` 再改对象字段，保证对最终模型值生效。
- **子组件要点**：`Trigger.show_add` 在 `noPreview` 时恒为 true，否则单选已选返回 false、多选按 `files.length < maxCount` 决定；`Preview` 的 `_files` 会把字符串路径规范化为 `[{ path }]`；`Progress` 用 `<teleport to="body">` + `v-show` 渲染到 body，标题固定「正在上传...」。

## 约束与注意事项

- **必须配置 `uploadFile`**（经 `MuConfigProvider` 的 `GLOBAL_CUSTOM_CONFIG`）才能自动上传，否则只弹错误。未配 `previewFileUrl` 时预览直接使用文件自带 URL / blob 地址。
- `autoUpload` 关闭时组件只负责选择和预览，**不提供手动上传方法**（`defineExpose` 只有 `handleReupload` / `handleDel`），需要在业务侧自行读取 `v-model` 中的 `file` 字段（原始 `File`）完成上传，并自行处理 `id` / `path` / `loading` 回填。
- `multiple` 决定 `v-model` 值形态，切换 `multiple` 会导致既有值形态不匹配（数组 ← 对象）；`handleDel` 在多选分支直接假设当前值是数组并 `findIndex`，值形态错配会抛错。
- `type="all"` 不在 `type_map` 中，`getAllType` 返回空后缀列表，`accept` 退化为 `*/*`；`suffix` 与 `type` 无交集时 `getAllType` 会 `console.warn('type和suffix设置冲突')` 并返回空列表。
- 类型拦截依赖 `@muyianking/utils` 的 `getMimeType` / `getSuffix`，若后缀无法映射到 MIME，`isAccepted` 会判为不通过并弹「请不要自行选择【所有文件】…」的阻塞式 `ElMessageBox`（无取消、点击遮罩不关闭）。
- `showTypeWarning` 的 `confirm` 是 `ElMessageBox.confirm`，其文案与关闭策略写死在 `Trigger.vue`，不随 locale 变化。
- 上传失败仅弹 `ElMessage` 错误，**不会自动回滚已插入的文件项**，列表里会保留该次选择，且该项的 `loading` 仍为 `true`（catch 分支只弹错误，不清除 `loading`：内置预览会一直转圈，`MuFormItem` 的 `uploadLoading` 校验也会持续拦截），需业务侧自行处理；如需失败重试由业务处理。
- 预览区依赖 `MuPreview` / `MuImage` / `MuVideo`，其下载、预览行为受同一份全局配置影响；`MuUpload` 的样式入口已链式引入 `preview` 的样式，单独引样式时无需重复引入。
- 触发区与预览区的图标（添加 `~icons/bitcoin-icons/plus-outline`、上传 `~icons/ic/round-cloud-upload`、删除 `~icons/pixelarticons/trash`、重传 `~icons/ri/folder-upload-line`）为 unplugin-icons 编译期组件，构建期打包、不依赖运行时网络。
- `readonly` 只隐藏触发区，不隐藏预览，也不禁止通过 `defineExpose` 的方法删除。
- **重新上传的目标是一次性的**：`handleSelect` 一进入就取出并清空 `replace_file`，因此点过「重新上传」又取消选择（未选文件）后，再点普通「添加」只会追加，不会误替换掉之前那个文件。
- 传入 `progress` 且自定义 `#progress` 插槽时，须自行渲染进度内容，内置 `ElProgress` 会被完全替换。

## 相关

- 子组件与工具：`packages/components/core/upload/components/Trigger.vue`、`Progress.vue`、`Preview.vue`、`packages/components/core/upload/hooks/index.ts`、`packages/components/core/upload/types.ts`
- 关联本库组件：`packages/components/core/preview/src/Index.vue`（依赖 `file` / `image` / `video`）
- 表单联动校验：`packages/components/core/form-item/src/Index.vue` 的 `uploadLoading` → `validateUploadLoading`
- 全局配置：`packages/components/core/config-provider/src/Index.vue`（`uploadFile` / `previewFileUrl` / `downloadFile`）
- 公共消息封装：`packages/components/utils/message.ts`（`error` / `confirm`）
- 演示页面：`playground/src/views/upload/Index.vue`
- 公共入口导出：`packages/components/index.ts`
