<script setup lang="ts">
import type { Placement } from 'element-plus'
import type { MuButtonMode } from './useButton'
import { ElButton, ElLink, ElTooltip } from 'element-plus'
import { MuIcon } from '../../icon'

defineOptions({ name: 'MuButton' })

withDefaults(defineProps<{
  icon?: string
  iconSize?: number
  mode?: MuButtonMode
  placement?: Placement
  tip?: string
  type?: 'default' | 'primary' | 'success' | 'warning' | 'info' | 'danger' | undefined
}>(), {
  icon: '',
  iconSize: 18,
  mode: 'button',
  placement: 'top',
  tip: '',
  type: 'primary',
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

function handleClick() {
  emit('click')
}
</script>

<template>
  <el-link v-if="mode === 'text'" class="mu-button whitespace-nowrap" :type v-bind="$attrs" @click="handleClick">
    <slot />
  </el-link>
  <el-button v-else-if="mode === 'button'" class="mu-button" :type v-bind="$attrs" @click="handleClick">
    <mu-icon v-if="icon" :icon class="mr-1" />
    <slot />
  </el-button>
  <el-tooltip v-else-if="tip" :content="tip" effect="light" :placement :enterable="false" :hide-after="0">
    <mu-icon v-bind="$attrs" :type :icon :size="iconSize" class="mu-button cursor-pointer" @click="handleClick" />
  </el-tooltip>
  <mu-icon v-else v-bind="$attrs" :type :icon :size="iconSize" class="mu-button cursor-pointer" @click="handleClick" />
</template>
