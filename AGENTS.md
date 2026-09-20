# AGENTS.md

本文件是本仓库的 AI Coding Agent 约束。第 0 章为跨项目通用约束（已并入本文件），第 1 章起为项目专属约束。

## 0. 通用约束

### 修改原则

- 修改文件前先读取并理解现有实现，沿用所在模块的代码风格、命名和技术模式。
- 只做完成用户需求所需的最小修改，不进行无关重构。
- 新增依赖前先检查项目已有依赖、组件、插件和工具；能复用则不引入同类库。
- 不主动创建 README、CI、Docker、测试配置、类型声明或其他非用户要求文件。
- 修改多个关联文件时，保持接口、命名、数据结构和调用链一致。
- 先检查相关文件和既有调用方式，不仅凭文件名或常见框架习惯猜测实现。

### 验证与 Git

- 较大代码修改后运行项目已有的静态检查或测试命令；没有对应脚本时，不假设或自行引入测试框架。
- 默认不执行 Git 提交，除非用户明确要求。
- 用户要求提交时，先检查 `git status`、`git diff` 和近期提交风格。
- 不泄露、输出或提交密钥、令牌、内部地址及其他敏感配置。
- 禁止执行 `git reset --hard`、`git clean -f`、强制推送等破坏性 Git 操作，除非用户明确要求。
- 输出项目文件引用时使用可跳转的绝对路径链接。

## 1. 项目边界

- 项目性质：Vue 3 组件库 `@muyianking/ui`（当前 0.0.1-beta.7），pnpm workspace 单仓多包，工作区为 packages/** 与 test/**。
- 技术栈：TypeScript 5.9.3 + Vue 3.5.35 SFC + Vite 8.3.0（Rolldown）+ vite-plugin-dts 5.1.0；包管理 pnpm，Node 需满足 ^20.19.0 || >=22.12.0。
- 运行期依赖只有 @iconify/vue 4.3.0、@muyianking/utils 0.2.0、@vueuse/core 12.8.2、element-plus 2.14.1、vue 3.5.35；UI 能力一律基于 Element Plus 二次封装。
- vue 与 element-plus 只允许存在于 peerDependencies（build.js 中显式排除），写入 dependencies 会导致消费者装出第二份 Element Plus、打断 provide/inject 并体积翻倍。
- 项目未引入测试框架，禁止自行引入 vitest / jest / @vue/test-utils 或新增测试配置。
- 禁止引入其它 UI 组件库（ant-design-vue、naive-ui、vant 等）、CSS 预处理器（Sass/Less/Stylus）、axios、Vuex；Tailwind 只存在于 test 演示应用，不得装进组件库本体。

## 2. 文件落位

- 组件统一位于 packages/components/core/<kebab-case>/，目录内固定三件：index.ts 入口、src/Index.vue 主实现、style/index.ts 样式入口。
- 同一组件的变体（如按钮族的 AddButton.vue、DelButton.vue）放该组件 src/ 下；子组件放 components/ 子目录；组合式函数放 src/useXxx.ts 或 hooks/index.ts。
- 组件样式写在 packages/theme-chalk/css/<kebab-case>.css，`.vue` 文件中不写 `<style>` 块（当前 49 个组件文件均为零 style 块）。
- 跨组件公共类型集中放 packages/components/core/types/common.ts；表单校验规则放 packages/components/utils/validator.ts；ElMessage/ElLoading 等反馈封装放 packages/components/utils/message.ts。
- 库的对外出口唯一为 packages/components/index.ts；新增组件必须在此文件补导出，否则消费方取不到。
- 演示与调试代码只写 test/src（views/ 页面、components/common 包装组件、layout、router、pinia），不得在 packages/ 下新增演示代码。
- 构建与发布脚本固定在 script/（build.js 负责产物与 dist/package.json 生成，publish.js 负责版本、CHANGELOG、提交打标）。

## 3. 编码规范

- 一律 `<script setup lang="ts">` + `defineOptions({ name: 'MuXxx' })`，组件对外名统一 Mu 前缀。
- props 用 `withDefaults(defineProps<{...}>(), {...})` 声明类型与默认值，emits 用 `defineEmits<{ (e: 'change'): void }>()` 或元组写法，不写 Options API。
- 组件入口 index.ts 固定模式：`import './style/index'` + `export const MuXxx = Index` + `export default Index`；多组件文件逐个命名导出。
- packages/components/resolver.ts 的 MuUiResolver 必须保留 `name.startsWith('Mu')` 短路，否则会 claim 消费者自己的组件名并产出无效 import。
- 从 utils/validator.ts 直接向公共入口导出校验函数（v_tel、v_id_num 等）：仅被组件内部引用的规则会被 tree-shake，发布包里取不到。
- 依赖第三方库时从具名路径导入（如 element-plus、element-plus/es/components/date-picker-panel/src/types、@muyianking/utils 的具体函数），不整包导入。
- tsconfig.json 开启 strict、noUnusedLocals、noUnusedParameters、isolatedModules，include 仅覆盖 packages/components，因此 test/ 不参与 typecheck。
- 遵循仓库 ESLint（@antfu/eslint-config + @muyianking/config）风格：2 空格缩进、单引号、无分号、注释与文案使用中文；格式化由 eslint --fix 完成，仓库已关闭 Prettier。

## 4. 样式与 UI

- 组件模板直接使用 Tailwind 工具类（flex、items-center、mr-1、cursor-pointer 等），由使用方应用的 Tailwind 扫描生成；库本体不提供 Tailwind 配置。
- 每个组件 style/index.ts 先 import element-plus/es/components/<组件>/style/css，再 import @muyianking/theme-chalk/css/<组件>.css，保持该顺序。
- style/index.ts 中的 `@muyianking/theme-chalk` 路径由 script/vite-plugins/style.path.alias.js 在构建期改写为 `@muyianking/ui/theme-chalk`，不要手动改成发布路径。
- 主题样式只写语义类名（.mu-button、.mu-search-page 等 mu- 前缀），不写行内样式；布局间距优先用工具类而非 CSS 普通属性。
- 全局能力经 MuConfigProvider provide 的 `GLOBAL_CUSTOM_CONFIG` 注入，组件用 `inject('GLOBAL_CUSTOM_CONFIG')` 读取 uploadFile、previewFileUrl、downloadFile、getIcons、tableIcon、buttonIcon 等配置，不新增全局单例。
- MuConfigProvider 必须把 $attrs 透传给 el-config-provider，否则 locale / size / zIndex 丢失。

## 5. 依赖与构建

- 构建外部化清单在 script/vite.config.js 中维护（vue、element-plus、@vueuse/core、echarts、dayjs、lodash-es、validator、js-cookie、nanoid、wavesurfer、@iconify/vue、@muyianking/\*），新增运行期依赖需同步登记。
- dist/package.json 的 sideEffects 中 `es/**/style/index.js` 不可删除：Rolldown 保留独立 style 入口，缺这条会让消费者静默丢失全部样式。
- 构建产物为 preserveModules ESM，入口 packages/components/index.ts 与 resolver.ts，样式自 packages/theme-chalk/css 拷贝至 dist/theme-chalk/css。
- test 应用通过 test/alias.config.ts 的别名（@、@layout、@views、@pinia、@comp）与 `@muyianking/ui` → packages/components/index.ts 直连源码，改组件后无需构建即可在 pnpm dev 中验证。
- 演示应用的路由在 test/src/router/menu/index.ts 维护，新增组件演示页需同时登记路由与 views 页面。
- 提交信息遵循 @muyianking/config/commitlint.config.js（Conventional Commits），pre-commit 由 husky + lint-staged 对 \*.{js,ts,vue} 执行 eslint --fix。

## 6. Agent 操作与验证

- 可用命令：pnpm dev（启动 test 演示应用）、pnpm lint、pnpm lint:fix、pnpm typecheck（vue-tsc，仅覆盖 packages/components）、pnpm build（输出 dist/）、pnpm release（发布流程，含提交与打标，非用户明确要求不得执行）。
- 组件改动后的验证顺序：pnpm lint → pnpm typecheck → pnpm build，再用 pnpm dev 在 test/src/views 对应页面手动确认。
- 不要直接修改 dist/ 产物或 CHANGELOG.md，二者均由脚本生成（dist 已被 .gitignore 忽略）。
- 不要改动 package.json 的 version，版本由 script/publish.js 维护。
