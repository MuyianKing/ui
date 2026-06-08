<script setup lang="ts">
import { computed, inject } from 'vue'
import { success } from '../../../utils/message'
import { MuIcon } from '../../icon'

defineOptions({ name: 'MuFile' })

const props = withDefaults(defineProps<{
  file?: Record<string, any> | null
  noDownload?: boolean
  card?: boolean
  height?: string
  width?: string
}>(), {
  file: null,
  noDownload: false,
  card: false,
  height: '100px',
  width: '100px',
})

const globalConfig = inject<{
  previewFileUrl?: (url: string, prefix?: string) => string
  downloadFile?: (url: string, name: string) => void
}>('GLOBAL_CUSTOM_CONFIG')

const fileName = computed(() => props.file?.name || props.file?.fileName || '')

const fileSuffix = computed(() => {
  const name = fileName.value
  return name?.split('.').pop()?.toLowerCase() || ''
})

const fileIcon = computed(() => {
  const suffixMap: Record<string, string> = {
    xls: 'vscode-icons:file-type-excel',
    xlsx: 'vscode-icons:file-type-excel',
    doc: 'vscode-icons:file-type-word',
    docx: 'vscode-icons:file-type-word',
    ppt: 'vscode-icons:file-type-powerpoint',
    pptx: 'vscode-icons:file-type-powerpoint',
    pdf: 'vscode-icons:file-type-pdf',
    mp3: 'vscode-icons:file-type-audio',
    wav: 'vscode-icons:file-type-audio',
  }
  return suffixMap[fileSuffix.value] || 'vscode-icons:file-type-default'
})

function handleDownload() {
  if (props.noDownload || !globalConfig?.downloadFile)
    return
  globalConfig.downloadFile(props.file!.url, fileName.value)
  success('开始下载')
}
</script>

<template>
  <div v-if="card" class="mu-file-card" :style="{ height, width }">
    <mu-icon :icon="fileIcon" size="36px" />
    <span class="file-name">{{ fileName }}</span>
    <div v-if="!noDownload" class="file-actions">
      <mu-icon icon="ep:download" size="16px" class="cursor-pointer" @click="handleDownload" />
    </div>
  </div>
  <div v-else class="mu-file-line">
    <span class="file-link cursor-pointer" @click="handleDownload">
      <mu-icon :icon="fileIcon" class="mr-1" />
      {{ fileName }}
    </span>
  </div>
</template>
