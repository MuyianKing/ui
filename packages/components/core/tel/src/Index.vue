<script setup lang="ts">
defineOptions({ name: 'MuTel' })

withDefaults(defineProps<{
  tel?: string
}>(), {
  tel: '',
})
</script>

<template>
  <span class="mu-tel"><slot>{{ tel }}</slot></span>
</template>
