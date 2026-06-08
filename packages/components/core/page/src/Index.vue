<script setup lang="ts">
import { ElPagination } from 'element-plus'
import { computed } from 'vue'

defineOptions({ name: 'MuPage' })

const props = withDefaults(defineProps<{
  modelValue?: number
  count?: number
  size?: number
  sizes?: boolean
  pagerCount?: number
}>(), {
  modelValue: 1,
  count: 0,
  size: 20,
  sizes: false,
  pagerCount: 7,
})

const emit = defineEmits<{
  (e: 'update:modelValue', val: number): void
  (e: 'update:size', val: number): void
  (e: 'change'): void
}>()

function handlePageChange(val: number) {
  emit('update:modelValue', val)
  emit('change')
}

function handleSizeChange(val: number) {
  emit('update:size', val)
  emit('change')
}

const firstNum = computed(() => props.size * (props.modelValue - 1) + 1)
const lastNum = computed(() =>
  props.count > props.size * props.modelValue
    ? props.modelValue * props.size
    : props.count,
)

const layout = computed(() => {
  let l = 'prev, pager, next'
  if (props.sizes)
    l = `sizes,${l}`
  return l
})
</script>

<template>
  <div v-if="count" class="mu-pagination-wrapper">
    <div v-if="lastNum" class="info">
      <span>共</span>
      <span class="num">{{ count }}</span>
      <span>条，当前第</span>
      <span class="num">{{ firstNum }}<template v-if="firstNum !== lastNum">~{{ lastNum }}</template></span>
      <span>条</span>
    </div>
    <el-pagination :current-page="modelValue"
                   :pager-count="pagerCount"
                   :layout
                   :page-size="size"
                   :total="count"
                   background
                   hide-on-single-page
                   @update:current-page="handlePageChange"
                   @update:page-size="handleSizeChange"
    />
  </div>
</template>
