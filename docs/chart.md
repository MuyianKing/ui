# MuChart 图表

基于 ECharts 的图表容器，负责容器渲染与实例生命周期管理。

- 组件目录：`packages/components/core/chart/`
- 对外导出：`MuChart`（`export const MuChart`，同时 `export default`）
- 样式入口：`packages/components/core/chart/style/index.ts`（类名无：`chart.css` 为空文件，模板也未使用语义类名）
- 演示页面：暂无
- 依赖：`@muyianking/utils` 的 `echartsUtil`（底层为 `echarts/core`）；不依赖 Element Plus 与本库其它组件

## 基础用法

```vue
<script setup lang="ts">
import { MuChart } from '@muyianking/ui'

const option = {
  xAxis: { type: 'category', data: ['周一', '周二', '周三'] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [120, 200, 150] }],
}

function handleReady(instance: any) {
  // 拿到 echarts 实例后可自行调用其 API
}
</script>

<template>
  <MuChart :option="option" height="300px" @ready="handleReady" />
</template>
```

通过 `ref` 调用暴露方法：

```vue
<script setup lang="ts">
import { MuChart } from '@muyianking/ui'
import { ref } from 'vue'

const chartRef = ref()

function fill() {
  chartRef.value?.setOption({ series: [{ type: 'bar', data: [1, 2, 3] }] })
}
</script>

<template>
  <MuChart ref="chartRef" :option="{}" height="300px" />
</template>
```

## Props

| 属性   | 类型                          | 默认值   | 说明                               |
| ------ | ----------------------------- | -------- | ---------------------------------- |
| option | `Record<string, any> \| null` | `null`   | ECharts 配置项，为空时不初始化图表 |
| width  | string                        | `'100%'` | 容器宽度（CSS 长度）               |
| height | string                        | `'100%'` | 容器高度（CSS 长度）               |

## Emits

| 事件  | 参数            | 说明                                                   |
| ----- | --------------- | ------------------------------------------------------ |
| ready | `instance: any` | 首次初始化并 `setOption` 成功后触发，携带 ECharts 实例 |

## Slots

无。

## 暴露

| 名称        | 类型                                    | 说明                                         |
| ----------- | --------------------------------------- | -------------------------------------------- |
| getInstance | `() => any`                             | 返回当前 ECharts 实例，未初始化时为 `null`   |
| setOption   | `(option: Record<string, any>) => void` | 实例已存在时更新配置；实例不存在时静默不处理 |
| resize      | `() => void`                            | 调用实例 `resize`，实例不存在时可选链跳过    |

## 业务逻辑

- 模板只有一个 `div`，`id` 为随机值 `mu-chart-${Math.random().toString(36).substring(2, 9)}`，宽高由 `width` / `height` 内联样式决定。
- `onMounted` 调用 `initChart`：`option` 为空或容器未挂载时直接返回；否则用 `echartsUtil.init(容器, {})` 创建实例，再 `setOption(props.option)` 并 `emit('ready', instance)`；异常被 `catch` 后仅 `console.error('Failed to load echarts:', e)`，不向上抛出。
- `watch(() => props.option, ..., { deep: true })`：新值存在时，已有实例则 `setOption`，否则调用 `initChart`。源码注释说明：`option` 一次给定、之后不再变化时 `watch` 不会触发，因此额外用 `onMounted` 兜底初始化。
- `onActivated` 中调用 `resize`，适配 `keep-alive` 恢复显示的场景。
- `onBeforeUnmount` 中调用 `dispose()` 并置空实例。
- `echartsUtil.init` 来自 `@muyianking/utils`：内部会清除容器的 `_echarts_instance_` 标记、用防抖绑定 `window` 的 `resize`（默认开启），并在容器 `overflowX` / `overflowY` 未设置时设为 `hidden`。

## 约束与注意事项

- 必须传入 `option`，为 `null` 时组件不会创建实例，也不会报错，页面为空。
- 容器需要有确定尺寸，默认 `100%` / `100%` 依赖父容器给出宽高，否则图表渲染异常。
- 依赖 ECharts：项目的构建外部化清单（`script/vite.config.js`）包含 `echarts`，库本身体积内不含 ECharts，消费者需自行安装 `echarts`，并按 `echarts/core` 的按需方式注册所用图表与组件。
- `width` / `height` 为字符串 CSS 长度，不接受数字。
- 根节点没有 `mu-` 语义类名，`chart.css` 为空文件，无法通过类名做样式覆盖，只能依赖内联宽高与父容器。
- `id` 基于 `Math.random()` 生成，非稳定值，不适合做服务端渲染的锚点或外部选择器。
- 组件只负责实例生命周期，不负责图表类型注册与主题配置。

## 相关

- 依赖工具：`@muyianking/utils` 的 `echartsUtil`（`packages/components` 运行期依赖）
- 样式：`packages/theme-chalk/css/chart.css`（空文件）
- 文档：`docs/theme-chalk.md`
