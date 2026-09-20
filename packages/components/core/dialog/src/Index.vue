<script setup lang="ts">
import { ElDialog } from 'element-plus'
import { computed, nextTick, useSlots, useTemplateRef, watch } from 'vue'

defineOptions({ name: 'MuDialog' })

const props = withDefaults(defineProps<{
  closeOnClickModal?: boolean
  top?: string | number
  height?: string
  destroyOnClose?: boolean
  draggable?: boolean
}>(), {
  closeOnClickModal: false,
  top: 150,
  destroyOnClose: true,
  draggable: true,
})

const slots = useSlots()
const dialogRef = useTemplateRef<any>('dialogRef')
const model = defineModel<boolean>({ default: false })

const topComp = computed(() => {
  let top: string | number = '10px'
  if (props.top) {
    if (Number.isNaN(+props.top)) {
      top = props.top === 'auto' ? '' : props.top
    } else {
      top = `${props.top}px`
    }
  }
  return top
})

const dialogStyle = computed(() => ({
  marginTop: topComp.value ? 0 : '',
  marginBottom: topComp.value ? 0 : '',
  top: topComp.value,
  height: props.height,
}))

function setMaxHeight() {
  nextTick(() => {
    // 这里伸手进了 Element Plus 的内部结构，它升级时最容易碎，
    // 所以集中成一次取值并全部走可选链（未渲染 header 时原来会直接抛错）
    const $el = (dialogRef.value as any)?.dialogContentRef?.$el as HTMLElement | undefined
    const body = $el?.querySelector<HTMLElement>('.el-dialog__body')
    if (!$el || !body)
      return

    const header = $el.querySelector('.el-dialog__header')?.clientHeight || 0
    const footer = slots.footer ? $el.querySelector('.el-dialog__footer')?.clientHeight || 72 : 0
    const offsetTop = $el.offsetTop

    if (props.height) {
      body.style.height = `calc(${props.height} - ${header + footer}px)`
    } else {
      body.style.maxHeight = `calc(100vh - ${header + 2 * offsetTop + footer + 32}px)`
    }
  })
}

watch(model, (val) => {
  if (val) {
    nextTick(() => setMaxHeight())
  }
}, { immediate: true })

defineExpose({ setMaxHeight })
</script>

<template>
  <el-dialog ref="dialogRef" v-model="model" class="mu-custom-dialog" :close-on-click-modal="closeOnClickModal" :destroy-on-close="destroyOnClose" :draggable :style="dialogStyle" append-to-body>
    <slot />
    <template v-if="slots.footer" #footer>
      <slot name="footer" />
    </template>
  </el-dialog>
</template>
