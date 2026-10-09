<script setup lang="ts">
import CompLineWrapper from '@comp/common/CompLineWrapper.vue'
import CompPageWrapper from '@comp/common/CompPageWrapper.vue'
import { MuBlockTitle } from '@muyianking/ui'
</script>

<template>
  <comp-page-wrapper>
    <comp-line-wrapper label="渐变">
      <mu-block-title title="测试" linear-gradient />
    </comp-line-wrapper>
    <comp-line-wrapper label="危险">
      <mu-block-title title="测试" type="danger" />
    </comp-line-wrapper>
    <comp-line-wrapper label="成功">
      <mu-block-title title="测试" type="success" />
    </comp-line-wrapper>
  </comp-page-wrapper>
</template>

<style scoped>
</style>
