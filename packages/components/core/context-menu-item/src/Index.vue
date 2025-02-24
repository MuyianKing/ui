<script setup lang="ts">
import type { ArrayOfFunctions, DefaultSlot } from '../../types/common'
import { inject, nextTick, onMounted, ref, useSlots } from 'vue'

defineOptions({
  name: 'MuContextMenuItem',
})

const context_item_renders = inject('context_item_renders', ref<ArrayOfFunctions>([]))

interface LabelTypeWithUnknown {
  label: string
  [key: string]: any
}

// 没有插槽的渲染函数
function DEFAULT_RENDER_CELL(row: LabelTypeWithUnknown) {
  return row.label
}

const slots: DefaultSlot = useSlots()

onMounted(() => {
  nextTick(() => {
    context_item_renders.value.push(slots?.default || DEFAULT_RENDER_CELL)
  })
})
</script>

<template>
  <div />
</template>
