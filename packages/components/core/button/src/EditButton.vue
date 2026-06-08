<script setup lang="ts">
import { inject } from 'vue'
import MuButton from './Index.vue'
import { useButton } from './useButton'

defineOptions({ name: 'MuEditButton' })

const props = withDefaults(defineProps<{
  icon?: string
  text?: string
}>(), {
  icon: 'uil:edit',
})

const emit = defineEmits<{
  (e: 'click'): void
}>()

const globalConfig = inject<{ tableIcon?: string }>('GLOBAL_CUSTOM_CONFIG')
const { buttonText, buttonType } = useButton(props as any, '编辑', globalConfig?.tableIcon)
</script>

<template>
  <mu-button :button-type="buttonType"
             :icon
             :text="buttonText"
             type="primary"
             @click="emit('click')"
  >
    <slot />
  </mu-button>
</template>
