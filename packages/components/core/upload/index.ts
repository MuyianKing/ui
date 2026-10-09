import Upload from './Index.vue'
import './style/index'

// UploadFile 出现在 MuUpload 的对外类型里（defineModel 与 #preview 插槽都引用它），
// 不从公共入口导出的话，消费者拿不到 v-model 与插槽作用域的类型。
export type { UploadFile } from './types'

export const MuUpload = Upload
