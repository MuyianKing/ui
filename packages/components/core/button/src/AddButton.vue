<script setup lang="ts">
import { inject } from 'vue'
import MuButton from './Index.vue'

defineOptions({ name: 'MuAddButton' })

withDefaults(defineProps<{
  text?: string
}>(), {
  text: '添加',
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

const globalConfig = inject<{ buttonIcon?: boolean }>('GLOBAL_CUSTOM_CONFIG')
</script>

<template>
  <mu-button type="danger" :show-icon="!!globalConfig?.buttonIcon" icon="icon-park-outline:add-one" @click="emit('click')">
    <slot>{{ text }}</slot>
  </mu-button>
</template>
