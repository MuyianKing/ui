<script setup lang="ts">
import type { Placement } from 'element-plus'
import type { GlobalCustomConfig } from '../../types/common'
import { ElButton, ElPopover } from 'element-plus'
import { inject, ref } from 'vue'
import MuButton from './Index.vue'
import { useButton } from './useButton'

defineOptions({ name: 'MuDelButton' })

const props = withDefaults(defineProps<{
  message?: string
  noPopover?: boolean
  placement?: Placement
  icon?: string
  // 运行时支持布尔形态（true 走文本样式、取默认文案），与 useButton 的签名一致
  text?: string | boolean
}>(), {
  message: '您确定确认删除？',
  noPopover: false,
  placement: 'top',
  icon: 'icon-park-outline:delete',
  // 必须显式给 undefined：text 类型含 Boolean，Vue 会把未传的布尔型 prop 转成 false，
  // 那样 useButton 里的 `props.text !== undefined` 恒为真、全局配置 tableIcon 就永远不生效
  text: undefined,
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

const globalConfig = inject<GlobalCustomConfig>('GLOBAL_CUSTOM_CONFIG')
const { buttonText, mode } = useButton(props, '删除', globalConfig?.tableIcon)
const popoverVisible = ref(false)

function handleConfirm() {
  popoverVisible.value = false
  emit('click')
}
</script>

<template>
  <el-popover v-if="!noPopover" v-model:visible="popoverVisible" :placement :width="180" trigger="click">
    <p>{{ message }}</p>
    <div style="text-align: right; margin: 0; margin-top: 8px">
      <el-button size="small" @click="popoverVisible = false">
        取消
      </el-button>
      <el-button size="small" type="danger" @click="handleConfirm">
        确定
      </el-button>
    </div>
    <template #reference>
      <div>
        <mu-button :mode="mode" :icon :tip="buttonText" type="danger" @click="popoverVisible = true">
          {{ buttonText }}
        </mu-button>
      </div>
    </template>
  </el-popover>
  <mu-button v-else :mode="mode" :icon :tip="buttonText" type="danger" @click="emit('click')">
    {{ buttonText }}
  </mu-button>
</template>
