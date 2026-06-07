<script setup lang="ts">
import { inject, ref, useSlots, onMounted, nextTick } from 'vue'

const itemRenders = inject('context_item_renders', ref<any[]>([]))

function defaultRender(item: any) {
  return item.label
}

const slots = useSlots()

onMounted(() => {
  nextTick(() => {
    itemRenders.value.push(slots.default || defaultRender)
  })
})
</script>

<template>
  <div />
</template>
