<script setup lang="ts">
import CompPageWrapper from '@comp/common/CompPageWrapper.vue'
import { MuButton, MuFormItem, MuInput } from '@muyianking/ui'
import { ElForm } from 'element-plus'
import { reactive, ref } from 'vue'

const model = reactive({ name: '', age: '' })

const form_ref = ref()
async function submit() {
  // validate() 无回调时返回 Promise，校验不通过会 reject；不接住就是未处理的 rejection
  try {
    await form_ref.value.validate()
  } catch {
    // 校验失败的错误提示由 el-form 自己渲染，这里只需吞掉 rejection
  }
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
