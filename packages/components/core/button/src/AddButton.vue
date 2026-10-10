<script setup lang="ts">
import type { GlobalCustomConfig } from '../../types/common'
import { inject } from 'vue'
import IconAddOne from '~icons/icon-park-outline/add-one'
import MuButton from './Index.vue'

defineOptions({ name: 'MuAddButton' })

const emit = defineEmits<{
  (e: 'click'): void
}>()

const globalConfig = inject<GlobalCustomConfig>('GLOBAL_CUSTOM_CONFIG')
</script>

<template>
  <mu-button type="danger" :icon="globalConfig?.buttonIcon ? IconAddOne : ''" @click="emit('click')">
    <slot>添加</slot>
  </mu-button>
</template>
