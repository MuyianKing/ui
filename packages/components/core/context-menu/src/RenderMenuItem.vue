<script setup lang="ts">
import { inject, ref, computed } from 'vue'
import { MuIcon } from '../../icon'

const props = withDefaults(defineProps<{
  options?: any[]
}>(), {
  options: () => [],
})

const emit = defineEmits<{
  (e: 'selected', index: number): void
}>()

const itemRenders = inject('context_item_renders', ref<any[]>([]))

function isContentMenuOption(obj: any): obj is { label: string; icon?: string; color?: string } {
  return typeof obj === 'object' && 'label' in obj
}

const renderList = computed(() =>
  itemRenders.value.length > 0 ? itemRenders.value : props.options || [],
)
</script>

<template>
  <div class="mu-context-menu-content">
    <div
      v-for="(item, index) in renderList"
      :key="index"
      class="mu-context-menu-item"
      :style="{ color: isContentMenuOption(item) ? item.color : '' }"
      @click="emit('selected', index)"
    >
      <template v-if="isContentMenuOption(item)">
        <MuIcon v-if="item.icon" :icon="item.icon" />
        <span class="mu-context-menu-content-text">{{ item.label }}</span>
      </template>
      <template v-else>
        <span>{{ item(options[index]) }}</span>
      </template>
    </div>
  </div>
</template>
