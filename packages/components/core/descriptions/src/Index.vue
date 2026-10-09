<script setup lang="ts">
import { computed, provide } from 'vue'

defineOptions({ name: 'MuDescriptions' })

const props = withDefaults(defineProps<{
  column?: number
}>(), {
  column: 4,
})

// 必须 provide 响应式值：直接 provide(props.column) 只是快照，
// 父级动态改 column 时子项宽度不会重算
provide('column', computed(() => props.column))
</script>

<template>
  <div class="mu-descriptions">
    <slot />
  </div>
</template>
