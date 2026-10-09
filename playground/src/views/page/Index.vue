<script setup lang="ts">
import CompLineWrapper from '@comp/common/CompLineWrapper.vue'
import CompPageWrapper from '@comp/common/CompPageWrapper.vue'
import { MuPage } from '@muyianking/ui'
import { reactive } from 'vue'

const query = reactive({ limit: 20, page: 1 })
const table = reactive({ count: 100 })

function getData() {
  // noop
}
</script>

<template>
  <comp-page-wrapper>
    <comp-line-wrapper label="分页">
      <div>
        <div>
          <div>page：{{ query.page }}</div>
          <div>size：{{ query.limit }}</div>
          <div>count：{{ table.count }}</div>
        </div>
        <mu-page v-model="query.page" :size="query.limit" :count="table.count" @change="getData" />
      </div>
    </comp-line-wrapper>

    <comp-line-wrapper label="带尺寸切换">
      <mu-page v-model="query.page" v-model:size="query.limit" :count="table.count" sizes @change="getData" />
    </comp-line-wrapper>
  </comp-page-wrapper>
</template>

<style scoped></style>
