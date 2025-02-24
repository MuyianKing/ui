export interface OptionsType {
  label: string
  value: string | number | boolean
  children?: OptionsType[]
}

export type StrNumBoolean = string | number | boolean

export interface ContentMenuOptionsType {
  label: string
  icon?: string
  color?: string
}

export type ArrayOfFunctions = Array<(...args: any[]) => any>

export interface DefaultSlot {
  default?: () => string
}
