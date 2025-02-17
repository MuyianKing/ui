<script setup lang="ts">
import CompLineWrapper from '@comp/common/CompLineWrapper.vue'
import CompPageWrapper from '@comp/common/CompPageWrapper.vue'
import { MuSelect } from '@muyianking/components'
import { reactive } from 'vue'

const options = [
  {
    label: '测试1',
    value: 1,
  },
  {
    label: '测试2',
    value: 2,
  },
]

const group_options = [
  {
    label: '测试1',
    value: 1,
    children: [
      {
        label: '测试1-1',
        value: 11,
      },
      {
        label: '测试1-2',
        value: 12,
      },
    ],
  },
  {
    label: '测试2',
    value: 2,
  },
]

const model = reactive({
  test: '',
  test2: [],
})
</script>

<template>
  <comp-page-wrapper>
    <comp-line-wrapper label="单选">
      <mu-select v-model="model.test" :options />
    </comp-line-wrapper>

    <comp-line-wrapper label="多选">
      <mu-select v-model="model.test2" :options multiple />
    </comp-line-wrapper>

    <comp-line-wrapper label="提示信息">
      <mu-select v-model="model.test2" :options multiple placeholder="请选择测试" />
    </comp-line-wrapper>

    <comp-line-wrapper label="全部">
      <mu-select v-model="model.test" :options all />
    </comp-line-wrapper>

    <comp-line-wrapper label="loading">
      <mu-select v-model="model.test" :options="[]" loading />
    </comp-line-wrapper>

    <comp-line-wrapper label="禁用选项">
      <mu-select v-model="model.test" :options :disabled-options="[1]" />
    </comp-line-wrapper>

    <comp-line-wrapper label="只读">
      <mu-select :model-value="1" :options readonly />
    </comp-line-wrapper>

    <comp-line-wrapper label="多选只读">
      <mu-select :model-value="[1, 2]" multiple :options readonly />
    </comp-line-wrapper>

    <comp-line-wrapper label="禁用">
      <mu-select :options disabled />
    </comp-line-wrapper>

    <comp-line-wrapper label="选项分组">
      <mu-select :options="group_options" />
    </comp-line-wrapper>
  </comp-page-wrapper>
</template>

<style lang='scss' scoped>
</style>
