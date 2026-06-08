<script setup lang="ts">
import { ElCascaderPanel, ElDropdown, ElInput } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import { computed, nextTick, ref, useTemplateRef } from 'vue'
import { MuIcon } from '../../icon'

defineOptions({ name: 'MuDropdownCascader' })

const props = withDefaults(defineProps<{
  options?: any[]
  multiple?: boolean
  label?: string
  hasSearch?: boolean
  noAll?: boolean
  noArrow?: boolean
  cascaderProps?: Record<string, any>
}>(), {
  options: () => [],
  multiple: false,
  label: '',
  hasSearch: false,
  noAll: false,
  noArrow: false,
  cascaderProps: () => ({}),
})

const emit = defineEmits<{
  (e: 'change', val: any): void
}>()

const model = defineModel<any>({ default: '' })

const cascaderPanelRef = useTemplateRef<InstanceType<typeof ElCascaderPanel>>('cascaderPanelRef')
const arrowStatus = ref(false)
const searchKey = ref('')

const cascaderPropsConfig = {
  multiple: props.multiple,
  checkStrictly: false,
  emitPath: false,
  label: 'label',
  value: 'value',
  children: 'children',
  ...props.cascaderProps,
}

function getFilterFlag(item: any): boolean {
  if (item[cascaderPropsConfig.label]?.includes(searchKey.value))
    return true
  if (item[cascaderPropsConfig.children] && Array.isArray(item[cascaderPropsConfig.children])) {
    item[cascaderPropsConfig.children] = item[cascaderPropsConfig.children].filter((child: any) => getFilterFlag(child))
    return item[cascaderPropsConfig.children].some((child: any) => getFilterFlag(child))
  }
  return false
}

const filteredOptions = computed(() => {
  const list = cloneDeep(props.options)
  if (!props.noAll) {
    const allOption: Record<string, any> = {}
    allOption[cascaderPropsConfig.label] = '全部'
    allOption[cascaderPropsConfig.value] = ''
    list.unshift(allOption)
  }
  return list.filter((item: any) => getFilterFlag(item))
})

async function handleChange() {
  await nextTick()
  if (cascaderPropsConfig.multiple) {
    if (Array.isArray(model.value) && (model.value as any[]).includes('')) {
      cascaderPanelRef.value?.clearCheckedNodes()
      return
    }
    emit('change', cascaderPanelRef.value?.getCheckedNodes().map((node: any) => node.data))
  } else {
    emit('change', cascaderPanelRef.value?.getCheckedNodes()[0]?.data)
  }
}

const activeStatus = computed(() => {
  if (!cascaderPropsConfig.multiple) {
    return model.value !== '' && model.value !== null && typeof model.value !== 'undefined'
  }
  return Array.isArray(model.value) && model.value.length > 0
})

const displayLabel = computed(() => {
  if (!props.multiple) {
    const found = findLabel(filteredOptions.value, model.value, cascaderPropsConfig)
    return found || props.label
  }
  return props.label
})

function findLabel(options: any[], value: any, config: Record<string, any>): string | undefined {
  for (const item of options) {
    if (item[config.value] === value)
      return item[config.label]
    if (item[config.children]) {
      const found = findLabel(item[config.children], value, config)
      if (found)
        return found
    }
  }
  return undefined
}
</script>

<template>
  <el-dropdown class="mu-dropdown-cascader"
               trigger="click"
               @visible-change="(val: boolean) => { arrowStatus = val }"
  >
    <div :class="{ 'active-label': activeStatus }" class="flex items-center dropdown-label">
      <span>{{ displayLabel }}</span>
      <mu-icon v-if="!noArrow"
               :class="{ 'deg-180': arrowStatus }"
               class="arrow-icon ml-1"
               icon="iconamoon:arrow-down-2-thin"
      />
    </div>
    <template #dropdown>
      <div :class="{ 'p-2': hasSearch }" class="flex flex-col">
        <el-input v-if="hasSearch"
                  v-model="searchKey"
                  placeholder="请输入关键字快速搜索"
                  class="mb-2"
        />
        <el-cascader-panel ref="cascaderPanelRef"
                           v-model="model"
                           :options="filteredOptions"
                           :props="cascaderPropsConfig"
                           style="width: fit-content"
                           @change="handleChange"
        />
      </div>
    </template>
  </el-dropdown>
</template>
