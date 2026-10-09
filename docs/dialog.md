# MuDialog 弹窗

基于 Element Plus `el-dialog` 的弹窗封装：默认禁止点击遮罩关闭、开启拖拽与关闭即销毁，并在打开时自动约束内容区高度。

- 组件目录：`packages/components/core/dialog/`
- 对外导出：`MuDialog`
- 样式入口：`packages/components/core/dialog/style/index.ts`（模板根类名与主题选择器统一为 `.mu-custom-dialog`）
- 演示页面：`playground/src/views/dialog/Index.vue`
- 依赖：element-plus 的 `ElDialog`（含 `dialog` 样式）；无本库其它组件；utils 无

## 基础用法

```vue
<script setup lang="ts">
import { MuButton, MuDialog } from '@muyianking/ui'
import { ref } from 'vue'

const show = ref(false)
</script>

<template>
  <MuButton @click="show = true">
    打开弹窗
  </MuButton>
  <MuDialog v-model="show" title="弹窗" top="50px" width="700px">
    <div style="height: 200vh;">
      内容超出时会自动限制高度并滚动
    </div>
    <template #footer>
      <MuButton>提交</MuButton>
    </template>
  </MuDialog>
</template>
```

## Props

| 属性              | 类型               | 默认值        | 说明                                                                                    |
| ----------------- | ------------------ | ------------- | --------------------------------------------------------------------------------------- |
| closeOnClickModal | `boolean`          | `false`       | 是否允许点击遮罩关闭弹窗                                                                |
| top               | `string \| number` | `150`         | 距顶部距离。数字（或数字字符串）按 `px`；`'auto'` 表示不设置 `top`；其它字符串原样使用  |
| height            | `string`           | `—（未设置）` | 弹窗内容高度。设置后内容区高度 = `height - header - footer`；不设置则按视口计算最大高度 |
| destroyOnClose    | `boolean`          | `true`        | 关闭后销毁弹窗内容                                                                      |
| draggable         | `boolean`          | `true`        | 允许拖拽弹窗                                                                            |

另含由 `defineModel<boolean>({ default: false })` 生成的 `v-model`（`modelValue: boolean`，默认 `false`）控制显隐。

其余属性经 `$attrs` 透传给 `el-dialog`（组件模板唯一根元素即 `el-dialog`，自动透传），如 `title`、`width` 等。

## Emits

`MuDialog` 未显式声明 `defineEmits`。

| 事件              | 参数      | 说明                                           |
| ----------------- | --------- | ---------------------------------------------- |
| update:modelValue | `boolean` | 由 `defineModel` 生成，用于 `v-model` 显隐同步 |

`el-dialog` 自身的 `open` / `opened` / `close` / `closed` 等事件经 `$attrs` 透传，可直接写在 `MuDialog` 上。

## Slots

| 插槽    | 作用域参数 | 说明                                                             |
| ------- | ---------- | ---------------------------------------------------------------- |
| default | 无         | 弹窗主体内容                                                     |
| footer  | 无         | 底部操作区。仅当调用方传入该插槽时才渲染 `el-dialog` 的 `footer` |

## 暴露

| 名称         | 类型         | 说明                                                  |
| ------------ | ------------ | ----------------------------------------------------- |
| setMaxHeight | `() => void` | 重新计算内容区高度 / 最大高度，内部经 `nextTick` 执行 |

## 业务逻辑

- `topComp` 归一化 `top`：数字或纯数字字符串 → `${top}px`；`'auto'` → `''`（不设置 `top`，回退 `el-dialog` 默认定位）；其它字符串原样透传。`top` 生效时同时把 `marginTop` / `marginBottom` 置 0。
- `dialogStyle` 向 `el-dialog` 注入 `top`、`height` 与上述 margin。
- `setMaxHeight` 在弹窗打开时触发（`watch(model, ..., { immediate: true })` 内 `nextTick`），会深入 `el-dialog` 内部 DOM：
  - 通过 `dialogRef.value.dialogContentRef.$el` 取到弹窗内容根，再查询 `.el-dialog__body` / `.el-dialog__header` / `.el-dialog__footer` 的 `clientHeight`。
  - 传了 `height`：`body.style.height = calc(height - header - footer)`。
  - 未传 `height`：`body.style.maxHeight = calc(100vh - header - 2 * offsetTop - footer - 32)`。
  - footer 高度取 `.el-dialog__footer` 的 `clientHeight`，无 footer 插槽时为 0，存在 footer 插槽但取不到元素时按 72 估算。
- 固定 `append-to-body`，弹窗挂载到 `body` 下；`closeOnClickModal` 默认 `false`、`destroyOnClose` 默认 `true`。

## 约束与注意事项

- `setMaxHeight` 依赖 `el-dialog` 内部结构（`dialogContentRef.$el` 与 `.el-dialog__body` 等类名），Element Plus 升级时最易失效；源码已用可选链兜底，元素缺失时直接返回、不抛错。
- 模板根类名与 `packages/theme-chalk/css/dialog.css` 的选择器统一为 `.mu-custom-dialog`。此前 CSS 里误写成 `.mu-custome-dialog`（多一个 `e`），8 条规则全部匹配不上、从未生效；现已修正，头部配色、内容区 `--padding`、footer 边框等样式也随之真正生效。
- 内容区内边距由 CSS 变量 `--padding` 控制（默认 `10px 20px`），可在标签上以 `style="--padding: 0"` 覆盖。
- `append-to-body` 为固定行为，无法通过属性关闭。
- 内容过高时靠 `setMaxHeight` 给 `.el-dialog__body` 写内联高度 / 最大高度，若只想自定义高度请通过 `height` prop 而不是手写内联样式。
- 其余属性 / 事件经 `$attrs` 透传给 `el-dialog`。

## 相关

- 关联组件：无。
- 演示页面：`playground/src/views/dialog/Index.vue`。
