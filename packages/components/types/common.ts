export interface OptionsType {
  label: string
  value: string | number | boolean
  children?: OptionsType[]
}

export type StrNumBoolean = string | number | boolean
