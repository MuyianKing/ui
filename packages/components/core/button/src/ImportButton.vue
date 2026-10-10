<script setup lang="ts">
import type { GlobalCustomConfig } from '../../types/common'
import { computed, inject } from 'vue'
import IconImport from '~icons/ph/download-simple-bold'
import MuButton from './Index.vue'

defineOptions({ name: 'MuImportButton' })

const emit = defineEmits<{
  (e: 'click'): void
}>()

const globalConfig = inject<GlobalCustomConfig>('GLOBAL_CUSTOM_CONFIG')
// 标准按钮的前置图标显隐由全局配置 buttonIcon 决定（与 MuAddButton 一致）
const renderIcon = computed(() => (globalConfig?.buttonIcon ? IconImport : ''))
</script>

<template>
  <mu-button :icon="renderIcon" @click="emit('click')">
    <slot>导入</slot>
  </mu-button>
</template>
