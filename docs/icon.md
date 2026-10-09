# MuIcon 图标

对 `@iconify/vue` 的 `Icon` 组件的轻量封装，统一尺寸、颜色与主题色写法。

- 组件目录：`packages/components/core/icon/`
- 对外导出：`MuIcon`
- 样式入口：`packages/components/core/icon/style/index.ts`（类名 `.mu-icon`；该入口为空文件，`theme-chalk/css` 下也没有 `icon.css`，库本体未内置 `.mu-icon` 样式）
- 演示页面：`playground/src/views/icon/Index.vue`
- 依赖：`@iconify/vue` 的 `Icon`；`@muyianking/utils` 的 `getCanUseValue`。不依赖 element-plus 组件；不读取 `GLOBAL_CUSTOM_CONFIG`。

## 基础用法

取自演示页 `playground/src/views/icon/Index.vue`。

```vue
<script setup lang="ts">
import { MuIcon } from '@muyianking/components'
</script>

<template>
  <MuIcon icon="material-symbols:10mp" />
  <MuIcon icon="material-symbols:10mp" size="40" />
  <MuIcon icon="material-symbols:10mp" color="red" />
</template>
```

## Props

| 属性  | 类型               | 默认值     | 说明                                                           |
| ----- | ------------------ | ---------- | -------------------------------------------------------------- |
| icon  | `string`           | 无（必填） | Iconify 图标名，如 `material-symbols:10mp`                     |
| size  | `string \| number` | `'18px'`   | 图标尺寸；经 `getCanUseValue` 处理后写入 `font-size`           |
| color | `string`           | `''`       | 图标颜色，优先级高于 `type`                                    |
| type  | `string`           | `''`       | Element Plus 主题色类型，非空时颜色取 `var(--el-color-<type>)` |

## Emits

无。

## Slots

无（内部直接渲染 `Icon` 组件，不暴露插槽）。

## 暴露

无。

## 业务逻辑

- 始终使用 `@iconify/vue` 的 `Icon` 渲染，`icon` 直接透传为其 `icon` 属性；**不注入、也不读取 `MuConfigProvider` 的 `getIcons` 配置**。
- 尺寸：`font-size` 由 `getCanUseValue(size)` 生成。纯数字或纯数字字符串会补 `px`（`'40'` → `'40px'`，`40` → `'40px'`）；已是带单位或非数字字符串（如 `'2em'`、`'18px'`）原样返回。
- 颜色：`color` 非空时直接用 `color`；否则 `type` 非空时用 `var(--el-color-${type})`；两者都为空则不设置颜色。
- 固定输出 `aria-hidden="false"`，即默认对辅助技术可见。
- 根元素是 `Icon` 组件本身，外部传入的 `class` / `style` / 其余属性会透传到该组件（演示页用 `style="font-size: 40px"` 覆盖即为该机制）。

## 约束与注意事项

- `type` 依赖 Element Plus 主题变量 `--el-color-<type>`，需应用侧已引入 Element Plus 主题（如 primary/success/warning/danger/info），否则 `var()` 解析为空、颜色不生效。
- 该组件不消费全局 `getIcons`。若项目需要从 `MuConfigProvider` 动态获取图标，应使用 `MuIconSelect` 或自行注入 `GLOBAL_CUSTOM_CONFIG`。
- 库本体未提供 `.mu-icon` 样式，图标外观完全来自 `@iconify/vue` 与传入的 `style` / `class`。
- 需要图标字体/图形随图标名按需加载，由 `@iconify/vue` 的运行时机制决定；组件本身不做离线图标集打包。

## 相关

- 上层组件：[`packages/components/core/icon-select/`](packages/components/core/icon-select/)（其列表项即使用 `MuIcon` 渲染）
- 尺寸工具：`@muyianking/utils` 的 `getCanUseValue`
- 演示页面：[`playground/src/views/icon/Index.vue`](playground/src/views/icon/Index.vue)
