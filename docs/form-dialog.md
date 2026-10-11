# MuFormDialog 表单弹窗

「弹窗 + 表单 + 提交」的封装：内置校验、提交 loading 与请求回调，提交成功后自动关闭并触发刷新。

- 组件目录：`packages/components/core/form-dialog/`
- 对外导出：`MuFormDialog`
- 样式入口：`packages/components/core/form-dialog/style/index.ts`（类名 `.mu-form-dialog-inline-form`）
- 演示页面：暂无（`playground/src/views/form/Index.vue` 只演示 `MuFormItem`）
- 依赖：element-plus 的 `ElForm`、`ElButton`；本库 `MuDialog`（并引入其 `style/index`）；`utils/message` 的 `success` / `warning`

## 基础用法

```vue
<script setup lang="ts">
import { MuFormDialog, MuFormItem, MuInput } from '@muyianking/ui'
import { reactive, ref } from 'vue'

const show = ref(false)
const model = reactive({ name: '' })

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'change' }],
}

async function server(data: any) {
  // await api.save(data)
  return data
}
</script>

<template>
  <MuFormDialog v-model="show" title="编辑" :model="model" :rules="rules" :server="server">
    <MuFormItem label="姓名" prop="name">
      <MuInput v-model="model.name" />
    </MuFormItem>
  </MuFormDialog>
</template>
```

## Props

| 属性       | 类型                                    | 默认值       | 说明                                                               |
| ---------- | --------------------------------------- | ------------ | ------------------------------------------------------------------ |
| title      | `string`                                | `''`         | 弹窗标题，透传 `mu-dialog`                                         |
| rules      | `Record<string, any>`                   | `() => ({})` | 表单校验规则，直接传给 `el-form`                                   |
| model      | `Record<string, any> \| null`           | `null`       | 表单数据模型；为 `null` 时提交会被拦截                             |
| width      | `string \| number`                      | `'500px'`    | 弹窗宽度，透传 `mu-dialog`                                         |
| top        | `string \| number`                      | `'150px'`    | 弹窗距顶部距离，透传 `mu-dialog`                                   |
| submitText | `string`                                | `'提交'`     | 默认提交按钮文案                                                   |
| inline     | `boolean`                               | `false`      | 行内布局：表单 `flex` 换行，每个 `el-form-item` 占 50% 宽          |
| server     | `((data: any) => Promise<any>) \| null` | `null`       | 提交请求函数，入参为 `model`；为 `null` 时只触发 `submit` 不做请求 |
| labelWidth | `string \| number`                      | `'80px'`     | 表单标签宽度，传给 `el-form`                                       |

组件通过 `defineModel<boolean>({ default: false })` 支持 `v-model`（`show` / `update:modelValue`）。其余属性经 `v-bind="$attrs"` 透传给 `mu-dialog`。

## Emits

| 事件    | 参数         | 说明                                                                  |
| ------- | ------------ | --------------------------------------------------------------------- |
| error   | `error: any` | `server` 请求失败时触发，参数为异常对象；组件不弹错误提示，由外部处理 |
| success | `data: any`  | `server` 请求成功时触发，参数为请求返回值                             |
| refresh | `model: any` | 请求成功后触发，参数为当前 `model`                                    |
| submit  | 无           | 未提供 `server` 且校验通过时触发                                      |

## Slots

| 插槽    | 作用域参数   | 说明                                                                   |
| ------- | ------------ | ---------------------------------------------------------------------- |
| default | 无           | 表单内容，渲染在 `el-form` 内                                          |
| footer  | `{ submit }` | 弹窗底部；不传时渲染默认的提交按钮，可用作用域里的 `submit` 自定义按钮 |

## 暴露

| 名称       | 类型                                        | 说明                        |
| ---------- | ------------------------------------------- | --------------------------- |
| getFormRef | `() => InstanceType<typeof ElForm> \| null` | 返回内部 `el-form` 组件实例 |

## 业务逻辑

- `submit()`：`model` 为空时 `warning('MuFormDialog 组件未设置 model 属性')` 并返回，不触发校验。否则调用 `formRef.validate(callback)`；`valid` 为真时：
  - 存在 `server` 函数：置 `loading = true`，调用 `server(props.model)`；成功回调里 `success('保存成功')`、`emit('success', data)`、`emit('refresh', props.model)`、`close()`；失败回调里 `emit('error', e)` 把异常交给外部处理，组件自身不弹错误提示；`finally` 复位 `loading = false`。
  - 不存在 `server`：直接 `emit('submit')`，不做请求、不自动关闭。
- `close()`：先 `formRef.clearValidate()` 清除校验态，再 `show = false`；同时通过 `mu-dialog` 的关闭事件触发，保证手动关闭也复位校验。
- 默认底部按钮为 `el-button type="primary"`，`:loading` 绑定内部 loading，点击调 `submit`。
- `inline` 为 `true` 时给 `el-form` 加 `mu-form-dialog-inline-form` 类，样式文件中该类使表单 `display: flex; flex-wrap: wrap`，其中 `.el-form-item` 宽度 50%。

## 约束与注意事项

- 必须传 `model`，否则提交只会提示且不校验、不请求。
- 校验能否生效取决于子 `MuFormItem` / `el-form-item` 是否设置了 `prop`；`rules` 键名需与 `prop` 对应。
- `server` 成功 resolve 后组件会自动 `close()` 并 `success('保存成功')`；若业务不希望自动关闭，应改用 `submit`（即不传 `server`）自行处理。
- `server` 抛错时组件不弹错误提示，仅通过 `error` 事件把异常抛给外部（参数为异常对象），由外部决定如何提示与处理；组件仍会复位 loading、弹窗保持打开。
- 组件未监听 `submit` 事件的原生表单提交，需点击按钮或作用域 `submit` 手动触发。
- 默认提交按钮只在未使用 `footer` 插槽时渲染；使用 `footer` 插槽后需自行绑定 `submit`。

## 相关

- 关联组件：`MuDialog`（弹窗外壳）、`MuFormItem`（配合使用以复用校验开关）
- utils：`packages/components/utils/message.ts`（`error` / `success` / `warning`）
- 公共类型：无
- 演示页面：暂无
