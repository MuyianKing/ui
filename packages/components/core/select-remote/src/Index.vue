<script setup lang="ts">
import { ElOption, ElSelect } from 'element-plus'
import { ref, watch } from 'vue'

defineOptions({ name: 'MuSelectRemote' })

const props = withDefaults(defineProps<{
  server?: (params: any) => Promise<any[]>
  all?: boolean
  params?: Record<string, any>
  queryConfig?: Record<string, string>
  // dataConfig 里要放 extend_keys: []，收窄成 Record<string, string> 会通过不了类型检查
  dataConfig?: Record<string, any>
}>(), {
  server: undefined,
  all: false,
  params: () => ({}),
  queryConfig: () => ({ id_key: 'id', query_key: 'query' }),
  dataConfig: () => ({ label_key: 'name', value_key: 'id', extend_keys: [] }),
})

const model = defineModel<any>()

const loading = ref(false)
const options = ref<any[]>([])
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
    options.value = (query || page.value === 1) ? result : [...options.value, ...result]
  } finally {
    loading.value = false
  }
}

function remoteMethod(query: string) {
  page.value = 1
  loadData(query)
}

// modelValue 已由 defineModel 声明成 prop，不会出现在 $attrs 里，
// 所以原来监听 attrs.modelValue 的分支永远不触发：编辑场景首次回显拿不到 label
watch(model, (val) => {
  if (val && options.value.length === 0)
    loadData()
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
