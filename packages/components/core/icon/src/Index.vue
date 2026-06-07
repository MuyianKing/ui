<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import { getCanUseValue } from '@muyianking/utils'

const props = withDefaults(defineProps<{
  icon: string
  size?: string | number
  color?: string
  type?: string
}>(), {
  size: '18px',
  color: '',
  type: '',
})

const style = computed(() => ({
  'font-size': getCanUseValue(props.size),
  color: props.color || (props.type ? `var(--el-color-${props.type})` : ''),
}))
</script>

<template>
  <Icon
    :icon="props.icon"
    class="mu-icon"
    aria-hidden="false"
    :style="style"
  />
</template>
