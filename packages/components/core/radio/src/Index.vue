<script setup lang="ts">
import { computed, nextTick } from 'vue'
import { ElRadioGroup, ElRadio } from 'element-plus'

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

const emit = defineEmits<{
  (e: 'update:modelValue', val: string | number | boolean): void
}>()

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
  <ElRadioGroup
    v-model="model"
    :class="['mu-radio', {
      'mu-radio-line-item': line,
      'mu-radio-readonly-group': readonly,
    }]"
    :disabled="disabled || readonly"
  >
    <ElRadio
      v-for="item in filteredOptions"
      :key="typeof item.value === 'boolean' ? +item.value : item.value"
      :value="item.value"
      @click="handleClick"
    >
      {{ item.label }}
    </ElRadio>
  </ElRadioGroup>
</template>
