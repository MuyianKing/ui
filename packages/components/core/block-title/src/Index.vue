<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'MuBlockTitle' })

const props = withDefaults(defineProps<{
  type?: string
  title?: string
  fontSize?: number
  color?: string
  showBlock?: boolean
  linearGradient?: boolean
}>(), {
  type: 'primary',
  title: '',
  fontSize: 16,
  color: '#595757',
  showBlock: true,
  linearGradient: false,
})

const title_style = computed(() => {
  return {
    'color': props.color,
    'font-size': `${props.fontSize}px`,
  }
})
</script>

<template>
  <div :class="linearGradient ? 'mu-block-title' : 'mu-flat-block-title'" v-bind="$attrs">
    <div class="flex h-full">
      <div v-if="showBlock" class="block" :class="type" />
      <div class="title flex items-center justify-center" :style="title_style">
        <slot>{{ title }}</slot>
      </div>
    </div>
    <div>
      <slot name="after" />
    </div>
  </div>
</template>
