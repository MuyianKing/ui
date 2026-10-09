# MuButton 按钮

按钮族：基础按钮 `MuButton` 与 8 个预设业务按钮（新增、删除、查看、编辑、导出、导入、重置、查询）。

- 组件目录：`packages/components/core/button/`
- 对外导出：`MuButton`（默认导出同）、`MuAddButton`、`MuDelButton`、`MuDetailButton`、`MuEditButton`、`MuExportButton`、`MuImportButton`、`MuResetButton`、`MuSearchButton`
- 样式入口：`packages/components/core/button/style/index.ts`（类名 `.mu-button`、`.mu-del-button`）
- 演示页面：`playground/src/views/button/Index.vue`
- 依赖：element-plus 的 `ElButton`、`ElLink`、`ElTooltip`、`ElPopover`、`ElPopconfirm`；本库 `MuIcon`（`packages/components/core/icon/`）；内部 hook `./useButton`；`inject('GLOBAL_CUSTOM_CONFIG')`

## 基础用法

```vue
<script setup lang="ts">
import { MuAddButton, MuButton, MuDelButton, MuEditButton, MuExportButton, MuResetButton, MuSearchButton } from '@muyianking/ui'

function handleClick() {
  // noop
}
</script>

<template>
  <MuButton type="primary" @click="handleClick">
    提交
  </MuButton>

  <MuButton mode="text" @click="handleClick">
    文本按钮
  </MuButton>
  <MuButton mode="icon" icon="lucide:search" tip="查询" @click="handleClick" />
  <MuButton mode="icon" icon="lucide:search" @click="handleClick" />

  <MuSearchButton />
  <MuAddButton>创建</MuAddButton>
  <MuResetButton @confirm="handleClick" />
  <MuExportButton text>
    点击导出
  </MuExportButton>
  <MuDelButton @click="handleClick" />
  <MuEditButton text="自定义文字" @click="handleClick" />
</template>
```

## Props

### MuButton

| 属性      | 类型                                                                                  | 默认值      | 说明                                                                                  |
| --------- | ------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------- |
| icon      | string                                                                                | `''`        | 图标名（Iconify）；为空即不渲染图标（`button` 形态为前置图标、`icon` 形态为自身图标） |
| iconSize  | number                                                                                | `18`        | 图标形态（`icon`）的图标字号，传给 `MuIcon` 的 `size`                                 |
| mode      | `'button' \| 'text' \| 'icon'`                                                        | `'button'`  | 渲染形态：`button` 用 `el-button`、`text` 用 `el-link`、`icon` 走图标或图标 + Tooltip |
| placement | `Placement`（element-plus）                                                           | `'top'`     | 图标形态下 Tooltip 的出现位置                                                         |
| tip       | string                                                                                | `''`        | 仅图标形态使用的 Tooltip 文案（`button` / `text` 形态忽略）                           |
| type      | `'default' \| 'primary' \| 'success' \| 'warning' \| 'info' \| 'danger' \| undefined` | `'primary'` | 颜色类型，传给 `el-button` / `el-link`，也传给图标形态的 `MuIcon`                     |

`MuButton` 的文案只来自默认插槽，没有 `text` 一类的文本 prop：图标形态不渲染插槽，提示语只能给 `tip`。
`size` 不是 `MuButton` 的 prop：它随 `$attrs` 透传给 `el-button`（`size="small"` 等），图标字号用 `iconSize`。

### MuAddButton

| 属性 | 类型   | 默认值   | 说明                     |
| ---- | ------ | -------- | ------------------------ |
| text | string | `'添加'` | 文案，默认插槽为空时显示 |

### MuDelButton

| 属性      | 类型                        | 默认值                       | 说明                                           |
| --------- | --------------------------- | ---------------------------- | ---------------------------------------------- |
| message   | string                      | `'您确定确认删除？'`         | Popover 内的二次确认文案                       |
| noPopover | boolean                     | `false`                      | 为 `true` 时跳过二次确认，点击直接触发 `click` |
| placement | `Placement`（element-plus） | `'top'`                      | Popover 出现位置                               |
| icon      | string                      | `'icon-park-outline:delete'` | 图标名                                         |
| text      | `string \| boolean`         | 无默认（`undefined`）        | 有值渲染为文本按钮，无值 / 空值渲染为图标按钮  |

### MuDetailButton

| 属性 | 类型                | 默认值                     | 说明                                          |
| ---- | ------------------- | -------------------------- | --------------------------------------------- |
| icon | string              | `'icon-park-outline:find'` | 图标名                                        |
| text | `string \| boolean` | 无默认（`undefined`）      | 有值渲染为文本按钮，无值 / 空值渲染为图标按钮 |

### MuEditButton

| 属性 | 类型                | 默认值                | 说明                                          |
| ---- | ------------------- | --------------------- | --------------------------------------------- |
| icon | string              | `'uil:edit'`          | 图标名                                        |
| text | `string \| boolean` | 无默认（`undefined`） | 有值渲染为文本按钮，无值 / 空值渲染为图标按钮 |

### MuExportButton

| 属性 | 类型                | 默认值   | 说明                     |
| ---- | ------------------- | -------- | ------------------------ |
| text | `string \| boolean` | `'导出'` | 文案，默认插槽为空时显示 |

### MuImportButton

| 属性 | 类型                | 默认值   | 说明                     |
| ---- | ------------------- | -------- | ------------------------ |
| text | `string \| boolean` | `'导入'` | 文案，默认插槽为空时显示 |

### MuResetButton

| 属性      | 类型                | 默认值                            | 说明                                       |
| --------- | ------------------- | --------------------------------- | ------------------------------------------ |
| icon      | string              | `'icon-park-outline:refresh-one'` | 图标名                                     |
| text      | `string \| boolean` | `'重置'`                          | 文案                                       |
| noConfirm | boolean             | `false`                           | 为 `true` 时不弹确认，点击即触发 `confirm` |

### MuSearchButton

| 属性 | 类型                | 默认值            | 说明   |
| ---- | ------------------- | ----------------- | ------ |
| icon | string              | `'lucide:search'` | 图标名 |
| text | `string \| boolean` | `'查询'`          | 文案   |

其余属性经 `v-bind="$attrs"` 透传：`MuButton` 的 `button` / `text` 形态透传给 `el-button` / `el-link`，图标形态透传给 `MuIcon`。

## Emits

| 事件    | 参数 | 说明                                                                                                                                       |
| ------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| click   | 无   | 点击触发：`MuButton`、`MuAddButton`、`MuDelButton`、`MuDetailButton`、`MuEditButton`、`MuExportButton`、`MuImportButton`、`MuSearchButton` |
| confirm | 无   | 确认触发：仅 `MuResetButton`，Popconfirm 确认或 `noConfirm` 下点击时触发                                                                   |

## Slots

| 插槽    | 作用域参数 | 说明                                                                                                                                                                                                                 |
| ------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| default | 无         | 内容：`MuButton` 的唯一文案来源（无回退值，图标形态不渲染插槽）；预设按钮中为空时回退到自身 `text` / 默认文案：`MuAddButton`、`MuDetailButton`、`MuEditButton`、`MuExportButton`、`MuImportButton`、`MuSearchButton` |

`MuDelButton` 与 `MuResetButton` 无插槽，自定义内容只能通过 `text` 属性（`MuResetButton` 的 `noConfirm` 分支文案固定取 `text`）。

## 暴露

无。

## 业务逻辑

- `MuButton` 按 `mode` 四态渲染：
  1. `'text'`：`el-link`，类 `mu-button whitespace-nowrap`，内容取默认插槽；
  2. `'button'`：`el-button`，类 `mu-button`，`icon` 非空时前置 `MuIcon`（类 `mr-1`），内容取默认插槽；
  3. `'icon'` 且有 `tip`：`el-tooltip`（`effect="light"`、`enterable="false"`、`hide-after="0"`）包裹 `MuIcon`；
  4. `'icon'` 且无 `tip`：仅 `MuIcon`。
     四种形态统一在点击时 `emit('click')`；`mode` 为 `'text'` / `'button'` / `'icon'` 的联合类型，不再接受任意字符串。`tip` 只在第 3 态参与渲染，图标形态会忽略默认插槽。
- `useButton` 是各预设按钮的公共逻辑：
  - `buttonText`：存在默认插槽时返回 `''`（语义为“内容交给调用方”）；否则 `text` 为真值字符串时返回 `text`；再否则返回传入的 `defaultText`。
  - `mode`：`text` 不为 `undefined` 时，`text` 为真返回 `'text'`、为假返回 `'icon'`；`text` 未传时取 `tableIcon`，仅 `'button'` / `'text'` 被采信、其余值（含未配置）一律 `'icon'`。`text` 未传 = `props.text === undefined`，因此 `MuDelButton` / `MuDetailButton` / `MuEditButton` 的 `withDefaults` 里必须显式写 `text: undefined`：这三个按钮的 `text` 类型含 `Boolean`，Vue 会把未传的布尔型 prop 转成 `false`，缺了这句 `tableIcon` 就静默失效（`MuSearchButton` / `MuExportButton` / `MuResetButton` 有真实文案默认值，`MuImportButton` 不走 `tableIcon`，都不适用）。
- 预设按钮的默认插槽回退文案取 `useButton` 的 `buttonText`（存在调用方插槽时为空串、由插槽内容接管；否则为 `text` 属性或默认文案），并把同一个 `buttonText` 传给 `MuButton` 的 `tip` 以保留图标形态的悬浮提示：`MuAddButton`、`MuDetailButton`、`MuEditButton`、`MuExportButton`、`MuImportButton`、`MuSearchButton` 用 `<slot>{{ buttonText }}</slot>`；`MuDelButton` / `MuResetButton` 没有插槽，直接把 `{{ buttonText }}` 放进 `MuButton` 的默认插槽。`MuEditButton` / `MuDetailButton` 此前无条件透传了一个空插槽，导致只传 `text`、不传插槽时文本形态渲染为空，现已改为带 `buttonText` 回退的 `<slot>{{ buttonText }}</slot>`。
- 预设按钮的图标形态（`icon` 与 `mode="icon"`）与文本形态（`mode="text"`）由全局配置 `tableIcon` 经 `useButton` 决定（`text` 未传时）；`MuAddButton` 的图标显隐由 `buttonIcon` 决定 —— 为真时传 `icon-park-outline:add-one`、否则传空字符串让 `MuButton` 不渲染图标，其 `type="danger"` 固定。
- `MuDelButton` 默认用 `el-popover`（`trigger="click"`、`width=180`）做二次确认：点击只展开 Popover，点“确定”后关闭并 `emit('click')`，点“取消”只关闭；`noPopover` 为 `true` 时直接渲染 `MuButton` 并 `emit('click')`。
- `MuResetButton` 默认用 `el-popconfirm`（标题“确定要重置吗？”）确认后 `emit('confirm')`；`noConfirm` 为 `true` 时改用原生 `el-button`，点击直接 `emit('confirm')`。
- 各预设按钮固定的 `type` 与 `icon`：`MuAddButton` 为 `danger` + `icon-park-outline:add-one`；`MuDetailButton` / `MuEditButton` 为 `primary`；`MuExportButton` 为 `success` + `ph:export-bold`；`MuImportButton` 为 `ph:import-bold`（`type` 用默认 `primary`）；`MuSearchButton` 为 `lucide:search`（默认 `primary`）；`MuResetButton` 为 `icon-park-outline:refresh-one`；`MuDelButton` 为 `danger` + `icon-park-outline:delete`。

## 约束与注意事项

- `$attrs` 的落点随形态变化：`button` / `text` 形态落在 `el-button` / `el-link` 上，图标形态落在 `MuIcon` 上。给图标形态传 `class` 时最终作用于图标元素。
- 图标只有 `icon` 一个开关：`icon` 为空即不渲染，没有 `showIcon`。图标形态必须提供 `icon`，否则 `MuIcon` 的必填 `icon` 为空。
- 图标字号是 `iconSize`（默认 18，仅图标形态生效）；`size` 留给 `el-button`，经 `$attrs` 透传（`button` 形态）。
- 破坏性调整（0.0.1-beta 阶段）：`buttonType` 改为 `mode` 并收窄为 `'button' | 'text' | 'icon'`；图标签名字号 `size` 改为 `iconSize`，`size` 交还 `el-button`；`showIcon` 删除，图标显隐只看 `icon`；`MuButton` 的 `text` 改为 `tip` 并只服务图标形态的 Tooltip，`button` / `text` 形态的文案一律走默认插槽（不再有文本 prop 兜底）。外部调用方需同步改这些 prop 名。
- 预设按钮中 `MuDelButton`、`MuResetButton` 没有默认插槽，想自定义文案只能用 `text` 属性。
- `MuResetButton` 的事件名是 `confirm` 而非 `click`；其 `noConfirm` 分支用的是原生 `el-button` + `MuIcon`，视觉与 `MuButton` 不完全一致。
- `MuButton` 没有文本框 prop：`button` / `text` 形态的文案只能写在默认插槽里，图标形态忽略插槽、提示语只认真 `tip`。预设按钮的 `text` 是它们自己的 prop，用于决定形态并作为插槽回退值。
- 预设按钮的 `text` 传空字符串会切换为图标形态（`useButton` 中 `props.text ? 'text' : 'icon'`）；`MuExportButton` / `MuImportButton` 因 `text` 有默认值，默认渲染为文本按钮（`el-link`）。
- 按钮族依赖 `GLOBAL_CUSTOM_CONFIG`：`tableIcon` 未配置时，`text` 未传的预设按钮（`MuDelButton` / `MuDetailButton` / `MuEditButton`）渲染为图标按钮；配置为 `'text'` / `'button'` 时分别渲染为文本 / 标准按钮，其余值按图标按钮处理（类型层面 `tableIcon` 已收窄为 `TableIcon = 'text' | 'button' | 'icon'`，见 `GlobalCustomConfig`）。`buttonIcon` 未配置时 `MuAddButton` 不显示图标。
- `MuDelButton` / `MuDetailButton` / `MuEditButton` 的 `withDefaults` 里那句 `text: undefined` 是必需的，不要删：`text` 类型含 `Boolean`，Vue 对未传的布尔型 prop 会转成 `false`，靠显式的 `undefined` 默认值才能跳过布尔转换，否则 `tableIcon` 会静默失效（回归护栏见 `packages/components/core/button/__tests__/button.spec.ts`）。
- `style/index.ts` 需依次引入 Element Plus 的 `button`、`tooltip`、`link`、`popover`、`popconfirm` 样式，再引本库 CSS；顺序由 `docs/theme-chalk.md` 约定。
- theme-chalk 中多数按钮变体 CSS 为空文件（`add-button`、`detail-button`、`edit-button`、`export-button`、`import-button`、`reset-button`、`search-button` 均为 0 字节），仅 `del-button.css` 有 `.mu-del-button { vertical-align: bottom }`。

## 相关

- 依赖组件：`packages/components/core/icon/`（`MuIcon`）
- 全局配置：`MuConfigProvider`（`GLOBAL_CUSTOM_CONFIG` 的 `tableIcon`、`buttonIcon`），见 `docs/config-provider.md`
- 内部 hook：`packages/components/core/button/src/useButton.ts`
- 样式：`packages/theme-chalk/css/button.css` 及 `add-button.css` 等按钮族 CSS
- 演示页面：`playground/src/views/button/Index.vue`
- 文档：`docs/theme-chalk.md`
