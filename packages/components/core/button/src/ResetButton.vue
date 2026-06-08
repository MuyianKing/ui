<script setup lang="ts">
import { ElButton, ElPopconfirm } from 'element-plus'
import { inject } from 'vue'
import MuIcon from '../../icon/src/Index.vue'
import MuButton from './Index.vue'
import { useButton } from './useButton'

defineOptions({ name: 'MuResetButton' })

const props = withDefaults(defineProps<{
  icon?: string
  text?: string
  noConfirm?: boolean
}>(), {
  icon: 'icon-park-outline:refresh-one',
  text: '重置',
  noConfirm: false,
})

const emit = defineEmits<{
  (e: 'confirm'): void
}>()

const globalConfig = inject<{ tableIcon?: boolean }>('GLOBAL_CUSTOM_CONFIG')
const { buttonText, buttonType } = useButton(props as any, '重置', globalConfig?.tableIcon ? undefined : undefined)
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
      <mu-button :button-type="buttonType"
                 :icon
                 :text="buttonText"
      />
    </template>
  </el-popconfirm>
</template>
