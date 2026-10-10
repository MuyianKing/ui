<script setup lang="ts">
import type { ComponentSize } from 'element-plus'
import { ElForm, vLoading } from 'element-plus'
import { computed, ref } from 'vue'
import IconArrowDown from '~icons/ep/arrow-down'
import { MuButton } from '../../button'

defineOptions({ name: 'MuSearchPage' })

const props = withDefaults(defineProps<{
  formSize?: ComponentSize
  labelWidth?: string | number
  loading?: boolean
  fixedButton?: boolean
  advancedText?: string
  noSearch?: boolean
  tableStyle?: string
  tableClass?: string
  bottomClass?: string
}>(), {
  formSize: 'default',
  labelWidth: 'auto',
  loading: false,
  fixedButton: false,
  advancedText: '高级搜索',
  noSearch: false,
  tableStyle: '',
  tableClass: '',
  bottomClass: '',
})

const showAdvanced = ref(false)

function toggleAdvanced() {
  showAdvanced.value = !showAdvanced.value
}

const bottomClasses = computed(() => {
  const cls: Record<string, boolean> = {}
  props.bottomClass.split(' ').forEach((item) => {
    if (item)
      cls[item] = true
  })
  return cls
})
</script>

<template>
  <div class="flex flex-col h-full mu-search-page">
    <el-form v-if="!noSearch" :size="formSize" :label-width="labelWidth">
      <div class="search-area">
        <slot name="header" />
        <slot v-if="showAdvanced" name="advanced" />
        <div v-if="fixedButton" class="fixed-button">
          <slot name="button" />
        </div>
        <slot v-else name="button" />
        <template v-if="$slots.advanced && advancedText">
          <mu-button mode="text" class="advanced-btn" @click="toggleAdvanced">
            <icon-arrow-down class="mu-search-page-arrow" :class="{ 'up-arrow': showAdvanced }" style="font-size: 18px" />
            {{ advancedText }}
          </mu-button>
        </template>
      </div>
    </el-form>
    <div class="flex-1 bottom" :class="{ 'mt-0': noSearch, ...bottomClasses }">
      <div v-loading="loading" class="table-body" :style="tableStyle" :class="tableClass">
        <slot name="table" />
      </div>
      <div class="flex-shrink-0">
        <slot />
      </div>
    </div>
  </div>
</template>
