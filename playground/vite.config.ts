import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vite'
import useAlias from './alias.config.ts'

const { alias_map } = useAlias()

export default defineConfig({
  // 固定 root 到 playground 目录：否则从仓库根执行 vite 时 root 会落到根目录、
  // 找不到这里的 index.html（根 dev 脚本正是从根目录启动的）
  root: import.meta.dirname,
  css: {
    postcss: {
      plugins: [
        // tailwind 默认只在 process.cwd() 下找 tailwind.config.js，
        // 而 dev 脚本是从仓库根启动 vite 的，必须显式指定配置路径
        tailwindcss({ config: resolve(import.meta.dirname, 'tailwind.config.js') }),
      ],
    },
  },
  resolve: {
    alias: {
      ...alias_map,
      '@muyianking/ui': resolve(import.meta.dirname, '../packages/components/index.ts'),
    },
  },
  optimizeDeps: {
    include: ['@muyianking/components', '@muyianking/ui'],
  },
  plugins: [
    vue(),
    vueJsx(),
  ],
})
