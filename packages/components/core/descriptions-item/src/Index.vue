<script setup lang="ts">
import { computed, inject } from 'vue'

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

const column = inject('column', 4)

const itemStyle = computed(() => {
  const width = `${(props.span / column) * 100}%`
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
