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

// 统一解析文件地址：字符串元素本身就是地址，对象优先 path、回退 url。
// 类型判定与实际 src 必须用同一个地址，否则「只有 url」的对象会被判成图片、
// 却把整个对象当作 src 渲染成 [object Object]。
function getFileUrl(file: any): string {
  if (!file)
    return ''
  if (typeof file === 'string')
    return file
  return file.path || file.url || ''
}

function getFileType(file: any): string {
  if (!file)
    return ''
  const url = getFileUrl(file)
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
      <mu-image v-if="getFileType(file) === 'image'" :src="getFileUrl(file)" :height :width :no-preview="noPreview" />
      <mu-video v-else-if="getFileType(file) === 'video'" :src="getFileUrl(file)" :height :width />
      <mu-file v-else :file="typeof file === 'object' ? file : { path: file }" :card :height :width />
    </template>
  </div>
</template>
