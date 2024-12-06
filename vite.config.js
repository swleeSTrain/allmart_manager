import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],

  server:
      {
        host: "0.0.0.0", // 모든 네트워크 인터페이스에서 접속 허용
        port: 5175,      // 기본 포트 (변경 가능)
      },
})