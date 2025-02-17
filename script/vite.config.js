import process from 'node:process'
import vue from '@vitejs/plugin-vue'
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
          dir: './dist/es',
          entryFileNames: '[name].js',
        },
      ],
      treeshake: true,
    },
    lib: {
      entry: [
        `${root}/packages/components/index.ts`,
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
