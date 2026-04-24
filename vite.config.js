import { buildErrorMessage, defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/web-chatting-app/', 
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        chat: resolve(__dirname, 'chat.html'),
        blog: resolve(__dirname, 'blog.html'),
      },
    },
  },
})