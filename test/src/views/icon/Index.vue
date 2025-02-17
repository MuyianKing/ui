<script setup lang="ts">
import CompLineWrapper from '@comp/common/CompLineWrapper.vue'
import CompPageWrapper from '@comp/common/CompPageWrapper.vue'
import { MuIcon } from '@muyianking/components'
</script>

<template>
  <comp-page-wrapper>
    <comp-line-wrapper label="基础用法">
      <mu-icon icon="material-symbols:10mp" />
    </comp-line-wrapper>

    <comp-line-wrapper label="设置大小">
      <mu-icon icon="material-symbols:10mp" size="40" />
      <mu-icon icon="material-symbols:10mp" style="font-size: 40px;" />
    </comp-line-wrapper>

    <comp-line-wrapper label="设置颜色">
      <mu-icon icon="material-symbols:10mp" color="red" />
      <mu-icon icon="material-symbols:10mp" style="color: red;" />
    </comp-line-wrapper>
  </comp-page-wrapper>
</template>

<style lang='scss' scoped></style>
