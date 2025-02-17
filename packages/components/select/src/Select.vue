<script setup lang="ts">
import type { OptionsType } from '../../types/common.ts'
import { transformBooleanToNum } from '@muyianking/utils/types'
import { ElOption, ElOptionGroup, ElSelect, vLoading } from 'element-plus'
import { computed, getCurrentInstance } from 'vue'

defineOptions({
  name: 'MuSelect',
})

const props = defineProps({
  options: {
    type: Array<OptionsType>,
    default() {
      return []
    },
  },
  placeholder: {
    type: String,
    default: '',
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  // 显示全部
  all: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  // 禁用的选项：选项值组成的数组
  disabledOptions: {
    type: [String, Array, Number, Boolean],
    default() {
      return []
    },
  },
  // 只读
  readonly: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits<{
  (e: 'change', val: string | number | string[] | number[]): void
}>()

// 提示信息
const placeholder_comp = computed(() => {
  // 只读没有提示
  if (props.readonly) {
    return ''
  }

  if (props.placeholder) {
    return props.placeholder
  }

  const instance = getCurrentInstance()
  if (instance?.parent?.props?.label) {
    return `请选择${(instance.parent.props.label as string).replace('：', '').replace(':', '')}`
  }

  return '请选择'
})

const modelValue = defineModel<string | number | string[] | number[]>()

function change(val: string | number | string[] | number[]) {
  emits('change', val)
}

// 禁用选项
const _d_p = computed(() => {
  if (!props.disabledOptions) {
    return []
  }
  return Array.isArray(props.disabledOptions) ? props.disabledOptions : [props.disabledOptions]
})
</script>

<template>
  <el-select v-model="modelValue" class="mu-select" :disabled="readonly || disabled" :loading :placeholder="placeholder_comp" :clearable="clearable" filterable :class="{ 'mu-select-readonly-item': readonly }" @change="change">
    <div class="mu-select-options">
      <el-option v-if="all" value="">
        全部
      </el-option>

      <!-- 分组 -->
      <template v-for="item in options" :key="item.value">
        <template v-if="item.children">
          <el-option-group :label="item.label">
            <el-option v-for="child in item.children" :key="transformBooleanToNum(child.value)" :label="child.label" :value="child.value" :disabled="_d_p.includes(item.value)" />
          </el-option-group>
        </template>

        <el-option v-else :label="item.label" :value="item.value" :disabled="_d_p.includes(item.value)" />
      </template>
    </div>

    <template #loading>
      <div v-loading="loading" element-loading-text="加载中..." class="mu-select-loading-item" />
    </template>
  </el-select>
</template>
