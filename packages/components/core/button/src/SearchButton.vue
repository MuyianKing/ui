<script setup lang="ts">
import { inject } from 'vue'
import MuButton from './Index.vue'
import { useButton } from './useButton'

defineOptions({ name: 'MuSearchButton' })

const props = withDefaults(defineProps<{
  icon?: string
  text?: string
}>(), {
  icon: 'lucide:search',
  text: '查询',
})

defineEmits<{
  (e: 'click'): void
}>()

const globalConfig = inject<{ tableIcon?: string }>('GLOBAL_CUSTOM_CONFIG')
const { buttonText, buttonType } = useButton(props as any, '查询', globalConfig?.tableIcon)
</script>

<template>
  <mu-button :button-type="buttonType"
             :icon
             :text="buttonText"
             @click="$emit('click')"
  >
    <slot>{{ text }}</slot>
  </mu-button>
</template>
