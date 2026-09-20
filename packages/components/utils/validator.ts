import { isEmail, isIdcardAll, isInt, isIP, isLatLong, isMobilePhone, isPort, isTelphone } from '@muyianking/utils'

/**
 * element-plus 中 rule.validator 的回调契约。
 *
 * 必须恰好调用一次：async-validator 只在回调被调用、或返回值是
 * true/false/Array/Error/thenable 时才结算。返回 undefined 又不调回调
 * 会让 validate() 永久 pending —— 表单提交会静默失效（无报错、无 loading、
 * 也永远不 resolve），排查成本极高。
 */
export type ValidateCallback = (error?: Error) => void

export type RuleValidator = (rule: any, value: any, callback: ValidateCallback) => void

function isEmpty(value: any): boolean {
  if (Array.isArray(value))
    return value.length === 0
  return value === '' || value === null || value === undefined
}

/**
 * 把「纯断言」包装成 element-plus 校验规则。
 *
 * 空值一律放行，交由 required 规则处理，避免一个字段同时报两条错误；
 * 这也是必需的 —— @muyianking/utils 的断言对空串行为并不一致
 * （isIdcardAll('') 为 true，其余多为 false），不能直接拿断言当空值判断。
 */
function createRule(test: (value: string) => boolean, message: string): RuleValidator {
  return (_rule, value, callback) => {
    if (isEmpty(value)) {
      callback()
      return
    }
    callback(test(String(value)) ? undefined : new Error(message))
  }
}

/**
 * 车牌正则。@muyianking/utils 未提供对应断言，本地维护。
 */
const CAR_NUM_REG = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z][A-Z][A-Z0-9]{4,5}[A-Z0-9挂学警港澳]$/

/** 验证整数 */
export const v_int = createRule(isInt, '只能是整数')

/** 验证车牌 */
export const v_carnum = createRule(value => CAR_NUM_REG.test(value), '车牌格式错误')

/** 验证端口号（0 - 65535） */
export const v_port = createRule(isPort, '端口号格式错误')

/** 验证邮箱 */
export const v_email = createRule(isEmail, '邮箱地址格式错误')

/** 验证手机号（支持中国大陆、香港、澳门、台湾） */
export const v_phone = createRule(isMobilePhone, '手机号码格式错误')

/** 验证座机号 */
export const v_tel = createRule(isTelphone, '电话号码格式错误')

/** 验证 IP（IPv4 与 IPv6） */
export const v_ip = createRule(isIP, 'IP格式错误')

/** 验证身份证 */
export const v_id_num = createRule(isIdcardAll, '身份证格式错误')

/** 验证手机号或座机号 */
export const v_phoneOrTel = createRule(
  value => isMobilePhone(value) || isTelphone(value),
  '电话号码格式错误',
)

/**
 * 验证经纬度。
 *
 * 与其余校验不同，经纬度天然是成对出现的，所以值允许两种形态：
 * `"纬度,经度"` 字符串，或 `[纬度, 经度]` 数组。
 */
export const v_latlong: RuleValidator = (_rule, value, callback) => {
  if (isEmpty(value)) {
    callback()
    return
  }
  const text = Array.isArray(value) ? value.join(',') : String(value)
  callback(isLatLong(text) ? undefined : new Error('经纬度格式错误'))
}
