import type { MaybeRefOrGetter } from 'vue'
import { onScopeDispose, toValue, watch } from 'vue'

interface GridConfig {
  width: number
  minWidth: number
  rowGap: number
  columnGap: number
}

export function useGridLayout(
  el: HTMLElement | (() => HTMLElement) | { value?: HTMLElement | null },
  config: MaybeRefOrGetter<GridConfig>,
) {
  function initStyle(element: HTMLElement) {
    const { rowGap, columnGap } = toValue(config)
    element.style.display = 'grid'
    element.style.rowGap = `${rowGap}px`
    element.style.columnGap = `${columnGap}px`
  }

  function setColumnRow(element: HTMLElement) {
    const { width: columnWidth, minWidth } = toValue(config)
    const width = element.clientWidth
    let column = width / columnWidth
    column = column - Math.floor(column) > 0.5 ? Math.ceil(column) : Math.floor(column)

    if (minWidth && width / column < minWidth) {
      column -= 1
    }

    element.style.gridTemplateColumns = `repeat(${Math.max(column, 1)}, 1fr)`
  }

  let resizeObserver: ResizeObserver | null = null

  function start(element: HTMLElement) {
    initStyle(element)
    setColumnRow(element)
    resizeObserver = new ResizeObserver(() => setColumnRow(element))
    resizeObserver.observe(element)
  }

  function init() {
    if (typeof el === 'function') {
      const element = el()
      if (element)
        start(element)
      return
    }

    if ('value' in el) {
      watch(
        () => el.value,
        (val) => {
          if (val)
            start(val)
        },
        { once: true, flush: 'post' },
      )
      return
    }

    start(el as HTMLElement)
  }

  init()

  // 之前 ResizeObserver 从不 disconnect，组件卸载后观察器与其闭包会一直存活
  onScopeDispose(() => {
    resizeObserver?.disconnect()
    resizeObserver = null
  })
}
