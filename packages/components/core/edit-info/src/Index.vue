<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { ElInput } from 'element-plus'
import { computed, ref } from 'vue'

defineOptions({ name: 'MuEditInfo' })

const props = withDefaults(defineProps<{
  modelValue?: string | number
  width?: string
  align?: string
  editable?: boolean
  placeholder?: string
  triggerInfo?: string
  zeroToEmpty?: boolean
}>(), {
  modelValue: '',
  width: '100%',
  align: 'left',
  editable: true,
  placeholder: '请输入',
  triggerInfo: '双击编辑',
  zeroToEmpty: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: string | number): void
  (e: 'change', val: string | number): void
}>()

const isEditing = ref(false)
const editValue = ref<string | number>('')

const displayValue = computed(() => {
  if (props.zeroToEmpty && (props.modelValue === 0 || props.modelValue === '0'))
    return ''
  return props.modelValue
})

function startEdit() {
  if (!props.editable)
    return
  editValue.value = props.modelValue
  isEditing.value = true
}

const submitEdit = useDebounceFn(() => {
  if (!isEditing.value)
    return
  isEditing.value = false
  if (editValue.value !== props.modelValue) {
    emit('update:modelValue', editValue.value)
    emit('change', editValue.value)
  }
}, 200)
</script>

<template>
  <div class="mu-edit-info" :style="{ width, textAlign: align }">
    <template v-if="isEditing">
      <el-input v-model="editValue"
                :placeholder
                @blur="submitEdit"
      />
    </template>
    <span v-else class="mu-edit-info-text" :title="triggerInfo" @dblclick="startEdit">
      {{ displayValue || placeholder }}
    </span>
  </div>
</template>
