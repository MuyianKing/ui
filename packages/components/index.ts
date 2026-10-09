export { MuBlockTitle } from './core/block-title'
export { MuAddButton, MuButton, MuDelButton, MuDetailButton, MuEditButton, MuExportButton, MuImportButton, MuResetButton, MuSearchButton } from './core/button'
export { MuChart } from './core/chart'
export { MuCheckbox } from './core/checkbox'
export { MuConfigProvider } from './core/config-provider'
export { MuDate } from './core/date'
export { MuDescriptions } from './core/descriptions'
export { MuDescriptionsItem } from './core/descriptions-item'
export { MuDialog } from './core/dialog'
export { MuDropdown } from './core/dropdown'
export { MuDropdownCascader } from './core/dropdown-cascader'
export { MuEditInfo } from './core/edit-info'
export { MuFile } from './core/file'
export { MuFormDialog } from './core/form-dialog'
export { MuFormItem } from './core/form-item'
export { MuGridLayout } from './core/grid-layout'
export { MuIcon } from './core/icon'
export { MuIconSelect } from './core/icon-select'
export { MuIdCard } from './core/id-card'
export { MuImage } from './core/image'
export { MuInput } from './core/input'
export { MuNoData } from './core/nodata'
export { MuNumber } from './core/number'
export { MuPage } from './core/page'
export { MuPreview } from './core/preview'
export { MuQuestionIcon } from './core/question-icon'
export { MuRadio } from './core/radio'
export { MuSearchPage } from './core/search-page'
export { MuSelect } from './core/select'
export { MuSelectRemote } from './core/select-remote'
export { MuTel } from './core/tel'
export { MuTime } from './core/time'
// 跨组件公共类型，与文档约定的公共 API 保持一致。
export type {
  ArrayOfFunctions,
  ContentMenuOptionsType,
  DefaultSlot,
  OptionsType,
  StrNumBoolean,
} from './core/types/common'
export { MuUpload } from './core/upload'
export type { UploadFile } from './core/upload'

export { MuVideo } from './core/video'

export { MuWatermark } from './core/watermark'

// 消息与交互反馈封装。必须从公共入口导出：只被组件内部引用的函数会被构建摇掉，
// 这样消费者才能 import { loading, error } from '@muyianking/ui' 使用。
export {
  closeLoading,
  confirm,
  error,
  loading,
  success,
  warning,
} from './utils/message'
// 校验规则同样必须从公共入口导出：只被组件内部引用的规则会被构建摇掉，
// 消费者需要能 import { v_tel } from '@muyianking/ui'。
export {
  v_carnum,
  v_email,
  v_id_num,
  v_int,
  v_ip,
  v_latlong,
  v_phone,
  v_phoneOrTel,
  v_port,
  v_tel,
} from './utils/validator'

export type { RuleValidator, ValidateCallback } from './utils/validator'
