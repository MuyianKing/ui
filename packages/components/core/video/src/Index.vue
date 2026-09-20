<script setup lang="ts">
import { computed, inject, useTemplateRef } from 'vue'

defineOptions({ name: 'MuVideo' })

const props = withDefaults(defineProps<{
  src?: string
  prefix?: string
  height?: string
  width?: string
  controls?: boolean
  fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
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

function togglePlay() {
  const video = videoRef.value
  if (!video)
    return
  if (video.paused) {
    // play() 可能因浏览器自动播放策略被 reject，需读 video.paused 而非自维护状态，
    // 否则失败时记录的播放态与真实状态相反
    video.play().catch(() => {})
  } else {
    video.pause()
  }
}

function handleDblclick() {
  if (!videoRef.value)
    return
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {})
  } else {
    videoRef.value.requestFullscreen().catch(() => {})
  }
}
</script>

<template>
  <div class="mu-video" :style="{ height, width }" @click="togglePlay" @dblclick="handleDblclick">
    <video v-if="videoSrc"
           ref="videoRef"
           :src="videoSrc"
           :controls="controls"
           :style="{ objectFit: fit }"
    />
    <div v-else class="mu-video-placeholder">
      <slot>暂无视频</slot>
    </div>
  </div>
</template>
