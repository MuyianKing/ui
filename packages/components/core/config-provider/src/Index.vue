<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import { provide } from 'vue'

defineOptions({ name: 'MuConfigProvider' })

const props = defineProps<{
  customConfig: Record<string, any>
}>()

provide('GLOBAL_CUSTOM_CONFIG', props.customConfig)
</script>

<template>
  <!-- 不转发的话 locale / size / zIndex 等全部丢失，这层包裹就成了空壳 -->
  <el-config-provider v-bind="$attrs">
    <slot />
  </el-config-provider>
</template>
