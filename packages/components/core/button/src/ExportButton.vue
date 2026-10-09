<script setup lang="ts">
import type { GlobalCustomConfig } from '../../types/common'
import { inject } from 'vue'
import MuButton from './Index.vue'
import { useButton } from './useButton'

defineOptions({ name: 'MuExportButton' })

const props = withDefaults(defineProps<{
  text?: string | boolean
}>(), {
  text: '导出',
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

const globalConfig = inject<GlobalCustomConfig>('GLOBAL_CUSTOM_CONFIG')
const { buttonText, mode } = useButton(props, '导出', globalConfig?.tableIcon)
</script>

<template>
  <mu-button :mode="mode"
             icon="ph:export-bold"
             :tip="buttonText"
             type="success"
             @click="emit('click')"
  >
    <slot>{{ buttonText }}</slot>
  </mu-button>
</template>
