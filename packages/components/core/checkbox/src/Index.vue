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
  model.value = props.multiple ? val : val.pop() || ''
}

const value = computed(() => {
  if (!model.value)
    return []
  let _value: any[]
  if (Array.isArray(model.value)) {
    _value = model.value
  } else if (typeof model.value === 'number') {
    _value = [model.value]
  } else {
    _value = String(model.value).split(',').filter(Boolean)
  }
  if (props.multiple) {
    return _value.map(item => valueMap.value[item]).filter(Boolean)
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
