<script setup lang="ts">
import type { Ref } from 'vue'
import { MuSelect } from '@muyianking/components'
import { ref } from 'vue'

const test: Ref<number> = ref(1)

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
</script>

<template>
  <div>
    <mu-select v-model="test"  :options />
  </div>
</template>

<style lang='scss' scoped></style>
