# @muyianking/ui 项目文档

本目录是 `@muyianking/ui` 组件库的业务文档中心：**每一条业务逻辑、约束都落在这里**，`README.md` 作为索引入口与通用业务规则，具体组件各占一份文件（组件文档陆续补充）。

## 文档索引

| 文档                               | 内容                                                                                           |
| ---------------------------------- | ---------------------------------------------------------------------------------------------- |
| [theme-chalk.md](./theme-chalk.md) | 样式体系：`packages/components` 与 `packages/theme-chalk` 的关系、开发期与打包期链路、维护红线 |

### 全局与基础

| 组件                                    | 导出                   | 说明                                                                |
| --------------------------------------- | ---------------------- | ------------------------------------------------------------------- |
| [config-provider](./config-provider.md) | `MuConfigProvider`     | 全局配置注入（上传、预览、下载、图标等），透传 `el-config-provider` |
| [icon](./icon.md)                       | `MuIcon`               | Iconify 图标渲染，统一尺寸与颜色                                    |
| [question-icon](./question-icon.md)     | `MuQuestionIcon`       | 问号图标 + tooltip 说明文案                                         |
| [button](./button.md)                   | `MuButton` 及 8 个预设 | 基础按钮与新增/删除/查看/编辑/导出/导入/重置/查询按钮               |

### 布局与容器

| 组件                                        | 导出                 | 说明                                   |
| ------------------------------------------- | -------------------- | -------------------------------------- |
| [block-title](./block-title.md)             | `MuBlockTitle`       | 带色块的区块标题                       |
| [page](./page.md)                           | `MuPage`             | 分页封装                               |
| [grid-layout](./grid-layout.md)             | `MuGridLayout`       | 按容器宽度自适应列数的网格布局         |
| [search-page](./search-page.md)             | `MuSearchPage`       | 搜索区容器，支持展开高级搜索           |
| [descriptions](./descriptions.md)           | `MuDescriptions`     | 描述列表容器                           |
| [descriptions-item](./descriptions-item.md) | `MuDescriptionsItem` | 描述列表项（列宽按父级 `column` 计算） |
| [edit-info](./edit-info.md)                 | `MuEditInfo`         | 可编辑信息展示                         |

### 表单录入

| 组件                                        | 导出                 | 说明                          |
| ------------------------------------------- | -------------------- | ----------------------------- |
| [form-item](./form-item.md)                 | `MuFormItem`         | 表单项，内建常用校验规则开关  |
| [form-dialog](./form-dialog.md)             | `MuFormDialog`       | 表单弹窗                      |
| [input](./input.md)                         | `MuInput`            | 输入框（带提示）              |
| [select](./select.md)                       | `MuSelect`           | 下拉选择                      |
| [select-remote](./select-remote.md)         | `MuSelectRemote`     | 远程数据/大数据量下拉选择     |
| [dropdown](./dropdown.md)                   | `MuDropdown`         | 下拉菜单选择                  |
| [dropdown-cascader](./dropdown-cascader.md) | `MuDropdownCascader` | 级联下拉菜单                  |
| [radio](./radio.md)                         | `MuRadio`            | 单选框组（支持再次点击取消）  |
| [checkbox](./checkbox.md)                   | `MuCheckbox`         | 复选框组                      |
| [date](./date.md)                           | `MuDate`             | 日期与日期范围选择            |
| [time](./time.md)                           | `MuTime`             | 时间选择                      |
| [tel](./tel.md)                             | `MuTel`              | 电话输入                      |
| [id-card](./id-card.md)                     | `MuIdCard`           | 身份证展示                    |
| [upload](./upload.md)                       | `MuUpload`           | 文件上传（触发、进度、预览）  |
| [file](./file.md)                           | `MuFile`             | 文件展示与下载                |
| [icon-select](./icon-select.md)             | `MuIconSelect`       | 图标选择器（依赖 `getIcons`） |

### 展示与预览

| 组件                        | 导出          | 说明                      |
| --------------------------- | ------------- | ------------------------- |
| [number](./number.md)       | `MuNumber`    | 数字格式化展示（万 / 亿） |
| [image](./image.md)         | `MuImage`     | 图片展示与预览            |
| [video](./video.md)         | `MuVideo`     | 视频播放                  |
| [preview](./preview.md)     | `MuPreview`   | 文件统一预览容器          |
| [chart](./chart.md)         | `MuChart`     | ECharts 图表封装          |
| [watermark](./watermark.md) | `MuWatermark` | 水印                      |
| [nodata](./nodata.md)       | `MuNoData`    | 空数据占位                |

### 反馈与弹层

| 组件                  | 导出       | 说明       |
| --------------------- | ---------- | ---------- |
| [dialog](./dialog.md) | `MuDialog` | 可拖拽弹窗 |

> 组件文档一份文件对应一个组件（kebab-case，与 `packages/components/core/` 目录同名），模板见第 4 节。新增组件时同步在此登记。

## 1. 项目边界

- 项目性质：Vue 3 组件库 `@muyianking/ui`（当前 0.0.1-beta.7），pnpm workspace 单仓多包，工作区成员为 `packages/**`。
- 技术栈：TypeScript 5.9.3 + Vue 3.5.43 SFC + Vite 8.3.4（Rolldown）+ vite-plugin-dts 5.1.2；包管理 pnpm。
- 运行期依赖只有 `@iconify/vue`、`@muyianking/utils`、`@vueuse/core`、`element-plus`、`vue`；UI 能力一律基于 Element Plus 二次封装。
- `vue` 与 `element-plus` 只允许存在于 `peerDependencies`（`script/build.js` 中显式排除），写入 `dependencies` 会导致消费者装出第二份 Element Plus、打断 provide/inject 并使体积翻倍。
- 项目未引入测试框架，不新增 vitest / jest / @vue/test-utils 及测试配置。
- 不引入其它 UI 组件库、CSS 预处理器、axios、Vuex；Tailwind 只存在于演示应用 `playground`，不得装进组件库本体。

## 2. 通用使用规则

### 引入方式

手动引入，库的对外出口唯一为 `packages/components/index.ts`：

```vue
<script setup lang="ts">
import { MuButton } from '@muyianking/ui'
</script>

<template>
  <MuButton text="提交" @click="handleSubmit" />
</template>
```

### 自动引入

组件对外名统一 `Mu` 前缀，配合 `unplugin-vue-components`：

```js
import { MuUiResolver } from '@muyianking/ui/resolver'
import Components from 'unplugin-vue-components/vite'

Components({ resolvers: [MuUiResolver()] })
```

`MuUiResolver` 必须保留 `name.startsWith('Mu')` 短路，否则会把消费者自己的组件名也 claim 到本库并产出无效 import。

### 全局配置

上传地址、文件预览、图标库等能力由 `MuConfigProvider` 经 provide 的 `GLOBAL_CUSTOM_CONFIG` 注入，组件用 `inject('GLOBAL_CUSTOM_CONFIG')` 读取（`uploadFile`、`previewFileUrl`、`downloadFile`、`getIcons`、`tableIcon`、`buttonIcon` 等）：

```vue
<MuConfigProvider :custom-config="{ uploadFile, previewFileUrl, downloadFile, getIcons }">
  <App />
</MuConfigProvider>
```

`MuConfigProvider` 必须把 `$attrs` 透传给 `el-config-provider`，否则 locale / size / zIndex 丢失。不新增全局单例。

### 表单校验与通用类型

- 校验规则集中在 `packages/components/utils/validator.ts`，并从公共入口导出（`v_tel`、`v_id_num`、`v_phone`、`v_email`、`v_carnum`、`v_int`、`v_ip`、`v_port`、`v_phoneOrTel`、`v_latlong`）。仅被组件内部引用的规则会被 tree-shake，发布包里取不到，所以必须走公共入口导出。
- 规则中空值一律放行、交由 `required` 处理，避免同一字段报两条错误；`rule.validator` 必须**恰好调用一次 callback**，否则 `validate()` 永久 pending、表单提交静默失效。
- 跨组件公共类型集中在 `packages/components/core/types/common.ts`：`OptionsType`、`ContentMenuOptionsType`、`ArrayOfFunctions`、`DefaultSlot`、`StrNumBoolean`，同样从公共入口导出类型。

### utils 的导出与生产形态

`packages/components/utils/` 下只有两个文件，二者的对外身份完全不同，改动前必须分清：

| 文件           | 是否公共 API                                                                                     | 源码内引用方                                                                 | 发布后的可见性                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `validator.ts` | 是。10 个规则与 `RuleValidator`、`ValidateCallback` 类型都从 `packages/components/index.ts` 导出 | `form-item`（7 个规则，相对路径引入）                                        | 运行时 `dist/es/index.js` 转出、类型在 `dist/index.d.ts` 声明，消费者可 `import { v_tel } from '@muyianking/ui'` |
| `message.ts`   | 否。公共入口与公共类型都不涉及                                                                   | `file`、`form-dialog`、`upload`、`upload/components/Trigger`（相对路径引入） | 仅作为内部模块存在于 `dist/es/utils/message.js`，无 `exports` 子路径背书，属私有实现                             |

约束与易踩的坑：

- **`validator` 必须从公共入口导出**。构建是 `preserveModules` + `treeshake`，`v_latlong`、`v_phoneOrTel`、`v_tel` 没有任何组件内部引用，若不从 `index.ts` 转出，它们不会出现在 `dist/es/utils/validator.js` 中。form-item 内部用到的 7 个规则即使不导出也能保留，**不要**据此误判「不导出也行」。
- **`message.ts` 不导出，且会被 tree-shake 到只剩被用到的函数**。当前产物 `dist/es/utils/message.js` 只导出 `confirm`、`error`、`success`、`warning`；源码里的 `loading`、`closeLoading` 因无组件引用被整体摇掉（连同其 `loadingInstance` 单例）。消费者若深导入该文件拿不到这两个函数，它们只存在于源码、随时可能被删。
- **不要给 `message.ts` 补公共导出**，除非确实要对外提供反馈 API：它会引入 element-plus 的 `ElMessage`/`ElMessageBox` 运行期依赖到公共入口，并需要同步补类型导出，属于对外契约变更。
- `message.ts` 的 `loading`/`closeLoading` 目前是死代码。要么让组件用起来，要么删除，不要指望它在产物里存在。
- 两个文件都用相对路径被组件引入（`../../../utils/xxx`），不是包名导入；新增引用沿用相对路径，避免引入自引用解析歧义。

### 样式与主题

- 组件样式落在 `packages/theme-chalk/css/<组件>.css`，组件 `.vue` 不写 `<style>` 块；入口 `style/index.ts` 先引 element-plus 的 `style/css`、再引本库 CSS。
- 语义类名统一 `mu-` 前缀；模板里优先用 Tailwind 工具类处理布局间距，样式职责与开发/构建链路详见 [theme-chalk.md](./theme-chalk.md)。

## 3. 开发与校验命令

| 命令                          | 作用                                                                        |
| ----------------------------- | --------------------------------------------------------------------------- |
| `pnpm dev`                    | 启动演示应用（`playground`，直连源码，改组件无需构建）                      |
| `pnpm lint` / `pnpm lint:fix` | ESLint 检查 / 自动修复（仓库已关闭 Prettier，格式化由 `eslint --fix` 完成） |
| `pnpm typecheck`              | `vue-tsc`，仅覆盖 `packages/components`                                     |
| `pnpm build`                  | 输出 `dist/`                                                                |
| `pnpm release`                | 发布流程（含提交与打标），非明确要求不得执行                                |

组件改动后的验证顺序：`pnpm lint` → `pnpm typecheck` → `pnpm build`，再用演示应用在对应页面手动确认。

> 根 `package.json` 的 `dev` / `preview` 已指向 `playground/vite.config.ts`，在仓库根直接执行即可；演示应用 `playground` 是 pnpm workspace 成员，依赖随根目录 `pnpm install` 一起安装，`vite` 的 `root` 已在配置里固定为 `playground`，因此从仓库根启动也能正确找到入口页面。

## 4. 组件文档约定

一个组件一份文件：`docs/<组件名>.md`，文件名与 `packages/components/core/` 目录同名（kebab-case）。按钮族等多组件目录合并到一份文件里。固定结构如下，空章节写「无。」，保持可预测：

```markdown
# MuXxx 中文名

一句话定位。

- 组件目录：`packages/components/core/<dir>/`
- 对外导出：`MuXxx`
- 样式入口：`packages/components/core/<dir>/style/index.ts`（类名 `.mu-xxx`）
- 演示页面：`playground/src/views/<x>/Index.vue`（无则写「暂无」）
- 依赖：element-plus 的哪些组件 / 本库其它组件 / utils

## 基础用法

（可运行的最小示例，取自演示页或源码）

## Props

| 属性 | 类型 | 默认值 | 说明 |

## Emits

| 事件 | 参数 | 说明 |

## Slots

| 插槽 | 作用域参数 | 说明 |

## 暴露

| 名称 | 类型 | 说明 |

## 业务逻辑

- 实现要点、内部状态、副作用与边界处理

## 约束与注意事项

- 红线与易踩的坑、依赖前提

## 相关

- 关联组件、utils、公共类型与演示页面
```

内容要求：Props / Emits / Slots 必须与源码中的 `withDefaults`、`defineEmits`、`defineSlots` 或模板插槽逐一对应，不得凭印象补 Element Plus 的属性；经 `v-bind="$attrs"` 透传的能力只说明「其余属性透传给 el-xxx」，不逐条列举。示例代码遵循仓库风格（2 空格缩进、单引号、无分号），文案使用中文。

## 5. 约束

- 不直接修改 `dist/` 与 `CHANGELOG.md`，二者由 `script/` 脚本生成（`dist/` 已被 `.gitignore` 忽略）。
- 不修改 `package.json` 的 `version`，版本由 `script/publish.js` 维护。
- 新增组件必须同步在 `packages/components/index.ts` 补导出，并在 `packages/theme-chalk/css/` 建立同名样式。
- 演示与调试代码只写 `playground/src`，不在 `packages/` 下新增演示代码。
- 默认不执行 Git 提交；提交遵循 Conventional Commits。
