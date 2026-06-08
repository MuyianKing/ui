<script setup lang="ts">
import CompPageWrapper from '@comp/common/CompPageWrapper.vue'
import { MuButton, MuFormItem, MuInput } from '@muyianking/ui'
import { ElForm } from 'element-plus'
import { reactive, ref } from 'vue'

const model = reactive({ name: '', age: '' })

const form_ref = ref()
function submit() {
  form_ref.value.validate()
}
</script>

<template>
  <comp-page-wrapper>
    <el-form ref="form_ref" :model="model" label-width="80px">
      <mu-form-item label="姓名" prop="name" required>
        <mu-input v-model="model.name" />
      </mu-form-item>
      <mu-form-item label="年龄" prop="age" id-card>
        <mu-input v-model="model.age" />
      </mu-form-item>
    </el-form>
    <mu-button @click="submit">
      提交
    </mu-button>
  </comp-page-wrapper>
</template>

<style scoped></style>
