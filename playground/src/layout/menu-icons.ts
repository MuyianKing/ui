import type { Component } from 'vue'
import IconListSelect from '~icons/iconoir/list-select'
import IconDialogs from '~icons/material-symbols-light/dialogs-outline'
import IconButtonCursor from '~icons/mdi/button-cursor'
import IconCalendar from '~icons/mdi/calendar'
import IconCardText from '~icons/mdi/card-text-outline'
import IconDatabaseSearch from '~icons/mdi/database-search'
import IconEmoticon from '~icons/mdi/emoticon-kiss-outline'
import IconFileSearch from '~icons/mdi/file-search-outline'
import IconFormTextbox from '~icons/mdi/form-textbox'
import IconListBulleted from '~icons/mdi/format-list-bulleted-triangle'
import IconFormatTitle from '~icons/mdi/format-title'
import IconGrid from '~icons/mdi/grid'
import IconMenuDown from '~icons/mdi/menu-down'
import IconNumeric from '~icons/mdi/numeric'
import IconPageNext from '~icons/mdi/page-next-outline'
import IconPencil from '~icons/mdi/pencil'
import IconUpload from '~icons/mdi/upload'
import IconListRadio from '~icons/ri/list-radio'

// 路由 meta.icon 的图标名到编译期图标组件（unplugin-icons）的映射；新增菜单图标需在此登记
export const menuIcons: Record<string, Component> = {
  'iconoir:list-select': IconListSelect,
  'material-symbols-light:dialogs-outline': IconDialogs,
  'mdi:button-cursor': IconButtonCursor,
  'mdi:calendar': IconCalendar,
  'mdi:card-text-outline': IconCardText,
  'mdi:database-search': IconDatabaseSearch,
  'mdi:emoticon-kiss-outline': IconEmoticon,
  'mdi:file-search-outline': IconFileSearch,
  'mdi:form-textbox': IconFormTextbox,
  'mdi:format-list-bulleted-triangle': IconListBulleted,
  'mdi:format-title': IconFormatTitle,
  'mdi:grid': IconGrid,
  'mdi:menu-down': IconMenuDown,
  'mdi:numeric': IconNumeric,
  'mdi:page-next-outline': IconPageNext,
  'mdi:pencil': IconPencil,
  'mdi:upload': IconUpload,
  'ri:list-radio': IconListRadio,
}
