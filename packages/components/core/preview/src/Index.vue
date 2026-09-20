<script setup lang="ts">
import { computed } from 'vue'
import { MuFile } from '../../file'
import { MuImage } from '../../image'
import { MuVideo } from '../../video'

defineOptions({ name: 'MuPreview' })

const props = withDefaults(defineProps<{
  files?: any[] | Record<string, any> | null
  height?: string
  width?: string
  noPreview?: boolean
  card?: boolean
}>(), {
  files: null,
  height: '100px',
  width: '100px',
  noPreview: false,
  card: false,
})

function getFileType(file: any): string {
  if (!file)
    return ''
  const url = file.url || file.path || ''
  const imgTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg']
  const videoTypes = ['mp4', 'webm', 'ogg', 'mov', 'avi']

  const suffix = (url as string).split('.').pop()?.toLowerCase()
  if (suffix && imgTypes.includes(suffix))
    return 'image'
  if (suffix && videoTypes.includes(suffix))
    return 'video'
  return 'file'
}

const fileList = computed(() => {
  if (!props.files)
    return []
  return Array.isArray(props.files) ? props.files : [props.files]
})
</script>

<template>
  <div class="mu-preview" :style="{ height, width }">
    <template v-for="(file, index) in fileList" :key="index">
      <mu-image v-if="getFileType(file) === 'image'" :src="file.path || file" :height :width :no-preview="noPreview" />
      <mu-video v-else-if="getFileType(file) === 'video'" :src="file.path || file" :height :width />
      <mu-file v-else :file="typeof file === 'object' ? file : { path: file }" :card :height :width />
    </template>
  </div>
</template>
