import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import autoName from 'vite-plugin-auto-name'

export default defineConfig({
  plugins: [autoName(), vue()],
})
