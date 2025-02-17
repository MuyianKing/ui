<script setup lang="ts">
import type { OptionsType } from '../../types/common.ts'
import { transformBooleanToNum } from '@muyianking/utils/types'
import { ElRadio, ElRadioGroup } from 'element-plus'
import { computed } from 'vue'

const props = defineProps({
  options: {
    type: Array<OptionsType>,
    default() {
      return []
    },
  },
  empty: {
    type: Boolean,
    default() {
      return false
    },
  },
  // 每个选项是否一行显示
  line: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const model = defineModel<string | number | boolean>({
  default() {
    return ''
  },
})

async function handleClick() {
  if (props.readonly) {
    return
  }

  if (!props.empty) {
    return
  }

  const last_val = model.value
  setTimeout(() => {
    // 如果上一次选中的值和当前点击的一致
    if (last_val && last_val === model.value) {
      model.value = ''
    }
  })
}

const _options = computed(() => {
  // 只读：只渲染已选的
  if (props.readonly) {
    if (model.value === '') {
      return []
    }

    // 返回已选的
    return props.options.filter(item => item.value === model.value)
  }

  return props.options
})
</script>

<template>
  <el-radio-group v-model="model" class="mu-radio" :class="{ 'mu-radio-line-item': line, 'mu-radio-readonly-group': readonly }" :disabled="disabled || readonly">
    <el-radio v-for="item in _options" :key="transformBooleanToNum(item.value)" :value="item.value" @click="handleClick">
      {{ item.label }}
    </el-radio>
  </el-radio-group>
</template>
