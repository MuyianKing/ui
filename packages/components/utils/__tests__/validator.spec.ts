import type { RuleValidator, ValidateCallback } from '../validator'
import { describe, expect, it, vi } from 'vitest'
import {
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
} from '../validator'

/**
 * 按 element-plus 的契约调用一次规则，并断言「callback 恰好被调用一次」。
 * 返回 callback 的第一个参数：无错误时是 undefined，校验失败时是 Error。
 */
function validate(validator: RuleValidator, value: unknown) {
  const callback = vi.fn<ValidateCallback>()
  validator({}, value, callback)
  expect(callback).toHaveBeenCalledTimes(1)
  return callback.mock.calls[0][0]
}

const rules: [string, RuleValidator][] = [
  ['v_int', v_int],
  ['v_carnum', v_carnum],
  ['v_port', v_port],
  ['v_email', v_email],
  ['v_phone', v_phone],
  ['v_tel', v_tel],
  ['v_ip', v_ip],
  ['v_id_num', v_id_num],
  ['v_phoneOrTel', v_phoneOrTel],
  ['v_latlong', v_latlong],
]

describe('utils/validator 的通用契约', () => {
  it.each(rules)('%s 对空值一律放行，交由 required 处理', (_name, validator) => {
    expect(validate(validator, '')).toBeUndefined()
    expect(validate(validator, null)).toBeUndefined()
    expect(validate(validator, undefined)).toBeUndefined()
    expect(validate(validator, [])).toBeUndefined()
  })

  it.each(rules)('%s 校验失败时回调一个 Error', (_name, validator) => {
    const error = validate(validator, '###')
    expect(error).toBeInstanceOf(Error)
    expect((error as Error).message).not.toBe('')
  })

  it('非字符串入参会被转成字符串再校验', () => {
    expect(validate(v_int, 123)).toBeUndefined()
    expect((validate(v_int, 1.5) as Error).message).toBe('只能是整数')
  })

  it('规则是纯函数，同一个 value 多次校验结果一致', () => {
    expect(validate(v_email, 'a@b.com')).toBeUndefined()
    expect(validate(v_email, 'a@b.com')).toBeUndefined()
  })
})

describe('v_int', () => {
  it('放行整数，拦截小数与非数字', () => {
    expect(validate(v_int, '123')).toBeUndefined()
    expect(validate(v_int, '-5')).toBeUndefined()
    expect((validate(v_int, '12.5') as Error).message).toBe('只能是整数')
    expect((validate(v_int, 'abc') as Error).message).toBe('只能是整数')
  })
})

describe('v_carnum', () => {
  it('放行新能源车牌，拦截不合法字符串', () => {
    expect(validate(v_carnum, '京AD12345')).toBeUndefined()
    expect((validate(v_carnum, 'ABC123') as Error).message).toBe('车牌格式错误')
    expect((validate(v_carnum, '京A-12345') as Error).message).toBe('车牌格式错误')
  })
})

describe('v_port', () => {
  it('只放行 0 - 65535 的整数端口', () => {
    expect(validate(v_port, '0')).toBeUndefined()
    expect(validate(v_port, '8080')).toBeUndefined()
    expect(validate(v_port, '65535')).toBeUndefined()
    expect((validate(v_port, '65536') as Error).message).toBe('端口号格式错误')
    expect((validate(v_port, '-1') as Error).message).toBe('端口号格式错误')
  })
})

describe('v_email', () => {
  it('放行合法邮箱，拦截缺少域名或 @ 的输入', () => {
    expect(validate(v_email, 'mu@example.com')).toBeUndefined()
    expect((validate(v_email, 'mu@example') as Error).message).toBe('邮箱地址格式错误')
    expect((validate(v_email, 'example.com') as Error).message).toBe('邮箱地址格式错误')
  })
})

describe('v_phone / v_tel / v_phoneOrTel', () => {
  it('v_phone 放行大陆手机号', () => {
    expect(validate(v_phone, '13800138000')).toBeUndefined()
    expect((validate(v_phone, '12345') as Error).message).toBe('手机号码格式错误')
  })

  it('v_tel 只接受连续数字（底层断言为 /^\\d{5,}$/）', () => {
    expect(validate(v_tel, '12345678')).toBeUndefined()
    expect((validate(v_tel, '021-12345678') as Error).message).toBe('电话号码格式错误')
  })

  it('v_phoneOrTel 手机号与座机号都放行', () => {
    expect(validate(v_phoneOrTel, '13800138000')).toBeUndefined()
    expect(validate(v_phoneOrTel, '12345678')).toBeUndefined()
    expect((validate(v_phoneOrTel, 'abc') as Error).message).toBe('电话号码格式错误')
  })
})

describe('v_ip', () => {
  it('放行 IPv4 / IPv6，拦截越界段', () => {
    expect(validate(v_ip, '192.168.1.1')).toBeUndefined()
    expect(validate(v_ip, '::1')).toBeUndefined()
    expect((validate(v_ip, '999.1.1.1') as Error).message).toBe('IP格式错误')
  })
})

describe('v_id_num', () => {
  it('放行 18 位身份证，拦截位数或校验位不符的输入', () => {
    expect(validate(v_id_num, '11010519491231002X')).toBeUndefined()
    expect((validate(v_id_num, '1101051949123') as Error).message).toBe('身份证格式错误')
  })
})

describe('v_latlong', () => {
  it('字符串与数组两种形态等价', () => {
    expect(validate(v_latlong, '39.9042,116.4074')).toBeUndefined()
    expect(validate(v_latlong, [39.9042, 116.4074])).toBeUndefined()
  })

  it('缺少逗号或数值越界时报错', () => {
    expect((validate(v_latlong, '39.9042') as Error).message).toBe('经纬度格式错误')
    expect((validate(v_latlong, '999,999') as Error).message).toBe('经纬度格式错误')
  })
})
