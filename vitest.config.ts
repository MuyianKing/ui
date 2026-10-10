import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vitest/config'

// 与 playground/vite.config.ts 同样的思路：测试直连源码，不走 dist 构建产物
const root = import.meta.dirname

export default defineConfig({
  plugins: [Icons({ compiler: 'vue3' }), vue(), vueJsx()],
  resolve: {
    alias: {
      '@muyianking/ui': resolve(root, 'packages/components/index.ts'),
      // style/index.ts 里写的是源码期路径，构建期由 script/vite-plugins/style.path.alias.js 改写。
      // 测试跑在源码期，这里按同一个语义补别名，否则组件入口的样式导入解析不到。
      '@muyianking/theme-chalk': resolve(root, 'packages/theme-chalk'),
    },
  },
  test: {
    environment: 'happy-dom',
    include: ['packages/**/*.spec.ts'],
    // 变换产物跨进程/跨次运行缓存（默认 false），显著缩短重复跑测试的冷启动；
    // 缓存落在 node_modules/.vitest-cache，由依赖重装自然失效。
    fsModuleCache: true,
    server: {
      deps: {
        // 组件入口带样式副作用（element-plus/es/**/style/css → theme-chalk/*.css）。
        // element-plus 默认被当成外部依赖交给 Node 直接 import，遇到 .css 会抛
        // 「Unknown file extension ".css"」，必须内联进来交给 Vite 处理（css: false 时被忽略）。
        inline: ['element-plus'],
      },
    },
  },
})
