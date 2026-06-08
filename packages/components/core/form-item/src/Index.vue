<script setup lang="ts">
import { ElFormItem } from 'element-plus'
import { computed, getCurrentInstance, onMounted, ref } from 'vue'

defineOptions({ name: 'MuFormItem' })

const props = withDefaults(defineProps<{
  info?: string
  required?: boolean
  idCard?: boolean
  email?: boolean
  integer?: boolean
  number?: boolean
  phone?: boolean
  carNum?: boolean
  ip?: boolean
  port?: boolean
  maxLength?: string | number
  minLength?: string | number
  uploadLoading?: boolean
  minCount?: number
  minCountMsg?: string
  trigger?: string
  rules?: any[] | null
  label?: string
  labelWidth?: string | number
}>(), {
  info: '',
  required: false,
  idCard: false,
  email: false,
  integer: false,
  number: false,
  phone: false,
  carNum: false,
  ip: false,
  port: false,
  maxLength: '',
  minLength: 0,
  uploadLoading: false,
  minCount: 0,
  minCountMsg: '',
  trigger: 'change',
  rules: null,
  label: '',
  labelWidth: '',
})

const instance = getCurrentInstance()
const info = ref('')

onMounted(() => {
  const el = instance?.vnode?.el as HTMLElement
  const content = el?.querySelector?.('.el-form-item__content')
  if (content) {
    if (content.querySelector('.el-input') || content.querySelector('.el-textarea')) {
      info.value = '请输入'
    } else {
      info.value = '请选择'
    }
  }
})

// Custom validators
function validateMaxLength(_rule: any, value: any, callback: (error?: Error) => void) {
  const max = Number.parseFloat(String(props.maxLength))
  if (!Number.isNaN(max) && value?.toString().length > max) {
    callback(new Error(`最大长度为${max}`))
  }
  callback()
}

function validateMinLength(_rule: any, value: any, callback: (error?: Error) => void) {
  const min = Number.parseFloat(String(props.minLength))
  if (!Number.isNaN(min) && value?.toString().length < min) {
    callback(new Error(`最小长度为${min}`))
  }
  callback()
}

function validateNumber(_rule: any, value: any, callback: (error?: Error) => void) {
  if (Number.isNaN(+value)) {
    callback(new Error('请输入数字'))
  }
  callback()
}

function validateUploadLoading(_rule: any, value: any, callback: (error?: Error) => void) {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      if (value[i].loading) {
        callback(new Error('请等待文件上传'))
      }
    }
  } else if (value?.loading) {
    callback(new Error('请等待文件上传'))
  }
  callback()
}

function validateMinCount(_rule: any, value: any, callback: (error?: Error) => void) {
  if (Array.isArray(value) && value.length < +props.minCount) {
    callback(new Error(props.minCountMsg || `最少${props.minCount}个`))
  }
  callback()
}

const mergedRules = computed(() => {
  const rulesList: any[] = []

  if (props.rules) {
    rulesList.push(...(Array.isArray(props.rules) ? [...props.rules] : [props.rules]))
  }

  const msg = `${props.info || info.value || '请输入'}${props.label?.replace('：', '').replace(':', '')}`
  const trigger = props.trigger

  if (props.required)
    rulesList.push({ required: true, message: msg, trigger })
  if (props.idCard)
    rulesList.push({ validator: () => { }, trigger })
  if (props.phone)
    rulesList.push({ validator: () => { }, trigger })
  if (props.carNum)
    rulesList.push({ validator: () => { }, trigger })
  if (props.integer)
    rulesList.push({ validator: () => { }, trigger })
  if (props.ip)
    rulesList.push({ validator: () => { }, trigger })
  if (props.port)
    rulesList.push({ validator: () => { }, trigger })
  if (props.minLength)
    rulesList.push({ validator: validateMinLength, trigger })
  if (props.maxLength)
    rulesList.push({ validator: validateMaxLength, trigger })
  if (props.number)
    rulesList.push({ validator: validateNumber, trigger })
  if (props.email)
    rulesList.push({ validator: () => { }, trigger })
  if (props.uploadLoading)
    rulesList.push({ validator: validateUploadLoading, trigger })
  if (props.minCount > 0)
    rulesList.push({ validator: validateMinCount, trigger })

  return rulesList
})

const labelWidthComp = computed(() => {
  if (props.labelWidth) {
    if (props.labelWidth === 'fit')
      return `calc(${props.label.length}em + 15px)`
    return props.labelWidth
  }

  if (instance) {
    return instance.parent?.props.labelWidth as string | number
  }

  return ''
})
</script>

<template>
  <el-form-item :rules="mergedRules" :label-width="labelWidthComp" :label>
    <template v-if="$slots.label" #label>
      <slot name="label" />
    </template>
    <template v-if="$slots.error" #error>
      <slot name="error" />
    </template>
    <slot />
  </el-form-item>
</template>
