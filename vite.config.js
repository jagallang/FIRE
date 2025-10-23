import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/wildfire': {
        target: 'http://safemap.go.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/wildfire/, '/openApiService/data'),
        secure: false
      }
    }
  }
})
