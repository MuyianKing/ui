<script setup lang="ts">
import CompLineWrapper from '@comp/common/CompLineWrapper.vue'
import CompPageWrapper from '@comp/common/CompPageWrapper.vue'
import { MuAddButton, MuButton, MuDelButton, MuDetailButton, MuEditButton, MuExportButton, MuImportButton, MuResetButton, MuSearchButton } from '@muyianking/ui'

function handleClick() {
  // noop
}
</script>

<template>
  <comp-page-wrapper>
    <comp-line-wrapper label="正常按钮">
      <mu-button type="danger">
        提交
      </mu-button>
      <mu-button type="primary" plain>
        提交
      </mu-button>
      <mu-button type="warning" loading>
        提交
      </mu-button>
    </comp-line-wrapper>

    <comp-line-wrapper label="预设按钮">
      <mu-search-button />
      <mu-search-button>搜索</mu-search-button>
    </comp-line-wrapper>

    <comp-line-wrapper label="添加按钮">
      <mu-add-button />
      <mu-add-button>创建</mu-add-button>
    </comp-line-wrapper>

    <comp-line-wrapper label="重置按钮">
      <mu-reset-button />
      <mu-reset-button>恢复</mu-reset-button>
    </comp-line-wrapper>

    <comp-line-wrapper label="导出按钮">
      <mu-export-button />
      <mu-export-button text class="ml-4">
        点击导出
      </mu-export-button>
    </comp-line-wrapper>

    <comp-line-wrapper label="导入按钮">
      <mu-import-button />
      <mu-import-button text class="ml-4">
        点击导入
      </mu-import-button>
    </comp-line-wrapper>

    <comp-line-wrapper label="表格按钮">
      <mu-del-button />
      <mu-del-button text class="ml-4" />
      <mu-del-button text="自定义文字" class="ml-4" />
    </comp-line-wrapper>

    <comp-line-wrapper label="编辑按钮">
      <mu-edit-button @click="handleClick" />
      <mu-edit-button text class="ml-4" />
      <mu-edit-button text="自定义文字" class="ml-4" />
    </comp-line-wrapper>

    <comp-line-wrapper label="查看按钮">
      <mu-detail-button @click="handleClick" />
      <mu-detail-button text class="ml-4" />
      <mu-detail-button text="自定义文字" class="ml-4" />
    </comp-line-wrapper>
  </comp-page-wrapper>
</template>

<style scoped>
</style>
