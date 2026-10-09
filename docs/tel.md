# MuTel 电话文本

用于展示电话号码的极简文本组件，纯展示、无任何交互。

- 组件目录：`packages/components/core/tel/`
- 对外导出：`MuTel`（具名导出 + 默认导出）
- 样式入口：`packages/components/core/tel/style/index.ts`（类名 `.mu-tel`）
- 演示页面：暂无
- 依赖：无（不使用 element-plus 组件、本库其它组件或 utils）

## 基础用法

```vue
<script setup lang="ts">
import { MuTel } from '@muyianking/ui'
</script>

<template>
  <MuTel tel="010-88886666" />
  <!-- 也可以用默认插槽覆盖文本 -->
  <MuTel>010-88886666</MuTel>
</template>
```

## Props

| 属性 | 类型     | 默认值 | 说明                                 |
| ---- | -------- | ------ | ------------------------------------ |
| tel  | `string` | `''`   | 电话号码文本，作为默认插槽的兜底内容 |

## Emits

无。

## Slots

| 插槽    | 作用域参数 | 说明                               |
| ------- | ---------- | ---------------------------------- |
| default | 无         | 自定义展示内容；未提供时渲染 `tel` |

## 暴露

无。

## 业务逻辑

- 根元素固定为 `<span class="mu-tel">`，内容为 `<slot>{{ tel }}</slot>`：插槽优先，未传插槽时回退到 `tel` 属性。
- 组件本身不校验、不格式化号码，传入什么就渲染什么；号码格式校验请参见 `utils/validator.ts` 的 `v_phone` / `v_tel` / `v_phoneOrTel`（见「相关」及注意事项）。

## 约束与注意事项

- 该组件对 `tel` 文本不做任何加工，页面上展示的格式完全取决于传入值。
- 关于手机号 / 座机校验：必须澄清一点——**`tel` 组件源码并没有引用 `utils/validator.ts`**（`tel/src/Index.vue` 只有 `defineProps` 和模板，`tel/index.ts` 只导出组件，`tel/style/index.ts` 只引样式）。手机号 / 座机校验能力由表单相关组件（如 `MuFormItem`）配合 `v_phone` / `v_tel` / `v_phoneOrTel` 使用，与 `MuTel` 无直接依赖关系。
- 样式文件 `packages/theme-chalk/css/tel.css` 当前为空，`.mu-tel` 只是一个语义占位类名。

## 相关

- 校验规则（与表单组件配合使用，非本组件引用）：`packages/components/utils/validator.ts` 的 `v_phone`、`v_tel`、`v_phoneOrTel`
- 公共入口导出：`packages/components/index.ts`
