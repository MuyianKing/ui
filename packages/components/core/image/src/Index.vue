<script setup lang="ts">
import { ElImage, vLoading } from 'element-plus'
import { computed, inject } from 'vue'

defineOptions({ name: 'MuImage' })

const props = withDefaults(defineProps<{
  src?: string
  prefix?: string
  preview?: string[]
  noPreview?: boolean
  fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  height?: string
  width?: string
}>(), {
  src: '',
  prefix: '',
  preview: () => [],
  noPreview: false,
  fit: 'contain',
  height: '100px',
  width: '100px',
})

const globalConfig = inject<{ previewFileUrl?: (url: string, prefix: string) => string }>('GLOBAL_CUSTOM_CONFIG')

const prevSrc = computed(() => {
  if (props.src) {
    return globalConfig?.previewFileUrl ? globalConfig.previewFileUrl(props.src, props.prefix) : props.src
  }
  return ''
})

const previewList = computed(() => {
  if (props.noPreview)
    return []
  return props.preview.length > 0 ? props.preview : [prevSrc.value]
})

const imageStyle = computed(() => ({
  height: props.height,
  width: props.width,
}))
</script>

<template>
  <div class="mu-preview-img" :style="imageStyle">
    <el-image v-if="prevSrc"
              :fit
              :preview-src-list="previewList"
              :src="prevSrc"
              class="w-full h-full"
              preview-teleported
    >
      <template #placeholder>
        <div v-loading="true" class="w-full h-full" element-loading-text="加载中..." />
      </template>
    </el-image>
    <slot />
  </div>
</template>
