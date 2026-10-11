# MuSearchPage 搜索页容器

一句话定位：列表页的搜索区加内容区布局容器，提供固定/普通按钮位、可展开的高级搜索插槽，以及内容区的 loading 与滚动。

- 组件目录：`packages/components/core/search-page/`
- 对外导出：`MuSearchPage`
- 样式入口：`packages/components/core/search-page/style/index.ts`（类名 `.mu-search-page`、`.search-area`、`.bottom`、`.table-body`、`.fixed-button`）
- 演示页面：`playground/src/views/search-page/Index.vue`
- 依赖：element-plus 的 `ElForm`、`vLoading`；本库的 `MuButton`；unplugin-icons 编译期图标（高级搜索箭头 `~icons/ep/arrow-down`）

## 基础用法

```vue
<script setup lang="ts">
import { MuSearchPage } from '@muyianking/ui'
import { ElButton, ElFormItem, ElInput } from 'element-plus'
</script>

<template>
  <MuSearchPage>
    <template #header>
      <ElFormItem label="测试">
        <ElInput placeholder="请输入" />
      </ElFormItem>
    </template>
    <template #button>
      <ElButton type="danger">
        查询
      </ElButton>
      <ElButton type="primary">
        test
      </ElButton>
    </template>
  </MuSearchPage>
</template>
```

## Props

| 属性         | 类型                                 | 默认值       | 说明                                 |
| ------------ | ------------------------------------ | ------------ | ------------------------------------ |
| formSize     | `ComponentSize`（来自 element-plus） | `'default'`  | 搜索表单尺寸                         |
| labelWidth   | `string \| number`                   | `'auto'`     | 表单标签宽度                         |
| loading      | `boolean`                            | `false`      | 内容区（`table` 插槽外层）的 loading |
| fixedButton  | `boolean`                            | `false`      | 按钮放入右对齐的固定高度容器         |
| advancedText | `string`                             | `'高级搜索'` | 展开/收起高级搜索的按钮文案          |
| noSearch     | `boolean`                            | `false`      | 隐藏整个搜索表单区                   |
| tableStyle   | `string`                             | `''`         | 内容区容器的行内样式                 |
| tableClass   | `string`                             | `''`         | 内容区容器的额外类名                 |
| bottomClass  | `string`                             | `''`         | 底部区域额外类名，按空格拆分逐个添加 |

其余属性经组件单根节点（根 `div`）自动继承透传，**不会**落到 `el-form` 上；控制表单请用 `formSize` / `labelWidth`。

## Emits

无。组件不提供查询、重置、展开等事件。

## Slots

| 插槽     | 作用域参数 | 说明                                                                         |
| -------- | ---------- | ---------------------------------------------------------------------------- |
| header   | 无         | 搜索表单的常驻区域，始终渲染（`noSearch` 为真时随表单一起消失）              |
| advanced | 无         | 高级搜索区域，仅当内部 `showAdvanced` 为 `true` 时渲染（`v-if`，无过渡动画） |
| button   | 无         | 操作按钮位；`fixedButton` 为真时被包进右对齐容器                             |
| table    | 无         | 内容区，外层承载 `loading`，并在 `.table-body` 中滚动                        |
| default  | 无         | 底部区域（通常放分页），固定在内容区下方                                     |

## 暴露

无。

## 业务逻辑

- 布局为纵向 flex：搜索表单区在上、底部内容区在下；根节点类名 `flex flex-col h-full p-2.5 mu-search-page`，四周内边距由工具类 `p-2.5`（10px）提供，高度撑满容器并在自身纵向滚动。
- `noSearch` 为真时整个 `el-form` 不渲染，此时底部区域不添加 `mt-2.5`（无上边距）；为假时添加 `mt-2.5`（10px）。
- 高级搜索默认收起：内部状态 `showAdvanced = ref(false)`；`toggleAdvanced` 取反。展开按钮仅在「存在 `advanced` 插槽且 `advancedText` 非空」时渲染，图标为 `ep:arrow-down`，展开时通过 `.up-arrow` 旋转 180 度。
- `fixedButton` 为真时，`button` 插槽被包进 `.fixed-button`（高度由工具类 `h-8` 提供、`flex-grow: 1`、右对齐），用于按钮吸右；否则 `button` 插槽直接平铺在搜索区。
- `loading` 透传给内容区的 `v-loading`，遮罩只覆盖 `table` 插槽区域，不影响底部。
- `bottomClass` 被 `split(' ')` 拆成类名对象逐项添加，空串会被跳过。
- 组件自身不发起请求、不持有查询参数，也没有内置的查询/重置按钮与事件；查询与重置逻辑由使用方通过 `button` 插槽自行放置按钮并绑定事件。

## 约束与注意事项

- 查询与重置不是本组件的能力：`button` 插槽里的按钮完全由使用方提供并自行绑定 `@click`，组件不会代为触发任何事件。
- 根节点是普通 `div`，`$attrs` 会落到该 `div` 上，不会转发给 `el-form`；`label-position`、`size` 等表单属性不会自动生效，请用 `formSize` / `labelWidth`。
- `advanced` 插槽是 `v-if` 直接挂载/卸载，没有动画；CSS 里的 `.advanced-area` 类在模板中并未使用，当前不参与渲染。
- 布局依赖 Tailwind 工具类（`flex`、`h-full`、`flex-1` 等）在消费者应用被扫描生成；库本体不带 Tailwind 配置。
- `advancedText` 为空字符串时会隐藏展开按钮，但仍会渲染 `advanced` 插槽（因为 `showAdvanced` 默认 false，实际不可见）。

## 相关

- 关联组件：`MuButton`（`packages/components/core/button/`）；高级搜索箭头为编译期图标组件（`~icons/ep/arrow-down`）
- 公共类型：无
- 样式：`packages/theme-chalk/css/search-page.css`
- 演示页面：`playground/src/views/search-page/Index.vue`
