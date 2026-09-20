<script setup lang="ts">
import { ElCheckbox, ElCheckboxGroup } from 'element-plus'
import { computed, ref, watch } from 'vue'

defineOptions({ name: 'MuCheckbox' })

const props = withDefaults(defineProps<{
  options?: any[]
  multiple?: boolean
  line?: boolean
  readonly?: boolean
  disabled?: boolean
}>(), {
  options: () => [],
  multiple: true,
  line: false,
  readonly: false,
  disabled: false,
})

const model = defineModel<any[] | string | number>({ default: () => [] })

const valueMap = ref<Record<string, any>>({})

watch(() => props.options, () => {
  const map: Record<string, any> = {}
  props.options.forEach((item: any) => {
    map[`${item.value}`] = item.value
  })
  valueMap.value = map
}, { immediate: true, deep: true })

function handleChange(val: any[]) {
  if (props.multiple) {
    model.value = val
    return
  }
  // 用 pop() || '' 会把 0 / false 这类合法值变成 ''
  model.value = val.length > 0 ? val[val.length - 1] : ''
}

const value = computed(() => {
  if (model.value === null || model.value === undefined || model.value === '')
    return []
  let _value: any[]
  if (Array.isArray(model.value)) {
    _value = model.value
  } else if (typeof model.value === 'number' || typeof model.value === 'boolean') {
    _value = [model.value]
  } else {
    _value = String(model.value).split(',').filter(item => item !== '')
  }
  if (props.multiple) {
    // 不能用 filter(Boolean)：value 为 0 / false 的选项会被当作"未选中"丢掉
    return _value.map(item => valueMap.value[item]).filter(item => item !== undefined)
  }
  return _value || []
})
</script>

<template>
  <el-checkbox-group v-bind="$attrs"
                     class="mu-checkbox"
                     :class="{
                       'mu-checkbox-line-item': line,
                       'mu-checkbox-readonly-group': readonly,
                     }"
                     :disabled="disabled || readonly"
                     :model-value="value"
                     @change="handleChange"
  >
    <el-checkbox v-for="item in options" :key="item.value" :value="item.value">
      {{ item.label }}
    </el-checkbox>
  </el-checkbox-group>
</template>
