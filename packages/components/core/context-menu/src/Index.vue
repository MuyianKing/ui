<script setup lang="ts">
import type { ArrayOfFunctions, ContentMenuOptionsType } from '../../types/common'
import { useEventListener, useMouse } from '@vueuse/core'
import { nextTick, provide, ref } from 'vue'

import RenderMenuItem from './RenderMenuItem.tsx'

defineOptions({
  name: 'MuContextMenu',
})

const props = defineProps({
  options: {
    type: Array<ContentMenuOptionsType>,
    default() {
      return []
    },
  },
})

const emits = defineEmits(['click'])

const context_item_renders = ref<ArrayOfFunctions>([])
provide('context_item_renders', context_item_renders)

const { x, y } = useMouse({
  touch: false,
  type: (event) => {
    return [event.clientX, event.clientY]
  },
})

const _style = ref({
  top: '0px',
  left: '0px',
  width: '0px',
  height: '0px',
})

const render_ref = ref()
const show = ref(false)
let _data: any = null
function toggle(data: any) {
  if (typeof data === 'boolean') {
    show.value = data
  } else {
    _data = data
    show.value = true
  }

  if (!show.value) {
    return
  }

  nextTick(() => {
    _style.value = {
      top: `${y.value}px`,
      left: `${x.value}px`,
      width: `${render_ref.value.$el.clientWidth}px`,
      height: `${render_ref.value.$el.clientHeight}px`,
    }
  })
}

function handleSelected(index: number) {
  emits('click', {
    index,
    option: props.options[index],
    data: _data || null,
  })
  show.value = false
}

useEventListener(document, 'click', () => {
  show.value = false
})

defineExpose({
  toggle,
})
</script>

<template>
  <div v-show="show" class="mu-context-menu" :style="_style" @click.stop>
    <div class="arrow" />

    <render-menu-item ref="render_ref" :options @selected="handleSelected" />
    <slot />
  </div>
</template>
