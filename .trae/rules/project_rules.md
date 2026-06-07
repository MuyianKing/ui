# Project Rules

## Project Overview
- **Name**: `@muyianking/ui` (v0.0.1-beta.7)
- **Type**: Vue 3 UI 组件库（基于 Element Plus 二次封装）
- **Private**: false (发布到 npm)
- **License**: MIT
- **Package Manager**: pnpm (monorepo)

## Tech Stack

### Core
- **Language**: TypeScript (strict mode)
- **Framework**: Vue 3 (Composition API + `<script setup lang="ts">`)
- **Build Tool**: Vite 6 + Rollup
- **Module System**: ESM (`"type": "module"`)

### UI & Styling
- **UI Library**: Element Plus (v2.9.3) — 组件内部依赖
- **Icon Library**: @iconify/vue (v4.3.0) — MuIcon 组件封装
- **CSS**: 原生 CSS — 组件库样式（已从 SCSS 迁移）
- **CSS Framework**: Tailwind CSS v3 — 主要用于 test 演示应用
- **Component Scoped Styles**: `<style scoped>`
- **BEM Naming**: 组件 class 使用 BEM 风格命名（如 `.mu-select`, `.mu-radio-line-item`）

### State & Routing
- **State Management**: Pinia (with pinia-plugin-persistedstate)
- **Router**: Vue Router 4 (Hash Mode)

### Utilities
- **Composables**: @vueuse/core
- **Utility Library**: lodash-es
- **ID Generation**: nanoid (外部依赖)

### Auto-Import
- **Components**: unplugin-vue-components（组件库自带 MuUiResolver 解析器）

## Package Structure (Monorepo)

```
@muyianking/ui (root)
├── packages/components/   # 组件库核心包
│   └── core/<name>/       # 单个组件目录
│       ├── src/Index.vue  # 组件实现
│       ├── style/index.ts # 样式导入
│       └── index.ts       # 组件入口
├── packages/theme-chalk/  # 主题样式包 (CSS, @ui/theme-chalk)
├── test/                  # 测试/演示应用
└── script/                # 构建脚本
```

## Component Conventions

### Naming
- **Component Prefix**: `Mu`（如 `MuIcon`, `MuSelect`, `MuRadio`）
- **Component Name**: 通过 `defineOptions({ name: 'MuXxx' })` 显式声明
- **Export**: 命名导出 + 默认导出（`export const MuXxx = Xxx; export default Xxx`）
- **File Naming**: PascalCase（`Index.vue`）
- **Style Naming**: kebab-case（`.mu-select`, `.mu-context-menu`）

### Component Structure
1. `defineOptions({ name: 'MuXxx' })` — 组件名称
2. `defineProps<T>()` / `withDefaults(defineProps<T>(), { ... })` — 带泛型的 Props 定义
3. `defineEmits<{ (e: 'xxx', val: type): void }>()` — 类型化 Emits
4. `defineModel()` — 双向绑定
5. Component logic (ref, computed, methods)
6. Template
7. `<style scoped>` — Scoped CSS 样式

### Props & Events Convention
- **Props**: 使用 `import type { ... }` 定义类型，使用 `withDefaults` 设置默认值
- **Emits**: 使用类型化 emits 语法
- **v-model**: 使用 `defineModel()` 宏

## Code Standards

### ESLint & Formatting
- **Config**: ESLint v9 Flat Config (`eslint.config.js`)
- **Base Preset**: `@antfu/eslint-config` (with formatters)
- **Formatting**: ESLint (no Prettier, formatting handled by `eslint-plugin-format`)
- **Pre-commit**: Husky 运行 `npm run lint`（eslint --fix）
- **lint-staged**: 对 `*.{js,ts,vue}` 运行 `eslint --fix`

### Git Commit
- **Convention**: Angular Commit Convention
- **Tool**: cz-git (Commitizen adapter)
- **Validation**: commitlint (继承 `@muyianking/config/commitlint.config.js`)
- **Hooks**: Husky (pre-commit: lint, commit-msg: commitlint)

### TypeScript
- **Strict Mode**: 启用
- **JSX Import Source**: `vue`
- **Target**: ES2020 / ES2022 (test)
- **Types**: `vite/client`, `element-plus/global`

### Path Aliases
- **Root**: `@muyianking/*` → `./packages/*`
- **Test App**: `@/*` → `./src/*`, `@layout/*`, `@views/*`, `@pinia/*`, `@comp/*`

## Testing
- 项目当前**没有**配置测试框架

## Architecture Decisions to Follow

1. **所有组件基于 Element Plus 二次封装** — 优先复用 El-* 组件能力，在此基础上添加增强功能（如 readonly、disabled options 等）
2. **组件内部使用 Element Plus 组件** — 直接 import ElSelect、ElRadio 等使用
3. **样式隔离** — 组件库用 CSS 管理样式，test 应用用 Tailwind CSS + Scoped CSS
4. **只读模式** — 表单类组件需支持 `readonly` prop（将内容展示为纯文本）
5. **disabled-options 模式** — Select 类组件需支持禁用特定选项
6. **组件自动导入** — 每个组件需在 resolver.ts 中注册以支持 `unplugin-vue-components`
7. **样式按需引入** — 每个组件通过 `style/index.ts` 管理样式导入
