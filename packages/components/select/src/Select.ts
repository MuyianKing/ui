export type OptionsValue = string | number

export interface OptionsType {
  label: string
  value: OptionsValue
  children?: OptionsType[]
}