# MuInput 输入框

基于 ElInput 的输入框封装，补充了聚焦提示浮层、父级 label 自动占位与简单输入清洗。

- 组件目录：`packages/components/core/input/`
- 对外导出：`MuInput`
- 样式入口：`packages/components/core/input/style/index.ts`（输入框无自有类名，`theme-chalk/css/input.css` 为空文件，样式全部来自 Element Plus）
- 演示页面：`playground/src/views/form/Index.vue`（在表单页中配合 `MuFormItem` 演示）
- 依赖：element-plus 的 `ElInput`、`ElPopover`；无本库其它组件

## 基础用法

```vue
<script setup lang="ts">
import { MuFormItem, MuInput } from '@muyianking/ui'
import { ElForm } from 'element-plus'
import { reactive } from 'vue'

const model = reactive({ name: '' })
</script>

<template>
  <ElForm :model="model" label-width="80px">
    <MuFormItem label="姓名" prop="name" required>
      <MuInput v-model="model.name" />
    </MuFormItem>
  </ElForm>
</template>
```

带提示浮层：

```vue
<template>
  <mu-input v-model="value" tip-label="命名规则" tip="仅允许中文、字母与数字，长度不超过 20 个字符。" />
</template>
```

## Props

| 属性        | 类型   | 默认值   | 说明                                                         |
| ----------- | ------ | -------- | ------------------------------------------------------------ |
| placeholder | string | `''`     | 占位文本；为空时回退到父组件 `label` 生成「请输入xxx」       |
| tip         | string | `''`     | 聚焦浮层中的提示正文；为空则不弹浮层                         |
| tipLabel    | string | `''`     | 浮层标题，默认取「提示」                                     |
| type        | string | `'text'` | 传给 ElInput 的 `type`；等于 `'number'` 时输入不做去引号处理 |

其余属性经 `v-bind="$attrs"` 透传给 `el-input`。

## Emits

| 事件              | 参数   | 说明                                                   |
| ----------------- | ------ | ------------------------------------------------------ |
| update:modelValue | string | 由 `defineModel<string>()` 声明，随输入更新（v-model） |

组件未写 `defineEmits`，除 `update:modelValue` 外的监听器（如 `change`、`clear`、键盘事件）留在 `$attrs` 中，随 `v-bind="$attrs"` 透传给 `el-input`。

## Slots

| 插槽   | 作用域参数 | 说明                                                               |
| ------ | ---------- | ------------------------------------------------------------------ |
| prefix | 无         | 透传给 `el-input` 的 `#prefix`                                     |
| append | 无         | 透传给 `el-input` 的 `#suffix`（注意插槽名映射为 append → suffix） |

无默认插槽。

## 暴露

无。

## 业务逻辑

- `model` 由 `defineModel<string>()` 定义，模板用 `:model-value="model"` 单向下发，再由 `@input` 处理器写回。
- `placeholderComp`：优先用 `props.placeholder`；否则读取 `instance.parent.props.label`（直接父组件实例的 label），去掉中文/英文冒号后拼成 `请输入${label}`；仍取不到则用「请输入」。
- 提示浮层：仅当 `tip` 非空时生效。聚焦时从事件目标 `closest('.el-input')` 取输入框容器，记录其 `getBoundingClientRect()` 与 `clientWidth`，置 `showTips = true`；失焦置 `false`。
- `triggerRef` 是一个仅实现 `getBoundingClientRect()` 的虚拟触发器，返回上面记录的 DOMRect，配合 `el-popover` 的 `virtual-ref` + `virtual-triggering` 定位到输入框正上方（`placement="top"`），浮层宽度等于输入框 `clientWidth`。
- `tipsComp` 拼接 HTML 字符串：第一段是黄色标题（`tipLabel || '提示'`）加一个圆形问号，第二段是 `props.tip`，两段用 `<br/>` 连接，最终经 `v-html` 渲染进浮层。
- `handleInput`：`type === 'number'` 时原样写入 `val`（保留 `'1.'`、`'-'` 这类输入中间态，避免用户打不出小数）；其它类型会删除输入中的所有单引号字符。
- `clearable` 与 `show-word-limit` 在模板中硬编码开启。

## 约束与注意事项

- `tip` / `tipLabel` 通过 `v-html` 注入浮层，内容直接来自使用方；不要把用户可控字符串传入，存在 XSS 风险。
- placeholder 自动回退依赖「直接父组件」的 `label` prop（如 `MuFormItem`、`el-form-item`）。在 `mu-input` 与表单之间再套一层包装组件，或父组件没有 `label`，都会退化为「请输入」。
- `type === 'number'` 时不做任何字符清洗，输入中间态原样保留；非 number 类型会删除所有单引号（防止粘贴带入）。
- `type` 是本组件声明的 prop，传入后经模板 `:type` 下发给 `el-input`；因已声明为 prop，它不会落入 `$attrs`，不存在与透传属性同名的覆盖问题。
- 样式依赖 Element Plus 的 input 与 popover 样式，已由 `style/index.ts` 引入；`input.css` 无内容，不要期待本库提供输入框自定义样式。
- 浮层事件不透传，`el-popover` 的能力无法经本组件控制。

## 相关

- `packages/components/core/form-item/src/Index.vue`（提供 `label`，被 placeholder 回退读取）
- element-plus `ElInput`、`ElPopover`
- 演示页面 `playground/src/views/form/Index.vue`
