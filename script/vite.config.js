import process from 'node:process'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

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
          dir: './dist/es',
          entryFileNames: '[name].js',
        },
      ],
      treeshake: false,
    },
    lib: {
      entry: [
        `${root}/packages/components/index.ts`,
      ],
    },
  },
  plugins: [
    vue(),
    dts({
      outDir: `${root}/dist/es`,
    }),
  ],
}
