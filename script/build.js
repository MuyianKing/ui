import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { copySync, readJsonSync, removeSync, writeJsonSync } from 'fs-extra/esm'
import { build } from 'vite'
import config from './vite.config.js'

// 注意：@muyianking/build 的 getDir() 返回的是文件路径而非目录，
// 之前 script 里的 '../../xxx' 全靠那个文件名占掉一层才碰巧正确。这里显式取目录。
const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(scriptDir, '..')

// 打包输出路径
const outputDir = path.join(rootDir, 'dist')

function _copy(source, target) {
  copySync(path.resolve(rootDir, source), path.resolve(outputDir, target))
}

// vue / element-plus 只保留在 peerDependencies。
// 同时出现在 dependencies 里会在消费者版本不匹配时装出嵌套的第二份 Element Plus，
// 双实例会打断 provide/inject 并翻倍样式体积。
const peerDependencies = {
  'vue': '>=3.0.0',
  'element-plus': '>=2.0.0',
}

async function buildLib() {
  // 清除以前的打包文件
  removeSync(outputDir)

  // rslib打包
  await build(config)

  // 拷贝READMER.md
  _copy('README.md', 'README.md')

  // 拷贝LICENSE
  _copy('LICENSE', 'LICENSE')

  // 拷贝样式
  _copy('packages/theme-chalk/css', 'theme-chalk/css')

  // 生成package.json
  const package_json = readJsonSync(path.resolve(rootDir, 'package.json'))
  const dependencies = Object.fromEntries(
    Object.entries(package_json.dependencies ?? {})
      .filter(([name]) => !(name in peerDependencies)),
  )

  const new_package = {
    name: package_json.name,
    version: package_json.version,
    type: 'module',
    main: 'es/index.js',
    module: 'es/index.js',
    types: 'index.d.ts',
    // 产物里的样式说明符是自引用的 '@muyianking/ui/theme-chalk/*'，
    // 没有 exports 字段时原生 Node ESM 不承认包自引用，这里一并放行子路径
    exports: {
      '.': {
        types: './index.d.ts',
        import: './es/index.js',
        default: './es/index.js',
      },
      './resolver': {
        types: './resolver.d.ts',
        default: './resolver.js',
      },
      // 放开深导入出口（'@muyianking/ui/es/core/button/index.js'）。
      // resolver 本身已不再依赖这条：它只返回 from: '@muyianking/ui'，走上面的 '.'
      './es/*': './es/*',
      './theme-chalk/*': './theme-chalk/*',
      './package.json': './package.json',
    },
    sideEffects: [
      '**/*.css',
      // Vite 6 的 Rollup 会把 style/index.ts 摊平进 es/core/<comp>/index.js，此条冗余；
      // 但 Vite 8 的 Rolldown 保留独立的 style/index.js 且内容只有 CSS 副作用导入，
      // 少了这条消费者会静默丢光全部样式（实测 34.29 kB CSS → 0）。
      'es/**/style/index.js',
    ],
    files: [
      'es/',
      'theme-chalk/',
      'index.d.ts',
      'resolver.js',
      'resolver.d.ts',
      'package.json',
    ],
    peerDependencies,
    dependencies,
    publishConfig: package_json.publishConfig,
    repository: package_json.repository,
    keywords: package_json.keywords,
    homepage: package_json.homepage,
  }

  writeJsonSync(path.resolve(outputDir, 'package.json'), new_package, {
    spaces: 2,
  })
}

buildLib()
