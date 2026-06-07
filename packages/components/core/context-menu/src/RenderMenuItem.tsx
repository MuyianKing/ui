import type { ArrayOfFunctions, ContentMenuOptionsType } from '../../types/common'
import { computed, defineComponent, inject, ref } from 'vue'
import HlIcon from '../../icon/index'

// 类型保护函数，检查对象是否符合 ContentMenuOptionsType 接口
function isOptionsType(obj: any): obj is ContentMenuOptionsType {
  return typeof obj === 'object' && 'label' in obj
}

export default defineComponent({
  props: {
    options: {
      type: Array<ContentMenuOptionsType>,
      required: true,
    },
  },
  components: {
    HlIcon,
  },
  setup(props, { emit }) {
    const context_item_renders = inject('context_item_renders', ref<ArrayOfFunctions>([]))

    function handelClick(index: number) {
      emit('selected', index)
    }

    // 有插槽以插槽为准，没有以options为准
    const list = computed(() =>
      context_item_renders.value.length > 0
        ? context_item_renders.value
        : props.options || [],
    )

    return () => (
      <div class="mu-context-menu-content">
        {list.value.map((render, index) => {
          return (
            <div
              class="mu-context-menu-item"
              onClick={() => handelClick(index)}
              style={`color:${isOptionsType(render) ? render.color : ''}`}
            >
              {isOptionsType(render)
                ? (render.icon
                    ? [
                        <HlIcon icon={render.icon} />,
                        <span class="mu-context-menu-content-text">{render.label}</span>,
                      ]
                    : <span>{render.label}</span>)
                : render(props.options[index])}
            </div>
          )
        })}
      </div>
    )
  },
})
