export default {
  extends: ['@muyianking/config/commitlint.config.js'],
  rules: {
    // 覆盖共享配置的 type-enum：script/publish.js 的发布提交使用 release 前缀
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'revert',
        'chore',
        'release',
      ],
    ],
  },
}
