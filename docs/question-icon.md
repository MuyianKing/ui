# MuQuestionIcon 问号提示图标

一句话定位：一个固定的问号图标，鼠标悬浮时经 Element Plus Tooltip 展示默认插槽里的说明文案。

- 组件目录：`packages/components/core/question-icon/`
- 对外导出：`MuQuestionIcon`
- 样式入口：`packages/components/core/question-icon/style/index.ts`（类名 `.mu-question-icon`）
- 演示页面：暂无
- 依赖：element-plus 的 `ElTooltip`；本库的 `MuIcon`（`packages/components/core/icon`）

## 基础用法

```vue
<script setup lang="ts">
import { MuQuestionIcon } from '@muyianking/ui'
</script>

<template>
  <MuQuestionIcon>这里是说明文案</MuQuestionIcon>
</template>
```

## Props

| 属性      | 类型                             | 默认值  | 说明               |
| --------- | -------------------------------- | ------- | ------------------ |
| placement | `Placement`（来自 element-plus） | `'top'` | tooltip 的弹出方向 |

其余属性经组件单根节点自动继承透传给 `el-tooltip`。

## Emits

无。

## Slots

| 插槽    | 作用域参数 | 说明                                 |
| ------- | ---------- | ------------------------------------ |
| default | 无         | tooltip 的内容，即悬浮提示的文案来源 |

## 暴露

无。

## 业务逻辑

- 组件模板根节点是 `el-tooltip`，`effect` 固定为 `light`，`placement` 取自 props。
- 默认插槽内容被放进 `el-tooltip` 的 `#content`，所以「tooltip 文案」完全来自使用方传入的默认插槽，组件内没有默认文案。
- 触发元素是固定写死的 `mu-icon`：`icon="mingcute:question-fill"`、`size="16px"`、`class="mu-question-icon"`。图标由 `MuIcon` 渲染，最终落到 `@iconify/vue` 的 `Icon` 组件；图标名与尺寸都不可通过 props 修改。
- 组件不读取 `GLOBAL_CUSTOM_CONFIG`，也不使用全局配置的 `getIcons`，因此不依赖 `MuConfigProvider`。

## 约束与注意事项

- 必须传入默认插槽文案，否则悬浮时 tooltip 内容为空。
- 图标固定为 Iconify 的 `mingcute:question-fill`，需要该图标集在运行时可被 `@iconify/vue` 解析（组件不提供本地图标资源）。
- `effect`、`placement` 在模板上显式绑定，不会被 `$attrs` 覆盖；其余未声明的属性（如 `disabled`）经自动继承透传给 `el-tooltip`。
- `packages/theme-chalk/css/question-icon.css` 当前是空文件（0 字节），仅作为样式挂载点保留，`.mu-question-icon` 目前没有任何实际样式；需要改样式时补在该文件。

## 相关

- 关联组件：`MuIcon`（`packages/components/core/icon/`）
- 公共类型：无
- 样式：`packages/theme-chalk/css/question-icon.css`
