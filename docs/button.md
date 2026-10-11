# MuButton 按钮

按钮族：基础按钮 `MuButton` 与 8 个预设业务按钮（新增、删除、查看、编辑、导出、导入、重置、查询）。

- 组件目录：`packages/components/core/button/`
- 对外导出：`MuButton`（默认导出同）、`MuAddButton`、`MuDelButton`、`MuDetailButton`、`MuEditButton`、`MuExportButton`、`MuImportButton`、`MuResetButton`、`MuSearchButton`
- 样式入口：`packages/components/core/button/style/index.ts`（类名 `.mu-button`、`.mu-del-button`）
- 演示页面：`playground/src/views/button/Index.vue`
- 依赖：element-plus 的 `ElButton`、`ElLink`、`ElMessageBox`、`ElPopconfirm`、`ElTooltip`；预设固定图标经 unplugin-icons 编译期打包（`~icons/*`），字符串图标名经 `@iconify/vue` 的 `Icon` 运行时渲染；内部 hook `./useButton`；`inject('GLOBAL_CUSTOM_CONFIG')`

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

| 属性      | 类型                                                                                  | 默认值      | 说明                                                                                                                             |
| --------- | ------------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| icon      | string                                                                                | `''`        | Iconify 图标名（运行时解析）或 unplugin-icons 编译期图标组件；为空即不渲染图标（`button` 形态为前置图标、`icon` 形态为自身图标） |
| iconSize  | number                                                                                | `16`        | 图标字号，以内联 `font-size` 落在图标上（`button` 形态的前置图标与 `icon` 形态）                                                 |
| mode      | `'button' \| 'text' \| 'icon'`                                                        | `'button'`  | 渲染形态：`button` 用 `el-button`、`text` 用 `el-link`、`icon` 走图标或图标 + Tooltip                                            |
| placement | `Placement`（element-plus）                                                           | `'top'`     | 图标形态下 Tooltip 的出现位置                                                                                                    |
| tip       | string                                                                                | `''`        | 仅图标形态使用的 Tooltip 文案（`button` / `text` 形态忽略）                                                                      |
| type      | `'default' \| 'primary' \| 'success' \| 'warning' \| 'info' \| 'danger' \| undefined` | `'primary'` | 颜色类型，传给 `el-button` / `el-link`，图标形态按它取 `var(--el-color-<type>)` 着色                                             |

`MuButton` 的文案只来自默认插槽，没有 `text` 一类的文本 prop：图标形态不渲染插槽，提示语只能给 `tip`。
`size` 不是 `MuButton` 的 prop：它随 `$attrs` 透传给 `el-button`（`size="small"` 等），图标字号用 `iconSize`。

### MuAddButton

无 prop：文案由默认插槽提供（回退「添加」），前置图标显隐由全局配置 `buttonIcon` 决定。

### MuDelButton

| 属性      | 类型                  | 默认值                              | 说明                                              |
| --------- | --------------------- | ----------------------------------- | ------------------------------------------------- |
| message   | string                | `'您确定确认删除？'`                | 确认弹窗的提示文案                                |
| noPopover | boolean               | `false`                             | 为 `true` 时不弹确认弹窗，点击直接触发 `click`    |
| icon      | `string \| Component` | `'~icons/icon-park-outline/delete'` | 默认删除图标（编译期组件），也可传 Iconify 图标名 |
| text      | `string \| boolean`   | 无默认（`undefined`）               | 有值渲染为文本按钮，无值 / 空值渲染为图标按钮     |

### MuDetailButton

| 属性 | 类型                  | 默认值                            | 说明                                              |
| ---- | --------------------- | --------------------------------- | ------------------------------------------------- |
| icon | `string \| Component` | `'~icons/icon-park-outline/find'` | 默认详情图标（编译期组件），也可传 Iconify 图标名 |
| text | `string \| boolean`   | 无默认（`undefined`）             | 有值渲染为文本按钮，无值 / 空值渲染为图标按钮     |

### MuEditButton

| 属性 | 类型                  | 默认值                | 说明                                              |
| ---- | --------------------- | --------------------- | ------------------------------------------------- |
| icon | `string \| Component` | `'~icons/uil/edit'`   | 默认编辑图标（编译期组件），也可传 Iconify 图标名 |
| text | `string \| boolean`   | 无默认（`undefined`） | 有值渲染为文本按钮，无值 / 空值渲染为图标按钮     |

### MuExportButton

无 prop：恒为标准按钮，文案由默认插槽提供（回退「导出」），前置图标显隐由 `buttonIcon` 决定。

### MuImportButton

无 prop：恒为标准按钮，文案由默认插槽提供（回退「导入」），前置图标显隐由 `buttonIcon` 决定。

### MuResetButton

| 属性      | 类型                  | 默认值                                   | 说明                                                                                |
| --------- | --------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------- |
| icon      | `string \| Component` | `'~icons/icon-park-outline/refresh-one'` | 默认重置图标（编译期组件），也可传 Iconify 图标名；前置图标显隐由 `buttonIcon` 决定 |
| noConfirm | boolean               | `false`                                  | 为 `true` 时不弹确认，点击即触发 `confirm`                                          |

恒为标准按钮（`el-popconfirm` 确认或 `noConfirm` 直点），文案由默认插槽提供（回退「重置」），两个分支都读取插槽。

### MuSearchButton

| 属性 | 类型                  | 默认值                   | 说明                                                                                              |
| ---- | --------------------- | ------------------------ | ------------------------------------------------------------------------------------------------- |
| icon | `string \| Component` | `'~icons/lucide/search'` | 默认查询图标（编译期组件），也可传 Iconify 图标名；图标形态渲染，标准按钮形态由 `buttonIcon` 决定 |
| text | `string \| boolean`   | `'查询'`                 | 文案；为真渲染成标准按钮（与 `MuAddButton` 一致），为假切图标形态                                 |

其余属性经 `v-bind="$attrs"` 透传：`MuButton` 的 `button` / `text` 形态透传给 `el-button` / `el-link`，图标形态透传给图标元素（编译期图标组件或运行时 `Icon`）。

## Emits

| 事件    | 参数 | 说明                                                                                                                                       |
| ------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| click   | 无   | 点击触发：`MuButton`、`MuAddButton`、`MuDelButton`、`MuDetailButton`、`MuEditButton`、`MuExportButton`、`MuImportButton`、`MuSearchButton` |
| confirm | 无   | 确认触发：仅 `MuResetButton`，Popconfirm 确认或 `noConfirm` 下点击时触发                                                                   |

## Slots

| 插槽    | 作用域参数 | 说明                                                                                                                                                                                                                                       |
| ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| default | 无         | 内容：`MuButton` 的唯一文案来源（无回退值，图标形态不渲染插槽）；预设按钮中为空时回退到自身 `text`（`MuDetailButton` / `MuEditButton` / `MuSearchButton`）或默认文案（`MuAddButton`、`MuExportButton`、`MuImportButton`、`MuResetButton`） |

`MuDelButton` 无插槽，自定义内容只能通过 `text` 属性。

## 暴露

无。

## 业务逻辑

- `MuButton` 按 `mode` 四态渲染：
  1. `'text'`：`el-link`，类 `mu-button whitespace-nowrap`，内容取默认插槽；
  2. `'button'`：`el-button`，类 `mu-button`，`icon` 非空时前置图标（类 `mr-1`，字号随 `iconSize`），内容取默认插槽；
  3. `'icon'` 且有 `tip`：`el-tooltip`（`effect="light"`、`enterable="false"`、`hide-after="0"`）包裹 `Icon`；
  4. `'icon'` 且无 `tip`：仅 `Icon`。
     四种形态统一在点击时 `emit('click')`；`mode` 为 `'text'` / `'button'` / `'icon'` 的联合类型，不再接受任意字符串。`tip` 只在第 3 态参与渲染，图标形态会忽略默认插槽。
- `useButton` 是各预设按钮的公共逻辑：
  - `buttonText`：存在默认插槽时返回 `''`（语义为“内容交给调用方”）；否则 `text` 为真值字符串时返回 `text`；再否则返回传入的 `defaultText`。
  - `mode`：`text` 不为 `undefined` 时，`text` 为真返回 `'text'`、为假返回 `'icon'`；`text` 未传时取 `tableIcon`，仅 `'button'` / `'text'` 被采信、其余值（含未配置）一律 `'icon'`。`text` 未传 = `props.text === undefined`，因此 `MuDelButton` / `MuDetailButton` / `MuEditButton` 的 `withDefaults` 里必须显式写 `text: undefined`：这三个按钮的 `text` 类型含 `Boolean`，Vue 会把未传的布尔型 prop 转成 `false`，缺了这句 `tableIcon` 就静默失效（`MuSearchButton` 的 `text` 有真实文案默认值且自行决定形态，`MuAddButton` / `MuExportButton` / `MuImportButton` / `MuResetButton` 已无 `text` prop，都不适用）。
- 预设按钮的默认插槽回退文案取 `useButton` 的 `buttonText`（存在调用方插槽时为空串、由插槽内容接管；否则为 `text` 属性或默认文案），并把同一个 `buttonText` 传给 `MuButton` 的 `tip` 以保留图标形态的悬浮提示：`MuDelButton` / `MuDetailButton` / `MuEditButton` / `MuSearchButton` 走该逻辑；`MuAddButton` / `MuExportButton` / `MuImportButton` / `MuResetButton` 已删除 `text` prop、不取 `useButton`，文案由默认插槽直接回退（添加 / 导出 / 导入 / 重置）。`MuEditButton` / `MuDetailButton` 此前无条件透传了一个空插槽，导致只传 `text`、不传插槽时文本形态渲染为空，现已改为带 `buttonText` 回退的 `<slot>{{ buttonText }}</slot>`。
- 预设按钮的图标形态（`icon` 与 `mode="icon"`）与文本形态（`mode="text"`）由全局配置 `tableIcon` 经 `useButton` 决定（`text` 未传时）；`MuAddButton` 与导出 / 导入 / 重置按钮恒为标准按钮、查询按钮的标准按钮形态，其前置图标显隐由 `buttonIcon` 决定 —— 为真时传入各自编译期图标组件（`~icons/icon-park-outline/add-one`、`~icons/lucide/search` 等）、否则传空字符串让 `MuButton` 不渲染图标；`MuAddButton` 的 `type="danger"` 固定。
- `MuExportButton` / `MuImportButton` / `MuResetButton` 与 `MuAddButton` 一样恒为标准按钮，不走 `tableIcon` 也没有图标形态；`MuSearchButton` 不走 `tableIcon`（`text` 有默认值）：`text` 为真渲染成标准按钮、传 `false` / `''` 切换为图标形态（`~icons/lucide/search` + Tooltip）。
- `MuDelButton` 点击弹出 `ElMessageBox.confirm` 模态确认框（`type: 'warning'`、标题「警告」，文案取 `message`）：确认后 `emit('click')`，取消 / 关闭只关弹窗；`noPopover` 为 `true` 时不弹确认，点击直接 `emit('click')`。
- `MuResetButton` 默认用 `el-popconfirm`（标题“确定要重置吗？”）确认后 `emit('confirm')`；`noConfirm` 为 `true` 时改用原生 `el-button`，点击直接 `emit('confirm')`。
- 各预设按钮固定的 `type` 与 `icon`：`MuAddButton` 为 `danger` + `icon-park-outline:add-one`；`MuDetailButton` / `MuEditButton` 为 `primary`；`MuExportButton` 为 `success` + `ph:export-bold`；`MuImportButton` 为 `ph:download-simple-bold`（原 `ph:import-bold` 在 @iconify/json 中不存在，属历史坏引用，运行时原本就渲染不出来）、`MuResetButton` 为 `icon-park-outline:refresh-one`（`type` 均用默认 `primary`）；`MuSearchButton` 为 `lucide:search`（默认 `primary`）；`MuExportButton` / `MuImportButton` / `MuResetButton` 的图标显隐只看 `buttonIcon`（`noConfirm` 分支一致），`MuSearchButton` 的图标出现在图标形态与 `buttonIcon` 为真的按钮形态；`MuDelButton` 为 `danger` + `icon-park-outline:delete`。

## 约束与注意事项

- `$attrs` 的落点随形态变化：`button` / `text` 形态落在 `el-button` / `el-link` 上，图标形态落在 `Icon` 上。给图标形态传 `class` 时最终作用于图标元素。
- 图标只有 `icon` 一个开关：`icon` 为空即不渲染，没有 `showIcon`。图标形态必须提供 `icon`，否则 `Icon` 的必填 `icon` 为空。
- 图标字号是 `iconSize`（默认 16，`button` 形态的前置图标与 `icon` 形态生效）；`size` 留给 `el-button`，经 `$attrs` 透传（`button` 形态）。
- 破坏性调整（0.0.1-beta 阶段）：`buttonType` 改为 `mode` 并收窄为 `'button' | 'text' | 'icon'`；图标签名字号 `size` 改为 `iconSize`，`size` 交还 `el-button`；`showIcon` 删除，图标显隐只看 `icon`；`MuButton` 的 `text` 改为 `tip` 并只服务图标形态的 Tooltip，`button` / `text` 形态的文案一律走默认插槽（不再有文本 prop 兜底）。外部调用方需同步改这些 prop 名。
- 预设按钮中 `MuDelButton` 没有默认插槽，想自定义文案只能用 `text` 属性。
- `icon` prop 接受 Iconify 图标名（字符串，运行时经 `Icon` 解析）或编译期图标组件（`~icons/*`）；预设按钮的默认图标全部是编译期组件，未自定义时不依赖运行时联网取图。
- `MuResetButton` 的事件名是 `confirm` 而非 `click`；其 `noConfirm` 分支用的是原生 `el-button`，图标显隐与 `MuButton` 按钮形态一致（都由 `buttonIcon` 决定）。
- `MuButton` 没有文本框 prop：`button` / `text` 形态的文案只能写在默认插槽里，图标形态忽略插槽、提示语只认真 `tip`。预设按钮中 `MuDelButton` / `MuDetailButton` / `MuEditButton` / `MuSearchButton` 的 `text` 用于决定形态并作为插槽回退值，`MuAddButton` / `MuExportButton` / `MuImportButton` / `MuResetButton` 无 `text`、文案一律走默认插槽。
- 预设按钮的 `text` 传空字符串会切换为图标形态（`MuDelButton` / `MuDetailButton` / `MuEditButton` 走 `useButton` 的 `props.text ? 'text' : 'icon'`，`MuSearchButton` 为自身的 `props.text ? 'button' : 'icon'`）；`MuAddButton` / `MuExportButton` / `MuImportButton` / `MuResetButton` 已无 `text` prop。
- `MuAddButton` / `MuExportButton` / `MuImportButton` / `MuResetButton` 的默认形态曾是文本链接（`el-link`）、文案靠 `text` prop，现统一为标准按钮 + 默认插槽（回退默认文案）；`MuExportButton` / `MuImportButton` / `MuResetButton` 随之恒为标准按钮、不再有图标形态，此前靠 `text` 传假值切图标形态的调用方需改用 `MuButton mode="icon"`，依赖文本链接外观的调用方需改用 `MuButton mode="text"`。
- 按钮族依赖 `GLOBAL_CUSTOM_CONFIG`：`tableIcon` 未配置时，`text` 未传的预设按钮（`MuDelButton` / `MuDetailButton` / `MuEditButton`）渲染为图标按钮；配置为 `'text'` / `'button'` 时分别渲染为文本 / 标准按钮，其余值按图标按钮处理（类型层面 `tableIcon` 已收窄为 `TableIcon = 'text' | 'button' | 'icon'`，见 `GlobalCustomConfig`）。`buttonIcon` 未配置时 `MuAddButton` 与导出 / 导入 / 重置 / 查询按钮不显示前置图标（查询按钮的图标形态不受影响）。
- `MuDelButton` / `MuDetailButton` / `MuEditButton` 的 `withDefaults` 里那句 `text: undefined` 是必需的，不要删：`text` 类型含 `Boolean`，Vue 对未传的布尔型 prop 会转成 `false`，靠显式的 `undefined` 默认值才能跳过布尔转换，否则 `tableIcon` 会静默失效（回归护栏见 `packages/components/core/button/__tests__/button.spec.ts`）。
- `style/index.ts` 需依次引入 Element Plus 的 `button`、`tooltip`、`link`、`popconfirm`、`message-box` 样式，再引本库 CSS；顺序由 `docs/theme-chalk.md` 约定。
- `MuDelButton` 的二次确认先后经历两个形态：自绘 `el-popover`（内嵌取消 / 确定按钮）→ `el-popconfirm` 气泡 → 现为 `ElMessageBox.confirm` 模态确认框（标题「警告」、warning 图标），并覆盖文本 / 图标两种形态；`placement` prop 随气泡一并删除，`noPopover` 保留为「跳过确认」开关。
- theme-chalk 中多数按钮变体 CSS 为空文件（`add-button`、`detail-button`、`edit-button`、`export-button`、`import-button`、`reset-button`、`search-button` 均为 0 字节），仅 `del-button.css` 有 `.mu-del-button { vertical-align: bottom }`。

## 相关

- 图标渲染：预设固定图标经 unplugin-icons 编译期打包（`~icons/*`）；字符串图标名经 `@iconify/vue` 的 `Icon` 运行时解析（原 `MuIcon` 组件已移除，图标字号与颜色由各使用处内联处理）
- 全局配置：`MuConfigProvider`（`GLOBAL_CUSTOM_CONFIG` 的 `tableIcon`、`buttonIcon`），见 `docs/config-provider.md`
- 内部 hook：`packages/components/core/button/src/useButton.ts`
- 样式：`packages/theme-chalk/css/button.css` 及 `add-button.css` 等按钮族 CSS
- 演示页面：`playground/src/views/button/Index.vue`
- 文档：`docs/theme-chalk.md`
