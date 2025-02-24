<script setup lang="ts">
import CompLineWrapper from '@comp/common/CompLineWrapper.vue'
import CompPageWrapper from '@comp/common/CompPageWrapper.vue'
import { MuContextMenu, MuContextMenuItem } from '@muyianking/components'
import { ref } from 'vue'

const options = [{
  icon: 'zondicons:add-outline',
  label: '添加',
}, {
  icon: 'ep:delete',
  label: '删除',
}]

const context_menu_ref = ref()
const context_menu_custom_ref = ref()
const context_menu_mul_ref = ref()

function handleContextMenu(_ref: any) {
  _ref.toggle({
    type: 1,
  })
}

function handleSelected(row: any) {
  console.log(row)
}
</script>

<template>
  <comp-page-wrapper>
    <comp-line-wrapper label="基础用法">
      <div class="right-click-wrapper" @contextmenu.prevent="handleContextMenu(context_menu_ref)">
        右击区域
      </div>
      <mu-context-menu ref="context_menu_ref" :options @click="handleSelected" />
    </comp-line-wrapper>

    <comp-line-wrapper label="自定义选项">
      <div class="right-click-wrapper" @contextmenu.prevent="handleContextMenu(context_menu_custom_ref)">
        右击区域
      </div>
      <mu-context-menu ref="context_menu_custom_ref" @click="handleSelected">
        <mu-context-menu-item>
          测试1
        </mu-context-menu-item>
        <mu-context-menu-item>
          测试2
        </mu-context-menu-item>
      </mu-context-menu>
    </comp-line-wrapper>

    <comp-line-wrapper label="自定义选项与options选项结合">
      <div class="right-click-wrapper" @contextmenu.prevent="handleContextMenu(context_menu_mul_ref)">
        右击区域
      </div>
      <mu-context-menu ref="context_menu_mul_ref" :options @click="handleSelected">
        <mu-context-menu-item v-slot="row">
          测试{{ row.label }}
        </mu-context-menu-item>
        <mu-context-menu-item v-slot="row">
          测试{{ row.label }}
        </mu-context-menu-item>
      </mu-context-menu>
    </comp-line-wrapper>
  </comp-page-wrapper>
</template>

<style lang='scss' scoped>
.right-click-wrapper {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: gray;
  background-color: #f7f7f7;
}
</style>
