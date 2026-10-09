<script setup lang="ts">
import type { ComputedRef } from 'vue'
import { computed, inject, unref } from 'vue'

defineOptions({ name: 'MuDescriptionsItem' })

const props = withDefaults(defineProps<{
  label?: string
  span?: number
  labelWidth?: string
}>(), {
  label: '',
  span: 1,
  labelWidth: '',
})

// 父级 provide 的是 computed，这里用 unref 取值才能随 column 变化重算
const column = inject<number | ComputedRef<number>>('column', 4)
const columnCount = computed(() => Number(unref(column)) || 4)

const itemStyle = computed(() => {
  const width = `${(props.span / columnCount.value) * 100}%`
  return { width }
})

const labelStyle = computed(() => {
  if (props.labelWidth)
    return { width: props.labelWidth }
  return {}
})
</script>

<template>
  <div class="mu-descriptions-item" :style="itemStyle">
    <div class="mu-descriptions-item-label" :style="labelStyle">
      {{ label }}
    </div>
    <div class="mu-descriptions-item-content">
      <slot />
    </div>
  </div>
</template>
