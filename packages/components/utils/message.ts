import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'

let loadingInstance: ReturnType<typeof ElLoading.service> | null = null

export function closeLoading() {
  loadingInstance?.close()
  loadingInstance = null
}

export function loading(msg: string, params?: Record<string, any>) {
  loadingInstance = ElLoading.service({
    lock: true,
    text: msg,
    ...params,
  })
}

export function error(e: any, msg?: string) {
  ElMessage.error(msg || e?.message || '操作失败')
}

export function success(msg: string) {
  ElMessage.success(msg)
}

export function warning(msg: string) {
  ElMessage.warning(msg)
}

export function confirm(msg: string, title?: string, params?: Record<string, any>) {
  return ElMessageBox.confirm(msg, title || '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    ...params,
  })
}
