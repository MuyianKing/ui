<script setup lang="ts">
import { provide } from 'vue'

defineOptions({ name: 'MuDescriptions' })

const props = withDefaults(defineProps<{
  column?: number
}>(), {
  column: 4,
})

provide('column', props.column)
</script>

<template>
  <div class="mu-descriptions">
    <slot />
  </div>
</template>
