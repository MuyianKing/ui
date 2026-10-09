# MuBlockTitle 区块标题

左侧色块 + 标题文字的区块小标题，用于内容分区。

- 组件目录：`packages/components/core/block-title/`
- 对外导出：`MuBlockTitle`（`export const MuBlockTitle`，同时 `export default`）
- 样式入口：`packages/components/core/block-title/style/index.ts`（类名 `.mu-block-title`，渐变由附加类 `.mu-linear-gradient` 开启）
- 演示页面：`playground/src/views/block-title/Index.vue`
- 依赖：无 Element Plus 依赖，也不依赖本库其它组件；样式来自 `@muyianking/theme-chalk/css/block-title.css`

## 基础用法

```vue
<script setup lang="ts">
import { MuBlockTitle } from '@muyianking/ui'
</script>

<template>
  <MuBlockTitle title="用户信息" />
  <MuBlockTitle title="渐变标题" linear-gradient />
  <MuBlockTitle title="危险" type="danger" />
</template>
```

带右侧附加内容和自定义标题槽：

```vue
<template>
  <MuBlockTitle title="成员列表" type="success">
    <template #after>
      <span class="text-gray-400">共 12 人</span>
    </template>
  </MuBlockTitle>
</template>
```

## Props

| 属性           | 类型    | 默认值      | 说明                                                                 |
| -------------- | ------- | ----------- | -------------------------------------------------------------------- |
| type           | string  | `'primary'` | 左侧色块的样式类，CSS 内置 `primary` / `success` / `danger` 三套背景 |
| title          | string  | `''`        | 标题文字，默认插槽为空时作为回退内容                                 |
| fontSize       | number  | `15`        | 标题字号，单位 px                                                    |
| color          | string  | `'#333'`    | 标题文字颜色                                                         |
| showBlock      | boolean | `true`      | 是否显示左侧色块                                                     |
| linearGradient | boolean | `false`     | 是否使用渐变样式，为真时在根节点追加 `mu-linear-gradient` 类         |

其余属性经 `v-bind="$attrs"` 透传到根 `div`。

## Emits

无。

## Slots

| 插槽    | 作用域参数 | 说明                                   |
| ------- | ---------- | -------------------------------------- |
| default | 无         | 标题内容，未提供时回退到 `title`       |
| after   | 无         | 根节点右侧的附加内容区，位于标题行之外 |

## 暴露

无。

## 业务逻辑

- 根节点固定为 `.mu-block-title`；`linearGradient` 为真时再追加 `mu-linear-gradient` 类，由 `.mu-block-title.mu-linear-gradient` 提供渐变色块背景（纯色模式则不追加，走 `.primary` / `.success` / `.danger` 的实底背景）。
- 左侧色块由 `showBlock` 控制渲染，`class="block"` 叠加 `type`，颜色由 theme-chalk 中 `.primary` / `.success` / `.danger` 决定。
- 标题的 `color` 与 `fontSize` 由 `title_style` 计算属性输出为内联样式（`font-size` 带 px）。
- 标题区渲染默认插槽，插槽为空时显示 `title`；右侧 `after` 具名插槽独立于标题行，位于根节点的第二个子 `div`。
- 根节点 `v-bind="$attrs"`，外部传入的 `class` / `style` 会落到根 `div` 而非标题上。

## 约束与注意事项

- `type` 只在 theme-chalk 中定义了 `primary`、`success`、`danger` 三种背景，传其它值不会报错但色块无背景色。
- 根类名固定为 `.mu-block-title`，渐变是同节点上的附加类 `.mu-linear-gradient`，外部覆盖样式时按需组合这两个类，不存在第二套根类名。
- 标题颜色默认值为硬编码的 `#333`（内联样式，不随主题变化）；色块背景走 Element Plus 主题变量：纯色用 `--el-color-primary` / `--el-color-success` / `--el-color-danger`，渐变用对应的 `-light-3` → `-dark-2` 档位。
- 组件为纯展示组件：无内部状态、无事件、无 `defineExpose`。

## 相关

- 样式：`packages/theme-chalk/css/block-title.css`
- 文档：`docs/theme-chalk.md`（样式体系与维护红线）
- 演示页面：`playground/src/views/block-title/Index.vue`
