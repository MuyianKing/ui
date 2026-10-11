<script setup lang="ts">
import type { Placement } from 'element-plus'
import { ElTooltip } from 'element-plus'
import IconQuestion from '~icons/mingcute/question-fill'

defineOptions({ name: 'MuQuestionIcon' })

withDefaults(defineProps<{
  placement?: Placement
}>(), {
  placement: 'top',
})
</script>

<template>
  <el-tooltip :placement effect="light">
    <template #content>
      <slot />
    </template>
    <icon-question class="mu-question-icon text-[16px]" />
  </el-tooltip>
</template>
