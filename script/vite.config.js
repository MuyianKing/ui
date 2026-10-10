import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Icons from 'unplugin-icons/vite'
import dts from 'vite-plugin-dts'
import StylePathAlias from './vite-plugins/style.path.alias.js'

// 与 build.js 保持同一个根目录，避免从子目录执行 pnpm build 时
// 产物写入目录和拷贝/生成 package.json 的目录错位
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export default {
  build: {
    // Vite 8 默认 target 已到 2026 baseline，产物会混入 ||= 等新语法；es2020 等价于 Vite 6 的 'modules'
    target: 'es2020',
    outDir: `${root}/dist`,
    rolldownOptions: {
      external: [
        /^@muyianking\//,
        'vue',
        /^element-plus/,
        '@vueuse/core',
        'dayjs',
        'echarts',
        'lodash-es',
        'validator',
        'js-cookie',
        'nanoid',
        /^wavesurfer/,
        '@iconify/vue',
      ],
      output: [
        {
          format: 'es',
          exports: 'named',
          preserveModules: true,
          dir: `${root}/dist`,
          entryFileNames(file) {
            if (file.name !== 'resolver') {
              return `es/[name].js`
            }
            return 'resolver.js'
          },
        },
      ],
      treeshake: true,
    },
    lib: {
      entry: [
        `${root}/packages/components/index.ts`,
        `${root}/packages/components/resolver.ts`,
      ],
    },
  },
  plugins: [
    // 图标构建期从 @iconify/json 打包（~icons/<集>/<名>），不依赖运行时联网拉取
    Icons({ compiler: 'vue3' }),
    StylePathAlias(),
    vue(),
    vueJsx(),
    dts({
      outDir: `${root}/dist`,
      bundleTypes: true,
    }),
  ],
}
