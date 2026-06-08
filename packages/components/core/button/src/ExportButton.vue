<script setup lang="ts">
import { inject } from 'vue'
import MuButton from './Index.vue'
import { useButton } from './useButton'

defineOptions({ name: 'MuExportButton' })

const props = withDefaults(defineProps<{
  text?: string
}>(), {
  text: '导出',
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

const globalConfig = inject<{ tableIcon?: boolean }>('GLOBAL_CUSTOM_CONFIG')
const { buttonText, buttonType } = useButton(props as any, '导出', globalConfig?.tableIcon ? undefined : undefined)
</script>

<template>
  <mu-button :button-type="buttonType"
             icon="ph:export-bold"
             :text="buttonText"
             type="success"
             @click="emit('click', $event)"
  >
    <slot>{{ text }}</slot>
  </mu-button>
</template>
