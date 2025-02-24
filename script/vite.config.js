import process from 'node:process'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import StylePathAlias from './vite-plugins/style.path.alias.js'

const root = process.cwd()

export default {
  build: {
    outDir: `${root}/dist`,
    rollupOptions: {
      preserveEntrySignatures: 'strict',
      external: [
        /^@muyianking\//,
        /^@ui\/theme-chalk\//,
        'vue',
        /^element-plus/,
        '@vueuse/core',
        'dayjs',
        'lodash-es',
        'validator',
        'js-cookie',
        'nanoid',
        /^@multiavatar\/multiavatar/,
        /^wavesurfer/,
        '@iconify/vue',
      ],
      output: [
        {
          format: 'es',
          exports: 'named',
          preserveModules: true,
          dir: './dist',
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
    StylePathAlias(),
    vue(),
    vueJsx(),
    dts({
      outDir: `${root}/dist`,
      rollupTypes: true,
    }),
  ],
}
