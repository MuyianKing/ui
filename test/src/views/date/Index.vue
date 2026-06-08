<script setup lang="ts">
import CompLineWrapper from '@comp/common/CompLineWrapper.vue'
import CompPageWrapper from '@comp/common/CompPageWrapper.vue'
import { MuDate, MuResetButton } from '@muyianking/ui'
import { reactive, ref } from 'vue'

const date_obj = reactive({
  start: '2024-10-01',
  end: '2024-12-12',
})

const value = ref('')

function handleClick() {
  date_obj.start = ''
}

const value2 = ref('')
</script>

<template>
  <comp-page-wrapper>
    <comp-line-wrapper label="重置">
      <mu-reset-button no-confirm @click="handleClick" />
    </comp-line-wrapper>

    <comp-line-wrapper label="值显示">
      <div>v-model：{{ value }}</div>
      <div>v-model:start：{{ date_obj.start }}</div>
      <div>v-model:end：{{ date_obj.end }}</div>
    </comp-line-wrapper>

    <comp-line-wrapper label="el日期范围">
      <mu-date v-model="value" v-model:start="date_obj.start" v-model:end="date_obj.end" end-value-format="YYYY-MM-DD 23:59:59" type="el-range" date-type="datetime" />
    </comp-line-wrapper>

    <comp-line-wrapper label="日期范围">
      <mu-date v-model="value" v-model:start="date_obj.start" v-model:end="date_obj.end" end-value-format="YYYY-MM-DD 23:59:59" type="range" date-type="datetime" />
    </comp-line-wrapper>

    <comp-line-wrapper label="默认">
      <mu-date v-model="value2" date-type="datetime" />
    </comp-line-wrapper>
  </comp-page-wrapper>
</template>

<style scoped></style>
