/**
 * 将联合类型中的布尔类型转为数字
 */
export function transformBooleanToNum(val: string | number | boolean) {
  if (typeof val === 'boolean') {
    return +val
  }

  return val
}
