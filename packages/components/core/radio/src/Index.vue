<script setup lang="ts">
import { ElRadio, ElRadioGroup } from 'element-plus'
import { computed, nextTick } from 'vue'

const props = withDefaults(defineProps<{
  options?: any[]
  empty?: boolean
  line?: boolean
  readonly?: boolean
  disabled?: boolean
  modelValue?: string | number | boolean
}>(), {
  options: () => [],
  empty: false,
  line: false,
  readonly: false,
  disabled: false,
  modelValue: '',
})

const model = defineModel<string | number | boolean>()

async function handleClick() {
  if (props.readonly || !props.empty)
    return
  const val = model.value
  await nextTick()
  if (val && val === model.value)
    model.value = ''
}

const filteredOptions = computed(() =>
  props.readonly
    ? model.value === ''
      ? []
      : props.options.filter((item: any) => item.value === model.value)
    : props.options,
)
</script>

<template>
  <el-radio-group v-model="model"
                  class="mu-radio" :class="[{
                    'mu-radio-line-item': line,
                    'mu-radio-readonly-group': readonly,
                  }]"
                  :disabled="disabled || readonly"
  >
    <el-radio v-for="item in filteredOptions"
              :key="typeof item.value === 'boolean' ? +item.value : item.value"
              :value="item.value"
              @click="handleClick"
    >
      {{ item.label }}
    </el-radio>
  </el-radio-group>
</template>
