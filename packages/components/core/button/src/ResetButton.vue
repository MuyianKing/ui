<script setup lang="ts">
import type { Component } from 'vue'
import type { GlobalCustomConfig } from '../../types/common'
import { Icon } from '@iconify/vue'
import { ElButton, ElPopconfirm } from 'element-plus'
import { computed, inject } from 'vue'
import IconRefresh from '~icons/icon-park-outline/refresh-one'
import MuButton from './Index.vue'
import { useIconProp } from './useButton'

defineOptions({ name: 'MuResetButton' })

const props = withDefaults(defineProps<{
  icon?: string | Component
  noConfirm?: boolean
}>(), {
  icon: IconRefresh,
  noConfirm: false,
})

const emit = defineEmits<{
  (e: 'confirm'): void
}>()

const globalConfig = inject<GlobalCustomConfig>('GLOBAL_CUSTOM_CONFIG')
// 标准按钮的前置图标显隐由全局配置 buttonIcon 决定（与 MuAddButton 一致），noConfirm 分支保持一致
const renderIcon = computed(() => (globalConfig?.buttonIcon ? props.icon : ''))
const { iconComp, iconName } = useIconProp(() => renderIcon.value)
</script>

<template>
  <template v-if="noConfirm">
    <el-button @click="emit('confirm')">
      <component :is="iconComp" v-if="iconComp" class="text-[18px]" />
      <icon v-else-if="iconName" :icon="iconName" class="text-[18px]" />
      <span><slot>重置</slot></span>
    </el-button>
  </template>
  <el-popconfirm v-else
                 title="确定要重置吗？"
                 @confirm="emit('confirm')"
  >
    <template #reference>
      <mu-button :icon="renderIcon">
        <slot>重置</slot>
      </mu-button>
    </template>
  </el-popconfirm>
</template>
