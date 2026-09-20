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

// 固定用 en-US 取千分位再换成 separator，否则输出会随运行环境 locale 变成 "1.234" / "1 234"
function group(value: number | string) {
  return `${value}`.replace(/,/g, props.separator)
}

watchEffect(() => {
  const n = props.num
  if (n >= 100000000) {
    numFormat.value = (n / 100000000).toFixed(2)
    suffix.value = '亿'
  } else if (n >= 10000) {
    numFormat.value = (n / 10000).toFixed(2)
    suffix.value = '万'
  } else {
    numFormat.value = group(n.toLocaleString('en-US'))
    suffix.value = ''
  }
})
</script>

<template>
  <span>{{ numFormat }}{{ suffix }}</span>
</template>
