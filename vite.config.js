import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/fb': {
        target: 'http://13.201.104.217:8081',
        changeOrigin: true,
      },
    },
  },
})