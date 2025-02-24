<script setup lang="ts">
import { Icon as IconComp } from '@iconify/vue'
import { getCanUseValue } from '@muyianking/utils'
import { computed } from 'vue'

defineOptions({
  name: 'MuIcon',
})

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  size: {
    type: [Number, String],
    default: '18px',
  },
  color: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: '',
  },
})

const _style = computed(() => {
  return {
    'font-size': getCanUseValue(props.size),
    'color': props.color || (props.type ? `var(--el-color-${props.type})` : ''),
  }
})
</script>

<template>
  <icon-comp :icon class="mu-icon" aria-hidden="false" :style="_style" />
</template>
