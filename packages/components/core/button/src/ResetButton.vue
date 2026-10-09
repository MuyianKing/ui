<script setup lang="ts">
import type { GlobalCustomConfig } from '../../types/common'
import { ElButton, ElPopconfirm } from 'element-plus'
import { inject } from 'vue'
import { MuIcon } from '../../icon'
import MuButton from './Index.vue'
import { useButton } from './useButton'

defineOptions({ name: 'MuResetButton' })

const props = withDefaults(defineProps<{
  icon?: string
  text?: string | boolean
  noConfirm?: boolean
}>(), {
  icon: 'icon-park-outline:refresh-one',
  text: '重置',
  noConfirm: false,
})

const emit = defineEmits<{
  (e: 'confirm'): void
}>()

const globalConfig = inject<GlobalCustomConfig>('GLOBAL_CUSTOM_CONFIG')
const { buttonText, mode } = useButton(props, '重置', globalConfig?.tableIcon)
</script>

<template>
  <template v-if="noConfirm">
    <el-button @click="emit('confirm')">
      <mu-icon :icon />
      <span>{{ text }}</span>
    </el-button>
  </template>
  <el-popconfirm v-else
                 title="确定要重置吗？"
                 @confirm="emit('confirm')"
  >
    <template #reference>
      <mu-button :mode="mode"
                 :icon
                 :tip="buttonText"
      >
        {{ buttonText }}
      </mu-button>
    </template>
  </el-popconfirm>
</template>
