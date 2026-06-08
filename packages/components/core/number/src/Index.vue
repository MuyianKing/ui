<script setup lang="ts">
import { ref, watchEffect } from 'vue'

defineOptions({ name: 'MuNumber' })

const props = withDefaults(defineProps<{
  num?: number
  separator?: string
}>(), {
  num: 0,
  separator: ',',
})

const numFormat = ref('')
const suffix = ref('')

watchEffect(() => {
  const n = props.num
  if (n >= 100000000) {
    numFormat.value = (n / 100000000).toFixed(2)
    suffix.value = '亿'
  } else if (n >= 10000) {
    numFormat.value = (n / 10000).toFixed(2)
    suffix.value = '万'
  } else {
    numFormat.value = n.toLocaleString()
    suffix.value = ''
  }
})
</script>

<template>
  <span>{{ numFormat }}{{ suffix }}</span>
</template>
