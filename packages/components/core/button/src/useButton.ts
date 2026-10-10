import type { Component } from 'vue'
import { computed, useSlots } from 'vue'

/** MuButton 的渲染形态：`el-button` / `el-link` / 纯图标（图标形态下 text 作为 Tooltip 内容） */
export type MuButtonMode = 'button' | 'text' | 'icon'

/**
 * 图标 prop 归一化：字符串（Iconify 图标名）经运行时 `Icon`（@iconify/vue）解析，
 * 组件（unplugin-icons 的 `~icons/*` 编译期图标）直接渲染，两者的字号与颜色处理保持一致。
 */
export function useIconProp(icon: () => string | Component | undefined) {
  const iconComp = computed(() => {
    const value = icon()
    return typeof value === 'string' ? undefined : value
  })
  const iconName = computed(() => {
    const value = icon()
    return typeof value === 'string' ? value : ''
  })
  return { iconComp, iconName }
}

export function useButton(props: { text?: string | boolean }, defaultText: string, tableIcon?: string) {
  const $slots = useSlots()

  const buttonText = computed(() => {
    if ($slots.default)
      return ''
    if (props.text) {
      if (typeof props.text === 'string')
        return props.text
    }
    return defaultText
  })

  const mode = computed<MuButtonMode>(() => {
    if (props.text !== undefined)
      return props.text ? 'text' : 'icon'
    return tableIcon === 'button' || tableIcon === 'text' ? tableIcon : 'icon'
  })

  return {
    buttonText,
    mode,
  }
}
