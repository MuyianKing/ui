<script setup lang="ts">
import { ElCascaderPanel, ElDropdown, ElInput } from 'element-plus'
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

// 必须是 computed：写成 setup 期的一次性快照，multiple / cascaderProps 变化不会响应
const cascaderPropsConfig = computed(() => ({
  multiple: props.multiple,
  checkStrictly: false,
  emitPath: false,
  label: 'label',
  value: 'value',
  children: 'children',
  ...props.cascaderProps,
}))

// 纯函数式过滤：返回新数组，不在 computed 里就地改写 props.options 的子节点
function filterTree(list: any[], keyword: string): any[] {
  if (!keyword)
    return list

  const { label: labelKey, children: childrenKey } = cascaderPropsConfig.value
  const result: any[] = []

  for (const item of list) {
    if (String(item[labelKey] ?? '').includes(keyword)) {
      // 父节点命中时保留完整子树，原实现在这里已经把 children 过滤空了
      result.push(item)
      continue
    }

    const children = Array.isArray(item[childrenKey]) ? item[childrenKey] : null
    if (children) {
      const matched = filterTree(children, keyword)
      if (matched.length > 0)
        result.push({ ...item, [childrenKey]: matched })
    }
  }

  return result
}

const filteredOptions = computed(() => {
  const { label: labelKey, value: valueKey } = cascaderPropsConfig.value
  const list = props.noAll
    ? props.options
    : [{ [labelKey]: '全部', [valueKey]: '' }, ...props.options]
  return filterTree(list, searchKey.value)
})

async function handleChange() {
  await nextTick()
  if (cascaderPropsConfig.value.multiple) {
    if (Array.isArray(model.value) && (model.value as any[]).includes('')) {
      cascaderPanelRef.value?.clearCheckedNodes()
      model.value = []
      emit('change', [])
      return
    }
    emit('change', cascaderPanelRef.value?.getCheckedNodes(false).map((node: any) => node.data))
  } else {
    emit('change', cascaderPanelRef.value?.getCheckedNodes(false)[0]?.data)
  }
}

const activeStatus = computed(() => {
  if (!cascaderPropsConfig.value.multiple) {
    return model.value !== '' && model.value !== null && typeof model.value !== 'undefined'
  }
  return Array.isArray(model.value) && model.value.length > 0
})

const displayLabel = computed(() => {
  if (!props.multiple) {
    // 在完整数据源里查标签，否则搜索状态下选中项会被过滤掉而显示不回显
    const found = findLabel(props.options, model.value, cascaderPropsConfig.value)
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
