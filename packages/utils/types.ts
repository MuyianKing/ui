export function transformBooleanToNum(val: string | number | boolean) {
  if (typeof val === 'boolean') {
    return +val
  }

  return val
}
