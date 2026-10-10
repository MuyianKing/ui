import type { UploadFile } from '../upload/types'

export interface OptionsType {
  label: string
  value: string | number | boolean
  children?: OptionsType[]
}

export interface ContentMenuOptionsType {
  label: string
  icon?: string
  color?: string
}

export type ArrayOfFunctions = Array<(...args: any[]) => any>

export interface DefaultSlot {
  default?: () => string
}

export type StrNumBoolean = string | number | boolean

/** `uploadFile` 的第二个参数：上传过程回调集合 */
export interface UploadFileOptions {
  /** 上传进度回调，`upload` 组件用它驱动内置进度条 */
  onProgress: (e: ProgressEvent) => void
}

/**
 * `uploadFile` 的单条成功返回值：`path` 与 `id` 必填 —— `upload` 组件的预览/下载依赖 `path`、
 * 文件标识与「重新上传」定位依赖 `id`，其余字段会原样并入 `UploadFile`。
 */
export type UploadedFile = UploadFile & { path: string, id: string }

/** `uploadFile` 的返回值：单条或数组（数组只取第 0 项），空值视为上传失败 */
export type UploadFileResult = UploadedFile | UploadedFile[] | null | undefined

/** `icon-select` 调用 `getIcons` 时传入的查询参数 */
export interface IconQuery {
  /** 每页条数 */
  limit: number
  /** 当前页码，从 1 开始 */
  page: number
  /** 名称搜索关键字，匹配规则由使用方实现 */
  query: string
}

/** `getIcons` 的返回结构；`data` 每项是图标名，同时用作列表 `:key` 与 `Icon`（`@iconify/vue`）的 `icon` */
export interface IconQueryResult {
  data: string[]
  count: number
}

/** `tableIcon` 的取值：文本按钮 / 标准按钮 / 纯图标按钮（`'icon'` 等价于未配置） */
export type TableIcon = 'text' | 'button' | 'icon'

/**
 * `MuConfigProvider` 经 `GLOBAL_CUSTOM_CONFIG` 注入的全局配置，键全部可选。
 * 业务自定义键通过扩展本接口声明（`interface AppConfig extends GlobalCustomConfig { ... }`），
 * 不要退回 `Record<string, any>`，否则本库消费的键会重新失去类型约束。
 */
export interface GlobalCustomConfig {
  /** 上传实现；未配置时 `upload` 抛「未配置上传接口」（`core/upload`） */
  uploadFile?: (file: File, options: UploadFileOptions) => UploadFileResult | Promise<UploadFileResult>
  /** 把存储路径拼成可访问 URL；未配置时直接用原始地址（`core/image`、`core/video`、`core/file`） */
  previewFileUrl?: (url: string, prefix?: string) => string
  /** 下载实现；未配置时 `core/file` 不响应下载（`core/file`） */
  downloadFile?: (url: string, name: string) => void
  /** 图标选择组件的数据源；未配置时 `core/icon-select` 静默无数据 */
  getIcons?: (query: IconQuery) => Promise<IconQueryResult>
  /** 表格预设操作按钮形态：`'text'` 文本、`'button'` 标准、其余（含未配置）为图标 */
  tableIcon?: TableIcon
  /** 标准按钮形态是否显示前置图标：`MuAddButton` 与查询 / 导出 / 导入 / 重置按钮（`core/button`） */
  buttonIcon?: boolean
}
