<script setup lang="ts">
import type { DatePickerType } from 'element-plus/es/components/date-picker-panel'
import { ElDatePicker } from 'element-plus'
import { computed, ref } from 'vue'

defineOptions({ name: 'MuDateElRange' })

const props = withDefaults(defineProps<{
  type?: DatePickerType
  emptyValue?: string | number | Record<string, any>
  placeholder?: string
  valueFormat?: string
  startValueFormat?: string
  endValueFormat?: string
  format?: string
  startPlaceholder?: string
  endPlaceholder?: string
}>(), {
  type: 'date',
  emptyValue: '',
  placeholder: '',
  valueFormat: '',
  startValueFormat: '',
  endValueFormat: '',
  format: '',
  startPlaceholder: '开始日期',
  endPlaceholder: '结束日期',
})

const emit = defineEmits<{
  (e: 'change', val: any): void
}>()

const start = defineModel<string>('start', { default: '' })
const end = defineModel<string>('end', { default: '' })
const model = defineModel<string>({ default: '' })

const dateType = computed(() => {
  const type = props.type === 'date' ? 'daterange' : `${props.type}range`
  return type as DatePickerType
})

const dateValueFormat = computed(() => {
  if (props.valueFormat)
    return props.valueFormat
  const formatMap: Record<string, string> = {
    date: 'YYYY-MM-DD',
    month: 'YYYY-MM',
  }
  return formatMap[props.type] || 'YYYY-MM-DD'
})

const dateFormat = computed(() => props.format || dateValueFormat.value)

const shortcuts = [
  {
    text: '近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

function handleChange(val: any[]) {
  console.log('change')

  if (val && val.length === 2) {
    start.value = val[0]
    end.value = val[1]
    model.value = `${val[0]} ~ ${val[1]}`
  } else {
    start.value = ''
    end.value = ''
    model.value = ''
  }
  emit('change', model.value)
}

const value = computed({
  set: handleChange,
  get: () => [start.value, end.value],
})
</script>

<template>
  <el-date-picker v-model="value" :type="dateType" :value-format="dateValueFormat" :format="dateFormat" :start-placeholder="startPlaceholder" :end-placeholder="endPlaceholder" :shortcuts range-separator="~" @change="handleChange" />
</template>
