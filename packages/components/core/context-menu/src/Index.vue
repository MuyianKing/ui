<script setup lang="ts">
import { ref, provide, nextTick } from 'vue'
import { useMouse, useEventListener } from '@vueuse/core'
import RenderMenuItem from './RenderMenuItem.vue'

const props = withDefaults(defineProps<{
  options?: any[]
}>(), {
  options: () => [],
})

const emit = defineEmits<{
  (e: 'click', payload: { index: number; option: any; data: any }): void
}>()

const itemRenders = ref<any[]>([])
provide('context_item_renders', itemRenders)

const { x, y } = useMouse({ touch: false, type: (e: MouseEvent) => [e.clientX, e.clientY] })
const position = ref({ top: '0px', left: '0px', width: '0px', height: '0px' })
const renderRef = ref<any>()
const visible = ref(false)
let contextData: any = null

function toggle(data: any) {
  if (typeof data === 'boolean') {
    visible.value = data
  }
  else {
    contextData = data
    visible.value = true
  }
  if (visible.value) {
    nextTick(() => {
      position.value = {
        top: `${y.value}px`,
        left: `${x.value}px`,
        width: `${renderRef.value.$el.clientWidth}px`,
        height: `${renderRef.value.$el.clientHeight}px`,
      }
    })
  }
}

function handleSelected(index: number) {
  emit('click', {
    index,
    option: props.options[index],
    data: contextData || null,
  })
  visible.value = false
}

useEventListener(document, 'click', () => {
  visible.value = false
})

defineExpose({ toggle })
</script>

<template>
  <div
    v-show="visible"
    class="mu-context-menu"
    :style="position"
    @click.stop
  >
    <div class="arrow" />
    <RenderMenuItem
      ref="renderRef"
      :options="options"
      @selected="handleSelected"
    />
    <slot />
  </div>
</template>
