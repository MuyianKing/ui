<script setup lang="ts">
import CompLineWrapper from '@comp/common/CompLineWrapper.vue'
import CompPageWrapper from '@comp/common/CompPageWrapper.vue'
import { MuSelectRemote } from '@muyianking/ui'
import { ref } from 'vue'

async function getData(query: any) {
  if (query.id !== undefined) {
    return {
      count: 1,
      data: (Array.isArray(query.id) ? query.id : [query.id]).map((value: any) => ({
        value,
        label: `init_${value}`,
      })),
    }
  }

  if (query.query !== undefined && query.query !== '') {
    return {
      count: 1,
      data: [{ label: query.query, value: crypto.randomUUID() }],
    }
  }

  const data = []
  for (let i = 0; i < 20; i++) {
    data.push({ label: `label${i}`, value: i })
  }

  return { count: 20, data }
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
