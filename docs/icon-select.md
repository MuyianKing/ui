# MuIconSelect 图标选择器

以 Popover 弹层展示可选图标列表的选择器，支持搜索、滚动分页与 `v-model` 双向绑定。

- 组件目录：`packages/components/core/icon-select/`
- 对外导出：`MuIconSelect`
- 样式入口：`packages/components/core/icon-select/style/index.ts`（类名 `.mu-icon-select`，另含 `.mu-icons-wrapper`、`.icon-content`、`.icon-item`、`.btn-wrapper`）
- 演示页面：`playground/src/views/icon-select/Index.vue`
- 依赖：element-plus 的 `ElPopover`、`ElButton`、`vLoading`（loading 指令）；运行时 `Icon`（`@iconify/vue`；图标名来自 `getIcons`，无法编译期确定）、本库 `MuInput`；`@vueuse/core` 的 `useDebounceFn`；运行时需通过 `MuConfigProvider` 注入 `GLOBAL_CUSTOM_CONFIG.getIcons`。

## 基础用法

演示页仅渲染组件本体、未绑定值，以下据源码 `defineModel` 补充 `v-model` 用法。

```vue
<script setup lang="ts">
import { MuIconSelect } from '@muyianking/ui'
import { ref } from 'vue'

const icon = ref('')
</script>

<template>
  <MuIconSelect v-model="icon" />
</template>
```

## Props

| 属性        | 类型                                             | 默认值         | 说明                                 |
| ----------- | ------------------------------------------------ | -------------- | ------------------------------------ |
| placeholder | `string`                                         | `'请选择图标'` | 未选中时在触发器内显示的占位文字     |
| title       | `string`                                         | `''`           | 透传给 `el-popover` 的标题           |
| teleported  | `boolean`                                        | `true`         | 透传给 `el-popover`，是否挂载到 body |
| width       | `string`                                         | `'440px'`      | 透传给 `el-popover` 的宽度           |
| trigger     | `'click' \| 'focus' \| 'hover' \| 'contextmenu'` | `'click'`      | 透传给 `el-popover` 的触发方式       |

`v-model` 绑定的值为选中的图标名（字符串），未选中时为 `undefined` 或清除后的空字符串。

## Emits

无 `defineEmits`；通过 `defineModel()` 提供 `v-model`，选中图标或清除时触发 `update:modelValue`。

## Slots

无。

## 暴露

无。

## 业务逻辑

- 数据来源：`inject('GLOBAL_CUSTOM_CONFIG')` 后调用 `getIcons(query)`。若未注入 `MuConfigProvider` 或 `getIcons` 缺失，`getData` 直接返回，弹层内不会渲染任何图标。
- `getIcons` 契约：入参为 `IconQuery`（`{ limit, page, query }`），返回 `Promise<IconQueryResult>`（`{ data: string[], count: number }`）；`data` 中每项是图标名字符串（同时用作列表 `:key` 与 `Icon` 的 `icon`），`count` 为总数。两个类型与 `GlobalCustomConfig` 同在 `packages/components/core/types/common.ts` 并从公共入口导出。
- 查询状态：`limit` 固定 `200`，`page` 从 `1` 开始，`query` 为搜索关键字。
- 搜索：`mu-input` 的输入经 `search`（`useDebounceFn`，300ms 防抖）触发，重置 `page = 1` 后重新拉取。
- 分页：`.icon-content` 的 `scroll.passive` 事件调用 `handleBottom`，仅在非 loading 且 `hasMore` 为真时 `page++` 并追加数据；`hasMore = count > page * limit`。
- 并发控制：`request_token` 自增令牌，过期响应直接丢弃，避免旧结果覆盖新结果；`loading` 只在令牌仍有效时复位。
- 选中：点击列表项即把图标名写入 `model`（`handleClick`），但不关闭弹层；点击“确定”才调用 `popoverRef.hide()` 关闭；点击“清除”置空 `model` 并关闭。
- 首次挂载即调用一次 `getData()` 预取第一页。

## 约束与注意事项

- 强依赖 `MuConfigProvider` 的 `getIcons`；未配置时组件静默无数据，不会报错。`getIcons` 由使用方注入 `customConfig` 提供。
- 搜索框提示为“请输入名称搜索，仅支持英文”，搜索关键字按原样传给 `getIcons`，匹配规则由使用方实现。
- 弹层内的 `.icon-content` 由 `.mu-icons-wrapper` 上的 `max-h-[400px]` 工具类约束产生滚动区域，滚动到底触发分页。
- 样式文件中选择器写作 `.mu-icon-select .placholder-item`（拼写为 `placholder`），而模板使用的类名是 `placeholder-item`，二者不一致，占位文字的灰色样式实际不生效。以源码为准，这里按现状记录。
- 弹层内容使用 Tailwind 工具类（如 `flex items-center cursor-pointer`），需消费方应用启用 Tailwind 才会得到预期排版。

## 相关

- 图标渲染：运行时 `Icon`（`@iconify/vue`，图标名来自 `getIcons`）；渲染依赖 [`packages/components/core/input/`](packages/components/core/input/)（`MuInput`）
- 全局配置：[`packages/components/core/config-provider/src/Index.vue`](packages/components/core/config-provider/src/Index.vue) 提供的 `GLOBAL_CUSTOM_CONFIG.getIcons`
- 样式文件：[`packages/theme-chalk/css/icon-select.css`](packages/theme-chalk/css/icon-select.css)
- 演示页面：[`playground/src/views/icon-select/Index.vue`](playground/src/views/icon-select/Index.vue)
