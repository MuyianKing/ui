# 样式体系：packages/components 与 packages/theme-chalk

本文件说明组件源码与样式资源包的职责边界、开发期如何生效、打包后如何被消费者加载，以及维护时必须遵守的红线。改组件、加组件、调样式前先读这一篇。

## 1. 两个包的关系与职责

| 包       | 目录                   | package.json 名称                               | 职责                                                            |
| -------- | ---------------------- | ----------------------------------------------- | --------------------------------------------------------------- |
| 组件源码 | `packages/components`  | `@muyianking/components`（`main: index.ts`）    | 组件实现与样式入口，唯一对外出口 `packages/components/index.ts` |
| 样式资源 | `packages/theme-chalk` | `@muyianking/theme-chalk`（无入口，深路径引用） | 纯 CSS 资源包，无任何 JS                                        |

两者是**并列的独立包**，不是父子关系：

- `packages/theme-chalk` 只有 `css/` 目录和 `package.json`，不含 `.ts` / `.vue`，也不被任何构建脚本当作入口编译。
- `packages/components` 的每个组件通过 `style/index.ts` 用 CSS 副作用导入把样式挂进来，组件产物本身不内联 CSS。
- 连接点只有一个：`packages/components/core/<组件>/style/index.ts` 里的 `import '@muyianking/theme-chalk/css/<组件>.css'`。

因此 `theme-chalk` 里**只允许放 CSS**，任何组件逻辑都属于 `packages/components`；反过来，组件 `.vue` 文件里不写 `<style>` 块（当前 49 个 `.vue` 全部为零 style 块），样式一律落在 `theme-chalk/css`。

`theme-chalk/package.json` 早前的 `main` 指向了并不存在的 `index.css`（已删除该字段：所有引用都是深路径 `@muyianking/theme-chalk/css/xxx.css`，不经过 `main`）。库本体**不提供全量样式入口**，消费者按需或全量引入组件时由各组件的 style 入口自动带上。

## 2. 样式入口的固定写法

`style/index.ts` 固定两段结构，顺序不可颠倒：

```ts
// 1. 先引 element-plus 对应组件的样式
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/tooltip/style/css'
// 2. 再引本库样式
import '@muyianking/theme-chalk/css/button.css'
```

- 先 element-plus、后本库，保证自定义样式能覆盖 Element Plus 的默认样式。
- 一个组件目录内有多个组件文件时，逐个引入对应 CSS，例如 `button`：

```ts
import '@muyianking/theme-chalk/css/button.css'
import '@muyianking/theme-chalk/css/add-button.css'
import '@muyianking/theme-chalk/css/del-button.css'
// ... 其余按钮族
```

- 组件样式只写语义类名（`.mu-button`、`.mu-block-title`、`.mu-search-page` 等 `mu-` 前缀），不写行内样式；布局间距优先用 Tailwind 工具类而非 CSS 普通属性。
- CSS 文件名必须与组件目录名一致（kebab-case），按钮族各变体名与文件一一对应。
- 样式用 **CSS 原生嵌套（Nesting）** 书写：后代、伪类、伪元素选择器收进祖先规则内部，父选择器一律显式写 `&`（`&:last-child`、`&.is-checked`、`& > div`、`&::-webkit-scrollbar`），不使用预处理器语法（`&-suffix`、`@nest`、`@apply`）。
- 嵌套只做选择器分层，**不改变规则的源码先后顺序**：同权重选择器的层叠结果依赖顺序，把扁平写法改成嵌套时不得就地调整规则次序；多个祖先共用一个后代选择器时，宁可在各自父规则下重复写，也不要为了少写几行而改变层叠。
- 仓库既无 PostCSS 嵌套插件也无 CSS 预处理器，`theme-chalk` 的 CSS 不经任何编译直接发布（见第 4 节），因此嵌套必须是浏览器能直接解析的标准写法：实际要求 Chrome/Edge 112+、Safari 16.5+、Firefox 117+。
- 颜色、圆角、字号一律取 **Element Plus 主题变量**（`--el-*`），不写死值：文字用 `--el-text-color-primary` / `--el-text-color-regular` / `--el-text-color-secondary` / `--el-text-color-placeholder`，边框用 `--el-border-color` / `--el-border-color-light` / `--el-border-color-lighter`，底色用 `--el-bg-color` / `--el-fill-color-light`，强调色用 `--el-color-primary` / `--el-color-success` / `--el-color-danger`，遮罩用 `--el-overlay-color-lighter`，反白用 `--el-color-white`，圆角用 `--el-border-radius-base` / `--el-border-radius-small`，字号用 `--el-font-size-base` / `--el-font-size-medium`；`1px solid` 的默认边框可直接写 `var(--el-border)`。
- **不再使用宿主应用的私有调色板** `--color-primary` / `--color-success` / `--color-danger`（那组变量由消费方 `:root` 自行定义，库未定义兜底，缺失时整条声明失效）。需要品牌色时由应用覆写 `--el-color-primary` 等 Element Plus 变量。
- 变量可用性有保证：组件 `style/index.ts` 先引的 `element-plus/es/components/<组件>/style/css` 会先加载 `element-plus/theme-chalk/base.css`，`:root` 里的 `--el-*` 定义就在其中，因此不必额外引入 Element Plus 全量主题。
- 没有一一对应档位的品牌色按 Element Plus 自身的搭配惯例映射到同色系：浅底用 `-light-9`、其描边用 `-light-8`（与 `.el-tag` 的底/框搭配一致），渐变用 `-light-3` → `-dark-2`。

## 3. 开发期怎么生效

演示应用 `playground` 直接连源码，改组件或改 CSS 都不需要先构建：

1. **组件源码**：`playground/vite.config.ts` 把 `@muyianking/ui` 别名到 `packages/components/index.ts`，所以引入 `@muyianking/ui` 拿到的就是源码。
2. **样式包**：`playground` 没有为 `@muyianking/theme-chalk` 配置别名，它通过工作区软链解析——`node_modules/@muyianking/theme-chalk` 是指向 `packages/theme-chalk` 的符号链接（`pnpm-workspace.yaml` 的 `packages/**` 建立）。由于该包没有 `exports` 字段，深路径 `css/button.css` 可以正常解析到实体文件。
3. **生效方式**：CSS 走 Vite 的 HMR，改 `packages/theme-chalk/css/*.css` 立即反映到页面；改 `.vue` / `.ts` 同样即时。
4. **Tailwind**：只有演示应用装了 Tailwind（`playground/tailwind.config.js`、`tailwindcss` devDependency），组件模板里的 `flex`、`items-center`、`mr-1` 等工具类由消费者应用的 Tailwind 扫描生成。库本体**不提供也不引入 Tailwind 配置**。

> 注意：`pnpm dev` / `pnpm preview` 都从仓库根启动，用 `--config playground/vite.config.ts` 显式指定配置，直接执行即可，不必先 `cd playground`。之所以能这样，是因为该配置把 `root` 固定为 `playground/`（`root: import.meta.dirname`）——Vite 默认以启动目录为 root，从仓库根启动时 root 会落到仓库根、找不到 `playground/index.html`。

## 4. 打包期怎么处理

执行 `pnpm build`（`script/build.js` → `script/vite.config.js`）时，样式资源经历四步处理：

1. **路径改写**：`script/vite-plugins/style.path.alias.js` 以 `enforce: 'pre'` 拦截所有 id 以 `style/index.ts` 结尾的模块，把 `@muyianking/theme-chalk` 替换为发布后的自引用路径 `@muyianking/ui/theme-chalk`。所以 `style/index.ts` 里**只写源码期路径** `@muyianking/theme-chalk`，不要手动改成发布路径。
2. **外部化**：`script/vite.config.js` 的 `external` 命中 `/^@muyianking\//`，CSS 与资源包不会被内联打包，产物里保留为裸导入语句。产物 `dist/es/core/<组件>/style/index.js` 内容就是若干条 `import '@muyianking/ui/theme-chalk/css/xxx.css'`（加上 element-plus 的 style 导入）。
3. **整体拷贝**：`script/build.js` 用 `_copy('packages/theme-chalk/css', 'theme-chalk/css')` 把 CSS 目录原样拷到 `dist/theme-chalk/css`。发布包里样式是**拷贝**而非编译产物，所以改 CSS 后必须重新 build 才会进 `dist`。
4. **发布清单**：`build.js` 生成的 `dist/package.json` 里
   - `exports` 放开 `./theme-chalk/*`（消费者深路径引样式）与 `./es/*`（深导入组件模块），并开放包自引用；
   - `sideEffects` 必须保留两条：`**/*.css` 与 `es/**/style/index.js`。**`es/**/style/index.js` 不可删除\*\*：Vite 8 的 Rolldown 会保留独立的 style 入口，其内容只有 CSS 副作用导入；缺这条 treeshake 会静默丢掉全部样式（实测 34.29 kB CSS → 0）。
   - `files` 包含 `theme-chalk/`，确保样式随包发布。

消费者侧：按需或全量引入组件时，组件模块自带的 style 副作用导入会自动拉取对应 CSS，无需额外配置；若要单独引某个样式文件，用 `import '@muyianking/ui/theme-chalk/css/button.css'`。

## 5. 维护红线

- `theme-chalk` 只放 CSS；组件 `.vue` 不写 `<style>`，样式只落在 `theme-chalk/css`。
- `style/index.ts` 顺序固定：element-plus 的 `style/css` 在前，本库 `@muyianking/theme-chalk/css/<组件>.css` 在后。
- 源码里样式路径一律写 `@muyianking/theme-chalk`，构建期由 `style.path.alias.js` 改写，不手改发布路径。
- 新增组件时必须在 `packages/theme-chalk/css/` 建同名 kebab-case CSS，并在该组件 `style/index.ts` 中引入；多组件文件逐个引入。
- 语义类名统一 `mu-` 前缀；库本体不引入 Tailwind、CSS 预处理器（Sass/Less/Stylus）。
- 样式一律用 CSS 原生嵌套，父选择器显式 `&`；嵌套改写必须保持规则源码顺序，不得顺手调整层叠次序。改完由 `pnpm lint` 的 format/prettier（`parser: css`）统一校验缩进与行尾。
- 颜色 / 圆角 / 字号用 Element Plus 主题变量（`--el-*`），不写死颜色值，也不再使用宿主私有的 `--color-*`；新增样式前先按第 2 节的清单找对应 token，找不到可对应的再考虑硬编码并在此说明。
- 不要直接改 `dist/`，它由 `script/build.js` 生成且已被 `.gitignore` 忽略；改样式后需重新 `pnpm build`。

## 6. 一处改动的传播路径（速查）

```text
改 packages/theme-chalk/css/button.css
  → 开发期：Vite HMR 立即生效（playground 软链直连源码）
  → 发布期：pnpm build 拷贝到 dist/theme-chalk/css/button.css
            + dist/es/core/button/style/index.js 以裸导入引用它
  → 消费期：import { MuButton } from '@muyianking/ui'
            触发 dist/es/core/button/style/index.js → '@muyianking/ui/theme-chalk/css/button.css'
```
