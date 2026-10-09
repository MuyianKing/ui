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

const { buttonText, buttonType } = useButton(props, '导入')
</script>

<template>
  <mu-button :button-type="buttonType"
             icon="ph:import-bold"
             :text="buttonText"
             @click="$emit('click')"
  >
    <slot>{{ text }}</slot>
  </mu-button>
</template>
