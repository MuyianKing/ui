<script setup lang="ts">
import type { Placement } from 'element-plus'
import { ElButton, ElLink, ElTooltip } from 'element-plus'
import { MuIcon } from '../../icon'

defineOptions({ name: 'MuButton' })

withDefaults(defineProps<{
  buttonType?: string
  icon?: string
  showIcon?: boolean
  size?: number
  text?: string
  placement?: Placement
  type?: 'default' | 'primary' | 'success' | 'warning' | 'info' | 'danger' | undefined
}>(), {
  buttonType: 'button',
  icon: '',
  showIcon: true,
  size: 18,
  text: '',
  placement: 'top',
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
  <el-link v-if="buttonType === 'text'" class="mu-button whitespace-nowrap" :type v-bind="$attrs" @click="handleClick">
    <slot>{{ text }}</slot>
  </el-link>
  <el-button v-else-if="buttonType === 'button'" class="mu-button" :type v-bind="$attrs" @click="handleClick">
    <mu-icon v-if="icon && showIcon" :icon class="mr-1" />
    <slot>{{ text }}</slot>
  </el-button>
  <el-tooltip v-else-if="text" :content="text" effect="light" :placement :enterable="false" :hide-after="0">
    <mu-icon v-bind="$attrs" :type :icon :size class="mu-button cursor-pointer" @click="handleClick" />
  </el-tooltip>
  <mu-icon v-else v-bind="$attrs" :type :icon :size class="mu-button cursor-pointer" @click="handleClick" />
</template>
