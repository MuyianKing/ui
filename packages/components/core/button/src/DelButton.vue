<script setup lang="ts">
import type { Component } from 'vue'
import type { GlobalCustomConfig } from '../../types/common'
import { ElMessageBox } from 'element-plus'
import { inject } from 'vue'
import IconDelete from '~icons/icon-park-outline/delete'
import MuButton from './Index.vue'
import { useButton } from './useButton'

defineOptions({ name: 'MuDelButton' })

const props = withDefaults(defineProps<{
  message?: string
  noPopover?: boolean
  icon?: string | Component
  // 运行时支持布尔形态（true 走文本样式、取默认文案），与 useButton 的签名一致
  text?: string | boolean
}>(), {
  message: '您确定确认删除？',
  noPopover: false,
  icon: IconDelete,
  // 必须显式给 undefined：text 类型含 Boolean，Vue 会把未传的布尔型 prop 转成 false，
  // 那样 useButton 里的 `props.text !== undefined` 恒为真、全局配置 tableIcon 就永远不生效
  text: undefined,
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

const globalConfig = inject<GlobalCustomConfig>('GLOBAL_CUSTOM_CONFIG')
const { buttonText, mode } = useButton(props, '删除', globalConfig?.tableIcon)

// 二次确认用模态 MessageBox：确认后 emit click；取消 / 关闭（promise reject）只关闭弹窗
function handleClick() {
  if (props.noPopover) {
    emit('click')
    return
  }
  ElMessageBox.confirm(props.message, '警告', { type: 'warning' })
    .then(() => emit('click'))
    .catch(() => {})
}
</script>

<template>
  <mu-button :mode="mode" :icon :tip="buttonText" type="danger" @click="handleClick">
    <slot>{{ buttonText }}</slot>
  </mu-button>
</template>
