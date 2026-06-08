<script setup lang="ts">
import { ElOption, ElSelect } from 'element-plus'
import { ref, useAttrs, watch } from 'vue'

defineOptions({ name: 'MuSelectRemote' })

const props = withDefaults(defineProps<{
  server?: (params: any) => Promise<any[]>
  all?: boolean
  params?: Record<string, any>
  queryConfig?: Record<string, string>
  dataConfig?: Record<string, string>
}>(), {
  server: undefined,
  all: false,
  params: () => ({}),
  queryConfig: () => ({ id_key: 'id', query_key: 'query' }),
  dataConfig: () => ({ label_key: 'name', value_key: 'id', extend_keys: [] }),
})

const attrs = useAttrs() as Record<string, any>
const model = defineModel<any>()

const loading = ref(false)
const options = ref<any[]>([])
const searchQuery = ref('')
const hasMore = ref(true)
const page = ref(1)
const pageSize = 50

async function loadData(query?: string) {
  if (!props.server)
    return
  loading.value = true
  try {
    const result = await props.server({
      [props.queryConfig.query_key]: query || '',
      page: query ? 1 : page.value,
      pageSize,
      ...props.params,
    })
    if (query || page.value === 1) {
      options.value = result
    } else {
      options.value = [...options.value, ...result]
    }
    hasMore.value = result.length >= pageSize
  } finally {
    loading.value = false
  }
}

function remoteMethod(query: string) {
  searchQuery.value = query
  page.value = 1
  loadData(query)
}

// Load initial data if there's a modelValue for display
watch(() => attrs.modelValue, (val) => {
  if (val && options.value.length === 0) {
    loadData()
  }
}, { immediate: true })
</script>

<template>
  <el-select v-model="model"
             v-bind="$attrs"
             remote
             filterable
             :loading
             :remote-method="remoteMethod"
             @visible-change="(visible: boolean) => { if (visible && options.length === 0) loadData() }"
  >
    <el-option v-if="all" value="">
      全部
    </el-option>
    <el-option v-for="item in options"
               :key="item[dataConfig.value_key]"
               :label="item[dataConfig.label_key]"
               :value="item[dataConfig.value_key]"
    />
  </el-select>
</template>
