import antfu from '@antfu/eslint-config'
import eslint from '@muyianking/config/eslint.config.js'

export default antfu({
  formatters: true,
  ignores: ['**/public/**'],
}, {
  rules: {
    ...eslint,
    'vue/custom-event-name-casing': 0,
    'test/prefer-lowercase-title': 0,
  },
  files: ['**/src/**', '**/script/**', '**/packages/**', '**/*.config.*'],
}, {
  // @antfu/eslint-config 9 的 unused-imports/no-unused-vars 在纯 JS 文件上会误报
  // 「is assigned a value but only used as a type」（最小用例可复现，.ts / .vue 不受影响），
  // 因此 JS 文件退回 ESLint 内置 no-unused-vars，保留未使用变量的检查能力。
  //
  // 这份覆盖只能限死在 JS：内置 no-unused-vars 不认类型位置，把它套到 .ts 上会把
  // 函数类型签名里的参数名一律判成未使用（如 core/types/common.ts 的 `(...args: any[]) => any`、
  // utils/validator.ts 的 `(rule, value, callback) => void`），而这些参数名是给消费者看的类型文档。
  // .ts 的未使用变量仍由 antfu 默认的 typescript-eslint + unused-imports 规则覆盖，别扩到这里。
  files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
  rules: {
    'no-unused-vars': ['error', {
      args: 'after-used',
      argsIgnorePattern: '^_',
      ignoreRestSiblings: true,
      vars: 'all',
      varsIgnorePattern: '^_',
    }],
    'unused-imports/no-unused-vars': 'off',
  },
}, {
  // pnpm/yaml-enforce-settings 要求 trustPolicy: no-downgrade，但该策略会让本仓库
  // 直接装不上依赖（chokidar@4.0.3 被判为 High-risk trust downgrade），
  // 因此关闭该规则，保留仓库原有的 pnpm 供应链设置。
  files: ['**/pnpm-workspace.yaml'],
  rules: {
    'pnpm/yaml-enforce-settings': 'off',
  },
})
