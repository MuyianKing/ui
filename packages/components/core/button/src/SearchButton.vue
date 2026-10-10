<script setup lang="ts">
import type { Component } from 'vue'
import type { GlobalCustomConfig } from '../../types/common'
import type { MuButtonMode } from './useButton'
import { computed, inject } from 'vue'
import IconSearch from '~icons/lucide/search'
import MuButton from './Index.vue'
import { useButton } from './useButton'

defineOptions({ name: 'MuSearchButton' })

const props = withDefaults(defineProps<{
  icon?: string | Component
  text?: string | boolean
}>(), {
  icon: IconSearch,
  text: '查询',
})

defineEmits<{
  (e: 'click'): void
}>()

const globalConfig = inject<GlobalCustomConfig>('GLOBAL_CUSTOM_CONFIG')
const { buttonText } = useButton(props, '查询')
// 不取 useButton 的 mode（由 tableIcon 驱动）：查询按钮与添加按钮一致固定渲染成标准按钮，text 为假时才切图标形态
const mode = computed<MuButtonMode>(() => (props.text ? 'button' : 'icon'))
// 按钮形态的前置图标显隐由全局配置 buttonIcon 决定（与 MuAddButton 一致），图标形态的图标即按钮本身
const renderIcon = computed(() => (mode.value === 'button' && !globalConfig?.buttonIcon ? '' : props.icon))
</script>

<template>
  <mu-button :mode
             :icon="renderIcon"
             :tip="buttonText"
             @click="$emit('click')"
  >
    <slot>{{ buttonText }}</slot>
  </mu-button>
</template>
