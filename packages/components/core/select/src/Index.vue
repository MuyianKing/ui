<script setup lang="ts">
import { ElOption, ElOptionGroup, ElSelect, vLoading } from 'element-plus'
import { computed, getCurrentInstance } from 'vue'

const props = withDefaults(defineProps<{
  options?: any[]
  placeholder?: string
  clearable?: boolean
  all?: boolean
  loading?: boolean
  disabledOptions?: string | any[] | number | boolean
  readonly?: boolean
  disabled?: boolean
  modelValue?: any
}>(), {
  options: () => [],
  placeholder: '',
  clearable: true,
  all: false,
  loading: false,
  disabledOptions: () => [],
  readonly: false,
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: any): void
  (e: 'change', val: any): void
}>()

const model = defineModel()

const placeholderText = computed(() => {
  if (props.readonly)
    return ''
  if (props.placeholder)
    return props.placeholder
  const instance = getCurrentInstance()
  const label = (instance?.parent?.props as any)?.label
  if (label)
    return `请选择${label.replace('：', '').replace(':', '')}`
  return '请选择'
})

function handleChange(val: any) {
  emit('change', val)
}

const disabledOptionsList = computed(() =>
  props.disabledOptions
    ? Array.isArray(props.disabledOptions)
      ? props.disabledOptions
      : [props.disabledOptions]
    : [],
)
</script>

<template>
  <el-select v-model="model" class="mu-select" :class="[{ 'mu-select-readonly-item': readonly }]" :disabled="readonly || disabled" :loading :placeholder="placeholderText" :clearable filterable @change="handleChange">
    <template #loading>
      <div v-loading="loading" element-loading-text="加载中..." class="mu-select-loading-item" />
    </template>
    <template #default>
      <div class="mu-select-options">
        <el-option v-if="all" value="">
          全部
        </el-option>
        <!-- 分组 -->
        <template v-for="item in options" :key="item.value">
          <el-option-group v-if="item.children" :label="item.label">
            <el-option v-for="child in item.children" :key="typeof child.value === 'boolean' ? +child.value : child.value" :label="child.label" :value="child.value" :disabled="disabledOptionsList.includes(item.value)" />
          </el-option-group>
          <el-option v-else :key="item.value" :label="item.label" :value="item.value" :disabled="disabledOptionsList.includes(item.value)" />
        </template>
      </div>
    </template>
  </el-select>
</template>
