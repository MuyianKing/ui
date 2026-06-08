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
  <el-config-provider>
    <slot />
  </el-config-provider>
</template>
