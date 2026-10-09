// UploadFile 被 Index.vue 的 defineModel / defineSlots 引用，会进入组件的对外类型。
// 声明在 Index.vue 内部时它不是模块导出，vue-tsc 无法为 `export const MuUpload` 命名该类型
// （TS4023），导致 core/upload 生成不出 index.d.ts、声明包留下悬空的 './core/upload' 引用。
// 因此独立成模块并对外导出。
export interface UploadFile {
  id?: string
  name?: string
  path?: string
  loading?: boolean
  file?: File
  [key: string]: any
}
