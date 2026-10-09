<script setup lang="ts">
import CompLineWrapper from '@comp/common/CompLineWrapper.vue'
import CompPageWrapper from '@comp/common/CompPageWrapper.vue'
import { MuEditInfo } from '@muyianking/ui'
import { ref } from 'vue'

const test = ref('')
</script>

<template>
  <comp-page-wrapper>
    <comp-line-wrapper label="编辑信息">
      <mu-edit-info v-model="test" />
    </comp-line-wrapper>
  </comp-page-wrapper>
</template>

<style scoped>
</style>
