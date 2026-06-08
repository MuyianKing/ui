<script setup lang="ts">
import CompPageWrapper from '@comp/common/CompPageWrapper.vue'
import { MuGridLayout } from '@muyianking/ui'
</script>

<template>
  <comp-page-wrapper>
    <mu-grid-layout :width="300" :min-width="300" class="flex-1 overflow-auto">
      <div v-for="index in 30" :key="index" class="grid-item">
        {{ index }}
      </div>
    </mu-grid-layout>
  </comp-page-wrapper>
</template>

<style scoped>
.grid-item {
  height: 250px;
  background-color: #b2b2b2;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
