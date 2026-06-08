<script setup lang="ts">
import { ElButton, ElForm } from 'element-plus'
import { ref, useTemplateRef } from 'vue'
import { error, success, warning } from '../../../utils/message'
import { MuDialog } from '../../dialog'

defineOptions({ name: 'MuFormDialog' })

const props = withDefaults(defineProps<{
  title?: string
  rules?: Record<string, any>
  model?: Record<string, any> | null
  width?: string | number
  top?: string | number
  submitText?: string
  inline?: boolean
  server?: ((data: any) => Promise<any>) | null
  labelWidth?: string | number
}>(), {
  title: '',
  rules: () => ({}),
  model: null,
  width: '500px',
  top: '150px',
  submitText: '提交',
  inline: false,
  server: null,
  labelWidth: '80px',
})

const emit = defineEmits<{
  (e: 'error'): void
  (e: 'success', data: any): void
  (e: 'refresh', model: any): void
  (e: 'submit'): void
}>()

const show = defineModel<boolean>({ default: false })
const loading = ref(false)
const formRef = useTemplateRef<InstanceType<typeof ElForm>>('formRef')

function close() {
  formRef.value?.clearValidate()
  show.value = false
}

function submit() {
  if (!props.model) {
    warning('MuFormDialog 组件未设置 model 属性')
    return
  }
  formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      const fun = props.server
      if (fun && typeof fun === 'function') {
        loading.value = true
        fun(props.model).then((data) => {
          success('保存成功')
          emit('success', data)
          emit('refresh', props.model)
          close()
        }).catch((e) => {
          error(e, '保存失败')
          emit('error')
        }).finally(() => {
          loading.value = false
        })
      } else {
        emit('submit')
      }
    }
  })
}

defineExpose({
  getFormRef: () => formRef.value,
})
</script>

<template>
  <mu-dialog v-model="show" :title :width :top v-bind="$attrs" @close="close">
    <el-form ref="formRef"
             :class="{ 'mu-form-dialog-inline-form': inline }"
             :model
             :rules
             :label-width="labelWidth"
             scroll-to-error
    >
      <slot />
    </el-form>
    <template #footer>
      <slot name="footer" :submit>
        <el-button type="primary" :loading @click="submit">
          {{ submitText }}
        </el-button>
      </slot>
    </template>
  </mu-dialog>
</template>
