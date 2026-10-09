# MuFormItem 表单项

在 `el-form-item` 之上封装常用校验规则，通过布尔开关把「必填 / 身份证 / 邮箱 / 数字」等能力一键编译为校验规则，并自动推断默认提示词。

- 组件目录：`packages/components/core/form-item/`
- 对外导出：`MuFormItem`
- 样式入口：`packages/components/core/form-item/style/index.ts`（无独立根类名，`packages/theme-chalk/css/form-item.css` 为空文件）
- 演示页面：`playground/src/views/form/Index.vue`
- 依赖：element-plus 的 `ElFormItem`；`utils/validator` 的 `v_carnum` / `v_email` / `v_id_num` / `v_int` / `v_ip` / `v_phone` / `v_port`

## 基础用法

```vue
<script setup lang="ts">
import { MuButton, MuFormItem, MuInput } from '@muyianking/ui'
import { ElForm } from 'element-plus'
import { reactive, ref } from 'vue'

const model = reactive({ name: '', age: '' })
const formRef = ref()

function submit() {
  formRef.value.validate()
}
</script>

<template>
  <ElForm ref="formRef" :model="model" label-width="80px">
    <MuFormItem label="姓名" prop="name" required>
      <MuInput v-model="model.name" />
    </MuFormItem>
    <MuFormItem label="年龄" prop="age" id-card>
      <MuInput v-model="model.age" />
    </MuFormItem>
  </ElForm>
  <MuButton @click="submit">
    提交
  </MuButton>
</template>
```

## Props

| 属性          | 类型               | 默认值     | 说明                                                            |
| ------------- | ------------------ | ---------- | --------------------------------------------------------------- |
| info          | `string`           | `''`       | 覆盖默认提示词前缀；为空时用挂载期自动探测结果                  |
| required      | `boolean`          | `false`    | 添加必填规则，提示词为「前缀 + label」                          |
| idCard        | `boolean`          | `false`    | 添加 `v_id_num` 身份证校验（提示「身份证格式错误」）            |
| email         | `boolean`          | `false`    | 添加 `v_email` 邮箱校验（提示「邮箱地址格式错误」）             |
| integer       | `boolean`          | `false`    | 添加 `v_int` 整数校验（提示「只能是整数」）                     |
| number        | `boolean`          | `false`    | 添加数字校验（提示「请输入数字」）                              |
| phone         | `boolean`          | `false`    | 添加 `v_phone` 手机号校验（提示「手机号码格式错误」）           |
| carNum        | `boolean`          | `false`    | 添加 `v_carnum` 车牌校验（提示「车牌格式错误」）                |
| ip            | `boolean`          | `false`    | 添加 `v_ip` IP 校验（提示「IP格式错误」）                       |
| port          | `boolean`          | `false`    | 添加 `v_port` 端口校验（提示「端口号格式错误」）                |
| maxLength     | `string \| number` | `''`       | 添加最大长度校验（提示「最大长度为N」），空值不生效             |
| minLength     | `string \| number` | `0`        | 添加最小长度校验（提示「最小长度为N」），`0` / 空值不生效       |
| uploadLoading | `boolean`          | `false`    | 添加「文件上传中」校验，值含 `loading` 时提示「请等待文件上传」 |
| minCount      | `number`           | `0`        | 大于 0 时添加数组最少项数校验（提示「最少N个」）                |
| minCountMsg   | `string`           | `''`       | 覆盖最少项数默认提示，为空时用「最少N个」                       |
| trigger       | `string`           | `'change'` | 生成规则的触发时机，透传给每条自动规则                          |
| rules         | `any[] \| null`    | `null`     | 自定义规则，合并进最终规则数组的最前面                          |
| label         | `string`           | `''`       | 标签文本；同时参与提示词拼接（会去掉冒号）                      |
| labelWidth    | `string \| number` | `''`       | 标签宽度；`'fit'` 按 label 长度计算；为空继承父 `el-form`       |

其余属性（如 `prop`）经默认的 `$attrs` 透传落到根节点 `el-form-item`。

## Emits

无。

## Slots

| 插槽    | 作用域参数 | 说明               |
| ------- | ---------- | ------------------ |
| default | 无         | 表单项内容         |
| label   | 无         | 自定义标签         |
| error   | 无         | 自定义校验错误提示 |

## 暴露

无。

## 业务逻辑

### 规则合并（`mergedRules`）

最终规则数组按**固定顺序**拼接：

1. `props.rules`（数组则逐个展开，非数组则整体放入），保证自定义规则排在最前，可覆盖后方默认规则；
2. `required` → `{ required: true, message: msg, trigger }`；
3. `idCard` → `v_id_num`；
4. `phone` → `v_phone`；
5. `carNum` → `v_carnum`；
6. `integer` → `v_int`；
7. `ip` → `v_ip`；
8. `port` → `v_port`；
9. `minLength` → 内置 `validateMinLength`；
10. `maxLength` → 内置 `validateMaxLength`；
11. `number` → 内置 `validateNumber`；
12. `email` → `v_email`；
13. `uploadLoading` → 内置 `validateUploadLoading`；
14. `minCount > 0` → 内置 `validateMinCount`。

每条自动规则都带上 `props.trigger`。除 `required` 外的开关均为「为真才 push」，因此关闭的开关不产生规则。

### 默认提示词拼接

```
msg = `${props.info || info.value || '请输入'}${props.label?.replace('：', '').replace(':', '')}`
```

- 前缀优先取 `props.info`，其次取挂载期探测出的 `info.value`，最后回退 `'请输入'`。
- 后缀是 `props.label`，会分别去掉第一个中文冒号「：」与第一个英文冒号「:」后与前缀直接拼接（无分隔符）。
- 探测逻辑在 `onMounted`：取当前组件根元素，`querySelector('.el-form-item__content')`，若其中含 `.el-input` 或 `.el-textarea` 则 `info = '请输入'`，否则 `info = '请选择'`；未找到 `.el-form-item__content` 时 `info` 保持 `''`，由计算属性回退到 `'请输入'`。
- `mergedRules` 是 `computed`，会随上述 props 与 `info` 响应式更新。

### 内置校验器

- `validateMaxLength`：`Number.parseFloat(String(props.maxLength))`，非 `NaN` 且 `value.toString().length > max` 时回调错误「最大长度为N」。
- `validateMinLength`：同理，`value.toString().length < min` 时「最小长度为N」。
- `validateNumber`：`Number.isNaN(+value)` 时「请输入数字」（空串 `+'' === 0`，不会触发）。
- `validateUploadLoading`：值若为数组，逐项检查 `.loading`；否则检查值本身的 `.loading`，命中即「请等待文件上传」。
- `validateMinCount`：仅在值为数组且 `length < props.minCount` 时回调，提示 `props.minCountMsg || '最少N个'`。

来自 `utils/validator` 的规则统一「空值放行、交由 `required` 处理」，避免同一字段同时报两条错误。

### 标签宽度（`labelWidthComp`）

- `props.labelWidth` 为真值时：等于 `'fit'` 返回 `calc(${props.label.length}em + 15px)`，否则原样返回；
- `props.labelWidth` 为空时继承父组件（`instance.parent.props.labelWidth`，即外层 `el-form` 的 `labelWidth`）；
- 父级也取不到时返回 `''`。

## 约束与注意事项

- **校验回调必须恰好调用一次 `callback`**：async-validator 只在回调被调用、或返回值为 `true` / `false` / Array / Error / thenable 时才结算。返回 `undefined` 又不调回调会让 `validate()` 永久 pending，表单提交静默失效——无报错、无 loading、也永不 resolve。自定义 `rules` 中的 validator 同样必须遵守。
- 校验能否触发取决于是否设置了 `prop`；`prop` 与 `rules` 键名需一致。
- `required` 的提示文案由 `info` 前缀 + 去冒号的 `label` 拼成，`label` 为空时只剩前缀，需自行注意文案可读性。
- `minLength` 默认 `0`，代码用 `if (props.minLength)` 判断，故 `0` 视为关闭；`maxLength` 默认 `''` 同理。
- `number` 校验不拦截空串（`+'' === 0`），空值需靠 `required` 约束。
- 挂载期探测依赖 DOM 中存在 `.el-form-item__content` 与 `.el-input` / `.el-textarea`；自定义非输入类控件会被判为「请选择」，需要精确文案时用 `info` 显式指定。
- `labelWidth` 计算中的 `'fit'` 以 `em` 估算并加 15px，多行或非等宽字体下可能不完全贴合。

## 相关

- 关联组件：`MuFormDialog`（表单弹窗外壳）、`MuInput`（演示中的输入控件）
- utils：`packages/components/utils/validator.ts`（`v_id_num`、`v_email`、`v_int`、`v_phone`、`v_carnum`、`v_ip`、`v_port`）
- 公共类型：无
- 演示页面：`playground/src/views/form/Index.vue`
