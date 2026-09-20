<script setup lang="ts">
import { getType } from '@muyianking/utils'
import { vLoading } from 'element-plus'
import { computed } from 'vue'
import IconComp from '../../icon'
import PreviewComp from '../../preview'

interface FileItem {
  id?: string
  name?: string
  path?: string
  loading?: boolean
  type?: string
  [key: string]: any
}

const props = defineProps({
  file: {
    type: [String, Array, Object] as unknown as () => string | FileItem[] | FileItem,
    default: '',
  },
  // 展示方式 line-一行一附件 card-卡片形式
  listType: {
    type: String,
    default: 'card',
  },
})

const emits = defineEmits<{
  'delete': [row: FileItem]
  're-upload': [row: FileItem]
}>()

// 删除
function handleDel(row: FileItem) {
  emits('delete', row)
}

// 重新上传
function handleChange(row: FileItem, real: boolean) {
  if (!real) {
    return
  }

  emits('re-upload', row)
}

const _files = computed<FileItem[]>(() => {
  if (!props.file)
    return []

  const files = Array.isArray(props.file) ? props.file : typeof props.file === 'object' ? [props.file] : [{ path: props.file }]

  return files.map((item: FileItem) => {
    return {
      ...item,
      type: getType(item.path ?? '') || getType(item.name ?? ''),
    }
  })
})
</script>

<template>
  <div v-for="(_file, index) in _files" :key="_file.id ?? index" v-loading="!!_file.loading" class="mu-upload-preview-wrapper"
       @click="handleChange(_file, listType !== 'card')"
  >
    <preview-comp :files="_file" height="100px" width="100px" no-preview :card="listType === 'card'" no-download />
    <div v-if="listType === 'card'" class="delete-wrapper" @click.stop>
      <icon-comp class="icon-close" icon="pixelarticons:trash" size="24px" @click="handleDel(_file)" />
      <icon-comp class="ml-2" icon="ri:folder-upload-line" size="24px" @click="handleChange(_file, true)" />
    </div>
    <icon-comp v-else class="icon-close ml-2" icon="pixelarticons:trash" size="18px" @click.stop="handleDel(_file)" />
  </div>
</template>
