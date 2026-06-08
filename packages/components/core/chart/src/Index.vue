<script setup lang="ts">
import { echartsUtil } from '@muyianking/utils'
import { onActivated, onBeforeUnmount, useTemplateRef, watch } from 'vue'

defineOptions({ name: 'MuChart' })

const props = withDefaults(defineProps<{
  option?: Record<string, any> | null
  width?: string
  height?: string
}>(), {
  option: null,
  width: '100%',
  height: '100%',
})

const emit = defineEmits<{
  (e: 'ready', instance: any): void
}>()

const id = `mu-chart-${Math.random().toString(36).substring(2, 9)}`
const chartRef = useTemplateRef<HTMLDivElement>('chartRef')
let chartInstance: any = null

async function initChart() {
  if (!props.option || !chartRef.value)
    return
  try {
    chartInstance = echartsUtil.init(chartRef.value, {})
    chartInstance.setOption(props.option)
    emit('ready', chartInstance)
  } catch (e) {
    console.error('Failed to load echarts:', e)
  }
}

function setOption(option: Record<string, any>) {
  if (chartInstance) {
    chartInstance.setOption(option)
  }
}

function resize() {
  chartInstance?.resize()
}

watch(() => props.option, (val) => {
  if (val) {
    if (chartInstance) {
      chartInstance.setOption(val)
    } else {
      initChart()
    }
  }
}, { deep: true })

onActivated(() => {
  chartInstance?.resize()
})

onBeforeUnmount(() => {
  chartInstance?.dispose()
  chartInstance = null
})

defineExpose({ getInstance: () => chartInstance, setOption, resize })
</script>

<template>
  <div :id ref="chartRef" :style="{ width, height }" />
</template>
