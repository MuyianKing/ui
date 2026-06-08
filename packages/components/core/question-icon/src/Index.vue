<script setup lang="ts">
import type { Placement } from 'element-plus'
import { ElTooltip } from 'element-plus'
import { MuIcon } from '../../icon'

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
    <mu-icon icon="mingcute:question-fill" size="16px" class="mu-question-icon" />
  </el-tooltip>
</template>
