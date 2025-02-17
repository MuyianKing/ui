<h1 align="center">@muyianking/ui</h1>

<p align="center">
@muyianking/ui
</p>

<p align="center">
  <a target="_blank" href="https://www.npmjs.com/package/@muyianking/ui" style="text-decoration: none;"><img  src="https://img.shields.io/npm/v/%40muyianking%2Fui"/></a>
  <a target="_blank" href="https://www.npmjs.com/package/@muyianking/ui" style="text-decoration: none;"><img  src="https://img.shields.io/npm/dm/%40muyianking%2Fui"/></a>
</p>

## 安装

```bash
npm i @muyianking/ui
```

```bash
yarn add @muyianking/ui
```

```bash
pnpm i @muyianking/ui
```

## 快速开始

### 手动引入

```js

```

### 自动引入(unplugin-vue-components)

```js
// vite.config.js
import { MuUiResolver } from '@muyianking/ui'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [
        MuUiResolver(),
      ],
    }),
  ]
})
```

## 贡献

<!-- readme: collaborators,contributors -start -->
<table>
	<tbody>
		<tr>
            <td align="center">
                <a href="https://github.com/MuyianKing">
                    <img src="https://avatars.githubusercontent.com/u/44827414?v=4" width="100;" alt="MuyianKing"/>
                    <br />
                    <sub><b>MuyianKing</b></sub>
                </a>
            </td>
		</tr>
	<tbody>
</table>
<!-- readme: collaborators,contributors -end -->
