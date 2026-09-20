<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { ElButton, ElPopover, vLoading } from 'element-plus'
import { inject, onMounted, reactive, ref, useTemplateRef } from 'vue'
import { MuIcon } from '../../icon'
import { MuInput } from '../../input'

defineOptions({ name: 'MuIconSelect' })

withDefaults(defineProps<{
  placeholder?: string
  title?: string
  teleported?: boolean
  width?: string
  trigger?: 'click' | 'focus' | 'hover' | 'contextmenu'
}>(), {
  placeholder: '请选择图标',
  title: '',
  teleported: true,
  width: '440px',
  trigger: 'click',
})

const model = defineModel<any>()

const globalConfig = inject<{ getIcons?: (query: any) => Promise<{ data: any[], count: number }> }>('GLOBAL_CUSTOM_CONFIG')

const query = reactive({
  limit: 200,
  page: 1,
  query: '',
})

const loading = ref(false)
const tableData = reactive({
  data: [] as any[],
  hasMore: true,
})

// 连续输入或滚动时会并发多个请求，用令牌丢弃过期响应，否则旧结果会覆盖新结果
let request_token = 0

async function getData(config?: { append?: boolean }) {
  if (!globalConfig?.getIcons)
    return
  if (!config?.append)
    tableData.data = []
  const token = ++request_token
  loading.value = true
  try {
    const result = await globalConfig.getIcons(query)
    if (token !== request_token)
      return
    result.data.forEach((icon: any) => tableData.data.push(icon))
    tableData.hasMore = result.count > query.page * query.limit
  } finally {
    if (token === request_token)
      loading.value = false
  }
}

const search = useDebounceFn(() => {
  query.page = 1
  getData()
}, 300)

function handleBottom() {
  // 缺少 loading 判断时，滚动可以并发触发同一页被 push 两次
  if (loading.value || !tableData.hasMore)
    return
  query.page++
  getData({ append: true })
}

const popoverRef = useTemplateRef<InstanceType<typeof ElPopover>>('popoverRef')

function handleSubmit() {
  popoverRef.value?.hide()
}

function handleClear() {
  model.value = ''
  popoverRef.value?.hide()
}

function handleClick(icon: any) {
  model.value = icon
}

onMounted(() => getData())
</script>

<template>
  <div class="mu-icon-select">
    <el-popover ref="popoverRef"
                placement="bottom-start"
                :title
                :width
                :trigger
                :teleported
    >
      <template #reference>
        <div class="flex items-center cursor-pointer">
          <span v-if="!model" class="placeholder-item">{{ placeholder }}</span>
          <mu-icon class="ml-2" :icon="model" style="font-size: 26px" />
        </div>
      </template>
      <div class="mu-icons-wrapper">
        <mu-input v-model="query.query" placeholder="请输入名称搜索，仅支持英文" @input="search" />
        <div v-loading="loading" class="icon-content" @scroll.passive="handleBottom">
          <div v-for="item in tableData.data"
               :key="item"
               class="icon-item"
          >
            <mu-icon :icon="item" size="22px" @click="handleClick(item)" />
          </div>
        </div>
        <div class="btn-wrapper">
          <el-button type="danger" size="small" @click="handleClear">
            清除
          </el-button>
          <el-button type="primary" size="small" @click="handleSubmit">
            确定
          </el-button>
        </div>
      </div>
    </el-popover>
  </div>
</template>
