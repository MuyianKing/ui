# MuSelectRemote 远程下拉选择

一句话定位：基于 `el-select` 的 remote 模式封装的下拉框，选项由 `server` 回调异步拉取，支持输入关键字触发查询与首次回显。

- 组件目录：`packages/components/core/select-remote/`
- 对外导出：`MuSelectRemote`
- 样式入口：`packages/components/core/select-remote/style/index.ts`（无专属语义类，仅引 Element Plus 选择器样式）
- 演示页面：`playground/src/views/select-remote/Index.vue`
- 依赖：element-plus 的 `ElSelect`、`ElOption`；本库无其它组件依赖

## 基础用法

```vue
<script setup lang="ts">
import { MuSelectRemote } from '@muyianking/ui'
import { ref } from 'vue'

// server 接收请求参数，返回选项数组
async function getData(params: any) {
  const { query, page, pageSize } = params
  const list = await fetchUserList({ query, page, pageSize })
  return list.map((item: any) => ({ name: item.name, id: item.id }))
}

const test = ref(0)
const dataConfig = { label_key: 'name', value_key: 'id' }
</script>

<template>
  <MuSelectRemote v-model="test" :server="getData" :data-config="dataConfig" />
</template>
```

## Props

| 属性        | 类型                              | 默认值                                                            | 说明                                                 |
| ----------- | --------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------- |
| server      | `(params: any) => Promise<any[]>` | `undefined`                                                       | 数据源函数，接收请求参数，返回选项数组               |
| all         | `boolean`                         | `false`                                                           | 是否追加一个 `value=""`、文案为「全部」的选项        |
| params      | `Record<string, any>`             | `() => ({})`                                                      | 每次请求都会合并进 `server` 参数的额外字段           |
| queryConfig | `Record<string, string>`          | `() => ({ id_key: 'id', query_key: 'query' })`                    | 请求参数名配置，`query_key` 决定关键字字段名         |
| dataConfig  | `Record<string, any>`             | `() => ({ label_key: 'name', value_key: 'id', extend_keys: [] })` | 响应字段映射，`label_key` / `value_key` 决定取值字段 |

`v-model` 由 `defineModel<any>()` 声明，等价于 `modelValue` prop 加 `update:modelValue` 事件；因此 `modelValue` 不能出现在 `defineProps` 中。

其余属性经模板上显式的 `v-bind="$attrs"` 透传给 `el-select`（例如演示页使用的 `multiple`）。

## Emits

无（未使用 `defineEmits`；`update:modelValue` 由 `defineModel` 生成）。

## Slots

无。

## 暴露

无。

## 业务逻辑

- **请求参数**（`loadData`）：固定拼出 `{ [queryConfig.query_key]: query || '', page, pageSize, ...params }`，其中 `pageSize` 是内部常量 `50`，`page` 取自内部 `page` 状态。`query` 为关键字，首次/回显请求为空串。
- **响应处理**：`options.value = (query || page.value === 1) ? result : [...options.value, ...result]`。即「有关键字」或「第一页」时直接替换列表，否则追加。**注意**：`page` 只在初始化与 `remoteMethod` 里被设为 `1`，组件没有翻页加载的触发点，`page` 永远不会大于 1，所以追加分支在当前源码下不可达，实际每次请求都会整体替换 `options`。
- **输入触发远程请求**：`remoteMethod(query)` 先把 `page` 重置为 `1` 再调用 `loadData(query)`，作为 `el-select` 的 `:remote-method`。组件自身**没有实现防抖**，调用时机完全由 `el-select` 的 remote 输入行为决定（Element Plus 在输入时调用 `remote-method`，未内置防抖），高频输入会产生多次请求，需要防抖请输入方自行处理或在上层对 `server` 去抖。
- **一次性拉取 + 本地过滤**：`el-select` 同时开启了 `remote` 与 `filterable`。在 `remote` 模式下，输入会走 `remote-method`（远程请求），而不是由 `el-select` 对已加载选项做本地过滤；`filterable` 在这里用于保证输入框可输入。因此不存在「一次性拉全量后本地过滤」的行为，关键字一律回源。
- **loading 处理**：内部 `loading = ref(false)`，`loadData` 进入时置 `true`，在 `try / finally` 中于请求结束后置回 `false`，透传给 `el-select` 的 `:loading`。`server` 抛错时 `finally` 仍会复位 loading，错误不做捕获与提示（原样向上抛）。
- **首次回显与打开下拉**：
  - `watch(model, ..., { immediate: true })`：当 `model` 有值且当前 `options` 为空时调用 `loadData()`（无关键字），用于编辑场景拿到已选值对应的 label。源码注释说明：`modelValue` 已由 `defineModel` 声明为 prop，不会出现在 `$attrs` 中，因此旧实现里监听 `attrs.modelValue` 的分支永远不触发，编辑回显拿不到 label。
  - `@visible-change`：下拉首次展开且 `options` 为空时调用 `loadData()`，避免重复请求。
- **选项映射**：`el-option` 的 `label` 取 `item[dataConfig.label_key]`、`value` 取 `item[dataConfig.value_key]`、`:key` 取 `item[dataConfig.value_key]`。`all` 为真时在最前插入 `value=""` 的「全部」选项。
- 演示页 `playground/src/views/select-remote/Index.vue` 的 `getData` 已按本组件契约返回数组。它早前返回 `{ count, data }`，会让 `options` 被赋成对象、下拉渲染异常（并且该分支读取的 `query.id` 组件根本不会传，`queryConfig.id_key` 未被使用），现已改为直接返回数组。

## 约束与注意事项

- `server` 是唯一数据源，未传时 `loadData` 直接 return，下拉永远为空。
- `loadData` 不使用 `await` 之外的并发控制：快速连续输入会并发多次请求，后返回的响应会覆盖先返回的，存在竞态风险。
- 组件不处理请求异常，`server` 抛错会中断该次调用并冒泡，调用方需自行捕获。
- `dataConfig` 中声明的 `extend_keys` 当前未被组件读取；`queryConfig` 中声明的 `id_key` 也未被组件使用（只用到 `query_key`）。两者均为预留字段，不要据此假设组件会传递这些参数。
- `server` 请求参数的字段名由 `queryConfig.query_key` 决定（默认 `query`），不是写死的 `query`，自定义后服务端需对应。
- 选项值即回显依据：初次回显只在 `options` 为空时请求一次，若 `server` 返回的数组不含该 `model` 值，下拉框会直接显示原始值而非 label。
- `all` 插入的「全部」值为 `''`，与「未选择」不易区分。
- `packages/theme-chalk/css/select-remote.css` 当前是空文件（0 字节），仅作样式挂载点，样式主要来自 `select.css` 那一类 Element Plus 选择器。

## 相关

- 关联组件：`MuSelect`（`packages/components/core/select/`，静态选项版本）
- 公共类型：`OptionsType`（`packages/components/core/types/common.ts`）
- 样式：`packages/theme-chalk/css/select-remote.css`
- 演示页面：`playground/src/views/select-remote/Index.vue`
