<script setup lang="ts">
import CompLineWrapper from '@comp/common/CompLineWrapper.vue'
import CompPageWrapper from '@comp/common/CompPageWrapper.vue'
import { MuSelectRemote } from '@muyianking/ui'
import { ref } from 'vue'

// MuSelectRemote 的 server 契约是「resolve 一个数组」，不是 { count, data }；
// 组件内部直接把返回值赋给 options 并逐项取 label_key / value_key。
async function getData(query: any) {
  if (query?.query) {
    return [{ label: query.query, value: crypto.randomUUID() }]
  }

  const data = []
  for (let i = 0; i < 20; i++) {
    data.push({ label: `label${i}`, value: i })
  }

  return data
}

const test = ref(0)
const test2 = ref([1, 2])

const data_config = { label_key: 'label', value_key: 'value' }
</script>

<template>
  <comp-page-wrapper>
    <comp-line-wrapper label="单选">
      <mu-select-remote v-model="test" :server="getData" :data-config="data_config" />
    </comp-line-wrapper>

    <comp-line-wrapper label="多选">
      <mu-select-remote v-model="test2" :server="getData" multiple :data-config="data_config" />
    </comp-line-wrapper>
  </comp-page-wrapper>
</template>

<style scoped>
</style>
