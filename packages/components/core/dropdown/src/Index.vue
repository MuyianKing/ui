<script setup lang="ts">
import { ElCheckbox, ElCheckboxGroup, ElDropdown, ElDropdownItem, ElDropdownMenu, ElInput, ElScrollbar } from 'element-plus'
import { computed, ref } from 'vue'
import { MuIcon } from '../../icon'

defineOptions({ name: 'MuDropdown' })

const props = withDefaults(defineProps<{
  options?: any[]
  multiple?: boolean
  label?: string
  keepLabel?: boolean
  hasSearch?: boolean
  noAll?: boolean
  noArrow?: boolean
}>(), {
  options: () => [],
  multiple: false,
  label: '',
  keepLabel: false,
  hasSearch: false,
  noAll: false,
  noArrow: false,
})

const emit = defineEmits<{
  (e: 'change', val: any): void
}>()

const model = defineModel<any>({ default: () => undefined })
const arrowStatus = ref(false)
const searchKey = ref('')

const filteredOptions = computed(() => {
  if (!props.hasSearch || !searchKey.value)
    return props.options
  return props.options.filter((item: any) =>
    item.label?.includes(searchKey.value),
  )
})

// For multiple selection
const selectedValues = computed(() => {
  if (!model.value)
    return []
  return Array.isArray(model.value) ? model.value : [model.value]
})

function handleSelect(val: any) {
  if (!props.multiple) {
    model.value = val
    emit('change', val)
  }
}

function handleCheckboxChange(val: any[]) {
  model.value = val
  emit('change', val)
}

const displayLabel = computed(() => {
  if (props.keepLabel)
    return props.label
  if (!props.multiple && model.value) {
    const found = props.options.find((item: any) => item.value === model.value)
    return found?.label || props.label
  }
  return props.label
})
</script>

<template>
  <el-dropdown class="mu-dropdown"
               trigger="click"
               @visible-change="(val: boolean) => { arrowStatus = val }"
  >
    <div :class="{ 'active-label': !!model }" class="flex items-center dropdown-label">
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
                  placeholder="请输入关键字搜索"
                  class="mb-2"
        />
        <el-scrollbar max-height="300px">
          <template v-if="multiple">
            <el-checkbox-group :model-value="selectedValues" @change="handleCheckboxChange">
              <div class="px-2">
                <div v-if="!noAll" class="checkbox-item">
                  <el-checkbox value="">
                    全部
                  </el-checkbox>
                </div>
                <div v-for="item in filteredOptions" :key="item.value" class="checkbox-item">
                  <el-checkbox :value="item.value">
                    {{ item.label }}
                  </el-checkbox>
                </div>
              </div>
            </el-checkbox-group>
          </template>
          <el-dropdown-menu v-else>
            <div v-if="!noAll">
              <el-dropdown-item @click="handleSelect('')">
                全部
              </el-dropdown-item>
            </div>
            <el-dropdown-item v-for="item in filteredOptions"
                              :key="item.value"
                              @click="handleSelect(item.value)"
            >
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-scrollbar>
      </div>
    </template>
  </el-dropdown>
</template>
