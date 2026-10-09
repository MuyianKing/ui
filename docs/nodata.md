# MuNoData 空数据占位

列表/区域无数据时展示的图片加文案占位块。

- 组件目录：`packages/components/core/nodata/`
- 对外导出：`MuNoData`
- 样式入口：`packages/components/core/nodata/style/index.ts`（类名 `.mu-no-data`）
- 演示页面：暂无
- 依赖：无（无 Element Plus 组件、无本库其它组件，仅自带一张静态图片）

## 基础用法

```vue
<script setup lang="ts">
import { MuNoData } from '@muyianking/ui'
</script>

<template>
  <MuNoData height="200px" text="暂无数据" />
</template>
```

自定义图片并追加底部内容：

```vue
<template>
  <mu-no-data img="/static/empty.svg" width="50%" text="还没有记录">
    <el-button type="primary" size="small" @click="handleCreate">
      新建
    </el-button>
  </mu-no-data>
</template>
```

## Props

| 属性   | 类型   | 默认值       | 说明                                       |
| ------ | ------ | ------------ | ------------------------------------------ |
| img    | string | `''`         | 自定义图片地址；为空使用内置 `no-data.png` |
| height | string | `'auto'`     | 容器高度，写入根节点行内 style             |
| width  | string | `'100%'`     | 容器宽度，写入根节点行内 style             |
| text   | string | `'暂无数据'` | 提示文案                                   |

## Emits

无。

## Slots

| 插槽     | 作用域参数 | 说明                                     |
| -------- | ---------- | ---------------------------------------- |
| 默认插槽 | 无         | 渲染在文案下方，可放操作按钮等自定义内容 |

## 暴露

无。

## 业务逻辑

- `imgSrc` 为 computed：`props.img || 内置默认图`，传给 `<img :src>`。
- 内置图通过 `import defaultImg from '../assets/img/no-data.png'` 以模块资源方式引入，是组件目录内唯一的静态资源。构建时由 Vite 作为 asset 处理：该文件 25814 字节，超过 Vite 默认 4096 字节的内联阈值，因此会被输出为独立资源文件并以带 hash 的 URL 引用，而不是 base64 内联进 JS。消费方打包时由各自的打包器接管。
- 根节点为 `div.mu-no-data`，`height` / `width` 直接写成行内 style（组件内少见的行内样式用法）；图片、文案、默认插槽按顺序渲染。
- `packages/theme-chalk/css/nodata.css` 中除 `.mu-no-data` 外还有 `.no-data-img`、`.no-data-text` 选择器，但当前模板未使用这两个类名，属历史遗留，不影响现有渲染。

## 约束与注意事项

- 组件自身不写 `<style>`，尺寸经 `height` / `width` props 传入并落为行内样式；需要其它外观请覆盖 `.mu-no-data` 语义类。
- `height` / `width` 是字符串（含单位），传数字不会自动补单位。
- 修改内置图片时替换 `packages/components/core/nodata/assets/img/no-data.png` 即可，无需改模板；该文件也是本组件能被单独构建出静态资源的唯一原因。
- 无 emits、无 `defineExpose`，纯展示组件。

## 相关

- 静态资源 `packages/components/core/nodata/assets/img/no-data.png`
- 样式 `packages/theme-chalk/css/nodata.css`
- 样式体系说明 `docs/theme-chalk.md`
