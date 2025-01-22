import path from 'node:path'
import { clearFolder, copy, exec, getDir, getObjectFromJson, objectToJson } from '@muyianking/build'
import { build } from "vite"
import config from "./vite.config.js"

const __dirname = getDir(import.meta.url)

// 打包输出路径
const outputDir = process.cwd() + '/dist'

function _copy(source, target) {
  copy(path.resolve(__dirname, source), path.resolve(outputDir, target))
}

async function buildLib() {
  // 清楚以前的打包文件
  clearFolder(outputDir)

  // rslib打包
  await build(config)

  // 拷贝READMER.md
  _copy(`../../README.md`, `README.md`)

  // 拷贝LICENSE
  _copy(`../../LICENSE`, `LICENSE`)

  // 生成package.json
  const package_json = getObjectFromJson(path.resolve(__dirname, `../../package.json`))
  const new_package = {}
    ;[
      'name',
      'type',
      'version',
      'exports',
      'main',
      'module',
      'types',
      'dependencies',
      'publishConfig',
      'repository',
      'keywords',
      'homepage',
    ].forEach((key) => {
      new_package[key] = package_json[key]
    })

  objectToJson(path.resolve(outputDir, `package.json`), new_package)
}

buildLib()
