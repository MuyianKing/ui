<script setup lang="ts">
import { computed } from 'vue'
import defaultImg from '../assets/img/no-data.png'

defineOptions({ name: 'MuNoData' })

const props = withDefaults(defineProps<{
  img?: string
  height?: string
  width?: string
  text?: string
}>(), {
  img: '',
  height: 'auto',
  width: '100%',
  text: '暂无数据',
})

const imgSrc = computed(() => props.img || defaultImg)
</script>

<template>
  <div class="mu-no-data" :style="{ height, width }">
    <img :src="imgSrc">
    <p>{{ text }}</p>
    <slot />
  </div>
</template>
