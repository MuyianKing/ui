<script setup lang="ts">
import CompLineWrapper from '@comp/common/CompLineWrapper.vue'
import CompPageWrapper from '@comp/common/CompPageWrapper.vue'
import { MuDropdown } from '@muyianking/ui'
import { ElFormItem } from 'element-plus'
import { ref } from 'vue'

const options = [
  { label: '测试1', value: 1 },
  { label: '测试2', value: 2 },
]

const test = ref()
const test2 = ref()
const mul_value = ref([])
</script>

<template>
  <comp-page-wrapper>
    <comp-line-wrapper label="基本用法">
      <el-form-item label="下拉">
        <mu-dropdown v-model="test" :options label="下拉" />
      </el-form-item>
    </comp-line-wrapper>

    <comp-line-wrapper label="保持 label">
      <el-form-item label="下拉">
        <mu-dropdown v-model="test2" :options keep-label label="下拉" />
      </el-form-item>
    </comp-line-wrapper>

    <comp-line-wrapper label="多选">
      <el-form-item label="下拉">
        <mu-dropdown v-model="mul_value" :options multiple label="下拉" />
      </el-form-item>
    </comp-line-wrapper>
  </comp-page-wrapper>
</template>

<style scoped>
</style>
