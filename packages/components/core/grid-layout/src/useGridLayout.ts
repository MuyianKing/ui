import { isRef, watch } from 'vue'

interface GridConfig {
  width: number
  minWidth: number
  rowGap: number
  columnGap: number
}

export function useGridLayout(
  el: HTMLElement | (() => HTMLElement) | { value?: HTMLElement },
  config: GridConfig,
) {
  function initStyle(element: HTMLElement) {
    element.style.display = 'grid'
    element.style.rowGap = `${config.rowGap}px`
    element.style.columnGap = `${config.columnGap}px`
  }

  function setColumnRow(element: HTMLElement) {
    const width = element.clientWidth
    let column = width / config.width
    column = column - Math.floor(column) > 0.5 ? Math.ceil(column) : Math.floor(column)

    if (config.minWidth && width / column < config.minWidth) {
      column -= 1
    }

    element.style.gridTemplateColumns = `repeat(${Math.max(column, 1)}, 1fr)`
  }

  let resizeObserver: ResizeObserver | null = null

  function start(element: HTMLElement) {
    initStyle(element)
    setColumnRow(element)
    resizeObserver?.disconnect()
    resizeObserver = new ResizeObserver(() => setColumnRow(element))
    resizeObserver.observe(element)
  }

  function init() {
    let element: HTMLElement | null = null

    if (isRef(el)) {
      watch(
        el as any,
        (val) => {
          if (val) {
            element = val as HTMLElement
            start(element)
          }
        },
        { once: true },
      )
    } else {
      element = el as unknown as HTMLElement
      if (element)
        start(element)
    }
  }

  init()
}
