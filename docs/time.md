# MuTime 时间文本

把「日期 + 时间」合一的字符串按分隔符拆成日期段与时间段分别渲染的文本组件。

- 组件目录：`packages/components/core/time/`
- 对外导出：`MuTime`（具名导出 + 默认导出）
- 样式入口：`packages/components/core/time/style/index.ts`（类名 `.mu-time`、`.mu-time-separator`、`.mu-time-value`）
- 演示页面：暂无
- 依赖：无 element-plus 组件、无本库其它组件、无 utils；仅用 Vue 的 `computed`

## 基础用法

```vue
<script setup lang="ts">
import { MuTime } from '@muyianking/ui'
</script>

<template>
  <!-- 默认分隔符为空格，自动拆成日期与时间两段 -->
  <MuTime time="2026-10-09 09:30:00" />

  <!-- 自定义分隔符 -->
  <MuTime time="2026-10-09T09:30:00" separator="T" />

  <!-- 不换行 -->
  <MuTime time="2026-10-09 09:30:00" nowrap />
</template>
```

## Props

| 属性      | 类型      | 默认值  | 说明                                                      |
| --------- | --------- | ------- | --------------------------------------------------------- |
| time      | `string`  | `''`    | 原始时间字符串，按 `separator` 拆分                       |
| separator | `string`  | `' '`   | 日期与时间的分隔符，同时用于渲染中间的分隔符              |
| nowrap    | `boolean` | `false` | 为 true 时给根元素加 `whitespace-nowrap` 工具类，禁止换行 |

## Emits

无。

## Slots

无。

## 暴露

无。

## 业务逻辑

- `timeParts = time.split(separator)`；`dateStr` 取第 0 段，`timeStr` 取第 1 段，两段都用 `|| ''` 兜底空值。
- 渲染结构：根 `<span class="mu-time">` 先输出 `dateStr`；当且仅当 `timeStr` 非空时，追加 `<span class="mu-time-separator">{{ separator }}</span>` 与 `<span class="mu-time-value">{{ timeStr }}</span>`。
- `nowrap` 通过根元素的动态 class 切换 Tailwind 的 `whitespace-nowrap`，组件不写 `<style>`。
- 边界：字符串中没有分隔符时，整串作为日期输出，不渲染时间段；`separator` 为空串时 `split('')` 会按字符拆分，日期段仅为第一个字符，属预期外的输入，调用方需保证分隔符非空。

## 约束与注意事项

- 组件只做「按固定分隔符一分为二」，不解析日期、不做时区/格式化处理；超过两段的内容会被丢弃（只取索引 0 与 1）。
- `separator` 同时是「切分依据」和「渲染文本」，改它会影响两处行为。
- 样式文件 `packages/theme-chalk/css/time.css` 当前为空，类名仅作语义标记，实际换行控制依赖 Tailwind 的 `whitespace-nowrap`。

## 相关

- 公共入口导出：`packages/components/index.ts`
