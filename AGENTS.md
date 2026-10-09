# AGENTS.md

本文件是本仓库的 AI Coding Agent 约束。第 0 章为跨项目通用约束（已并入本文件），第 1 章起为项目专属约束。

业务文档中心是 `docs/README.md`：组件自身的业务逻辑写在 `docs/<组件>.md`，不写进本文件。本文件只保留跨组件的稳定工程约束，两者的分工与同步要求见第 3 章。

## 0. 通用约束

### 修改原则

- 修改文件前先读取并理解现有实现，沿用所在模块的代码风格、命名和技术模式。
- 只做完成用户需求所需的最小修改，不进行无关重构。
- 新增依赖前先检查项目已有依赖、组件、插件和工具；能复用则不引入同类库。
- 不主动创建 README、CI、Docker、测试配置、类型声明或其他非用户要求文件；文档是唯一例外，组件改动必须同步 `docs/` 对应文档（第 3 章）。
- 修改多个关联文件时，保持接口、命名、数据结构和调用链一致。
- 先检查相关文件和既有调用方式，不仅凭文件名或常见框架习惯猜测实现。

### 组件设计

- 组件保持高内聚低耦合：父组件负责页面编排与数据准备，子组件经 props 入、emits 出，不反向依赖宿主页面内部状态。
- 禁止用 DOM 查询、隐式全局变量或事件总线传递核心业务数据；跨层共享一律走 provide/inject，本库只有 MuConfigProvider 的 `GLOBAL_CUSTOM_CONFIG` 一处全局配置。
- 复杂交互按职责拆子组件：upload 已拆 Trigger / Preview / Progress，其余弹窗、表单、列表沿用同一模式。
- 需要外部能力的组件（上传、预览、下载、图标）只声明依赖并 `inject` 读取，不自行实现，也不新增全局单例。
- 组件的业务语义与边界不靠代码注释承载，写进该组件的 `docs/<组件>.md`（第 3 章）。

### 验证与 Git

- 较大代码修改后运行项目已有的静态检查或测试命令；没有对应脚本时，不假设或自行引入测试框架。
- 默认不执行 Git 提交，除非用户明确要求。
- 用户要求提交时，先检查 `git status`、`git diff` 和近期提交风格。
- 不泄露、输出或提交密钥、令牌、内部地址及其他敏感配置。
- 禁止执行 `git reset --hard`、`git clean -f`、强制推送等破坏性 Git 操作，除非用户明确要求。
- 输出项目文件引用时使用可跳转的绝对路径链接。

## 1. 项目边界

- 项目性质：Vue 3 组件库 `@muyianking/ui`（当前 0.0.1-beta.7），pnpm workspace 单仓多包，工作区成员为 `packages/**` 与 `playground`（演示应用，直连源码，依赖随根 `pnpm install` 一起安装）。
- 技术栈：TypeScript 5.9.3 + Vue 3.5.43 SFC + Vite 8.3.4（Rolldown）+ vite-plugin-dts 5.1.2；包管理 pnpm，Node 需满足 ^20.19.0 || >=22.12.0。
- 运行期依赖只有 @iconify/vue 5.0.3、@muyianking/utils 0.2.1、@vueuse/core 15.0.0、element-plus 2.14.7、vue 3.5.43；UI 能力一律基于 Element Plus 二次封装。
- vue 与 element-plus 只允许存在于 peerDependencies（build.js 中显式排除），写入 dependencies 会导致消费者装出第二份 Element Plus、打断 provide/inject 并体积翻倍。
- 项目未引入测试框架，禁止自行引入 vitest / jest / @vue/test-utils 或新增测试配置。
- 禁止引入其它 UI 组件库（ant-design-vue、naive-ui、vant 等）、CSS 预处理器（Sass/Less/Stylus）、axios、Vuex；Tailwind 只存在于演示应用 playground（仅其 devDependencies），不得装进组件库本体。

## 2. 文件落位

- 组件统一位于 `packages/components/core/<kebab-case>/`，目录内固定三件：index.ts 入口、src/Index.vue 主实现、style/index.ts 样式入口；唯一例外是 upload（主实现为 `core/upload/Index.vue`，无 src/ 层）。
- 同一组件的变体（如按钮族的 AddButton.vue、DelButton.vue）放该组件 src/ 下；子组件放 components/ 子目录；组合式函数放 src/useXxx.ts 或 hooks/index.ts。
- 组件样式写在 `packages/theme-chalk/css/<kebab-case>.css`，`.vue` 文件中不写 `<style>` 块（当前 49 个 .vue 文件均为零 style 块）。
- 跨组件公共类型集中放 `packages/components/core/types/common.ts`；表单校验规则放 `packages/components/utils/validator.ts`；ElMessage/ElLoading 等反馈封装放 `packages/components/utils/message.ts`。
- 库的对外出口唯一为 `packages/components/index.ts`；新增组件必须在此文件补导出，否则消费方取不到。
- 演示与调试代码只写 `playground/src`（views 页面、components/common 包装组件、layout、router、pinia），不得在 `packages/` 下新增演示代码。
- 文档落位：`docs/<kebab-case>.md` 与 `packages/components/core/<同名目录>` 一对一（当前 35 个组件 35 份齐全）；索引与跨组件通用业务规则在 `docs/README.md`，样式体系细节在 `docs/theme-chalk.md`。
- 构建与发布脚本固定在 `script/`（build.js 负责产物与 dist/package.json 生成，publish.js 负责版本、CHANGELOG、提交打标）。

## 3. 文档与业务逻辑

- 单一归宿：组件自身的业务逻辑（实现要点、内部状态、副作用、边界与坑、依赖前提）只写在该组件的 `docs/<组件>.md`。AGENTS.md 不逐组件罗列业务规则，跨组件的通用业务规则写 `docs/README.md`；新发现的业务细节补进对应文档，而不是补进本文件。
- 一组件一份：文件名 kebab-case，与 `packages/components/core/` 目录同名；多文件组件（button 族、upload 及其子组件）合并进同一份；空章节写「无。」但保留标题。
- 结构固定：按 `docs/README.md` 第 4 节模板 —— 头部五要素（组件目录 / 对外导出 / 样式入口 / 演示页面 / 依赖），正文依次为基础用法 / Props / Emits / Slots / 暴露 / 业务逻辑 / 约束与注意事项 / 相关；头部「演示页面」必须与 `playground/src/views/` 实际路径一致，无则写「暂无」。
- 内容必须来自源码：Props / Emits / Slots / 暴露逐条对应 `withDefaults`、`defineEmits`、`defineSlots`、`defineExpose` 与模板插槽，不凭印象补 Element Plus 的属性；经 `v-bind="$attrs"` 透传的能力只写「其余属性透传给 el-xxx」，不逐条列举。
- 代码改动必须同步文档（完成定义）：改动 `packages/` 下任何组件时，同一次改动内更新对应文档 —— ① props / emits / slots / 暴露变化 → 对应表格；② 行为、默认值语义、边界、失败处理变化 → 「业务逻辑」「约束与注意事项」；③ 样式类名增删 → 头部样式入口与 `docs/theme-chalk.md`；④ 新增组件 → 新建 `docs/<组件>.md` 并在 `docs/README.md` 索引表登记；⑤ 演示页增删 → 头部「演示页面」。文档未同步即视为改动未完成，不得报告完成。
- 改前先读文档：动某个组件前先读它的 `docs/<组件>.md`，了解既有业务约定（如 upload 的 `uploadFile` 返回结构、form-item 的 `uploadLoading` 校验联动），不推翻或遗漏既有语义。
- 冲突即缺陷：文档与实现不一致时当场对齐（改代码或改文档），不允许两种说法并存；不确定的细节以读源码为准，不照抄 Element Plus 官网或凭印象推断。
- 示例可运行：基础用法示例取自 playground 演示页或源码，遵循仓库风格（2 空格缩进、单引号、无分号、中文文案），不写未经验证的伪代码。
- 校验：`docs/*.md` 由 ESLint 的 format/prettier 统一格式化（表格对齐、行尾），改完跑 `pnpm lint:fix`，不手工对齐表格空格；文档为手写内容，不为它新增生成脚本、校验脚本或 CI。

## 4. 编码规范

- 一律 `<script setup lang="ts">` + `defineOptions({ name: 'MuXxx' })`，组件对外名统一 Mu 前缀。
- props 用 `withDefaults(defineProps<{...}>(), {...})` 声明类型与默认值，emits 用 `defineEmits<{ (e: 'change'): void }>()` 或元组写法，不写 Options API。
- 组件入口 index.ts 固定模式：`import './style/index'` + `export const MuXxx = Index` + `export default Index`；多组件文件逐个命名导出。
- `packages/components/resolver.ts` 的 MuUiResolver 必须保留 `name.startsWith('Mu')` 短路，否则会 claim 消费者自己的组件名并产出无效 import。
- 从 utils/validator.ts 直接向公共入口导出校验函数（v_tel、v_id_num 等）：仅被组件内部引用的规则会被 tree-shake，发布包里取不到。
- 依赖第三方库时从具名路径导入（如 element-plus、element-plus/es/components/date-picker-panel/src/types、@muyianking/utils 的具体函数），不整包导入。
- tsconfig.json 开启 strict、noUnusedLocals、noUnusedParameters、isolatedModules，include 仅覆盖 packages/components，因此 `playground/` 不参与 typecheck（它有自己的 playground/tsconfig.json）。
- 遵循仓库 ESLint（@antfu/eslint-config + @muyianking/config）风格：2 空格缩进、单引号、无分号、注释与文案使用中文；格式化由 `eslint --fix` 完成，仓库无独立 Prettier 配置（Markdown 同样走 eslint 的 format/prettier）。`eslint.config.js` 里自定义规则的 files 白名单为 `**/src/**`、`**/script/**`、`**/packages/**`、`**/*.config.*`，`packages/` 与 `playground/src` 都在覆盖范围内。另外 `eslint.config.js` 有两处针对 @antfu/eslint-config 9 的必要覆盖，不要删除：① 纯 JS 文件改用内置 `no-unused-vars`——该版本的 `unused-imports/no-unused-vars` 在 `.js` 上会把已使用的变量误报为「only used as a type」（`.ts` / `.vue` 不受影响）；② 关闭 `pnpm/yaml-enforce-settings`——它强制要求的 `trustPolicy: no-downgrade` 会让本仓库直接装不上依赖（chokidar@4.0.3 被判为 High-risk trust downgrade）。

## 5. 样式与 UI

- 组件模板直接使用 Tailwind 工具类（flex、items-center、mr-1、cursor-pointer 等），由使用方应用的 Tailwind 扫描生成；仓库内只有演示应用的 `playground/tailwind.config.js` 一份配置，库本体不提供 Tailwind 配置。
- 每个组件 style/index.ts 先 import element-plus/es/components/<组件>/style/css，再 import @muyianking/theme-chalk/css/<组件>.css，保持该顺序。
- style/index.ts 中的 `@muyianking/theme-chalk` 路径由 script/vite-plugins/style.path.alias.js 在构建期改写为 `@muyianking/ui/theme-chalk`，不要手动改成发布路径。
- 主题样式只写语义类名（.mu-button、.mu-search-page 等 mu- 前缀），不写行内样式；布局间距优先用工具类而非 CSS 普通属性。
- 全局能力经 MuConfigProvider provide 的 `GLOBAL_CUSTOM_CONFIG` 注入，组件用 `inject('GLOBAL_CUSTOM_CONFIG')` 读取 uploadFile、previewFileUrl、downloadFile、getIcons、tableIcon、buttonIcon 等配置，不新增全局单例。
- MuConfigProvider 必须把 $attrs 透传给 el-config-provider，否则 locale / size / zIndex 丢失。

## 6. 依赖与构建

- 构建外部化清单在 script/vite.config.js 中维护（vue、element-plus、@vueuse/core、echarts、dayjs、lodash-es、validator、js-cookie、nanoid、wavesurfer、@iconify/vue、@muyianking/\*），新增运行期依赖需同步登记。
- dist/package.json 的 sideEffects 中 `es/**/style/index.js` 不可删除：Rolldown 保留独立 style 入口，缺这条会让消费者静默丢失全部样式。
- 构建产物为 preserveModules ESM，入口 packages/components/index.ts 与 resolver.ts，样式自 packages/theme-chalk/css 拷贝至 dist/theme-chalk/css。
- 演示应用通过 playground/alias.config.ts 的别名（@、@layout、@views、@pinia、@comp）与 playground/vite.config.ts 中 `@muyianking/ui` → packages/components/index.ts 直连源码，改组件后无需构建即可验证。
- 演示应用的路由在 playground/src/router/menu/index.ts 维护，新增组件演示页需同时登记路由与 views 页面。
- 提交信息遵循 @muyianking/config/commitlint.config.js（Conventional Commits），pre-commit 由 husky + lint-staged 对 \*.{js,ts,vue} 执行 eslint --fix。

## 7. Agent 操作与验证

- 可用命令：pnpm dev（在仓库根启动 playground 演示应用，改组件无需构建）、pnpm lint、pnpm lint:fix、pnpm typecheck（vue-tsc，仅覆盖 packages/components）、pnpm build（输出 dist/）、pnpm release（发布流程，含提交与打标，非用户明确要求不得执行）。
- 组件改动后的验证顺序：pnpm lint → pnpm typecheck → pnpm build，再用 playground 对应演示页手动确认，并确认 `docs/<组件>.md` 已同步。
- 不要直接修改 dist/ 产物或 CHANGELOG.md，二者均由脚本生成（dist 已被 .gitignore 忽略）。
- 不要改动 package.json 的 version，版本由 script/publish.js 维护。
