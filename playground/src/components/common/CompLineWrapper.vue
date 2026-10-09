<script setup lang="ts">
defineProps({
  label: {
    type: String,
    required: true,
  },
  labelWidth: {
    type: String,
    default: '80px',
  },
})
</script>

<template>
  <div class="wrapper flex items-center mt-4">
    <div class="block-title mb-1 flex-shrink-0 mr-2">
      {{ label }}
    </div>
    <slot />
  </div>
</template>

<style scoped>
.wrapper {
  &:first-child {
    margin-top: 0 !important;
  }
}

.block-title {
  width: v-bind(labelWidth);
}
</style>
