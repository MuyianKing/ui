<script setup lang="ts">
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
  <div class="p-[10px] h-full w-full">
    <div class="bg-white w-full p-4 rounded-lg shadow-lg ">
      <div class="wrapper">
        <div class="block-title">
          单选
        </div>
        <mu-select v-model="model.test" :options />
      </div>

      <div class="wrapper">
        <div class="block-title">
          多选
        </div>
        <mu-select v-model="model.test2" :options multiple />
      </div>

      <div class="wrapper">
        <div class="block-title">
          提示信息
        </div>
        <mu-select v-model="model.test2" :options multiple placeholder="请选择测试" />
      </div>

      <div class="wrapper">
        <div class="block-title">
          全部
        </div>
        <mu-select v-model="model.test" :options all />
      </div>

      <div class="wrapper">
        <div class="block-title">
          loading
        </div>
        <mu-select v-model="model.test" :options="[]" loading />
      </div>

      <div class="wrapper">
        <div class="block-title">
          禁用选项
        </div>
        <mu-select v-model="model.test" :options :disabled-options="[1]" />
      </div>

      <div class="wrapper">
        <div class="block-title">
          只读
        </div>
        <mu-select :model-value="1" :options readonly />
      </div>

      <div class="wrapper">
        <div class="block-title">
          多选只读
        </div>
        <mu-select :model-value="[1, 2]" multiple :options readonly />
      </div>

      <div class="wrapper">
        <div class="block-title">
          禁用
        </div>
        <mu-select :options disabled />
      </div>

      <div class="wrapper">
        <div class="block-title">
          选项分组
        </div>
        <mu-select :options="group_options" />
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.wrapper {
  @apply flex items-center mt-4;

  &:first-child {
    @apply mt-0;
  }
}

.block-title {
  @apply mb-1 text-lg flex-shrink-0 mr-2 w-[70px];
}
</style>
