<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useGridLayout } from './useGridLayout'

defineOptions({ name: 'MuGridLayout' })

const props = withDefaults(defineProps<{
  width: number
  minWidth?: number
  gap?: number
  rowGap?: number
  columnGap?: number
}>(), {
  minWidth: 0,
  gap: 10,
  // rowGap/columnGap 默认给 0（而非 10），否则下面的 fallback 永远走不到 gap，
  // gap 属性就成了摆设；未显式指定时结果仍是 10，行为不变
  rowGap: 0,
  columnGap: 0,
})

const containerRef = useTemplateRef<HTMLElement>('containerRef')

// 传 getter 而不是快照，props 变化时列数与间距才会重算
useGridLayout(containerRef, () => ({
  rowGap: props.rowGap || props.gap || 10,
  columnGap: props.columnGap || props.gap || 10,
  minWidth: props.minWidth,
  width: props.width,
}))
</script>

<template>
  <div ref="containerRef" class="mu-grid-layout">
    <slot />
  </div>
</template>
