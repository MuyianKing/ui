<script setup lang="ts">
import CompLineWrapper from '@comp/common/CompLineWrapper.vue'
import CompPageWrapper from '@comp/common/CompPageWrapper.vue'
import { MuButton, MuIcon, MuUpload } from '@muyianking/ui'
import { ref } from 'vue'

const image = ref({
  f1: { id: 'P1723702204773gL', name: '微信图片_20240302181524.jpg', path: '2024/8/15/P1723702204773gL.jpg' },
  f2: [
    { id: 'P17237022130930e', name: '微信图片_20240302181524.jpg', path: '2024/8/15/P17237022130930e.jpg' },
    { id: 'P1723702215611sw', name: '微信图片_20240302181524.jpg', path: '2024/8/15/P1723702215611sw.jpg' },
  ],
  f3: { id: 'N1723702291155Ks', name: '自定义任务-设计文档.docx', path: '2024/8/15/N1723702291155Ks.docx' },
  f4: [
    { id: 'N1723702293294kX', name: '自定义任务-设计文档.docx', path: '2024/8/15/N1723702293294kX.docx' },
    { id: 'N1723702295325CK', name: '自定义任务-设计文档.docx', path: '2024/8/15/N1723702295325CK.docx' },
  ],
  f5: { id: 'N1723702298919vV', name: '自定义任务-设计文档.docx', path: '2024/8/15/N1723702298919vV.docx' },
  f6: [
    { id: 'N1723702303785tM', name: '自定义任务-设计文档.docx', path: '2024/8/15/N1723702303785tM.docx' },
    { id: 'P17237023077576v', name: '微信图片_20240302181524.jpg', path: '2024/8/15/P17237023077576v.jpg' },
  ],
})

const upload_ref = ref()
function handleReUpload(row: any) {
  upload_ref.value.handleReupload(row)
}

function handleDel(row: any) {
  upload_ref.value.handleDel(row)
}

function handleFinish() {
  // noop
}
</script>

<template>
  <comp-page-wrapper>
    <comp-line-wrapper label="单选附件">
      <mu-upload v-model="image.f1" />
    </comp-line-wrapper>

    <comp-line-wrapper label="多选附件">
      <mu-upload v-model="image.f2" multiple />
    </comp-line-wrapper>

    <comp-line-wrapper label="单选文件">
      <mu-upload v-model="image.f3" type="file" />
    </comp-line-wrapper>

    <comp-line-wrapper label="多选文件">
      <mu-upload v-model="image.f4" multiple type="file" />
    </comp-line-wrapper>

    <comp-line-wrapper label="单选各种文件">
      <mu-upload v-model="image.f5" type="all" />
    </comp-line-wrapper>

    <comp-line-wrapper label="多选各种文件">
      <mu-upload v-model="image.f6" multiple type="all" suffix="apk" />
    </comp-line-wrapper>

    <comp-line-wrapper label="自定义触发">
      <mu-upload no-preview progress @upload-finish="handleFinish">
        <mu-button>导入</mu-button>
      </mu-upload>
    </comp-line-wrapper>

    <comp-line-wrapper label="自定义预览">
      <mu-upload ref="upload_ref" v-model="image.f6" multiple trigger-type="line">
        <template #preview="{ files }">
          <div v-for="file in files" :key="file.id" class="flex items-center">
            <span @click="handleReUpload(file)">{{ file.name }}</span>
            <mu-icon icon="ph:trash-bold" @click="handleDel(file)" />
          </div>
        </template>
      </mu-upload>
    </comp-line-wrapper>
  </comp-page-wrapper>
</template>

<style scoped>
</style>
