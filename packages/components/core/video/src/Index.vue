<script setup lang="ts">
import { computed, inject, ref, useTemplateRef } from 'vue'

defineOptions({ name: 'MuVideo' })

const props = withDefaults(defineProps<{
  src?: string
  prefix?: string
  height?: string
  width?: string
  controls?: boolean
  fit?: string
  noPreview?: boolean
}>(), {
  src: '',
  prefix: '',
  height: 'auto',
  width: '300px',
  controls: false,
  fit: 'contain',
  noPreview: false,
})

const globalConfig = inject<{ previewFileUrl?: (url: string, prefix: string) => string }>('GLOBAL_CUSTOM_CONFIG')

const videoSrc = computed(() => {
  if (props.src) {
    return globalConfig?.previewFileUrl ? globalConfig.previewFileUrl(props.src, props.prefix) : props.src
  }
  return ''
})

const videoRef = useTemplateRef<HTMLVideoElement>('videoRef')
const isPlaying = ref(false)

function togglePlay() {
  if (!videoRef.value)
    return
  if (isPlaying.value) {
    videoRef.value.pause()
  } else {
    videoRef.value.play()
  }
  isPlaying.value = !isPlaying.value
}

function handleDblclick() {
  if (!videoRef.value)
    return
  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    videoRef.value.requestFullscreen()
  }
}
</script>

<template>
  <div class="mu-video" :style="{ height, width }" @click="togglePlay" @dblclick="handleDblclick">
    <video v-if="videoSrc"
           ref="videoRef"
           :src="videoSrc"
           :style="{ objectFit: fit }"
           @ended="isPlaying = false"
    />
    <div v-else class="mu-video-placeholder">
      <slot>暂无视频</slot>
    </div>
  </div>
</template>
