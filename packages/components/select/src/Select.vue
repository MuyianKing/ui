<script setup lang="ts">
import { ElOption, ElOptionGroup, ElSelect, vLoading } from 'element-plus'
import { computed, getCurrentInstance } from 'vue'
import { OptionsType, OptionsValue } from "./Select.ts"

defineOptions({
  name: 'MuSelect'
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
  (e: 'change', val: OptionsValue): void
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


const modelValue = defineModel<OptionsValue>()

function change(val: OptionsValue) {
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
  <el-select v-model="modelValue" :disabled="readonly || disabled" :placeholder="placeholder_comp" :clearable="clearable" filterable :class="{ 'hl-select-readonly-item': readonly }" @change="change">
    <div class="relative">
      <el-option v-if="all" value="">
        全部
      </el-option>

      <!-- 分组 -->
      <template v-for="item in options" :key="item.value">
        <template v-if="item.children">
          <el-option-group :label="item.label">
            <el-option v-for="child in item.children" :key="child.value" :label="child.label" :value="child.value" :disabled="_d_p.includes(item.value)" />
          </el-option-group>
        </template>

        <el-option v-else :label="item.label" :value="item.value" :disabled="_d_p.includes(item.value)" />
      </template>
    </div>
    <div v-loading="loading" class="hl-select-loading-item" />
  </el-select>
</template>
