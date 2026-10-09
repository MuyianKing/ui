# MuEditInfo 行内编辑

双击文本进入编辑、失焦提交的轻量行内编辑控件。

- 组件目录：`packages/components/core/edit-info/`
- 对外导出：`MuEditInfo`
- 样式入口：`packages/components/core/edit-info/style/index.ts`（类名 `.mu-edit-info`）
- 演示页面：`playground/src/views/edit-info/Index.vue`
- 依赖：element-plus 的 `ElInput`；`@vueuse/core` 的 `useDebounceFn`；未使用 utils

## 基础用法

```vue
<script setup lang="ts">
import { MuEditInfo } from '@muyianking/ui'
import { ref } from 'vue'

const value = ref('')
</script>

<template>
  <MuEditInfo v-model="value" />
</template>
```

## Props

| 属性        | 类型                            | 默认值       | 说明                                                         |
| ----------- | ------------------------------- | ------------ | ------------------------------------------------------------ |
| modelValue  | `string \| number`              | `''`         | 绑定值（`v-model`）                                          |
| width       | `string`                        | `'100%'`     | 容器宽度，作用于根节点内联 `style`                           |
| align       | `'left' \| 'center' \| 'right'` | `'left'`     | 展示态文本对齐方式                                           |
| editable    | `boolean`                       | `true`       | 为 `false` 时双击不进入编辑                                  |
| placeholder | `string`                        | `'请输入'`   | 空值时的占位文案，同时作为编辑态 `el-input` 的 `placeholder` |
| triggerInfo | `string`                        | `'双击编辑'` | 展示态 `span` 的原生 `title` 提示                            |
| zeroToEmpty | `boolean`                       | `false`      | 为 `true` 时把 `0` / `'0'` 显示为空                          |

其余属性经 `$attrs` 自动透传给根节点 `div.mu-edit-info`。

## Emits

| 事件              | 参数                    | 说明                                   |
| ----------------- | ----------------------- | -------------------------------------- |
| update:modelValue | `val: string \| number` | 编辑值与原值不同时触发，用于 `v-model` |
| change            | `val: string \| number` | 同上时机触发，值为编辑后的新值         |

## Slots

无。

## 暴露

无。

## 业务逻辑

- `displayValue` 计算展示内容：先处理 `zeroToEmpty`（值为 `0` 或 `'0'` 时返回空串），再判断 `''` / `null` / `undefined` 返回 `placeholder`，否则原样返回值。注意此处必须用 `===` 判断而非 `displayValue || placeholder`，否则合法的 `0` 会被占位文案替换。
- 展示态为 `span.mu-edit-info-text`，绑定原生 `title="triggerInfo"`，`dblclick` 调 `startEdit`；编辑态渲染 `el-input`，`v-model` 绑定内部 `editValue`，`blur` 调 `submitEdit`。
- `startEdit`：`editable` 为 `false` 直接返回；否则把 `modelValue` 复制到内部 `editValue`，置 `isEditing = true`。
- `submitEdit` 经 `useDebounceFn(..., 200)` 包裹：若不在编辑态直接返回；否则先退出编辑态，仅当 `editValue !== props.modelValue` 时依次 `emit('update:modelValue', editValue)` 与 `emit('change', editValue)`。值未变化时两个事件都不触发。
- 组件不持有独立提交状态，编辑值仅在本地 `editValue` 中暂存，`modelValue` 始终由使用方驱动。

## 约束与注意事项

- 提交仅由 `el-input` 的 `blur` 触发，按回车不会提交（回车行为沿用 `el-input` 默认，组件未监听 keydown）。
- 提交被 200ms 防抖包裹：失焦后约 200ms 才发出 `update:modelValue` / `change`。
- 进入编辑态后未修改即失焦，不会触发任何事件。
- `placeholder` 同时用于展示态占位与编辑态输入框提示，语义重叠。
- `packages/theme-chalk/css/edit-info.css` 中定义的 `.mu-value-item` / `.mu-trigger-item` 与当前模板使用的 `.mu-edit-info-text` 不一致，这两条样式对当前模板不生效（历史遗留，待确认）。

## 相关

- 关联组件：无
- utils：无
- 公共类型：无
- 演示页面：`playground/src/views/edit-info/Index.vue`
