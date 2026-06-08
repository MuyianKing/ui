<script setup lang="ts">
defineOptions({ name: 'MuIdCard' })

withDefaults(defineProps<{
  idCard?: string
}>(), {
  idCard: '',
})
</script>

<template>
  <span class="mu-id-card"><slot>{{ idCard }}</slot></span>
</template>
