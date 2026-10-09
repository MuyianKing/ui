import { computed, useSlots } from 'vue'

/** MuButton 的渲染形态：`el-button` / `el-link` / 纯图标（图标形态下 text 作为 Tooltip 内容） */
export type MuButtonMode = 'button' | 'text' | 'icon'

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
