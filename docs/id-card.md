# MuIdCard 身份证展示

以文本形式展示身份证号的最简展示组件，支持默认插槽覆盖。

- 组件目录：`packages/components/core/id-card/`
- 对外导出：`MuIdCard`
- 样式入口：`packages/components/core/id-card/style/index.ts`（类名 `.mu-id-card`；该入口只引 `@muyianking/theme-chalk/css/id-card.css`，而该 CSS 当前为空文件）
- 演示页面：暂无
- 依赖：无。未引入 element-plus，也未依赖本库其它组件或 utils。

## 基础用法

演示页不存在，以下据源码推断。

```vue
<script setup lang="ts">
import { MuIdCard } from '@muyianking/ui'
</script>

<template>
  <MuIdCard id-card="110101199001011234" />
</template>
```

## Props

| 属性   | 类型     | 默认值 | 说明                                                 |
| ------ | -------- | ------ | ---------------------------------------------------- |
| idCard | `string` | `''`   | 默认展示的身份证号文本；提供默认插槽时被插槽内容覆盖 |

## Emits

无。

## Slots

| 插槽    | 作用域参数 | 说明                                     |
| ------- | ---------- | ---------------------------------------- |
| default | 无         | 覆盖展示内容；未提供时渲染 `idCard` 文本 |

## 暴露

无。

## 业务逻辑

- 模板只有一个根元素 `<span class="mu-id-card">`，内部为默认插槽，插槽无内容时回退渲染 `idCard`。
- 组件不做任何格式化、脱敏、长度裁剪或合法性校验，传入什么就原样显示什么。

## 约束与注意事项

- 这是纯展示组件，不是表单控件；身份证校验请使用 `packages/components/utils/validator.ts` 的 `v_id_num`，组件本身不调用它。
- `.mu-id-card` 在 `theme-chalk` 中无样式定义，如需外观（字体、省略等）请由使用方通过类名或 `style` 覆盖。
- 属性默认透传到根 `span`（原生元素）。

## 相关

- 校验规则：[`packages/components/utils/validator.ts`](packages/components/utils/validator.ts) 的 `v_id_num`
- 样式文件：[`packages/theme-chalk/css/id-card.css`](packages/theme-chalk/css/id-card.css)
