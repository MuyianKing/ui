<script setup lang="ts">
import type { Placement } from 'element-plus'
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
  text?: string
}>(), {
  message: '您确定确认删除？',
  noPopover: false,
  placement: 'top',
  icon: 'icon-park-outline:delete',
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

const globalConfig = inject<{ tableIcon?: string }>('GLOBAL_CUSTOM_CONFIG')
const { buttonText, buttonType } = useButton(props as any, '删除', globalConfig?.tableIcon)
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
        <mu-button :button-type="buttonType" :icon :text="buttonText" type="danger" @click="popoverVisible = true" />
      </div>
    </template>
  </el-popover>
  <mu-button v-else :button-type="buttonType" :icon :text="buttonText" type="danger" @click="emit('click')" />
</template>
