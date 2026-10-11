import type { UploadFileOptions, UploadFileResult } from '@muyianking/components'

/** 模拟上传接口：按 150ms 间隔推进进度，约 1.5s 完成后返回文件自身信息 */
export function mockUploadFile(file: File, { onProgress }: UploadFileOptions): Promise<UploadFileResult> {
  return new Promise((resolve) => {
    const total = file.size || 1024 * 1024
    let loaded = 0
    const timer = setInterval(() => {
      loaded = Math.min(total, loaded + total * (0.1 + Math.random() * 0.15))
      onProgress(new ProgressEvent('progress', { loaded, total }))
      if (loaded < total) {
        return
      }
      clearInterval(timer)
      // blob 地址可直接当 path 预览；真实接口这里换成服务端返回的存储路径与 id
      resolve({
        id: `${Date.now()}${Math.floor(Math.random() * 1000)}`,
        name: file.name,
        path: URL.createObjectURL(file),
      })
    }, 150)
  })
}
