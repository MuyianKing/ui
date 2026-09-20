<script setup lang="ts">
import type { DatePickerType } from 'element-plus/es/components/date-picker-panel'
import { ElDatePicker } from 'element-plus'
import { computed } from 'vue'

defineOptions({ name: 'MuDateRange' })

const props = withDefaults(defineProps<{
  type?: DatePickerType
  start?: string
  end?: string
  startPlaceholder?: string
  endPlaceholder?: string
  format?: string
  valueFormat?: string
  startValueFormat?: string
  endValueFormat?: string
  separator?: string
  width?: string | number
  noWarning?: boolean
  emptyValue?: string | number | Record<string, any>
}>(), {
  type: 'date',
  start: '',
  end: '',
  startPlaceholder: '开始日期',
  endPlaceholder: '结束日期',
  format: '',
  valueFormat: '',
  startValueFormat: '',
  endValueFormat: '',
  separator: ' ~ ',
  width: '',
  noWarning: false,
  emptyValue: '',
})

const emit = defineEmits<{
  (e: 'update:start', val: string): void
  (e: 'update:end', val: string): void
  (e: 'change'): void
}>()

const modelValue = defineModel<string>('modelValue', { default: '' })

const dateType = computed(() => props.type)
const dateValueFormat = computed(() => {
  if (props.valueFormat)
    return props.valueFormat
  const formatMap: Record<string, string> = {
    date: 'YYYY-MM-DD',
    month: 'YYYY-MM',
    datetime: 'YYYY-MM-DD HH:mm:ss',
  }
  return formatMap[props.type] || 'YYYY-MM-DD'
})

const startValueFormat = computed(() => props.startValueFormat || dateValueFormat.value)
const endValueFormat = computed(() => props.endValueFormat || dateValueFormat.value)
const dateFormat = computed(() => props.format || dateValueFormat.value)

// 按「本地时区的当天零点」比较日期。
// 直接 new Date('YYYY-MM-DD HH:mm:ss') 在 Safari 下得到 Invalid Date（比较恒为 false，
// 禁用失效），而 new Date('YYYY-MM-DD') 又按 UTC 解析，会整体差一天。
function toDateOnly(val: string): number | null {
  if (!val)
    return null
  const [y, m, d] = val.split(/T| /)[0].split('-').map(Number)
  if (!y || !m || !d)
    return null
  return new Date(y, m - 1, d).getTime()
}

function disabledStartDate(time: Date) {
  const end = toDateOnly(props.end)
  if (end !== null) {
    // 用当天零点比较，结束日当天本身仍然可选
    return time.getTime() > end
  }
  return false
}

function disabledEndDate(time: Date) {
  const start = toDateOnly(props.start)
  if (start !== null) {
    return time.getTime() < start
  }
  return false
}

function handleStartChange(val: string) {
  emit('update:start', val || '')
  modelValue.value = `${val || ''}${props.separator}${props.end || ''}`
  if (props.end || !props.noWarning)
    emit('change')
}

function handleEndChange(val: string) {
  emit('update:end', val || '')
  modelValue.value = `${props.start || ''}${props.separator}${val || ''}`
  if (props.start || !props.noWarning)
    emit('change')
}

const rangeWidth = computed(() => {
  if (props.width)
    return typeof props.width === 'number' ? `${props.width}px` : props.width
  return ''
})

const startComp = computed({
  get: () => props.start,
  set: handleStartChange,
})

const endComp = computed({
  get: () => props.end,
  set: handleEndChange,
})
</script>

<template>
  <div class="mu-date-range" :style="{ width: rangeWidth }">
    <el-date-picker v-model="startComp" :type="dateType" :placeholder="startPlaceholder" :value-format="startValueFormat" :format="dateFormat" :disabled-date="disabledStartDate" />
    <span class="mu-date-range-separator">{{ separator }}</span>
    <el-date-picker v-model="endComp" :type="dateType" :placeholder="endPlaceholder" :value-format="endValueFormat" :format="dateFormat" :disabled-date="disabledEndDate" />
  </div>
</template>
