<script setup lang="ts">
import { ElInput, ElPopover } from 'element-plus'
import { computed, getCurrentInstance, ref } from 'vue'

defineOptions({ name: 'MuInput' })

const props = withDefaults(defineProps<{
  placeholder?: string
  tip?: string
  tipLabel?: string
  type?: string
}>(), {
  placeholder: '',
  tip: '',
  tipLabel: '',
  type: 'text',
})

const model = defineModel<string>()

const width = ref('')
const showTips = ref(false)
const position = ref({ top: 0, left: 0, bottom: 0, right: 0 })

const triggerRef = ref({
  getBoundingClientRect() {
    return position.value
  },
})

const instance = getCurrentInstance()

const placeholderComp = computed(() => {
  if (props.placeholder)
    return props.placeholder
  const label = (instance?.parent?.props as any)?.label
  if (label)
    return `请输入${label.replace('：', '').replace(':', '')}`
  return '请输入'
})

const tipsComp = computed(() => {
  const tips: string[] = []
  const label = props.tipLabel || '提示'
  if (label) {
    tips.push(`<div style="color:#feb059;width:100%;font-size:15px;font-weight:bold;"><span style="width:16px;height:16px;font-weight:600;line-height:16px;font-size:14px;border-radius:50%;background-color:#feb059;margin-right:5px;display:inline-block;text-align:center;color:white">?</span>${label}</div>`)
  }
  tips.push(`<div style="width:100%;font-size:14px;">${props.tip}</div>`)
  return tips.join('<br/>')
})

function handleEnter(e: MouseEvent) {
  const dom = (e.target as HTMLElement).parentNode as HTMLElement
  if (props.tip && dom) {
    const { top, left } = dom.getBoundingClientRect()
    position.value = {
      top: left + dom.clientWidth / 2,
      left: top,
      bottom: 0,
      right: 0,
    }
    width.value = `${dom.clientWidth}px`
    showTips.value = true
  }
}

function handleLeave() {
  showTips.value = false
}

function handleInput(val: string) {
  if (props.type === 'number') {
    model.value = val === '' ? '' : String(+val)
  } else {
    model.value = val.replace(/'/g, '')
  }
}
</script>

<template>
  <el-input :model-value="model"
            :placeholder="placeholderComp"
            :type
            clearable
            show-word-limit
            v-bind="$attrs"
            @blur="handleLeave"
            @focus="handleEnter"
            @input="handleInput"
  >
    <template v-if="$slots.prefix" #prefix>
      <slot name="prefix" />
    </template>
    <template v-if="$slots.append" #suffix>
      <slot name="append" />
    </template>
  </el-input>
  <el-popover :virtual-ref="triggerRef"
              :visible="showTips"
              :width
              placement="top"
              virtual-triggering
  >
    <div v-html="tipsComp" />
  </el-popover>
</template>
