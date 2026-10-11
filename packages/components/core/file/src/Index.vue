<script setup lang="ts">
import type { Component } from 'vue'
import type { GlobalCustomConfig } from '../../types/common'
import { computed, inject } from 'vue'
import IconDownload from '~icons/ep/download'
import IconFileAudio from '~icons/vscode-icons/file-type-audio'
import IconFileExcel from '~icons/vscode-icons/file-type-excel'
import IconFilePdf from '~icons/vscode-icons/file-type-pdf'
import IconFilePowerpoint from '~icons/vscode-icons/file-type-powerpoint'
import IconFileText from '~icons/vscode-icons/file-type-text'
import IconFileWord from '~icons/vscode-icons/file-type-word'
import { success } from '../../../utils/message'

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

const globalConfig = inject<GlobalCustomConfig>('GLOBAL_CUSTOM_CONFIG')

const fileName = computed(() => props.file?.name || props.file?.fileName || '')

// 上传链路里存的是 path，只读 url 会拿到 undefined
const fileUrl = computed(() => props.file?.url || props.file?.path || '')

const fileSuffix = computed(() => {
  const name = fileName.value
  return name?.split('.').pop()?.toLowerCase() || ''
})

const fileIcon = computed<Component>(() => {
  const suffixMap: Record<string, Component> = {
    xls: IconFileExcel,
    xlsx: IconFileExcel,
    doc: IconFileWord,
    docx: IconFileWord,
    ppt: IconFilePowerpoint,
    pptx: IconFilePowerpoint,
    pdf: IconFilePdf,
    mp3: IconFileAudio,
    wav: IconFileAudio,
  }
  return suffixMap[fileSuffix.value] || IconFileText
})

function handleDownload() {
  if (props.noDownload || !globalConfig?.downloadFile)
    return
  if (!fileUrl.value)
    return
  globalConfig.downloadFile(fileUrl.value, fileName.value)
  success('开始下载')
}
</script>

<template>
  <div v-if="card" class="mu-file-card" :style="{ height, width }">
    <component :is="fileIcon" class="shrink-0 text-[36px]" />
    <span class="file-name">{{ fileName }}</span>
    <div v-if="!noDownload" class="file-actions">
      <icon-download class="cursor-pointer text-[16px]" @click="handleDownload" />
    </div>
  </div>
  <div v-else class="mu-file-line">
    <span class="file-link cursor-pointer flex items-center" @click="handleDownload">
      <component :is="fileIcon" class="mr-1 text-[18px]" />
      {{ fileName }}
    </span>
  </div>
</template>
