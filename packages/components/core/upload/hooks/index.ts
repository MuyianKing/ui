import type { Ref } from 'vue'
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
 * 根据新的文件生成新的需要渲染的文件
 * @param files 新文件
 * @param file_list_ref
 */
export function comp_file_list(files: any[], file_list_ref: Ref<any[]>, previewFileUrl: (file: any) => string) {
  files.forEach((file, index) => {
    const new_file = {
      uuid: file.uuid,
      name: file.name,
      config: file.config,
      hover: false,
    }
    if (file.file instanceof File) {
      new_file.src = URL.createObjectURL(file.file)
    } else {
      new_file.src = previewFileUrl(file.file)
    }

    // 简单做一个差量，否则会闪一下
    if (file_list_ref.value[index]) {
      // 只要索引和uuid不同就替换
      if (file_list_ref.value[index].uuid !== new_file.uuid) {
        file_list_ref.value[index] = new_file
      }
    } else {
      file_list_ref.value.push(new_file)
    }
  })

  // 删掉多余的
  file_list_ref.value.splice(files.length)
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
