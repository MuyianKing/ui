<script setup lang="ts">
import { AUDIO_SUFFIX, FILE_SUFFIX, guid } from '@muyianking/utils'
import { computed, inject, nextTick, provide, ref, useSlots } from 'vue'
import { error } from '../../utils/message'

import PreviewComp from './components/Preview.vue'
import UploadProgress from './components/Progress.vue'
import TriggerComp from './components/Trigger.vue'
import { getAllType } from './hooks/index'

defineOptions({ name: 'MuUpload' })

const props = defineProps({
  // 文件类型 video：视频 image：图片 file：文件 audio：音频, all:所有文件类型
  type: {
    type: [String, Array] as unknown as () => string | string[],
    default: 'image',
  },
  // 指定文件后缀用于过滤待选文件类型
  suffix: {
    type: [String, Array] as unknown as () => string | string[],
    default: '',
  },
  // 是否多选
  multiple: {
    type: Boolean,
    default: false,
  },
  // 最大上传数量
  maxCount: {
    type: Number,
    default: 99,
  },
  // 自动上传
  autoUpload: {
    type: Boolean,
    default: true,
  },
  // 进度条
  progress: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  // 预览文件
  noPreview: {
    type: Boolean,
    default: false,
  },
  // 展示方式 card-卡片形式 line-一行 不传自动判断
  listType: {
    type: String,
    default: '',
  },
  // 触发区域样式：card-卡片  line-一行
  triggerType: {
    type: String,
    default: '',
  },
})

const emits = defineEmits(['upload-start', 'upload-finish'])

interface UploadFile {
  id?: string
  name?: string
  path?: string
  loading?: boolean
  file?: File
  [key: string]: any
}

interface UploadConfig {
  multiple: boolean
  files: UploadFile | UploadFile[] | null
  maxCount: number
  type: string | string[]
  suffix: string | string[]
  disabled: boolean
  noPreview: boolean
}

// 触发区域展示形式
const _trigger_type = computed(() => {
  if (props.triggerType) {
    return props.triggerType
  }
  return _list_type.value
})

// 展示形式
const _list_type = computed(() => {
  if (props.listType) {
    return props.listType
  }

  // 判断当前文件类型是否只包含图片和视频
  if (is_only_video_image.value) {
    return 'card'
  }

  return 'line'
})

const { uploadFile } = inject('GLOBAL_CUSTOM_CONFIG', null) as any || {}

const slots = useSlots()

const files_value = defineModel<UploadFile | UploadFile[] | null>({
  type: [Array, Object] as unknown as () => UploadFile | UploadFile[] | null,
  default: null,
})

// 本地预览用的 blob 地址必须显式释放，否则每个选过又删掉的文件都会一直占着内存
function revokeBlob(file?: UploadFile | null) {
  if (file?.path?.startsWith('blob:'))
    URL.revokeObjectURL(file.path)
}

// 删除
function handleDel(row: UploadFile) {
  if (props.multiple) {
    const files = files_value.value as UploadFile[]
    const index = files.findIndex(item => item.id === row.id)
    if (index > -1) {
      revokeBlob(files[index])
      files.splice(index, 1)
    }
  } else {
    revokeBlob(files_value.value as UploadFile | null)
    files_value.value = null
  }
}

// 重新上传
let replace_file: UploadFile | null = null
const trigger_ref = ref()

function handleReupload(row: UploadFile) {
  trigger_ref.value.triggerAdd()
  replace_file = row
}

// 选择文件后
async function handleSelect(file: File) {
  let new_file: UploadFile = {
    id: guid(),
    name: file.name,
    path: URL.createObjectURL(file),
  }

  if (props.multiple) {
    // 未初始化过设为空数组
    if (!files_value.value)
      files_value.value = []

    await nextTick()

    const files = files_value.value as UploadFile[]
    let index = files.length

    // 是重新上传
    if (replace_file) {
      // 找到重新上传的文件的索引
      index = files.findIndex(item => item.id === replace_file!.id)

      if (index > -1) {
        // 找到替换
        revokeBlob(files[index])
        files.splice(index, 1, new_file)
      } else {
        // 未找到新增
        files.push(new_file)
        index = files.length - 1
      }
    } else {
      // 新增
      files.push(new_file)
    }

    new_file = files[index]
  } else {
    revokeBlob(files_value.value as UploadFile | null)
    files_value.value = new_file
  }

  if (props.autoUpload) {
    // defineModel 有延迟
    await nextTick()

    // 自动上传
    setModelValue(new_file, {
      loading: true,
    })
    try {
      const result = await handleUploadFile(file)

      setModelValue(new_file, {
        path: result.path,
        id: result.id,
        loading: false,
      })

      emits('upload-finish', result.id)
    } catch (e) {
      error(e as string, '文件上传失败')
    }
  } else {
    setModelValue(new_file, {
      file,
    })
  }
}

function setModelValue(new_file: UploadFile, row: Record<string, any>) {
  if (props.multiple) {
    Object.keys(row).forEach((key) => {
      new_file[key] = row[key]

      if (key === 'loading' && row[key] === false)
        delete new_file[key]
    })
  } else {
    const fileVal = files_value.value as UploadFile
    Object.keys(row).forEach((key) => {
      fileVal[key] = row[key]

      if (key === 'loading' && row[key] === false)
        delete fileVal[key]
    })
  }
}

/**
 * 上传
 */
const progress_percent = ref(0)
const show_progress = ref(false)

interface UploadResult {
  path: string
  id: string
  [key: string]: any
}

async function handleUploadFile(file: File): Promise<UploadResult> {
  if (!uploadFile) {
    throw new Error('未配置上传接口')
  }

  // 开始上传
  emits('upload-start')

  // 打开进度条
  if (props.progress) {
    show_progress.value = true
    progress_percent.value = 0
  }

  // 上传
  let result
  try {
    result = await uploadFile(file, {
      onProgress(e: ProgressEvent) {
        // e.total 为 0 时算出 Infinity，parseInt 后变成 NaN
        const percent = e.total > 0 ? Math.min(100, Math.round((e.loaded / e.total) * 100)) : 0
        progress_percent.value = percent
      },
    })
  } finally {
    // 失败时也要收起进度条，否则会一直挂着
    show_progress.value = false
    progress_percent.value = 0
  }

  // 上传成功
  const uploaded = Array.isArray(result) ? result[0] : result
  if (uploaded) {
    return uploaded
  }

  throw new Error('上传失败')
}

// 触发组件所需参数
const trigger_config = computed<UploadConfig>(() => {
  return {
    multiple: props.multiple,
    files: files_value.value as UploadFile | UploadFile[] | null,
    maxCount: props.maxCount,
    type: props.type,
    suffix: props.suffix,
    disabled: props.disabled,
    noPreview: props.noPreview,
  }
})

// 判断是否只有图片和视频
const is_only_video_image = computed(() => {
  const _file_type = getAllType(props.type, props.suffix) || []
  for (let i = 0; i < _file_type.length; i++) {
    if ([...AUDIO_SUFFIX, ...FILE_SUFFIX].includes(_file_type[i]))
      return false
  }
  return true
})

provide('is_only_video_image', is_only_video_image)

defineExpose({
  handleReupload,
  handleDel,
})
</script>

<template>
  <div v-bind="$attrs" class="mu-upload-wrapper" :class="{ 'mu-upload-flex-style': _list_type === 'card', 'mu-upload-multiple-margin': multiple }">
    <template v-if="!noPreview">
      <preview-comp v-if="!slots.preview" :file="files_value ?? undefined" :list-type="_list_type" @delete="handleDel" @re-upload="handleReupload" />
      <slot v-else name="preview" :files="files_value" />
    </template>

    <trigger-comp v-if="!readonly" ref="trigger_ref" :config="trigger_config" :trigger-type="_trigger_type" @select-file="handleSelect">
      <template v-if="slots.default" #trigger>
        <slot />
      </template>
    </trigger-comp>
  </div>

  <!-- 上传进度条 -->
  <upload-progress v-if="progress" :show="show_progress" :progress="progress_percent">
    <template v-if="slots.progress" #default="{ percentage }">
      <slot name="progress" :percentage="percentage" />
    </template>
  </upload-progress>
</template>
