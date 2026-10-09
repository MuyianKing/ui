export default {
  theme: {
    extend: {},
  },
  important: true,
  content: {
    // dev 脚本从仓库根启动 vite，process.cwd() 不是 playground；
    // 不开启 relative 时 content 路径会按 cwd 解析，导致一个文件都扫不到
    relative: true,
    files: [
      './index.html',
      './src/**/*.{vue,js,ts,jsx,tsx}',
      '../node_modules/@muyianking/components/**/*.{vue,js,ts,jsx,tsx}',
    ],
  },
  plugins: [],
}
