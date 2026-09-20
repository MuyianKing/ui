import { AUDIO_SUFFIX, FILE_SUFFIX, getMimeType, IMAGE_SUFFIX, VIDEO_SUFFIX } from '@muyianking/utils'

const type_map: Record<string, string[]> = {
  image: IMAGE_SUFFIX,
  video: VIDEO_SUFFIX,
  file: FILE_SUFFIX,
  audio: AUDIO_SUFFIX,
}

/**
 * 根据文件类型和后缀获取可选的文件的所有后缀
 * @param type 文件类型
 * @param suffix 文件后缀
 */
export function getAllType(type: string | string[], suffix: string | string[]) {
  try {
    let _type_list: string[] = []

    // 根据类型设置所选文件后缀
    const _type = Array.isArray(type) ? type : (type ? [type] : [])

    _type.forEach((t) => {
      _type_list = _type_list.concat(type_map[t] || [])
    })

    if (suffix) {
      const suffixList = Array.isArray(suffix) ? suffix : [suffix]
      if (suffixList.length > 0) {
        // 设置类型取两者的交集
        const new_mine_type: string[] = []
        suffixList.forEach((s) => {
          if (_type_list.length === 0 || _type_list.includes(s)) {
            new_mine_type.push(s)
          }
        })

        _type_list = new_mine_type

        if (_type_list.length === 0) {
          console.warn('type和suffix设置冲突')
        }
      }
    }

    return _type_list
  } catch (error) {
    console.log(error)
  }
}

/**
 * 根据文件类型和后缀获取可选的文件的acceptT_type
 * @param type 文件类型
 * @param suffix 文件后缀
 */
export function getAcceptType(type: string | string[], suffix: string | string[]) {
  const _type_list = getAllType(type, suffix)

  if (!_type_list || _type_list.length === 0) {
    return '*/*'
  }

  return getMimeType(_type_list)
}
