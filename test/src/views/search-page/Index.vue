<script setup lang="ts">
import CompPageWrapper from '@comp/common/CompPageWrapper.vue'
import { MuSearchPage } from '@muyianking/ui'
import { ElButton, ElFormItem, ElInput } from 'element-plus'
</script>

<template>
  <comp-page-wrapper>
    <mu-search-page>
      <template #header>
        <el-form-item label="测试">
          <el-input placeholder="请输入" />
        </el-form-item>
      </template>
      <template #button>
        <el-button type="danger">
          查询
        </el-button>
        <el-button type="primary">
          test
        </el-button>
      </template>
    </mu-search-page>
  </comp-page-wrapper>
</template>

<style scoped></style>
