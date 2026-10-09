<script setup lang="ts">
import MuButton from './Index.vue'
import { useButton } from './useButton'

defineOptions({ name: 'MuImportButton' })

const props = withDefaults(defineProps<{
  text?: string | boolean
}>(), {
  text: '导入',
})

defineEmits<{
  (e: 'click'): void
}>()

const { buttonText, mode } = useButton(props, '导入')
</script>

<template>
  <mu-button :mode="mode"
             icon="ph:import-bold"
             :tip="buttonText"
             @click="$emit('click')"
  >
    <slot>{{ buttonText }}</slot>
  </mu-button>
</template>
