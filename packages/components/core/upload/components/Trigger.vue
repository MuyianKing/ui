<script setup lang="ts">
import { getMimeType, getSuffix } from '@muyianking/utils'
import { computed, ref, useSlots } from 'vue'
import { confirm } from '../../../utils/message'
import IconComp from '../../icon'
import { getAcceptType } from '../hooks/index'

interface UploadConfig {
  multiple: boolean
  files: any
  maxCount: number
  type: string | string[]
  suffix: string | string[]
  disabled: boolean
  noPreview: boolean
}

const props = defineProps({
  config: {
    type: Object as () => UploadConfig,
    default() {
      return {}
    },
  },
  triggerType: {
    type: String,
    default: 'card',
  },
})

const emits = defineEmits<{
  'select-file': [file: File]
}>()

const slots = useSlots()

// 已选文件数组
const files_comp = computed<any[]>(() => {
  const files = props.config.files
  if (files)
    return Array.isArray(files) ? files : [files]

  return []
})

// 是否显示添加按钮
const show_add = computed(() => {
  const config = props.config

  if (config.noPreview) {
    return true
  }

  // 单选已选
  if ((!config.multiple && files_comp.value.length > 0)) {
    return false
  }

  // 多选超过范围
  return files_comp.value.length < config.maxCount
})

// 触发上传
const file_input_ref = ref<HTMLInputElement>()

function triggerAdd() {
  if (props.config.disabled)
    return

  file_input_ref.value?.click()
}

// 选择文件
function selectMedia(e: Event) {
  const input = e.target as HTMLInputElement
  const selected = Array.from(input.files ?? [])
  input.value = ''
  if (selected.length === 0)
    return

  // multiple 时必须整批处理，之前只取 files[0]，一次选 5 个只进 1 个
  const files = props.config.multiple ? selected : selected.slice(0, 1)

  for (const file of files) {
    if (!isAccepted(file.name)) {
      showTypeWarning()
      // 类型不符时整批中止，避免混入越权文件后继续上传
      return
    }
    emits('select-file', file)
  }
}

// 文件类型
const accept_type = computed<string[]>(() => {
  const result = getAcceptType(props.config.type, props.config.suffix)
  return Array.isArray(result) ? result : []
})

// 供 <input accept> 使用的字符串；空数组表示不限制类型
const accept_attr = computed(() => accept_type.value.length > 0 ? accept_type.value.join(',') : '*/*')

// accept_type 是 mime 字符串数组；getMimeType 传字符串时返回的是单个 mime 字符串，
// 旧写法多了一个 [0] 下标，取到的是首字符（'i'），比对永远失配并拦掉合法文件
function isAccepted(fileName: string) {
  if (accept_type.value.length === 0)
    return true
  return accept_type.value.includes(getMimeType(getSuffix(fileName)))
}

function showTypeWarning() {
  confirm('请不要自行选择【所有文件】，上传指定类型外的文件', '', {
    type: 'warning',
    buttonSize: 'large',
    confirmButtonText: '我已知晓',
    center: true,
    showCancelButton: false,
    showClose: false,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    closeOnHashChange: false,
  })
}

defineExpose({
  triggerAdd,
})
</script>

<template>
  <div v-if="show_add" v-bind="$attrs" class="cursor-pointer normal-trigger mu-upload-trigger-comp" :class="{ 'trigger-item': triggerType === 'card' && !slots.trigger, 'w-full': triggerType === 'line' }" @click="triggerAdd">
    <slot name="trigger" />

    <template v-if="!slots.trigger">
      <div v-if="triggerType === 'card'">
        <icon-comp icon="bitcoin-icons:plus-outline" style="font-size: 28px;" />
      </div>
      <div v-else class="upload-icon">
        <icon-comp icon="ic:round-cloud-upload" style="font-size: 20px;" />
        <span class="ml-1 ">点击上传附件</span>
      </div>
    </template>
  </div>
  <input ref="file_input_ref" type="file" :accept="accept_attr" :multiple="!!props.config.multiple" style="display:none" @change="selectMedia">
</template>
