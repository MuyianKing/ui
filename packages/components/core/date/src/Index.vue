<script setup lang="ts">
import type { DatePickerType } from 'element-plus/es/components/date-picker-panel/src/types'
import DateSingle from '../components/Date.vue'
import DateElRange from '../components/DateElRange.vue'
import DateRange from '../components/DateRange.vue'

defineOptions({ name: 'MuDate' })

withDefaults(defineProps<{
  type?: string
  dateType?: DatePickerType
}>(), {
  type: 'date',
  dateType: 'date',
})
</script>

<template>
  <date-single v-if="type === 'date'" :type="dateType" v-bind="$attrs" />
  <date-el-range v-else-if="type === 'el-range'" :type="dateType" v-bind="$attrs" />
  <date-range v-else :type="dateType" v-bind="$attrs" />
</template>
