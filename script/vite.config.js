import process from 'node:process'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import StylePathAlias from './vite-plugins/style.path.alias.js'

const root = process.cwd()

export default {
  root: `${root}/packages/components`,

  build: {
    outDir: `${root}/dist`,
    rollupOptions: {
      preserveEntrySignatures: 'strict',
      external: [
        /^@muyianking\//,
        /^@theme-chalk\//,
        'vue',
        /^element-plus/,
        '@vueuse/core',
        'dayjs',
        'lodash-es',
        'validator',
        'js-cookie',
        'nanoid',
        '@iconify/vue',
        /^@multiavatar\/multiavatar/,
        /^wavesurfer/,
      ],
      output: [
        {
          format: 'es',
          exports: 'named',
          preserveModules: true,
          dir: './dist',
          entryFileNames(chunkInfo) {
            return chunkInfo.name === 'resolver' ? '[name].js' : 'es/[name].js'
          },
        },
      ],
      treeshake: false,
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
    dts({
      outDir: `${root}/dist`,
      rollupTypes: true,
    }),
  ],
}
