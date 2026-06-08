<script setup lang="ts">
import CompLineWrapper from '@comp/common/CompLineWrapper.vue'
import CompPageWrapper from '@comp/common/CompPageWrapper.vue'
import { MuButton, MuDialog } from '@muyianking/ui'
import { ref } from 'vue'

const show = ref(false)
</script>

<template>
  <comp-page-wrapper>
    <comp-line-wrapper label="弹窗">
      <mu-button @click="show = true">
        打开弹窗
      </mu-button>
      <mu-dialog v-model="show" title="弹窗" top="50px" width="700px" style="--padding: 0;">
        <div style="height: 200vh;">
          test
        </div>
        <template #footer>
          <mu-button>提交</mu-button>
        </template>
      </mu-dialog>
    </comp-line-wrapper>
  </comp-page-wrapper>
</template>

<style scoped>
</style>
