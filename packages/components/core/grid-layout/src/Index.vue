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
  rowGap: 10,
  columnGap: 10,
})

const containerRef = useTemplateRef<HTMLElement>('containerRef')

useGridLayout(containerRef, {
  rowGap: props.rowGap || props.gap || props.columnGap || 10,
  columnGap: props.columnGap || props.gap || props.rowGap || 10,
  minWidth: props.minWidth,
  width: props.width,
})
</script>

<template>
  <div ref="containerRef" class="mu-grid-layout">
    <slot />
  </div>
</template>
