<script setup lang="ts">
import type { DatePickerType } from 'element-plus/es/components/date-picker-panel/src/types'
import { ElDatePicker } from 'element-plus'
import { computed } from 'vue'

defineOptions({ name: 'MuDateSingle' })

const props = withDefaults(defineProps<{
  type?: DatePickerType
  emptyValue?: string
  placeholder?: string
  valueFormat?: string
  format?: string
}>(), {
  type: 'date',
  modelValue: '',
  emptyValue: '',
  placeholder: '请选择时间',
  valueFormat: '',
  format: '',
})

const dateValueFormat = computed(() => {
  if (props.valueFormat)
    return props.valueFormat
  const formatMap: Record<string, string> = {
    date: 'YYYY-MM-DD',
    week: 'YYYY-MM-DD',
    month: 'YYYY-MM',
    year: 'YYYY',
    datetime: 'YYYY-MM-DD HH:mm:ss',
  }
  return formatMap[props.type] || 'YYYY-MM-DD'
})

const dateFormat = computed(() => {
  if (props.format)
    return props.format
  return dateValueFormat.value
})

const model = defineModel({ type: String })
</script>

<template>
  <el-date-picker v-model="model" :type :placeholder :value-format="dateValueFormat" :format="dateFormat" />
</template>
