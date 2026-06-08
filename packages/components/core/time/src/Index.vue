<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'MuTime' })

const props = withDefaults(defineProps<{
  time?: string
  separator?: string
  nowrap?: boolean
}>(), {
  time: '',
  separator: ' ',
  nowrap: false,
})

const timeParts = computed(() => props.time.split(props.separator))
const dateStr = computed(() => timeParts.value[0] || '')
const timeStr = computed(() => timeParts.value[1] || '')
</script>

<template>
  <span class="mu-time" :class="{ 'whitespace-nowrap': nowrap }">
    {{ dateStr }}
    <template v-if="timeStr">
      <span class="mu-time-separator">{{ separator }}</span>
      <span class="mu-time-value">{{ timeStr }}</span>
    </template>
  </span>
</template>
