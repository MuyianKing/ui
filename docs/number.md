# MuNumber 数字格式化展示

把数字按区 万 / 亿 自动缩写并保留千分位的纯展示组件。

- 组件目录：`packages/components/core/number/`
- 对外导出：`MuNumber`
- 样式入口：`packages/components/core/number/style/index.ts`（模板根节点为无类名的 `<span>`，`theme-chalk/css/number.css` 中的 `.mu-data-num` 当前未被使用）
- 演示页面：`playground/src/views/number/Index.vue`
- 依赖：无（无 Element Plus 组件、无本库其它组件，纯 Vue watchEffect）

## 基础用法

```vue
<script setup lang="ts">
import { MuNumber } from '@muyianking/ui'
</script>

<template>
  <MuNumber :num="9998" />
  <MuNumber :num="456383" />
  <MuNumber :num="999999998" />
  <MuNumber :num="12345678" separator="." />
</template>
```

## Props

| 属性      | 类型   | 默认值 | 说明                                             |
| --------- | ------ | ------ | ------------------------------------------------ |
| num       | number | `0`    | 待展示的数字                                     |
| separator | string | `','`  | 小于 1 万时的千分位分隔符，替换 en-US 千分位逗号 |

## Emits

无。

## Slots

无。

## 暴露

无。

## 业务逻辑

- `watchEffect` 监听 `props.num`，同步刷新两个内部 ref：`numFormat`（数字文本）与 `suffix`（单位），模板输出 `{{ numFormat }}{{ suffix }}`。
- 分支规则：
  - `num >= 100000000`（1 亿）：`(num / 100000000).toFixed(2)`，单位「亿」。
  - `num >= 10000`（1 万）：`(num / 10000).toFixed(2)`，单位「万」。
  - 其余（含负数）：`num.toLocaleString('en-US')` 得到带千分位逗号的字符串，再经 `group()` 用正则把每个 `,` 替换为 `props.separator`，无单位。
- 千分位固定用 `en-US` 取值再替换分隔符，避免输出随运行环境 locale 变成 `1.234`（欧陆）或 `1 234`（法语）；这是刻意固定，不要改成本地 `toLocaleString()`。
- 万 / 亿分支固定 `toFixed(2)` 保留两位小数并四舍五入，因此会进位：`999999998` 输出 `10.00亿`，而不是 `9.99亿`。
- 小于 1 万分支走 `toLocaleString` 默认规则（最多 3 位小数），如 `1234.5678` 会变成 `1,234.568`。
- `separator` 只在小于 1 万的分支生效；万 / 亿分支结果里不含千分位。

## 约束与注意事项

- `num` 只接受 `number`；比较用的是 `>=`，传入字符串等非数字类型的行为不在类型保证范围内。
- 万 / 亿缩写一律两位小数且会四舍五入进位，若需要截断或更多精度，本组件不支持。
- 负数与小于 1 万的数走同一分支，同样会插入 `separator`。
- 组件只输出一个 `<span>` 文本节点，无交互、无 emits、无插槽、无 `defineExpose`；需要样式请自行在外层包一层或通过 `class` 透传到根节点。
- `theme-chalk/css/number.css` 里只有未使用的 `.mu-data-num`，不要依据它给模板加同名类，除非同步调整样式。

## 相关

- 演示页面 `playground/src/views/number/Index.vue`
- 样式 `packages/theme-chalk/css/number.css`
