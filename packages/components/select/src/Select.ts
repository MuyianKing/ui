export type OptionsValue = string | number

export interface OptionsType {
  label: string
  value: OptionsValue
  children?: OptionsType[]
}


type MyFunc = (txt: string) => void;

export const selectEmits = {
  change: MyFunc
}