<script setup lang="ts">
import type { GlobalCustomConfig } from '../../types/common'
import { inject } from 'vue'
import MuButton from './Index.vue'
import { useButton } from './useButton'

defineOptions({ name: 'MuSearchButton' })

const props = withDefaults(defineProps<{
  icon?: string
  text?: string | boolean
}>(), {
  icon: 'lucide:search',
  text: '查询',
})

defineEmits<{
  (e: 'click'): void
}>()

const globalConfig = inject<GlobalCustomConfig>('GLOBAL_CUSTOM_CONFIG')
const { buttonText, mode } = useButton(props, '查询', globalConfig?.tableIcon)
</script>

<template>
  <mu-button :mode="mode"
             :icon
             :tip="buttonText"
             @click="$emit('click')"
  >
    <slot>{{ buttonText }}</slot>
  </mu-button>
</template>
