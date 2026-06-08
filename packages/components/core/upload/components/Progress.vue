<script setup lang="ts">
import { ElProgress } from 'element-plus'

import { useSlots } from 'vue'

defineOptions({ name: 'UploadProgress' })

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  progress: {
    type: Number,
    default: 0,
  },
})

const slots = useSlots()
</script>

<template>
  <teleport to="body">
    <div v-show="show" class="mu-ui-progress-shadow">
      <div class="progress-body">
        <div class="title mb-2">
          正在上传...
        </div>
        <slot :percentage="progress" />
        <el-progress v-if="!slots.default" text-inside :stroke-width="20" :percentage="progress" class="progress" />
      </div>
    </div>
  </teleport>
</template>
