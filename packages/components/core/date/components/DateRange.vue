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

function disabledStartDate(time: Date) {
  if (props.end) {
    return time.getTime() > new Date(props.end).getTime()
  }
  return false
}

function disabledEndDate(time: Date) {
  if (props.start) {
    return time.getTime() < new Date(props.start).getTime()
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
