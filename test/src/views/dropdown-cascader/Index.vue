<script setup lang="ts">
import CompLineWrapper from '@comp/common/CompLineWrapper.vue'
import CompPageWrapper from '@comp/common/CompPageWrapper.vue'
import { MuDropdownCascader } from '@muyianking/ui'
import { ElFormItem } from 'element-plus'
import { ref } from 'vue'

const options = [
  {
    label: '测试1',
    value: 1,
    children: [
      {
        label: '测试1-1',
        value: 11,
        children: [
          { label: '测试1-1-1', value: 111 },
          { label: '测试1-1-2', value: 112 },
        ],
      },
      { label: '测试1-2', value: 12 },
    ],
  },
  { label: '测试2', value: 2 },
]

const test = ref()
const mul_value = ref([])
</script>

<template>
  <comp-page-wrapper>
    <comp-line-wrapper label="基本用法">
      <el-form-item label="下拉">
        <mu-dropdown-cascader v-model="test" :options label="下拉" />
      </el-form-item>
    </comp-line-wrapper>

    <comp-line-wrapper label="多选">
      <el-form-item label="下拉">
        <mu-dropdown-cascader v-model="mul_value" :options multiple label="下拉" no-all :cascader-props="{ checkStrictly: false }" />
      </el-form-item>
    </comp-line-wrapper>
  </comp-page-wrapper>
</template>

<style scoped>
</style>
