# MuDate 日期选择

基于 Element Plus `el-date-picker` 的日期选择封装：通过 `type` 在「单日期」「原生 el 范围」「自定义双框范围」三种形态间切换，范围形态内置联动禁用与常用快捷选项。

- 组件目录：`packages/components/core/date/`
- 对外导出：`MuDate`
- 样式入口：`packages/components/core/date/style/index.ts`（模板类名 `.mu-date-range`、`.mu-date-range-separator`；`packages/theme-chalk/css/date.css` 当前为空）
- 演示页面：`playground/src/views/date/Index.vue`
- 依赖：element-plus 的 `ElDatePicker`（同时引入 `date-picker` 与 `date-picker-panel` 样式）；无本库其它组件；无 utils

## 基础用法

```vue
<script setup lang="ts">
import { MuDate } from '@muyianking/ui'
import { reactive, ref } from 'vue'

const single = ref('')
const range = reactive({
  start: '2024-10-01',
  end: '2024-12-12',
})
</script>

<template>
  <!-- 单日期，值格式随 date-type 推导（datetime -> YYYY-MM-DD HH:mm:ss） -->
  <MuDate v-model="single" date-type="datetime" />

  <!-- 自定义双框范围：结束后追加时分秒 -->
  <MuDate
    v-model="single"
    v-model:start="range.start"
    v-model:end="range.end"
    type="range"
    date-type="datetime"
    end-value-format="YYYY-MM-DD 23:59:59"
  />

  <!-- 原生 el 范围，内置快捷选项 -->
  <MuDate
    v-model="single"
    v-model:start="range.start"
    v-model:end="range.end"
    type="el-range"
    date-type="datetime"
  />
</template>
```

## Props

`MuDate`（`src/Index.vue`）自身声明：

| 属性     | 类型             | 默认值   | 说明                                                                                                     |
| -------- | ---------------- | -------- | -------------------------------------------------------------------------------------------------------- |
| type     | `string`         | `'date'` | 形态开关。`'date'` 走单日期；`'el-range'` 走原生 el 范围；其它任意值（约定用 `'range'`）走自定义双框范围 |
| dateType | `DatePickerType` | `'date'` | 透传给底层 `el-date-picker` 的选择粒度（`date` / `week` / `month` / `year` / `datetime` 等）             |

其余属性经 `v-bind="$attrs"` 透传给命中的子组件（单日期 / el-range 分支落到 `el-date-picker` 根元素；自定义范围分支落到外层 `div.mu-date-range`，不会进入内部的两个 `el-date-picker`）。

各分支子组件（`components/` 下）用于内部传参，同样可作为独立组件使用，其自身 props 如下：

`Date.vue`（`MuDateSingle`）

| 属性        | 类型             | 默认值         | 说明                                        |
| ----------- | ---------------- | -------------- | ------------------------------------------- |
| type        | `DatePickerType` | `'date'`       | 选择粒度，用于推导默认 valueFormat / format |
| emptyValue  | `string`         | `''`           | 已声明但源码未使用                          |
| placeholder | `string`         | `'请选择时间'` | 占位文案                                    |
| valueFormat | `string`         | `''`           | 绑定值格式，为空时按 type 推导              |
| format      | `string`         | `''`           | 展示格式，为空时取 valueFormat              |

`DateRange.vue`（`MuDateRange`）

| 属性             | 类型                                      | 默认值       | 说明                                     |
| ---------------- | ----------------------------------------- | ------------ | ---------------------------------------- |
| type             | `DatePickerType`                          | `'date'`     | 选择粒度，用于推导默认格式               |
| start            | `string`                                  | `''`         | 开始值（配合 `v-model:start`）           |
| end              | `string`                                  | `''`         | 结束值（配合 `v-model:end`）             |
| startPlaceholder | `string`                                  | `'开始日期'` | 开始框占位                               |
| endPlaceholder   | `string`                                  | `'结束日期'` | 结束框占位                               |
| format           | `string`                                  | `''`         | 展示格式，为空时取 valueFormat           |
| valueFormat      | `string`                                  | `''`         | 绑定值格式，为空时按 type 推导           |
| startValueFormat | `string`                                  | `''`         | 开始框独立绑定格式，缺省回退 valueFormat |
| endValueFormat   | `string`                                  | `''`         | 结束框独立绑定格式，缺省回退 valueFormat |
| separator        | `string`                                  | `' ~ '`      | 面板中间分隔符，同时参与 modelValue 拼接 |
| width            | `string \| number`                        | `''`         | 外层容器宽度，数字按 px                  |
| noWarning        | `boolean`                                 | `false`      | 对端为空时是否抑制 change 事件           |
| emptyValue       | `string \| number \| Record<string, any>` | `''`         | 已声明但源码未使用                       |

`DateElRange.vue`（`MuDateElRange`）

| 属性             | 类型                                      | 默认值       | 说明                              |
| ---------------- | ----------------------------------------- | ------------ | --------------------------------- |
| type             | `DatePickerType`                          | `'date'`     | 选择粒度，内部会归一化为 `*range` |
| emptyValue       | `string \| number \| Record<string, any>` | `''`         | 已声明但源码未使用                |
| placeholder      | `string`                                  | `''`         | 已声明但模板未绑定                |
| valueFormat      | `string`                                  | `''`         | 绑定值格式，为空时按 type 推导    |
| startValueFormat | `string`                                  | `''`         | 已声明但模板未使用                |
| endValueFormat   | `string`                                  | `''`         | 已声明但模板未使用                |
| format           | `string`                                  | `''`         | 展示格式，为空时取 valueFormat    |
| startPlaceholder | `string`                                  | `'开始日期'` | 开始框占位                        |
| endPlaceholder   | `string`                                  | `'结束日期'` | 结束框占位                        |

`v-model`（`modelValue`，字符串值）：单日期分支为 `defineModel({ type: String })`，自定义范围分支为 `defineModel<string>('modelValue', { default: '' })`，el-range 分支为 `defineModel<string>({ default: '' })`。

## Emits

`MuDate` 自身未声明 `defineEmits`，事件经 `$attrs` 透传给命中的子组件。实际可用事件如下（由子组件声明）：

| 事件         | 参数                                                                                     | 说明                               |
| ------------ | ---------------------------------------------------------------------------------------- | ---------------------------------- |
| update:start | `val: string`                                                                            | 开始值变化，仅 `type="range"` 分支 |
| update:end   | `val: string`                                                                            | 结束值变化，仅 `type="range"` 分支 |
| change       | 自定义范围分支无参数；el-range 分支为 `val: any`（运行时传拼接后的 `modelValue` 字符串） | 值变化通知。两个分支签名不一致     |

单日期 / el-range 分支根元素就是 `el-date-picker`，写在 `MuDate` 上的事件监听会经 `$attrs` 落到 `el-date-picker` 上。

## Slots

无。

## 暴露

无。

## 业务逻辑

- `src/Index.vue` 只做分支派发：`type === 'date'` → `Date.vue`；`type === 'el-range'` → `DateElRange.vue`；其余 → `DateRange.vue`，并把 `dateType` 作为子组件 `type` 传入。
- 默认格式推导：单日期分支 `date/week → YYYY-MM-DD`、`month → YYYY-MM`、`year → YYYY`、`datetime → YYYY-MM-DD HH:mm:ss`；自定义范围分支（`DateRange`）映射 `date/month/datetime`，缺省 `YYYY-MM-DD`；el-range 分支（`DateElRange`）映射 `date/month/year/datetime`，缺省 `YYYY-MM-DD`（早期缺 `datetime` 映射会让 `type="el-range"` + `date-type="datetime"` 的选中结果被截成纯日期）。`startValueFormat` / `endValueFormat` 未给时回退到推导值。
- `DateElRange` 会把 `type` 归一化：已是 `*range` 则原样使用，`date` 转 `daterange`，其余拼接 `range` 后缀（源码注释说明这是为了避免拼出 `daterangerange`）。选中数组经 computed setter 拆成 `start` / `end`，并额外把 `${start} ~ ${end}` 写入 `modelValue`，同时 `emit('change', modelValue)`。
- `DateElRange` 内置「近一周 / 近一个月 / 近三个月」三个 shortcuts，`range-separator` 固定为 `~`。
- `DateRange` 用两个独立 `el-date-picker` 绑定 `start` / `end`，`disabledStartDate` 禁止选择晚于结束日的日期、`disabledEndDate` 禁止早于开始日的日期；比较统一走本地时区「当天零点」，结束日当天本身仍可选。
- `toDateOnly` 会先按 `T` 或空格截断再拆 `-`，以规避 `new Date('YYYY-MM-DD HH:mm:ss')` 在 Safari 下得到 Invalid Date、以及 `new Date('YYYY-MM-DD')` 按 UTC 解析导致差一天的问题。
- `DateRange` 每次变更把 `modelValue` 重写为 `${start}${separator}${end}`；`noWarning` 为 `true` 时，对端为空则不发 `change`。

## 约束与注意事项

- `emptyValue` 在三个子组件里都已声明并给了默认值，但源码未引用，设置它没有任何效果。
- `type` 的取值不是枚举校验的联合类型（`Index.vue` 为 `string`）；传 `'daterange'` 这类已含 `range` 的值只在 `DateElRange` 分支被识别，`DateRange` 分支按「非 date / 非 el-range」一律进入双框范围逻辑。
- 自定义范围分支的根是多元素容器 `div.mu-date-range`，写到 `MuDate` 上的 `class` / `style` / 原生属性会落在该容器上，不会传给内部的两个 `el-date-picker`。
- 自定义范围分支的 `change` 事件无参数（`(e: 'change'): void`），el-range 分支的 `change` 携带字符串，两者行为不同。
- `date.css` 为空，`.mu-date-range` / `.mu-date-range-separator` 目前没有对应主题样式，布局间距依赖使用方自身的 Tailwind / 全局样式。
- 其余属性经 `v-bind="$attrs"` 透传给 `el-date-picker`（如 `disabled`、`clearable`、`shortcuts` 等，具体以分支根元素为准）。

## 相关

- 关联组件：无（`date` 目录自包含三个子组件）。
- 公共类型：`DatePickerType` 来自 `element-plus/es/components/date-picker-panel`。
- 演示页面：`playground/src/views/date/Index.vue`。
