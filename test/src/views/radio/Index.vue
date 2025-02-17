<script setup lang="ts">
import CompLineWrapper from '@comp/common/CompLineWrapper.vue'
import CompPageWrapper from '@comp/common/CompPageWrapper.vue'
import { MuRadio } from '@muyianking/components'
import { ref } from 'vue'

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

const radio = ref(1)
const radio2 = ref('')
</script>

<template>
  <comp-page-wrapper>
    <comp-line-wrapper label="基础用法">
      <mu-radio v-model="radio" :options />
    </comp-line-wrapper>

    <comp-line-wrapper label="可取消的">
      <mu-radio v-model="radio2" :options empty />
    </comp-line-wrapper>

    <comp-line-wrapper label="独占一行" class="items-baseline">
      <mu-radio v-model="radio" :options line />
    </comp-line-wrapper>

    <comp-line-wrapper label="只读" class="items-baseline">
      <mu-radio v-model="radio" :options readonly />
    </comp-line-wrapper>

    <comp-line-wrapper label="禁用" class="items-baseline">
      <mu-radio v-model="radio" :options disabled />
    </comp-line-wrapper>
  </comp-page-wrapper>
</template>

<style lang='scss' scoped></style>
