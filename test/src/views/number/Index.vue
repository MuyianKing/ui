<script setup lang="ts">
import CompLineWrapper from '@comp/common/CompLineWrapper.vue'
import CompPageWrapper from '@comp/common/CompPageWrapper.vue'
import { MuNumber } from '@muyianking/ui'
</script>

<template>
  <comp-page-wrapper>
    <div class="flex flex-col">
      <mu-number class="my-2" :num="9998" />
      <mu-number class="my-2" :num="456383" />
      <mu-number class="my-2" :num="999998" />
      <mu-number class="my-2" :num="99999998" />
      <mu-number class="my-2" :num="999999998" />
      <mu-number class="my-2" :num="9999999998" />
      <mu-number class="my-2" :num="999999999998" />
    </div>
  </comp-page-wrapper>
</template>

<style scoped></style>
