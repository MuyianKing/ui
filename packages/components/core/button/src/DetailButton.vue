<script setup lang="ts">
import { inject } from 'vue'
import MuButton from './Index.vue'
import { useButton } from './useButton'

defineOptions({ name: 'MuDetailButton' })

const props = withDefaults(defineProps<{
  icon?: string
  text?: string | boolean
}>(), {
  icon: 'icon-park-outline:find',
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

const globalConfig = inject<{ tableIcon?: string }>('GLOBAL_CUSTOM_CONFIG')
const { buttonText, buttonType } = useButton(props, '详情', globalConfig?.tableIcon)
</script>

<template>
  <mu-button :button-type="buttonType"
             :icon
             :text="buttonText"
             type="primary"
             @click="emit('click')"
  >
    <slot>{{ buttonText }}</slot>
  </mu-button>
</template>
