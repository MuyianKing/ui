import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tailwindcss from 'tailwindcss'
import { defineConfig } from 'vite'
import useAlias from './alias.config'

const { alias_map } = useAlias()

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        tailwindcss,
      ],
    },
  },
  resolve: {
    alias: alias_map,
  },
  optimizeDeps: {
    include: ['@muyianking/components'],
    force: true,
  },
  plugins: [
    vue(),
    vueJsx(),
  ],
})
