import { beforeEach, describe, expect, it, vi } from 'vitest'

// message.ts 直接依赖 element-plus 的三个反馈组件，测试里整体替换成 spy
const mocks = vi.hoisted(() => ({
  service: vi.fn(() => ({ close: vi.fn() })),
  error: vi.fn(),
  success: vi.fn(),
  warning: vi.fn(),
  confirm: vi.fn(() => Promise.resolve()),
}))

vi.mock('element-plus', () => ({
  ElLoading: { service: mocks.service },
  ElMessage: { error: mocks.error, success: mocks.success, warning: mocks.warning },
  ElMessageBox: { confirm: mocks.confirm },
}))

const { closeLoading, confirm, error, loading, success, warning } = await import('../message')

beforeEach(() => {
  vi.clearAllMocks()
})

describe('utils/message 的反馈封装', () => {
  it('success / warning 原样透传', () => {
    success('保存成功')
    warning('请先选择数据')

    expect(mocks.success).toHaveBeenCalledWith('保存成功')
    expect(mocks.warning).toHaveBeenCalledWith('请先选择数据')
  })

  it('error 优先用显式文案，其次取 e.message，最后回退「操作失败」', () => {
    error(new Error('接口 500'), '保存失败')
    expect(mocks.error).toHaveBeenLastCalledWith('保存失败')

    error(new Error('接口 500'))
    expect(mocks.error).toHaveBeenLastCalledWith('接口 500')

    error({ message: '对象形态的错误' })
    expect(mocks.error).toHaveBeenLastCalledWith('对象形态的错误')

    error(null)
    expect(mocks.error).toHaveBeenLastCalledWith('操作失败')

    error({ code: 1 })
    expect(mocks.error).toHaveBeenLastCalledWith('操作失败')
  })

  it('confirm 内置「提示」标题与确定/取消文案，params 可覆盖', async () => {
    await confirm('确认删除？')
    expect(mocks.confirm).toHaveBeenLastCalledWith('确认删除？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await confirm('确认删除？', '危险操作', { type: 'error' })
    expect(mocks.confirm).toHaveBeenLastCalledWith('确认删除？', '危险操作', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error',
    })
  })

  it('loading 写入单例，closeLoading 只关闭最近一次并置空', () => {
    loading('正在导出')
    expect(mocks.service).toHaveBeenLastCalledWith({ lock: true, text: '正在导出' })

    loading('正在下载', { background: 'rgba(0,0,0,.5)' })
    expect(mocks.service).toHaveBeenLastCalledWith({
      lock: true,
      text: '正在下载',
      background: 'rgba(0,0,0,.5)',
    })

    // 后一次 loading 覆盖前一个实例，closeLoading 只关得掉最后一次
    const [first, second] = mocks.service.mock.results.map(item => item.value)
    closeLoading()
    expect(second.close).toHaveBeenCalledTimes(1)
    expect(first.close).not.toHaveBeenCalled()
  })

  it('closeLoading 可重复调用，未开启 loading 时也不报错', () => {
    expect(() => closeLoading()).not.toThrow()

    loading('加载中')
    closeLoading()
    closeLoading()
    expect(mocks.service.mock.results[0].value.close).toHaveBeenCalledTimes(1)
  })
})
