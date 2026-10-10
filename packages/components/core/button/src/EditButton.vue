<script setup lang="ts">
import type { Component } from 'vue'
import type { GlobalCustomConfig } from '../../types/common'
import { inject } from 'vue'
import IconEdit from '~icons/uil/edit'
import MuButton from './Index.vue'
import { useButton } from './useButton'

defineOptions({ name: 'MuEditButton' })

const props = withDefaults(defineProps<{
  icon?: string | Component
  text?: string | boolean
}>(), {
  icon: IconEdit,
  // 必须显式给 undefined：text 类型含 Boolean，Vue 会把未传的布尔型 prop 转成 false，
  // 那样 useButton 里的 `props.text !== undefined` 恒为真、全局配置 tableIcon 就永远不生效
  text: undefined,
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

const globalConfig = inject<GlobalCustomConfig>('GLOBAL_CUSTOM_CONFIG')
const { buttonText, mode } = useButton(props, '编辑', globalConfig?.tableIcon)
</script>

<template>
  <mu-button :mode="mode"
             :icon
             :tip="buttonText"
             type="primary"
             @click="emit('click')"
  >
    <slot>{{ buttonText }}</slot>
  </mu-button>
</template>
