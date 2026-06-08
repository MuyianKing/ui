import { computed, useSlots } from 'vue'

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

  const buttonType = computed(() => {
    if (props.text !== undefined)
      return props.text ? 'text' : 'icon'
    return tableIcon || 'icon'
  })

  return {
    buttonText,
    buttonType,
  }
}
