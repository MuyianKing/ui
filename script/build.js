import path from 'node:path'
import process from 'node:process'
import { getDir } from '@muyianking/build'
import { copySync, readJsonSync, removeSync, writeJsonSync } from 'fs-extra/esm'
import { build } from 'vite'
import config from './vite.config.js'

const __dirname = getDir(import.meta.url)

// 打包输出路径
const outputDir = `${process.cwd()}/dist`

function _copy(source, target) {
  copySync(path.resolve(__dirname, source), path.resolve(outputDir, target))
}

async function buildLib() {
  // 清除以前的打包文件
  removeSync(outputDir)

  // rslib打包
  await build(config)

  // 拷贝READMER.md
  _copy(`../../README.md`, `README.md`)

  // 拷贝LICENSE
  _copy(`../../LICENSE`, `LICENSE`)

  // 拷贝LICENSE
  _copy(`../../packages/theme-chalk/scss`, 'theme-chalk/scss')

  // 生成package.json
  const package_json = readJsonSync(path.resolve(__dirname, `../../package.json`))
  const new_package = {
    module: 'es/components/index.js',
    types: 'index.d.ts',
    type: 'module',
  }
    ;[
    'name',
    'type',
    'version',
    'exports',
    'dependencies',
    'publishConfig',
    'repository',
    'keywords',
    'homepage',
  ].forEach((key) => {
    new_package[key] = package_json[key]
  })

  writeJsonSync(path.resolve(outputDir, `package.json`), new_package, {
    spaces: 2,
  })
}

buildLib()
