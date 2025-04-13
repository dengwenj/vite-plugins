## 自动注入组件 Name
### 安装
```npm
npm install @vite-plugin/auto-name
```
### 使用
#### vite.config.ts 中如下：
```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import autoName from '@vite-plugin/auto-name'

export default defineConfig({
  plugins: [autoName(), vue()],
})
```
#### vue 文件如下：
```html
<!-- 在 script 标签中写上 name 属性即可：name="你的组件名" -->
<script setup lang="ts" name="test">
console.log("自动注入 name 属性")
</script>

<template>
  test plugin
</template>
```
