<script setup lang="ts">
import type { Placement } from 'element-plus'
import type { Component } from 'vue'
import type { MuButtonMode } from './useButton'
import { Icon } from '@iconify/vue'
import { ElButton, ElLink, ElTooltip } from 'element-plus'
import { computed } from 'vue'
import { useIconProp } from './useButton'

defineOptions({ name: 'MuButton' })

const props = withDefaults(defineProps<{
  /** Iconify 图标名（运行时解析）或 unplugin-icons 的编译期图标组件 */
  icon?: string | Component
  iconSize?: number
  mode?: MuButtonMode
  placement?: Placement
  tip?: string
  type?: 'default' | 'primary' | 'success' | 'warning' | 'info' | 'danger' | undefined
}>(), {
  icon: '',
  iconSize: 16,
  mode: 'button',
  placement: 'top',
  tip: '',
  type: 'primary',
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

const { iconComp, iconName } = useIconProp(() => props.icon)

// 按钮形态的前置图标只随 iconSize 缩放，颜色交给 el-button 的文字色（plain / danger 等场景不能写死主题色）
const buttonIconStyle = computed(() => ({ 'font-size': `${props.iconSize}px` }))

// 图标形态的字号与颜色：颜色按 type 取 Element Plus 主题变量，type 为空不着色
const iconStyle = computed(() => ({
  'font-size': `${props.iconSize}px`,
  'color': props.type ? `var(--el-color-${props.type})` : '',
}))

function handleClick() {
  emit('click')
}
</script>

<template>
  <el-link v-if="mode === 'text'" class="mu-button whitespace-nowrap" :type v-bind="$attrs" @click="handleClick">
    <slot />
  </el-link>
  <el-button v-else-if="mode === 'button'" class="mu-button" :type v-bind="$attrs" @click="handleClick">
    <component :is="iconComp" v-if="iconComp" class="mr-1" :style="buttonIconStyle" />
    <icon v-else-if="iconName" :icon="iconName" class="mr-1" :style="buttonIconStyle" />
    <slot />
  </el-button>
  <el-tooltip v-else-if="tip" :content="tip" effect="light" :placement :enterable="false" :hide-after="0">
    <component :is="iconComp" v-if="iconComp" v-bind="$attrs" class="mu-button cursor-pointer"
               :style="iconStyle"
               @click="handleClick"
    />
    <icon v-else v-bind="$attrs" :icon="iconName" class="mu-button cursor-pointer"
          :style="iconStyle"
          @click="handleClick"
    />
  </el-tooltip>
  <template v-else>
    <component :is="iconComp" v-if="iconComp" v-bind="$attrs" class="mu-button cursor-pointer"
               :style="iconStyle"
               @click="handleClick"
    />
    <icon v-else v-bind="$attrs" :icon="iconName" class="mu-button cursor-pointer"
          :style="iconStyle"
          @click="handleClick"
    />
  </template>
</template>
